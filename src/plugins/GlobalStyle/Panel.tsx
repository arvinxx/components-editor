import React, { ChangeEvent, FC } from 'react';
import { Divider, InputNumber, Radio, Switch } from 'antd';

import { RadioChangeEvent } from 'antd/lib/radio/interface';

import { useProTableTheme } from '@/models/theme';
import { CollapsePanel, PanelLayout, ColorPanel } from '@/core/components';

import { useGlobalStyle } from './state';

const StyleConfig: FC = () => {
  const { config, handleTableConfig } = useGlobalStyle();
  const { theme } = useProTableTheme();

  const { size, width, bordered, widthType, showHeader } = config;

  const handleInput = (key: string) => (
    e: ChangeEvent<HTMLInputElement> | RadioChangeEvent,
  ) => {
    handleTableConfig({ [key]: e.target.value });
  };

  return (
    <CollapsePanel
      title="表格样式"
      panelKey="style"
      defaultExpanded
      hideButton
      isActive
    >
      <PanelLayout title="尺寸">
        <Radio.Group name="size" onChange={handleInput('size')} value={size}>
          <Radio value="large">大</Radio>
          <Radio value="middle">中</Radio>
          <Radio value="small">小</Radio>
        </Radio.Group>
      </PanelLayout>
      <PanelLayout title="总宽度">
        <Radio.Group
          name="widthType"
          onChange={(e) => {
            handleTableConfig({ widthType: e.target.value });
          }}
          value={widthType}
        >
          <Radio value="auto">自动</Radio>
          <Radio value="fixed">
            固定宽度
            {widthType === 'auto' ? null : (
              <InputNumber
                style={{
                  width: 80,
                  marginLeft: 8,
                }}
                size="small"
                step={10}
                type="tel"
                placeholder="表格宽度"
                maxLength={25}
                name="width"
                value={width}
                onChange={(value) => {
                  handleTableConfig({ width: Number(value || 0) });
                }}
              />
            )}
          </Radio>
        </Radio.Group>
      </PanelLayout>
      <PanelLayout title="边框">
        <Switch
          size="small"
          checked={bordered}
          onChange={(checked) => {
            handleTableConfig({ bordered: checked });
          }}
        />
      </PanelLayout>
      <PanelLayout title="表头">
        <Switch
          size="small"
          checked={showHeader}
          onChange={(checked) => {
            handleTableConfig({ showHeader: checked });
          }}
        />
      </PanelLayout>
      <Divider style={{ margin: '16px 0' }} />
      {/* <PanelLayout title={'主色'}> */}
      {/*  <ColorPanel color={theme.primaryColor} colorKey={'primaryColor'} /> */}
      {/* </PanelLayout> */}
      <PanelLayout title="表头背景">
        <ColorPanel
          color={theme.headerBG}
          colorKey="headerBG"
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
