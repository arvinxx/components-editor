import ProTable, { TableDropdown } from '@ant-design/pro-table';
import React, { FC, useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';
import { Badge, Space, Tag, Button } from 'antd';
import { ConnectState, ProTableModelState } from '@/models/connect';
import { useSize } from '@umijs/hooks';
import request from 'umi-request';

import { useHandleTable } from '@/hook';
import { ValueEnum } from '@/typings/table';
import { PresetStatusColorType } from 'antd/lib/_util/colors';
import { isEnum, notColumnData } from '@/utils';

import { ActionType } from '@ant-design/pro-table/lib/Table';
import { TablePaginationConfig } from 'antd/es/table';
import { DataPreviewPanel } from '../components';
import styles from './style.less';
import TableHeader from './TableHeader';

const ProTablePage: FC = () => {
  const table = useSelector<ConnectState, ProTableModelState>(
    (state) => state.protable,
  );
  const actionRef = useRef<ActionType>();

  const { handleTableState, handleTableSearch } = useHandleTable();
  const [tableSize, setRef] = useSize<HTMLDivElement>();
  useEffect(() => {
    handleTableState({ tableTotalWidth: tableSize.width });
  }, [tableSize.width]);
  const {
    config,
    columns,
    dataSource,
    tableWidth,
    activeHeader,
    focusedCellKey,
    resizingWidth,
    resizingIndex,
    showAlertRender,
    showTitle,
    showToolBar,
    showSearch,
    onlineUrl,
    dataSourceType,
    shouldRefreshData,
  } = table;

  const {
    title,
    footer,
    footerText,
    rowSelection,
    bordered,
    size,
    widthValue,
    loading,
    showHeader,
    hasData,
    pagination,
    search,
    toolBarActions,
  } = config;

  useEffect(() => {
    if (shouldRefreshData) {
      actionRef.current?.reload();
      handleTableState({ shouldRefreshData: false });
    }
  }, [shouldRefreshData]);

  let paginationConfig: TablePaginationConfig | false = false;
  switch (dataSourceType) {
    case 'mock':
      paginationConfig = pagination!;
      break;
    case 'online':
      if (pagination) {
        const { total: _, ...res } = pagination;
        paginationConfig = { ...res };
      }
      break;
  }
  return (
    <div
      id="x-table"
      ref={setRef}
      style={{ width: tableWidth === 'fixed' ? widthValue : undefined }}
    >
      <DataPreviewPanel />
      <ProTable
        actionRef={actionRef}
        tableLayout={tableWidth}
        headerTitle={showTitle ? title : undefined}
        dataSource={
          dataSourceType === 'mock' || hasData ? dataSource : undefined
        }
        components={{
          header: {
            cell: TableHeader,
          },
        }}
        rowKey="key"
        pagination={paginationConfig}
        bordered={bordered}
        search={
          showSearch
            ? {
                ...search,
                onCollapse: (collapsed: boolean) => {
                  handleTableSearch({ collapsed });
                },
              }
            : false
        }
        loading={loading}
        footer={footer ? () => <div>{footerText} </div> : undefined}
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
        postData={(data) => {
          if (dataSourceType === 'online') {
            handleTableState({ previewData: data });
          }
          return data;
        }}
        // @ts-ignore
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
              resizingIndex === dataIndex
                ? resizingWidth
                : widthType === 'number'
                ? width
                : widthType === 'percent'
                ? `${widthPercent}%`
                : undefined,
            align,
            // header 单元格控制
            onHeaderCell: (column) => ({
              ...res,
              columnIndex: index,
              active: activeHeader === column?.key,
              onClick: () => {
                if (activeHeader === column?.key) {
                  handleTableState({
                    activeHeader: '',
                    focusedCellKey: '',
                  });
                } else {
                  handleTableState({
                    activeHeader: column?.key,
                    focusedCellKey: '',
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
                        [styles.activeCell]: focusedCellKey === item?.key,
                        [styles.cell]: true,
                      },
                      onClick: () => {
                        if (focusedCellKey === item.key) {
                          handleTableState({
                            activeHeader: '',
                            focusedCellKey: '',
                          });
                        } else {
                          handleTableState({
                            focusedCellKey: item.key,
                            activeHeader: '',
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
                      {col.actions.map((action, index) => (
                        <a key={index} href="">
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
                  const { color, text } = content;
                  if (!text) {
                    return content;
                  }
                  return <Tag color={color}>{text}</Tag>;
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
      />
    </div>
  );
};

export default ProTablePage;
