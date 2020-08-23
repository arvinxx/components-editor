import { AlignType, TagType, ValueEnum, ValueEnumObj } from '@/typings/table';
import update from 'immutability-helper';
import { createStore, defaultTableData, PROTABLE_NAMESPACE } from './utils';

export interface ColumnType {
  /**
   * 标题
   * */
  title: string;

  dataIndex: string;
  key: string;
  /**
   * 宽度类型
   */
  widthType: 'percent' | 'number' | 'auto';
  /**
   * 表宽
   * */
  width?: number;
  /**
   * 表宽百分比
   */
  widthPercent?: number;
  /**
   * 表宽样式
   */
  style?: any;
  /**
   * 对齐方式
   */
  align: AlignType;
  /**
   * 可省略
   */
  ellipsis?: boolean;
  /**
   * 显示筛选
   */
  filters?: boolean;
  /**
   * 可复制
   */
  copyable?: boolean;
  /**
   * 列单元数据
   * 文本类型下的数值类型
   * */
  valueType: ColumnValueType;
  /**
   * 数值元组类型
   */
  valueEnum?: ValueEnumObj;
  /**
   * 文本类型的自定义数据元组
   *
   * 例如: ['男','女'] ['前端','后端','设计'] 等
   * */
  enum: string[];

  /**
   * 操作类型的数据元组
   *
   * 默认为: ['确认','删除'] 等
   * */
  actions: string[];
  /**
   * tags 类型
   * */
  tags: TagType[];

  /**
   * 显示tag的 dataIndex 类型
   */
  tagIndex?: string;
  /**
   * status 类型
   */
  status: ValueEnum[];

  /**
   * 是否显示省略号
   * */
  showActionEllipsis?: boolean;
  /**
   * 是否是链接
   * */
  isLink?: boolean;
  /**
   * 是否显示Icon图标
   * */
  showLinkIcon?: boolean;
  /**
   * 在查询表单中不展示此项
   */
  hideInSearch?: boolean;
}

/**
 * 列单元数据类型
 * */
export type ColumnValueType =
  | 'tag'
  | 'status'
  | 'enum'
  | 'money'
  | 'textarea'
  | 'option'
  | 'date'
  | 'dateRange'
  | 'dateTimeRange'
  | 'dateTime'
  | 'time'
  | 'text'
  | 'index'
  | 'indexBorder'
  | 'progress'
  | 'percent'
  | 'digit'
  | 'avatar'
  | 'code';

/**
 * 表格列头
 */
export type ProtableColumnState = ColumnType[];

/**
 * 返回的 Hooks 方法
 */
export interface ProtableConfigHook {
  columns: ProtableColumnState;
  setColumns: (columns: ProtableColumnState) => void;
  /**
   * 修改列配置项
   * @param {string} ColumnDataIndex 列索引
   * @param {string} field 需修改字段
   * @param {any} value 修改值
   * */
  handleTableColumn: (dataIndex: string, field: string, value: any) => void;
  /**
   * 根据 Key 获取相应的列
   * @param key
   */
  getColumnByKey: (key: string) => { column: ColumnType; index: number };

  /**
   * 删除 Column 的 enum 对象
   * @param columnIndex
   * @param enumIndex
   */
  deleteColumnEnum: (columnIndex: number, enumIndex: number) => void;
  /**
   * 添加 enum 对象
   * @param columnIndex
   * @param text
   */
  addColumnEnum: (columnIndex: number, text: string) => void;
  /**
   * 修改 列的 enum 值
   * @param columnIndex
   * @param enumIndex
   * @param text
   */
  handleColumnEnum: (
    columnIndex: number,
    enumIndex: number,
    text: string,
  ) => void;
  /**
   * 修改 列的 对象值
   * @param columnIndex
   * @param enumIndex
   * @param payload
   */
  handleColumnTagOrStatus: (
    columnIndex: number,
    enumIndex: number,
    payload: {
      text?: string;
      color?: string;
      status?: string;
      index?: string;
    },
  ) => void;
}

/**
 * 简单配置的 Model
 */
export const useProTableColumn = (): ProtableConfigHook => {
  const { useStore, mutate } = createStore<'columns'>(PROTABLE_NAMESPACE);
  const [columns, setColumns] = useStore('columns', defaultTableData.columns);

  return {
    columns,
    setColumns,
    handleTableColumn: (dataIndex, field, value) => {
      mutate('columns', (state: ProtableColumnState) => {
        const index = state.findIndex((col) => col.dataIndex === dataIndex);
        return update(state, {
          [index]: {
            [field]: { $set: value },
          },
        });
      });
    },
    getColumnByKey: (key) => {
      const index = columns.findIndex((col) => col.key === key);
      return { column: columns[index], index };
    },
  };
};
