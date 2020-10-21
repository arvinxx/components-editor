import React, { FC, useState } from 'react';
import { EditorWrapper, ProTable } from '@/core';

const ProTableEditor: FC = () => {
  const [visible, setVisible] = useState(true);

  return (
    <EditorWrapper visible={visible} onVisibleChange={(v) => setVisible(v)}>
      <ProTable />
    </EditorWrapper>
  );
};

export default ProTableEditor;
