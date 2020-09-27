import React, { FC, useRef } from 'react';
import { DndProvider, createDndContext } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';

const RNDContext = createDndContext(HTML5Backend);

const DragAndDrop: FC = ({ children }) => {
  const manager = useRef(RNDContext);
  return (
    <DndProvider manager={manager.current.dragDropManager}>
      {children}
    </DndProvider>
  );
};

export default DragAndDrop;
