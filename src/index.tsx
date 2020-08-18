import React, { FC, useRef } from 'react';
import { DndProvider, createDndContext } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import ProTable from './ProTable';
import ConfigPanel from './ConfigPanel';
import styles from './style.less';

const RNDContext = createDndContext(HTML5Backend);

const ProComponentEditor: FC = () => {
  const manager = useRef(RNDContext);

  return (
    <div className={styles.container}>
      <div className={styles.left}>
        <div className={styles.main}>
          <DndProvider manager={manager.current.dragDropManager!}>
            <ProTable />
          </DndProvider>
        </div>
      </div>
      <div className={styles.side}>
        <ConfigPanel />
      </div>
    </div>
  );
};

export default ProComponentEditor;
