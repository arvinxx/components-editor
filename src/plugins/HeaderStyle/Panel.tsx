import React, { FC } from 'react';
import { Radio, Switch, InputNumber } from 'antd';

import { PanelLayout, CollapsePanel } from '@/components';

import { useIntl } from 'react-intl';

import { isEnum, notColumnData } from '@/utils';

import { useProTableInteract } from '@/models/interact';
import { useProTableColumn } from '@/models/columns';

const HeaderStyle: FC = () => {
  const { formatMessage } = useIntl();

  const { interact } = useProTableInteract();
  const { handleTableColumn, getColumnByKey } = useProTableColumn();

  const { tableTotalWidth, activeColumnKey } = interact;

  const { column } = getColumnByKey(activeColumnKey);

  const setColumnConfig = (field: string, value: any) => {
    handleTableColumn(column.dataIndex, field, value);
  };

  return !column ? (
    <div />
  ) : (
    <div>
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
            <Radio value="auto" style={{ marginBottom: 4 }}>
              自动
            </Radio>
            <Radio value="number">
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
            <Radio value="percent">
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
            <Radio value="left">左</Radio>
            <Radio value="center">中</Radio>
            <Radio value="right">右</Radio>
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
    </div>
  );
};

export default HeaderStyle;
