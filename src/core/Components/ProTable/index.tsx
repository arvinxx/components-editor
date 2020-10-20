import ProTable, { TableDropdown, ActionType } from '@ant-design/pro-table';
import React, { FC, useEffect, useRef, useMemo } from 'react';

import { Badge, Space, Tag, Button } from 'antd';

import { useSize } from '@umijs/hooks';
import request from 'umi-request';

import { ValueEnum } from '@/typings/table';
import { PresetStatusColorType } from 'antd/lib/_util/colors';
import { isEnum, notColumnData } from '@/utils';

import { TablePaginationConfig } from 'antd/es/table';
import { useProTablePagination } from '@/models/pagination';
import { useProTableSearch } from '@/models/search';
import { useProTableInteract } from '@/models/interact';
import { useProTableConfig } from '@/models/config';
import { useProTableDataSource } from '@/models/dataSource';
import { useProTableColumn } from '@/models/columns';
import { useProTableRowSelection } from '@/models/rowSelection';
import { useProTableToolBar } from '@/models/toolbar';
import { DataPreviewPanel, DragAndDrop } from '@/components';
import TableHeader from './TableHeader';
import styles from './style.less';

const ProTablePage: FC = () => {
  const actionRef = useRef<ActionType>();

  const [tableSize, setRef] = useSize<HTMLDivElement>();

  const { pagination, showPagination } = useProTablePagination();

  const { showAlertRender, rowSelection } = useProTableRowSelection();
  const {
    toolBarActions,
    showToolBar,
    showTitle,
    title,
  } = useProTableToolBar();

  const { columns } = useProTableColumn();
  const { config } = useProTableConfig();
  const { interact, handleTableInteract } = useProTableInteract();

  const {
    showHeader,
    widthType,
    bordered,
    width,
    size,
    showLoading,
    showEmpty,
  } = config;

  useEffect(() => {
    handleTableInteract({ tableTotalWidth: tableSize.width });
  }, [tableSize.width]);

  const {
    dataSourceConfig,
    mockDataSource,
    handleTableDataSourceConfig,
  } = useProTableDataSource();
  const {
    dataSourceType,
    onlineDataSource,
    onlineUrl,
    shouldRefreshData,
  } = dataSourceConfig;
  const {
    resizingWidth,
    resizingIndex,
    activeCellKey,
    activeColumnKey,
  } = interact;
  const { search, showSearch, handleSearch } = useProTableSearch();
  useEffect(() => {
    if (shouldRefreshData) {
      actionRef.current?.reload();
      handleTableDataSourceConfig({ shouldRefreshData: false });
    }
  }, [shouldRefreshData]);

  const getPaginationConfig = useMemo((): TablePaginationConfig | undefined => {
    switch (dataSourceType) {
      case 'mock':
        return pagination!;
      default:
      case 'online':
        if (!pagination) return undefined;

        // eslint-disable-next-line no-case-declarations
        const { total, ...res } = pagination;
        return res;
    }
  }, [pagination, dataSourceType]);
  return (
    <DragAndDrop>
      <div
        id="x-table"
        ref={setRef}
        style={{ width: widthType === 'fixed' ? width : undefined }}
      >
        <DataPreviewPanel />
        <ProTable
          actionRef={actionRef}
          tableLayout={widthType}
          headerTitle={showTitle ? title : undefined}
          dataSource={
            dataSourceType === 'online' || showEmpty
              ? undefined
              : mockDataSource
          }
          components={{
            header: {
              cell: TableHeader,
            },
          }}
          rowKey="key"
          pagination={showPagination ? getPaginationConfig : false}
          bordered={bordered}
          search={
            showSearch
              ? {
                  ...search,
                  onCollapse: (collapsed: boolean) => {
                    handleSearch({ collapsed });
                  },
                }
              : false
          }
          loading={showLoading}
          rowSelection={rowSelection}
          size={size}
          showHeader={showHeader}
          options={false}
          toolBarRender={
            !showToolBar
              ? false
              : () =>
                  (toolBarActions &&
                    toolBarActions.map((action) => (
                      <Button key={action.text} type={action.type}>
                        {action.text}
                      </Button>
                    ))) ||
                  []
          }
          tableAlertRender={showAlertRender ? undefined : false}
          request={
            dataSourceType === 'online' && onlineUrl
              ? async (params = {}) => {
                  let url = onlineUrl;
                  if (!url?.startsWith('http')) {
                    url = `https://${url}`;
                  }
                  return request(url, {
                    params,
                  });
                }
              : undefined
          }
          columns={columns.map((col, index) => {
            const {
              tags,
              dataIndex,
              title,
              widthType,
              align,
              width,
              widthPercent,
              enum: enums,
              actions,
              status,
              copyable,
              valueType,
              valueEnum,
              filters,
              ...res
            } = col;

            let withValue: number | string | undefined = width;
            switch (widthType) {
              case 'auto':
              default:
                withValue = undefined;
                break;
              case 'number':
                withValue = width;
                break;
              case 'percent':
                withValue = `${widthPercent}%`;
                break;
            }

            return {
              ...res,
              filters: filters ?? isEnum(valueType),
              dataIndex,
              copyable: notColumnData(valueType) ? false : copyable,
              valueType:
                valueType === 'enum' ||
                valueType === 'status' ||
                valueType === 'tag'
                  ? undefined
                  : valueType,
              valueEnum: ['status', 'enum'].includes(valueType)
                ? valueEnum
                : undefined,
              title,
              width:
                // 如果是正在缩放的,那么使用缩放宽度
                resizingIndex === dataIndex ? resizingWidth : withValue,
              align,
              // header 单元格控制
              onHeaderCell: (column) => ({
                ...res,
                columnIndex: index,
                active: activeColumnKey === column?.key,
                onClick: () => {
                  if (activeColumnKey === column?.key) {
                    handleTableInteract({
                      activeCellKey: '',
                      activeColumnKey: '',
                    });
                  } else {
                    handleTableInteract({
                      activeColumnKey: column?.key?.toString(),
                      activeCellKey: '',
                    });
                  }
                },
              }),
              // 单元格控制
              onCell:
                dataSourceType === 'online'
                  ? undefined
                  : (items) => {
                      const item = items[col?.dataIndex];
                      return {
                        className: {
                          [styles.cell]: true,
                          [styles.activeCell]: activeCellKey === item.key,
                          [styles.activeHeader]: activeColumnKey === col?.key,
                          [styles.lastActiveHeader]:
                            activeColumnKey === col?.key &&
                            index &&
                            index + 1 ===
                              (pagination &&
                              onlineDataSource.length >
                                getPaginationConfig?.pageSize!
                                ? getPaginationConfig?.pageSize
                                : onlineDataSource.length),
                        },
                        onClick: () => {
                          if (activeCellKey === item.key) {
                            handleTableInteract({
                              activeColumnKey: '',
                              activeCellKey: '',
                            });
                          } else {
                            handleTableInteract({
                              activeCellKey: item.key,
                              activeColumnKey: '',
                            });
                          }
                        },
                      };
                    },

              render: (node) => {
                switch (col.valueType) {
                  case 'option':
                    return (
                      <Space>
                        {col.actions.map((action, i) => (
                          <a key={i} href="">
                            {action}
                          </a>
                        ))}
                        {col.showActionEllipsis ? <TableDropdown /> : null}
                      </Space>
                    );
                  default:
                    return node;
                }
              },
              renderText: (cellText) => {
                let content;
                if (dataSourceType === 'online') {
                  content = cellText;
                }
                if (dataSourceType === 'mock') {
                  if (!cellText) return '';
                  content = cellText.content;
                }

                switch (col.valueType) {
                  case 'tag':
                    if (!content) {
                      return '';
                    }

                    return <Tag color={content.color}>{content.text}</Tag>;
                  case 'status':
                    if (!content) {
                      return '';
                    }
                    const { text: statusText } = content;
                    if (!statusText) {
                      return content;
                    }
                    return typeof content === 'string' ? (
                      content
                    ) : (
                      <div
                        style={{ display: 'inline-flex', alignItems: 'center' }}
                      >
                        <Badge
                          status={
                            ((content as ValueEnum).status &&
                              ((content as ValueEnum).status!.toLowerCase() as PresetStatusColorType)) ||
                            'default'
                          }
                        />
                        <div>{content?.text}</div>
                      </div>
                    );
                  case 'text':
                    return col.isLink ? (
                      <a>
                        {typeof content === 'string' ? content : content?.text}
                      </a>
                    ) : typeof content === 'object' ? (
                      content?.text
                    ) : (
                      content
                    );
                  default:
                    return content;
                }
              },
            };
          })}
          // @ts-ignore
          postData={(data) => {
            if (dataSourceType === 'online') {
              handleTableDataSourceConfig({ onlineDataSource: data });
            }
            return data;
          }}
        />
      </div>
    </DragAndDrop>
  );
};

export default ProTablePage;
