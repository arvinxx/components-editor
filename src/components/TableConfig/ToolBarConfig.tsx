import React, { FC } from 'react';
import { Checkbox, Input } from 'antd';
import { ConnectState, ProTableModelState } from '@/models/connect';
import { useSelector } from 'dva';

import { EditableTagGroup, CollapsePanel, PanelLayout } from '../index';
import { useHandleTable } from '../../hook';
import styles from './style.less';

const ToolBarConfig: FC = () => {
  const { config, showToolBar, showTitle } = useSelector<
    ConnectState,
    ProTableModelState
  >((state) => state.protable);
  const {
    handleTableState,
    handleToolBarActions,
    deleteToolBarActions,
    addToolBarActions,
    handleTableConfig,
  } = useHandleTable();
  const { toolBarActions, title } = config;

  return (
    <CollapsePanel
      isActive={showToolBar}
      onHandleSwitch={(isActive) => {
        console.log(isActive);
        handleTableState({ showToolBar: isActive });
      }}
      title={'工具栏'}
      panelKey={'toolbar'}
    >
      <PanelLayout
        title={
          <Checkbox
            className={styles.checkBox}
            checked={showTitle}
            name="title"
            onChange={(e) => {
              handleTableState({ showTitle: e.target.checked });
            }}
          >
            标题
          </Checkbox>
        }
      >
        {!showTitle ? null : (
          <Input
            size={'small'}
            placeholder="请输入标题"
            name="titleText"
            value={title}
            onChange={(e) => {
              handleTableConfig('title', e.target.value);
            }}
          />
        )}
      </PanelLayout>
      <PanelLayout title={'操作项'}>
        <EditableTagGroup
          tags={toolBarActions}
          handleTextChange={(index, text) => {
            handleToolBarActions(index, { text });
          }}
          handleDelete={(index) => {
            deleteToolBarActions(index);
          }}
          handleAdd={(text) => {
            addToolBarActions(text);
          }}
          type={'action'}
          showDropdown
          handleTagColorChange={(index, type) => {
            handleToolBarActions(index, { type });
          }}
        />
      </PanelLayout>
    </CollapsePanel>
  );
};

export default ToolBarConfig;
