import {
  AlignType,
  EnumType,
  TagType,
  ValueEnum,
  ValueEnumObj,
} from '@/typings/table';
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
  enum: EnumType[];

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

export type EnumKeyType = 'actions' | 'enum' | 'status' | 'tags';
export type EnumValueType = EnumType | ValueEnum | TagType;
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
  handleTableColumn: (dataIndex: string, field: string, value: any) => void;
}

/**
 * 简单配置的 Model
 */
export const useProTableColumn = () => {
  const { useStore, mutate } = createStore<'columns'>(PROTABLE_NAMESPACE);
  const [columns, setColumns] = useStore<ProtableColumnState>(
    'columns',
    defaultTableData.columns,
  );

  return {
    columns,
    setColumns,
    /**
     * 修改列配置项
     * @param {string} dataIndex 列索引
     * @param {string} field 需修改字段
     * @param {any} value 修改值
     * */
    handleTableColumn: (dataIndex: string, field: string, value: any) => {
      mutate('columns', (state: ProtableColumnState) => {
        const index = state.findIndex((col) => col.dataIndex === dataIndex);
        state[index][field] = value;
      });
    },
    /**
     * 根据 Key 获取相应的列
     * @param key
     */
    getColumnByKey: (key: string) => {
      const index = columns.findIndex((col: ColumnType) => col.key === key);
      return { column: columns[index], index };
    },
    /**
     * 删除 Column 的 enum 对象
     * @param columnIndex
     * @param enumIndex
     */
    deleteColumnEnum: (columnIndex: number, enumIndex: number) => {
      let type: EnumKeyType;
      switch (columns[columnIndex].valueType) {
        case 'enum':
          type = 'enum';
          break;
        case 'option':
          type = 'actions';
          break;
        case 'status':
          type = 'status';
          break;
        case 'tag':
          type = 'tags';
          break;
        default:
          return;
      }
      mutate<ProtableColumnState>('columns', (state) => {
        state[columnIndex][type].splice(enumIndex, 1);
      });
    },
    /**
     * 添加 enum 对象
     * @param columnIndex
     * @param text
     */
    addColumnEnum: (columnIndex: number, text: string) => {
      let type: EnumKeyType;
      let content: EnumValueType = text;
      switch (columns[columnIndex].valueType) {
        // 如果是 tag 直接跳过
        case 'tag':
          type = 'tags';
          content = { text, color: 'default' };
          break;
        case 'option':
          type = 'actions';
          break;
        case 'status':
          type = 'status';
          content = { text, status: 'Default' };
          break;
        case 'text':
        default:
          type = 'enum';
          break;
      }
      // 如果存在重复 不添加
      const isExist = columns[columnIndex][type].includes(text as any);
      if (isExist) return;
      mutate<ProtableColumnState>('columns', (state) => {
        state[columnIndex][type].push(content as any);
      });
    },
    /**
     * 修改 列的 enum 值
     * @param columnIndex 列 index
     * @param enumIndex

     */

    /**
     * 修改 列的 对象值
     * @param columnIndex 列索引
     * @param enumIndex enum 索引
     * @param payload 其余配置项
     * @param payload.text
     * @param payload.color
     * @param payload.status
     * @param payload.index
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
    ) => {
      const { text, index, color, status } = payload;
      let type: EnumKeyType;
      let content: EnumValueType = text || '';
      const column = columns[columnIndex];

      const newTagContent = () => {
        const tagEnum = column.tags[enumIndex];
        let { text: newText, color: newColor } = tagEnum;

        if (text) newText = text;
        if (color) newColor = color;
        return { text: newText, color: newColor };
      };
      const newStatusContent = () => {
        const statusEnum = column.status[enumIndex];

        let {
          text: newStatusText,
          index: newIndex,
          status: newStatus,
        } = statusEnum;

        if (text) newStatusText = text;
        if (status) newStatus = status;
        if (index) newIndex = index;
        return { text: newStatusText, status: newStatus, index: newIndex };
      };

      switch (column.valueType) {
        case 'tag':
          type = 'tags';
          content = newTagContent();
          break;
        case 'status':
          type = 'status';

          content = newStatusContent();
          break;
        case 'option':
          type = 'actions';
          break;
        case 'text':
        default:
          type = 'enum';
      }
      // 如果存在重复 不添加
      const isExist = column[type].includes(text as any);
      if (isExist) return;

      mutate<ProtableColumnState>('columns', (state) => {
        state[columnIndex][type][enumIndex] = content;
      });
    },
  };
};
