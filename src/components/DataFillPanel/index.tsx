import React, { FC } from 'react';
import ContentFill from '../ContentFill/ContentFill';
import EnumFillConfig from './EnumFillConfig';
import { ColumnType } from '../../models/columns';

interface DataFillPanelProps {
  column: ColumnType;
  columnIndex: number;
}

const DataFillPanel: FC<DataFillPanelProps> = ({ column }) => {
  switch (column.valueType) {
    // 文本类型
    case 'text':
    case 'money':
    case 'digit':
    case 'percent':
    case 'dateRange':
    case 'date':
    case 'dateTime':
    case 'time':
      return <ContentFill />;

    // 元组类型
    case 'status':
    case 'enum':
    case 'option':
    case 'tag':
      return <EnumFillConfig />;
    default:
      return <div />;
  }
};
export default DataFillPanel;
