import React, { FC, useState } from 'react';
import { Button, Input, InputNumber, Radio, Switch, Drawer, Space } from 'antd';
import { ConnectState, ProTableModelState } from '@/models/connect';
import { useSelector } from 'dva';
import { CheckOutlined } from '@ant-design/icons';

import { CollapsePanel, PanelLayout } from '../index';
import { useHandleTable } from '../../hook';
import { ColumnType } from 'typings/data/table';
import { generateColumn, generateRow } from '@/utils';

const DataSourceConfig: FC = () => {
  const {
    dataSourceType,
    config,
    dataSource,
    columns,
    onlineUrl,
  } = useSelector<ConnectState, ProTableModelState>((state) => state.protable);
  const { handleTableConfig, handleTableState } = useHandleTable();
  const { loading, hasData } = config;

  /**
   * 添加新的列
   * @param {number} newColumnNum 添加的列数
   **/
  const addNewColumns = (newColumnNum: number) => {
    let newColumns = columns.concat([]);
    let newDataSource = dataSource.concat([]);
    for (let i = columns.length; i < Number(newColumnNum); i++) {
      const columnIndex = i.toString();
      const newColumn = generateColumn({ columnIndex });
      newDataSource = newDataSource.map((row, rowIndex) => {
        Object.assign(row, {
          [newColumn.dataIndex]: {
            content: '----',
            key: rowIndex + '-' + columnIndex,
          },
        });
        return row;
      });
      newColumns.push(newColumn);
    }

    handleTableState({
      columns: newColumns,
      dataSource: newDataSource,
    });
  };

  /**
   * 主动触发表格刷新
   */
  const updateData = () => {
    handleTableState({ shouldRefreshData: true });
  };

  return (
    <CollapsePanel
      isActive
      panelKey={'dataSource'}
      title={'数据源'}
      hideButton
      defaultExpanded
    >
      <PanelLayout title={'数据类型'}>
        <Radio.Group
          name="tableWidth"
          onChange={(e) => {
            handleTableState({ dataSourceType: e.target.value });
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
          <PanelLayout title={'请求网址'}>
            <Input
              size={'small'}
              placeholder="xxx.com/api"
              value={onlineUrl}
              onChange={(e) => {
                handleTableState({
                  onlineUrl: e.target.value,
                });
              }}
              onPressEnter={updateData}
            />
          </PanelLayout>
          <PanelLayout title={' '}>
            <Button size={'small'} onClick={updateData}>
              刷新
            </Button>
            <Button
              size={'small'}
              onClick={() => {
                handleTableState({ showDataPreviewPanel: true });
              }}
            >
              预览接口
            </Button>
          </PanelLayout>
        </>
      ) : (
        <>
          <PanelLayout title={'总列数'}>
            <InputNumber
              step={1}
              size={'small'}
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
                  handleTableState({
                    columns: columns.splice(0, numberValue),
                  });
                }
              }}
            />
          </PanelLayout>
          <PanelLayout title={'总行数'}>
            <InputNumber
              step={1}
              size={'small'}
              type="tel"
              placeholder="10"
              maxLength={30}
              name="pageSize"
              value={dataSource.length || 10}
              onChange={(value) => {
                if (!value) return;

                // 如果数量少于已有的 则减少行数
                if (value < dataSource.length) {
                  handleTableState({
                    dataSource: dataSource.slice(0, Number(value)),
                  });
                }
                // 不然就新增行
                else {
                  const newColumns: ColumnType[] = [];
                  const newRows = [];
                  for (let i = 0; i < columns.length; i++) {
                    newColumns.push(
                      generateColumn({
                        dataIndex: columns[i].dataIndex,
                        columnIndex: i.toString(),
                      })
                    );
                  }
                  for (let i = dataSource.length; i < value; i++) {
                    newRows.push(
                      generateRow(newColumns, { rowIndex: i.toString() })
                    );
                  }
                  handleTableState({
                    dataSource: dataSource.concat(newRows),
                  });
                }
              }}
            />
          </PanelLayout>
          <PanelLayout title={'空数据'}>
            <Switch
              size={'small'}
              checked={!hasData}
              onChange={(checked) => {
                handleTableConfig('hasData', !checked);
              }}
            />
          </PanelLayout>
          <PanelLayout title={'加载中'}>
            <Switch
              size={'small'}
              checked={loading}
              onChange={(checked) => {
                handleTableConfig('loading', checked);
              }}
            />
          </PanelLayout>
        </>
      )}
    </CollapsePanel>
  );
};

export default DataSourceConfig;
