import React, { FC } from 'react';
import { InputNumber, Input, Switch, Radio, Divider } from 'antd';

import { TableRowSelection } from 'antd/es/table/interface';

import { CollapsePanel, PanelLayout } from '@/core/components';
import { useProTableRowSelection } from '@/models/rowSelection';

const RowSelection: FC = () => {
  const {
    showAlertRender,
    showRowSelection,
    setShowRowSelection,
    rowSelection,
    handleRowSelection,
    setShowAlertRender,
  } = useProTableRowSelection();

  const setRowSelectionState = (
    key: keyof TableRowSelection<any>,
    value: any,
  ) => {
    handleRowSelection({
      [key]: value,
    });
  };
  return (
    <CollapsePanel
      title="批量操作"
      isActive={showRowSelection}
      panelKey="rowSelection"
      onHandleSwitch={(isOpen) => {
        setShowRowSelection(isOpen);
        setShowAlertRender(isOpen);
      }}
    >
      <PanelLayout title="提示框" heightGutter={0}>
        <Switch
          size="small"
          checked={showAlertRender}
          onChange={(isOpen) => {
            setShowAlertRender(isOpen);
          }}
        />
      </PanelLayout>
      <Divider style={{ margin: '16px 0' }} />
      <PanelLayout title="列标题">
        <Input
          size="small"
          value={(rowSelection && rowSelection.columnTitle?.toString()) || ''}
          onChange={(e) => {
            setRowSelectionState('columnTitle', e.target.value);
          }}
          placeholder="请输入选择列标题"
        />
      </PanelLayout>
      <PanelLayout title="列宽">
        <InputNumber
          size="small"
          value={Number(rowSelection && rowSelection.columnWidth)}
          onChange={(value) => {
            setRowSelectionState('columnWidth', value);
          }}
          placeholder="查询"
        />
      </PanelLayout>
      <PanelLayout title="单选/多选">
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
      <PanelLayout title="滚动时固定在左侧">
        <Switch
          size="small"
          checked={rowSelection && rowSelection.fixed}
          onChange={(isOpen) => {
            setRowSelectionState('fixed', isOpen);
          }}
        />
      </PanelLayout>
    </CollapsePanel>
  );
};

export default RowSelection;
