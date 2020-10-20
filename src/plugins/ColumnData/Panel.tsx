import React, { FC, useEffect, useRef, useState } from 'react';
import { Radio, Input, Divider, Select } from 'antd';
import { EditOutlined } from '@ant-design/icons';

import {
  InfoNote,
  PanelLayout,
  CollapsePanel,
  DataFillPanel,
} from '@/components';

// import { useIntl } from 'react-intl';

import { notColumnData } from '@/utils';
import { useProTableDataSource, RowType } from '@/models/dataSource';
import { useProTableInteract } from '@/models/interact';
import { useProTableColumn, ColumnValueType } from '@/models/columns';

import TypeString from './TypeString';

import styles from './style.less';

const { Option } = Select;

const ColumnData: FC = () => {
  // const { formatMessage } = useIntl();
  const titleInput = useRef<Input>(null);
  const [isEditingIndex, setEditIndex] = useState(false);
  const [editingValue, setEditingValue] = useState('');
  const {
    mockDataSource,
    dataSourceConfig,
    setMockDataSource,
  } = useProTableDataSource();
  const { interact } = useProTableInteract();
  const { handleTableColumn, getColumnByKey } = useProTableColumn();

  const { activeColumnKey } = interact;
  const { dataSourceType, onlineDataSource } = dataSourceConfig;

  const { column, index: colIndex } = getColumnByKey(activeColumnKey);

  const setColumnConfig = (field: string, value: any) => {
    handleTableColumn(column.dataIndex, field, value);
  };

  // 每次切换 index 时,自动聚焦标题
  useEffect(() => {
    if (titleInput.current) {
      titleInput.current.focus();
    }
  }, [colIndex]);

  /**
   * 修改数据索引的组件
   * */
  const DataIndex: FC = () => {
    if (dataSourceType === 'mock') return <div />;

    const changeDataIndex = (value?: string) => {
      let index = editingValue;
      if (value) {
        index = value;
      }

      const newDataSource: RowType[] = [];
      mockDataSource.forEach((row) => {
        const item = row[column?.dataIndex];
        if (item) {
          row[index] = item;
          delete row[column?.dataIndex];
        }
        newDataSource.push(row);
      });
      setMockDataSource(newDataSource);
      setColumnConfig('dataIndex', index);
      setEditIndex(false);
    };

    return notColumnData(column.valueType) ? null : (
      <PanelLayout
        title={
          <div>
            索引{' '}
            <InfoNote
              title="用于指向具体数据的参数项"
              url="https://yuque.com"
            />
          </div>
        }
      >
        {isEditingIndex ? (
          <div>
            <Select
              value={column?.dataIndex}
              size="small"
              style={{ width: '100%' }}
              placeholder="请选择索引"
              onChange={changeDataIndex}
            >
              {Object.entries(onlineDataSource[0])?.map((entry) => {
                const [key, value] = entry;

                return (
                  <Option value={key} key={key} title={key}>
                    <div style={{ display: 'inline-block', width: 32 }}>
                      <TypeString
                        value={value instanceof Array ? 'array' : typeof value}
                      />
                    </div>
                    {key}
                  </Option>
                );
              })}
            </Select>
          </div>
        ) : (
          <div className={styles.dataIndex} style={{ display: 'flex' }}>
            <div style={{ marginRight: 4 }}>{column.dataIndex}</div>
            <EditOutlined
              onClick={() => {
                setEditIndex(true);
                setEditingValue(column.dataIndex);
              }}
              className={styles.editIcon}
            />
          </div>
        )}{' '}
      </PanelLayout>
    );
  };

  return (
    <div>
      <CollapsePanel
        title="数据"
        panelKey="data"
        isActive
        hideButton
        defaultExpanded
      >
        <PanelLayout title="名称">
          <Input
            size="small"
            ref={titleInput}
            autoFocus={colIndex > -1}
            value={column && column.title}
            onChange={(e) => {
              setColumnConfig('title', e.target.value);
            }}
          />
        </PanelLayout>
        <DataIndex />
        <PanelLayout title="数据类型">
          <Radio.Group
            value={column.valueType}
            onChange={(e) => {
              const valueType: ColumnValueType = e.target.value;
              setColumnConfig('valueType', valueType);
            }}
          >
            {colIndex === 0 ? (
              <>
                <Radio value="index">序号</Radio>
                <Radio value="indexBorder">序号（带边框）</Radio>
                <Divider style={{ margin: '8px 0' }} />
              </>
            ) : null}
            <Radio value="text">普通文本</Radio>
            <Divider style={{ margin: '8px 0' }} />
            <Radio value="digit">数字</Radio>
            <Radio value="money">金额</Radio>
            <Radio value="percent">百分比</Radio>
            <Divider style={{ margin: '8px 0' }} />
            <Radio value="date">日期</Radio>
            <Radio value="time">时间</Radio>
            <Radio value="dateTime">日期时间</Radio>
            {/* TODO 时间区间 & 日期区间 */}
            {/* <Radio  value={'dateRange'}> */}
            {/*  日期区间 */}
            {/* </Radio> */}
            {/* <Radio  value={'dateTimeRange'}> */}
            {/*  日期时间区间 */}
            {/* </Radio> */}
            <Divider style={{ margin: '8px 0' }} />
            <Radio value="enum">
              枚举{' '}
              <InfoNote title="固定某些值的文本类型 例如: [男,女] [前端,后端,设计] 等" />
            </Radio>
            <Radio value="tag">标签</Radio>
            <Radio value="status">状态</Radio>
            <Radio value="option">操作</Radio>
          </Radio.Group>
        </PanelLayout>
        <DataFillPanel column={column} columnIndex={colIndex} />
      </CollapsePanel>
    </div>
  );
};

export default ColumnData;
