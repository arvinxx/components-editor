import React, { useState, FC, useEffect } from 'react';
import { Collapse, Switch } from 'antd';

import styles from './style.less';

const { Panel } = Collapse;

export interface CollapsePanelProps {
  panelKey: string;
  title: string;
  /**
   * 控制开关值
   */
  isActive: boolean;
  /**
   * 点击 Switch 的回调函数
   */
  onHandleSwitch?: (isActive: boolean) => void;

  /**
   * 是否显示按钮
   */

  hideButton?: boolean;
  /**
   * 默认展开
   */
  defaultExpanded?: boolean;
}

/**
 * 提炼了一种点击即可展开 关闭即收拢的组件
 */
const CollapsePanel: FC<CollapsePanelProps> = ({
  children,
  onHandleSwitch,
  isActive,
  panelKey,
  title,
  hideButton,
  defaultExpanded,
}) => {
  const [openPanelKey, setOpenPanelKey] = useState<string[]>(
    defaultExpanded ? [panelKey] : []
  );

  useEffect(() => {
    if (!isActive) {
      setOpenPanelKey([]);
    }
  }, [isActive]);

  return (
    <Collapse
      ghost
      className={styles.container}
      activeKey={openPanelKey}
      defaultActiveKey={openPanelKey}
      onChange={(e) => {
        setOpenPanelKey(typeof e === 'string' ? [e] : e);
      }}
    >
      <Panel
        key={panelKey}
        header={title}
        disabled={!isActive}
        className={styles.panel}
        extra={
          hideButton ? null : (
            <Switch
              size={'small'}
              checked={isActive}
              onChange={(isOpen) => {
                onHandleSwitch && onHandleSwitch(isOpen);
                setOpenPanelKey(isOpen ? [panelKey] : []);
              }}
            />
          )
        }
      >
        {children}
      </Panel>
    </Collapse>
  );
};

export default CollapsePanel;
