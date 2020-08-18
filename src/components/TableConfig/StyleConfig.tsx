import React, { ChangeEvent, FC, useState } from 'react';
import { Col, Divider, Dropdown, InputNumber, Radio, Switch } from 'antd';
import { ConnectState, ProTableModelState } from '@/models/connect';
import { useSelector } from 'dva';
import { RadioChangeEvent } from 'antd/lib/radio/interface';

import { CollapsePanel, PanelLayout, ColorPanel } from '../index';
import { useHandleTable } from '../../hook';

const StyleConfig: FC = () => {
  const { theme, config, tableWidth } = useSelector<
    ConnectState,
    ProTableModelState
  >((state) => state.protable);
  const { handleTableConfig, handleTableState } = useHandleTable();

  const { size, widthValue, bordered, showHeader } = config;

  const handleInput = (key: string) => (
    e: ChangeEvent<HTMLInputElement> | RadioChangeEvent
  ) => {
    handleTableConfig(key, e.target.value);
  };

  return (
    <CollapsePanel
      title={'表格样式'}
      panelKey={'style'}
      defaultExpanded
      hideButton
      isActive={true}
    >
      <PanelLayout title={'尺寸'}>
        <Radio.Group name="size" onChange={handleInput('size')} value={size}>
          <Radio value="large">大</Radio>
          <Radio value="middle">中</Radio>
          <Radio value="small">小</Radio>
        </Radio.Group>
      </PanelLayout>
      <PanelLayout title={'总宽度'}>
        <Radio.Group
          name="tableWidth"
          onChange={(e) => {
            handleTableState({ tableWidth: e.target.value });
          }}
          value={tableWidth}
        >
          <Radio value="auto">自动</Radio>
          <Radio value="fixed">
            固定宽度
            {tableWidth === 'auto' ? null : (
              <InputNumber
                style={{
                  width: 80,
                  marginLeft: 8,
                }}
                size={'small'}
                step={10}
                type="tel"
                placeholder="表格宽度"
                maxLength={25}
                name="widthValue"
                value={widthValue}
                onChange={(value) => {
                  handleTableConfig('widthValue', value);
                }}
              />
            )}
          </Radio>
        </Radio.Group>
      </PanelLayout>
      <PanelLayout title={'边框'}>
        <Switch
          size={'small'}
          checked={bordered}
          onChange={(checked) => {
            handleTableConfig('bordered', checked);
          }}
        />
      </PanelLayout>
      <PanelLayout title={'表头'}>
        <Switch
          size={'small'}
          checked={showHeader}
          onChange={(checked) => {
            handleTableConfig('showHeader', checked);
          }}
        />
      </PanelLayout>
      <Divider style={{ margin: '16px 0' }} />
      {/*<PanelLayout title={'主色'}>*/}
      {/*  <ColorPanel color={theme.primaryColor} colorKey={'primaryColor'} />*/}
      {/*</PanelLayout>*/}
      <PanelLayout title={'表头背景'}>
        <ColorPanel
          color={theme.headerBG}
          colorKey={'headerBG'}
          presetColors={[
            { color: '#fafafa', title: '默认' },
            { color: '#fff', title: '纯色' },
          ]}
        />
      </PanelLayout>
    </CollapsePanel>
  );
};

export default StyleConfig;
