import { AlignType, RowType } from '@/typings/table';
import { ColumnType } from '@/models/columns';
import { Random } from 'mockjs';

/**
 * 判断是否是开发环境
 */
export const isDev = process.env.NODE_ENV === 'development';

/**
 * 生成 Index
 */
export const generateIndex = () => {
  return `pce-${Random.word(4, 4)}`;
};

/**
 * 生成一列数据
 * */
export const generateColumn = (data: {
  columnIndex: string;
  key?: string;
  title?: string;
  dataIndex?: string;
  width?: number;
  align?: AlignType;
}): ColumnType => {
  const { title, key, width, align, columnIndex, dataIndex } = data;

  return {
    key: key || columnIndex,
    title: title || `Header ${Number(columnIndex) + 1}`,
    dataIndex: dataIndex || generateIndex(),
    width: width || undefined,
    widthType: 'auto',
    align: align || 'left',
    style: {},
    valueType: 'text',
    enum: [],
    actions: ['确认', '删除'],
    tags: [],
    status: [],
  };
};

/**
 * 生成一行数据
 * */
export const generateRow = (
  columns: ColumnType[],
  data: { rowIndex: string },
) => {
  const { rowIndex } = data;
  const row: RowType = { key: `row ${rowIndex}` };
  columns.forEach((col, columnIndex) => {
    const key = col.dataIndex;
    const cell = {
      [key]: {
        content: '----',
        key: `${rowIndex}-${columnIndex}`,
      },
    };
    Object.assign(row, cell);
  });
  return row;
};

/**
 * 解析表格
 * */
export const getDefaultTableData = () => {
  const columns: ColumnType[] = [];
  const dataSource: RowType[] = [];
  for (let i = 0; i < 5; i += 1) {
    columns.push(generateColumn({ columnIndex: i.toString() }));
  }

  for (let i = 0; i < 10; i += 1) {
    dataSource.push(generateRow(columns, { rowIndex: i.toString() }));
  }
  return {
    dataSource,
    columns,
  };
};

/**
 * 判断是否是元组类数据
 * @param type
 */
export const isEnum = (type: ColumnType['valueType']) => {
  return ['enum', 'status', 'tag'].includes(type);
};
/**
 * 判断是否是元组类数据
 * @param type
 */
export const isMockData = (type: ColumnType['valueType']) => {
  return dataSourceType==='';
};

/**
 * 不属于列数据
 * @param type
 */
export const notColumnData = (type: ColumnType['valueType']) => {
  return ['option', 'index', 'indexBorder'].includes(type);
};
