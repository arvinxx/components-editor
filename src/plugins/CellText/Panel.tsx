import React, { FC } from 'react';
import { Input } from 'antd';

import { PanelLayout } from '@/components';

import { useProTableInteract } from '@/models/interact';
import { useProTableColumn } from '@/models/columns';
import { useProTableDataSource } from '@/models/dataSource';

const CellConfig: FC = () => {
  const { interact } = useProTableInteract();
  const { activeCellKey } = interact;

  const { handleMockCellText, mockDataSource } = useProTableDataSource();
  const { columns } = useProTableColumn();

  const [row, col] = activeCellKey.split('-').map(Number); // 数字化

  const rowData = mockDataSource[row];

  const cell = Object.entries(rowData || {})?.find(
    (entry) => entry[0] === columns[col]?.dataIndex,
  );

  const getText = () => {
    if (!cell) return '';
    const value = cell[1];
    if (typeof value === 'string') {
      return value;
    }
    if (value instanceof Array) {
      return '';
    }
    if (typeof value.content === 'string') {
      return value.content;
    }
    return value.content.text;
  };
  return (
    <PanelLayout title="文本">
      <Input
        size="small"
        value={getText()}
        onChange={(e) => {
          handleMockCellText(row, cell?.[0]!, e.target.value);
        }}
      />
    </PanelLayout>
  );
};

export default CellConfig;
