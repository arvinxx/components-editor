import React, { FC } from 'react';
import { InputNumber, Input, Switch, Radio, Divider } from 'antd';
import { ConnectState, ProTableModelState } from '@/models/connect';
import { useSelector } from 'dva';
import { TableRowSelection } from 'antd/es/table/interface';

import { useHandleTable } from '../../hook';
import { CollapsePanel, PanelLayout } from '../index';

const RowSelectionConfig: FC = () => {
  const { config, showRowSelection, showAlertRender } = useSelector<
    ConnectState,
    ProTableModelState
  >((state) => state.protable);
  const {
    handleTableConfig,
    handleTableState,
    handleTableRowSelection,
  } = useHandleTable();
  const { rowSelection } = config;

  const setRowSelectionState = (
    key: keyof TableRowSelection<any>,
    value: any
  ) => {
    handleTableRowSelection({
      [key]: value,
    });
  };
  return (
    <CollapsePanel
      title={'批量操作'}
      isActive={showRowSelection}
      panelKey={'rowSelection'}
      onHandleSwitch={(isOpen) => {
        handleTableState({ showRowSelection: isOpen });
        handleTableState({ showAlertRender: isOpen });
        if (isOpen) {
          if (!rowSelection) {
            handleTableConfig('rowSelection', {
              columnWidth: 60,
              type: 'checkbox',
            });
          }
        } else {
          // 配置为禁用
          handleTableConfig('rowSelection', false);
        }
      }}
    >
      <PanelLayout title={'提示框'} heightGutter={0}>
        <Switch
          size={'small'}
          checked={showAlertRender}
          onChange={(isOpen) => {
            handleTableState({ showAlertRender: isOpen });
          }}
        />
      </PanelLayout>
      <Divider style={{ margin: '16px 0' }} />
      <PanelLayout title={'列标题'}>
        <Input
          size={'small'}
          value={(rowSelection && rowSelection.columnTitle?.toString()) || ''}
          onChange={(e) => {
            setRowSelectionState('columnTitle', e.target.value);
          }}
          placeholder={'请输入选择列标题'}
        />
      </PanelLayout>
      <PanelLayout title={'列宽'}>
        <InputNumber
          size={'small'}
          value={Number(rowSelection && rowSelection.columnWidth)}
          onChange={(value) => {
            setRowSelectionState('columnWidth', value);
          }}
          placeholder={'查询'}
        />
      </PanelLayout>
      <PanelLayout title={'单选/多选'}>
        <Radio.Group
          name="size"
          onChange={(e) => {
            setRowSelectionState('type', e.target.value);
          }}
          value={rowSelection && rowSelection.type}
        >
          <Radio value="radio">单选</Radio>
          <Radio value="checkbox">多选</Radio>
        </Radio.Group>
      </PanelLayout>
      <Divider style={{ margin: '16px 0' }} />
      <PanelLayout title={'滚动时固定在左侧'}>
        <Switch
          size={'small'}
          checked={rowSelection && rowSelection.fixed}
          onChange={(isOpen) => {
            setRowSelectionState('fixed', isOpen);
          }}
        />
      </PanelLayout>
    </CollapsePanel>
  );
};

export default RowSelectionConfig;
