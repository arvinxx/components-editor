import React, { FC, Ref } from 'react';
import { Drawer } from 'antd';
import { useProTableInteract } from '@/models/interact';

import TableConfig from './TableConfig';
import HeaderConfig from './HeaderConfig';
import CellConfig from './CellConfig';

type GetContainerFunc = () => HTMLElement;

export interface ConfigPanelProps {
  drawer?: boolean;
  visible: boolean;
  getContainer?: string | HTMLElement | GetContainerFunc | false;
}
const ConfigPanel: FC<ConfigPanelProps> = ({ visible = true, container }) => {
  const PanelContent = () => {
    const { interact, handleTableInteract } = useProTableInteract();

    const { activeColumnKey, activeCellKey } = interact;
    if (activeCellKey === '' && activeColumnKey === '') {
      return <TableConfig />;
    }

    return activeColumnKey !== '' ? (
      <HeaderConfig
        onBack={() => {
          handleTableInteract({ activeColumnKey: '', activeCellKey: '' });
        }}
      />
    ) : (
      <CellConfig
        onBack={() => {
          handleTableInteract({ activeColumnKey: '', activeCellKey: '' });
        }}
      />
    );
  };
  return (
    <Drawer width={320} visible={visible} mask={false} getContainer={container}>
      <PanelContent />
    </Drawer>
  );
};

export default ConfigPanel;
