import React, { FC } from 'react';
import { Button, Input, InputNumber, Radio, Switch } from 'antd';

import { generateColumn, generateRow } from '@/utils';
import { useProTableDataSource } from '@/models/dataSource';
import { useProTableColumn, ColumnType } from '@/models/columns';

import { CollapsePanel, PanelLayout } from '@/core/components';

const DataSourceConfig: FC = () => {
  const {
    dataSourceConfig,
    mockDataSource,
    handleTableDataSourceConfig,
    setMockDataSource,
  } = useProTableDataSource();
  const { columns, setColumns } = useProTableColumn();
  const {
    dataSourceType,
    onlineUrl,
    showEmpty,
    showLoading,
  } = dataSourceConfig;

  /**
   * 添加新的列
   * @param {number} newColumnNum 添加的列数
   * */
  const addNewColumns = (newColumnNum: number) => {
    const newColumns = columns.concat([]);
    let newDataSource = mockDataSource.concat([]);
    for (let i = columns.length; i < Number(newColumnNum); i += 1) {
      const columnIndex = i.toString();
      const newColumn = generateColumn({ columnIndex });
      newDataSource = newDataSource.map((row, rowIndex) => {
        Object.assign(row, {
          [newColumn.dataIndex]: {
            content: '----',
            key: `${rowIndex}-${columnIndex}`,
          },
        });
        return row;
      });
      newColumns.push(newColumn);
    }

    setColumns(newColumns);
    setMockDataSource(newDataSource);
  };

  /**
   * 主动触发表格刷新
   */
  const updateData = () => {
    handleTableDataSourceConfig({ shouldRefreshData: true });
  };

  return (
    <CollapsePanel
      isActive
      panelKey="dataSource"
      title="数据源"
      hideButton
      defaultExpanded
    >
      <PanelLayout title="数据类型">
        <Radio.Group
          onChange={(e) => {
            handleTableDataSourceConfig({ dataSourceType: e.target.value });
            updateData();
          }}
          value={dataSourceType}
        >
          <Radio value="mock">假数据</Radio>
          <Radio value="online">真实数据</Radio>
        </Radio.Group>
      </PanelLayout>
      {dataSourceType === 'online' ? (
        <>
          <PanelLayout title="请求网址">
            <Input
              size="small"
              placeholder="xxx.com/api"
              value={onlineUrl}
              onChange={(e) => {
                handleTableDataSourceConfig({
                  onlineUrl: e.target.value,
                });
              }}
              onPressEnter={updateData}
            />
          </PanelLayout>
          <PanelLayout title={' '}>
            <Button size="small" onClick={updateData}>
              刷新
            </Button>
            <Button
              size="small"
              onClick={() => {
                handleTableDataSourceConfig({ showDataPreviewPanel: true });
              }}
            >
              预览接口
            </Button>
          </PanelLayout>
        </>
      ) : (
        <>
          <PanelLayout title="总列数">
            <InputNumber
              step={1}
              size="small"
              type="tel"
              placeholder="10"
              minLength={1}
              maxLength={30}
              name="pageSize"
              value={columns.length}
              onChange={(value) => {
                if (!value) return;
                const numberValue = Number(value);
                // 如果数量比已有的大多
                if (numberValue > columns.length) {
                  // 新增列数
                  // 要生成新的 column 和 dataSource
                  addNewColumns(numberValue);
                } else {
                  // 删除列数
                  setColumns(columns.splice(0, numberValue));
                }
              }}
            />
          </PanelLayout>
          <PanelLayout title="总行数">
            <InputNumber
              step={1}
              size="small"
              type="tel"
              placeholder="10"
              maxLength={30}
              name="pageSize"
              value={mockDataSource.length || 10}
              onChange={(value) => {
                if (!value) return;

                // 如果数量少于已有的 则减少行数
                if (value < mockDataSource.length) {
                  setMockDataSource(mockDataSource.slice(0, Number(value)));
                }
                // 不然就新增行
                else {
                  const newColumns: ColumnType[] = [];
                  const newRows = [];
                  for (let i = 0; i < columns.length; i += 1) {
                    newColumns.push(
                      generateColumn({
                        dataIndex: columns[i].dataIndex,
                        columnIndex: i.toString(),
                      }),
                    );
                  }
                  for (let i = mockDataSource.length; i < value; i += 1) {
                    newRows.push(
                      generateRow(newColumns, { rowIndex: i.toString() }),
                    );
                  }
                  setMockDataSource(mockDataSource.concat(newRows));
                }
              }}
            />
          </PanelLayout>
          <PanelLayout title="空数据">
            <Switch
              size="small"
              checked={showEmpty}
              onChange={(checked) => {
                handleTableDataSourceConfig({ showEmpty: checked });
              }}
            />
          </PanelLayout>
          <PanelLayout title="加载中">
            <Switch
              size="small"
              checked={showLoading}
              onChange={(checked) => {
                handleTableDataSourceConfig({ showLoading: checked });
              }}
            />
          </PanelLayout>
        </>
      )}
    </CollapsePanel>
  );
};

export default DataSourceConfig;
