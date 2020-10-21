import React, { FC } from 'react';
import { Drawer } from 'antd';
import { useIntl } from 'react-intl';
import { ArrowLeftOutlined } from '@ant-design/icons';
import { useProTableInteract } from '@/models/interact';
import { pluginManager } from '@/core';

import styles from './style.less';

type GetContainerFunc = () => HTMLElement;

export interface ConfigPanelProps {
  drawer?: boolean;
  visible: boolean;
  onClose: () => void;
  getContainer?: string | HTMLElement | GetContainerFunc | false;
}
const ConfigPanel: FC<ConfigPanelProps> = ({
  visible = true,
  getContainer,
  onClose,
}) => {
  const { formatMessage } = useIntl();
  const { interact, handleTableInteract } = useProTableInteract();
  const { activeColumnKey, activeCellKey } = interact;

  const isGlobal = activeCellKey === '' && activeColumnKey === '';
  const isHeader = activeColumnKey !== '';

  const contextTitle = () => {
    if (isGlobal) {
      return 'page.component.element.table';
    }
    if (isHeader) {
      return 'page.component.element.header';
    }
    return 'page.component.element.cell';
  };
  return (
    <Drawer
      onClose={onClose}
      width={320}
      visible={visible}
      mask={false}
      getContainer={getContainer}
    >
      {isGlobal ? (
        // 全局面板
        <>
          <div className={styles.title}>
            {formatMessage({ id: 'page.component.element.table' })}
          </div>
          <pluginManager.GlobalPanel />
        </>
      ) : (
        // token 面板
        <>
          <div
            className={styles.tokenTitle}
            onClick={() => {
              handleTableInteract({ activeColumnKey: '', activeCellKey: '' });
            }}
          >
            <ArrowLeftOutlined style={{ marginRight: 4 }} />
            {formatMessage({ id: contextTitle() })}
          </div>
          <pluginManager.SpecificPanel token={isHeader ? 'header' : 'cell'} />
        </>
      )}
    </Drawer>
  );
};

export default ConfigPanel;
