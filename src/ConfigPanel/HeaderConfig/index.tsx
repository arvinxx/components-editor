import React, {
  FC,
  MouseEventHandler,
  useEffect,
  useRef,
  useState,
} from 'react';
import { Radio, Switch, Input, InputNumber, Divider, Select } from 'antd';
import { EditOutlined, ArrowLeftOutlined } from '@ant-design/icons';

import {
  InfoNote,
  PanelLayout,
  CollapsePanel,
  DataFillPanel,
} from '@/components';

import { useIntl } from 'react-intl';

import { isEnum, notColumnData } from '@/utils';
import { useProTableDataSource, RowType } from '@/models/dataSource';
import { useProTableInteract } from '@/models/interact';
import { useProTableColumn, ColumnValueType } from '@/models/columns';

import TypeString from './TypeString';

import styles from './style.less';

interface HeaderConfigProps {
  onBack?: MouseEventHandler<HTMLElement>;
  onReset?: MouseEventHandler<HTMLElement>;
}
// TODO 优化表头编辑器
// 2. 将高级搜索抽离出来 提供新的配置
//    - 配置项有在搜索框隐藏
//    - 排序
//    - 能修改输入框内容吗

const { Option } = Select;

const HeaderConfig: FC<HeaderConfigProps> = ({ onBack }) => {
  const { formatMessage } = useIntl();
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

  const { tableTotalWidth, activeColumnKey } = interact;
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
      <div className={styles.configTitle} onClick={onBack}>
        <ArrowLeftOutlined style={{ marginRight: 4 }} />
        {formatMessage({ id: 'page.component.element.header' })}
      </div>
      <CollapsePanel
        title={formatMessage({ id: 'page.component.header-config.style' })}
        panelKey="style"
        isActive
        hideButton
        defaultExpanded
      >
        <PanelLayout title="列宽">
          <Radio.Group
            onChange={(e) => {
              const widthType = e.target.value;
              setColumnConfig('widthType', widthType);
              let percent;
              let number;
              switch (widthType) {
                default:
                  break;
                case 'percent':
                  if (column.width && tableTotalWidth) {
                    percent = (column.width / tableTotalWidth) * 100;
                    setColumnConfig('widthPercent', percent.toFixed(0));
                  }
                  setColumnConfig('width', undefined);
                  break;
                case 'number':
                  if (column.widthPercent && tableTotalWidth) {
                    number =
                      (Number(column.widthPercent) / 100) * tableTotalWidth;
                    setColumnConfig('width', number.toFixed(0));
                  }
                  setColumnConfig('widthPercent', undefined);
                  break;
                case 'auto':
              }
            }}
            value={column.widthType}
          >
            <Radio
              className={styles.radio}
              value="auto"
              style={{ marginBottom: 4 }}
            >
              自动
            </Radio>
            <Radio className={styles.radio} value="number">
              数值
              <InputNumber
                name="width"
                style={{
                  width: 110,
                  marginLeft: 24,
                  marginBottom: 8,
                }}
                size="small"
                placeholder="请输入数值"
                value={column.width}
                onChange={(value) => {
                  setColumnConfig('width', value);
                }}
              />
            </Radio>
            <Radio className={styles.radio} value="percent">
              百分比
              <InputNumber
                name="width"
                style={{
                  width: 110,
                  marginLeft: 10,
                }}
                size="small"
                placeholder="请输入百分比"
                formatter={(value) => (value ? `${value}%` : '')}
                parser={(value) => value!.replace('%', '')}
                value={column.widthPercent}
                onChange={(value) => {
                  setColumnConfig('widthPercent', value);
                }}
              />
            </Radio>
          </Radio.Group>
        </PanelLayout>
        <PanelLayout title="对齐方式">
          <Radio.Group
            onChange={(e) => {
              setColumnConfig('align', e.target.value);
            }}
            defaultValue="left"
            value={column.align}
          >
            <Radio className={styles.radio} value="left">
              左
            </Radio>
            <Radio className={styles.radio} value="center">
              中
            </Radio>
            <Radio className={styles.radio} value="right">
              右
            </Radio>
          </Radio.Group>
        </PanelLayout>
        <PanelLayout title="过长省略">
          <Switch
            size="small"
            checked={column.ellipsis}
            onChange={(checked) => {
              setColumnConfig('ellipsis', checked);
            }}
          />
        </PanelLayout>
        {notColumnData(column.valueType) ? null : (
          <PanelLayout title="复制按钮">
            <Switch
              size="small"
              checked={column.copyable}
              onChange={(checked) => {
                setColumnConfig('copyable', checked);
              }}
            />
          </PanelLayout>
        )}
        {isEnum(column.valueType) ? (
          <PanelLayout title="显示筛选">
            <Switch
              size="small"
              checked={column.filters ?? isEnum(column.valueType)}
              onChange={(checked) => {
                setColumnConfig('filters', checked);
              }}
            />
          </PanelLayout>
        ) : null}
      </CollapsePanel>
      <CollapsePanel title="高级搜索" panelKey="search" isActive hideButton>
        {notColumnData(column.valueType) ? null : (
          <PanelLayout title="隐藏字段">
            <Switch
              size="small"
              checked={column.hideInSearch}
              onChange={(checked) => {
                setColumnConfig('hideInSearch', checked);
              }}
            />
          </PanelLayout>
        )}
      </CollapsePanel>
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
                <Radio className={styles.radio} value="index">
                  序号
                </Radio>
                <Radio className={styles.radio} value="indexBorder">
                  序号（带边框）
                </Radio>
                <Divider style={{ margin: '8px 0' }} />
              </>
            ) : null}
            <Radio className={styles.radio} value="text">
              普通文本
            </Radio>
            <Divider style={{ margin: '8px 0' }} />
            <Radio className={styles.radio} value="digit">
              数字
            </Radio>
            <Radio className={styles.radio} value="money">
              金额
            </Radio>
            <Radio className={styles.radio} value="percent">
              百分比
            </Radio>
            <Divider style={{ margin: '8px 0' }} />
            <Radio className={styles.radio} value="date">
              日期
            </Radio>
            <Radio className={styles.radio} value="time">
              时间
            </Radio>
            <Radio className={styles.radio} value="dateTime">
              日期时间
            </Radio>
            {/* TODO 时间区间 & 日期区间 */}
            {/* <Radio className={styles.radio} value={'dateRange'}> */}
            {/*  日期区间 */}
            {/* </Radio> */}
            {/* <Radio className={styles.radio} value={'dateTimeRange'}> */}
            {/*  日期时间区间 */}
            {/* </Radio> */}
            <Divider style={{ margin: '8px 0' }} />
            <Radio className={styles.radio} value="enum">
              枚举{' '}
              <InfoNote title="固定某些值的文本类型 例如: [男,女] [前端,后端,设计] 等" />
            </Radio>
            <Radio className={styles.radio} value="tag">
              标签
            </Radio>
            <Radio className={styles.radio} value="status">
              状态
            </Radio>
            <Radio className={styles.radio} value="option">
              操作
            </Radio>
          </Radio.Group>
        </PanelLayout>
        <DataFillPanel column={column} columnIndex={colIndex} />
      </CollapsePanel>
    </div>
  );
};

export default HeaderConfig;
