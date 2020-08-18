import { SizeType } from 'antd/lib/config-provider/SizeContext';
import { TablePaginationConfig } from 'antd/es/table';

import { StatusType } from '@ant-design/pro-table/es/component/status';
import { TableRowSelection } from 'antd/es/table/interface';
import { ButtonType } from 'antd/es/button';
import { SearchConfig } from '@ant-design/pro-table/es/form';

export type AlignType = 'left' | 'center' | 'right';

export interface ThemeConfig {
  primaryColor: string;
  headerBG: string;
}

export type ThemeKey = keyof ThemeConfig;

export interface TableConfig {
  /**
   * 显示边框
   */
  bordered: boolean;
  /**
   * 多选配置项
   */
  rowSelection: TableRowSelection<any> | false;
  expandable: boolean;
  footer: boolean;
  /**
   * 大小
   * */
  size: SizeType;
  /**
   * 标题
   */
  title: string;
  /**
   * 页脚
   */
  footerText: string;
  /**
   * table 总宽
   */
  widthValue: number;
  /**
   * 加载中
   */
  loading: boolean;
  /**
   * 是否显示 header
   */
  showHeader: boolean;
  /**
   * 是否显示数据
   * */
  hasData: boolean;
  /**
   * 是否显示分页器
   * */
  pagination?: TablePaginationConfig | false;
  /**
   * 显示 search 窗口
   */
  search?: SearchConfig;
  /**
   * 渲染操作按钮栏
   */
  toolBarActions: ActionType[];
}

export interface TableModelType {
  /**
   * 表格列头
   */
  columns: ColumnType[];
  /**
   * 数据源
   */
  dataSource: RowType[];
  /**
   * 表格控制选项
   */
  config: TableConfig;
  /**
   * 主题项
   */
  theme: ThemeConfig;
}

/**
 * 列单元数据类型
 * */
export type ValueType =
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
  valueType: ValueType;
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

export interface RowType {
  key: string;
  [key: string]: CellType | string | any[];
}

export interface CellType {
  key: string;
  content: string | TagType;
}

export type TagType = { text: string; color: string };

export type ActionType = { text: string; type: ButtonType };

export type ValueEnum = { text: string; status?: StatusType; index?: string };

export declare type ValueEnumObj = {
  [key: string]: ValueEnum;
};
