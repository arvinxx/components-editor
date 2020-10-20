import React, { FC } from 'react';
import { Checkbox, Input } from 'antd';
import { ButtonType } from 'antd/es/button';

import { useProTableToolBar } from '@/models/toolbar';
import { EditableTagGroup, CollapsePanel, PanelLayout } from '@/components';

import styles from './style.less';

const ToolBar: FC = () => {
  const {
    showToolBar,
    showTitle,
    toolBarActions,
    title,
    setShowToolBar,
    handleToolBarActions,
    deleteToolBarActions,
    addToolBarActions,
    setShowTitle,
    setTitle,
  } = useProTableToolBar();

  return (
    <CollapsePanel
      isActive={showToolBar}
      onHandleSwitch={(isActive) => {
        setShowToolBar(isActive);
      }}
      title="工具栏"
      panelKey="toolbar"
    >
      <PanelLayout
        title={
          <Checkbox
            className={styles.checkBox}
            checked={showTitle}
            name="title"
            onChange={(e) => {
              setShowTitle(e.target.checked);
            }}
          >
            标题
          </Checkbox>
        }
      >
        {!showTitle ? null : (
          <Input
            size="small"
            placeholder="请输入标题"
            name="title"
            value={title}
            onChange={(e) => {
              setTitle(e.target.value);
            }}
          />
        )}
      </PanelLayout>
      <PanelLayout title="操作项">
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
          type="action"
          showDropdown
          handleTagColorChange={(index, type) => {
            handleToolBarActions(index, { type: type as ButtonType });
          }}
        />
      </PanelLayout>
    </CollapsePanel>
  );
};

export default ToolBar;
