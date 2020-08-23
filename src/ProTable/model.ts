import { DvaModel, Reducer, Effect } from '@/models/connect';
import { TableModelType } from 'typings/data/table';
import update from 'immutability-helper';

import { getDefaultTableData } from '../utils';

export interface ProTableModelState extends TableModelType {
  activeColumnKey: string;
  activeCellKey: string;
  /**
   * 正在缩放的列索引
   */
  resizingIndex: string;
  /**
   * 缩放临时宽度
   */
  resizingWidth: number;
  /**
   * 表格的宽度类型
   */
  tableWidth: 'auto' | 'fixed';
  /**
   * 表格识别到的宽度
   */
  tableTotalWidth?: number;
  /**
   * 显示批量操作
   */
  showRowSelection: boolean;
  /**
   * 渲染 Alert 提示条
   */
  showAlertRender: boolean;
  /**
   * 显示标题
   */
  showTitle: boolean;
  /**
   * 显示工具栏
   */
  showToolBar: boolean;
  /**
   * 显示高级搜索框
   */
  showSearch: boolean;
}

export interface TableModelStore extends DvaModel<ProTableModelState> {
  namespace: 'protable';
  state: ProTableModelState;
  reducers: {
    save: Reducer<ProTableModelState>;
    setConfig: Reducer<ProTableModelState>;
    setTablePagination: Reducer<ProTableModelState>;
    setTableSearch: Reducer<ProTableModelState>;
    setTableRowSelection: Reducer<ProTableModelState>;
    setCellText: Reducer<ProTableModelState>;
    addToolBarActions: Reducer<ProTableModelState>;
    deleteToolBarActions: Reducer<ProTableModelState>;
    handleToolBarActions: Reducer<ProTableModelState>;
    handleHeaderText: Reducer<ProTableModelState>;
    handleTableColumn: Reducer<ProTableModelState>;
    handleColumnEnum: Reducer<ProTableModelState>;
    addColumnEnum: Reducer<ProTableModelState>;
    deleteColumnEnum: Reducer<ProTableModelState>;
    handleTheme: Reducer<ProTableModelState>;
  };
  effects: {};
}

// 生成初始化表格数据
const { dataSource, columns } = getDefaultTableData();

const TableModel: TableModelStore = {
  namespace: 'protable',
  state: {
    columns,
    dataSource,
    dataSourceType: 'mock',
    config: {
      title: '表格标题',
      footer: false,
      footerText: '表格页脚',
      rowSelection: false,
      bordered: false,
      expandable: false,
      loading: false,
      showHeader: true,
      size: 'large',
      widthValue: 1200,
      hasData: true,
      pagination: false,
      toolBarActions: [],
    },
    theme: {
      primaryColor: '#1890ff',
      headerBG: '#fafafa',
    },
    tableWidth: 'auto',
    showRowSelection: false,
    showAlertRender: false,
    showSearch: true,
    showTitle: false,
    showToolBar: false,
    shouldRefreshData: false,
    showDataPreviewPanel: false,
    previewData: [],
  },
  effects: {},
  reducers: {
    save(state, { payload }) {
      return { ...state, ...payload };
    },
    /**
     * 修改配置
     */
    setConfig(state, { payload }) {
      return { ...state, config: { ...state.config, ...payload } };
    },

    /**
     * 修改 Table 的 Pagination 参数
     */
    setTableRowSelection(state, { payload }) {
      return {
        ...state,
        config: {
          ...state.config,
          rowSelection: { ...state.config.rowSelection, ...payload },
        },
      };
    },

    /**
     * 修改 Header 单元格文本
     */
    handleHeaderText(state, { payload }) {
      const index = state.columns.findIndex(
        (col) => col.dataIndex === payload.dataIndex,
      );
      return {
        ...state,
        columns: update(state.columns, {
          [index]: {
            title: {
              $set: payload.text,
            },
          },
        }),
      };
    },
    /**
     * 修改列配置
     */
    handleTableColumn(state, { payload }) {
      const index = state.columns.findIndex(
        (col) => col.dataIndex === payload.dataIndex,
      );
      const { field, value } = payload;
      return {
        ...state,
        columns: update(state.columns, {
          [index]: {
            [field]: { $set: value },
          },
        }),
      };
    },

    //*** 元组操作 *** //
    /**
     * 增加列数据元组
     **/
    addColumnEnum(state, { payload }) {
      const { columnIndex, text } = payload;
      let type: 'actions' | 'enum' | 'status' | 'tags' | undefined = undefined;
      let content = text;
      switch (state.columns[columnIndex].valueType) {
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
      const isExist = state.columns[columnIndex][type].includes(text);
      if (isExist) return state;

      return {
        ...state,
        columns: update(state.columns, {
          [columnIndex]: {
            [type]: {
              $push: [content],
            },
          },
        }),
      };
    },
    /**
     * 删除列数据元组
     **/
    deleteColumnEnum(state, { payload }) {
      const { columnIndex, enumIndex } = payload;
      let type = '';
      switch (state.columns[columnIndex].valueType) {
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
      }
      return {
        ...state,
        columns: update(state.columns, {
          [columnIndex]: {
            [type]: {
              $splice: [[enumIndex, 1]],
            },
          },
        }),
      };
    },
    /**
     * 调整列数据元组
     *
     **/
    handleColumnEnum(state, { payload }) {
      const { columnIndex, text, enumIndex, color, status, index } = payload;
      let type: 'actions' | 'enum' | 'tags' | 'status' | undefined = undefined;

      let content = text;

      switch (state.columns[columnIndex].valueType) {
        case 'tag':
          type = 'tags';
          let newText = state.columns[columnIndex].tags[enumIndex].text;
          let newColor = state.columns[columnIndex].tags[enumIndex].color;
          if (text) newText = text;
          if (color) newColor = color;
          content = { text: newText, color: newColor };
          break;
        case 'status':
          type = 'status';
          let newStatusText = state.columns[columnIndex].status[enumIndex].text;
          let newStatus = state.columns[columnIndex].status[enumIndex].status;
          let newIndex = state.columns[columnIndex].status[enumIndex].index;
          if (text) newStatusText = text;
          if (status) newStatus = status;
          if (index) newIndex = index;
          content = { text: newStatusText, status: newStatus, index: newIndex };
          break;
        case 'option':
          type = 'actions';
          break;
        case 'text':
        default:
          type = 'enum';
      }
      // 如果存在重复 不添加
      const isExist = state.columns[columnIndex][type].includes(text);
      if (isExist) return state;

      return {
        ...state,
        columns: update(state.columns, {
          [columnIndex]: {
            [type]: {
              [enumIndex]: { $set: content },
            },
          },
        }),
      };
    },
  },
};
export default TableModel;

type TableActionType = {
  [key in keyof typeof TableModel.reducers]: string;
};
export const TableAction: TableActionType = (() => {
  let action = {};
  Object.keys(TableModel.reducers).forEach((reducer) => {
    const key = TableModel.namespace + '/' + reducer;
    Object.assign(action, { [reducer]: key });
  });
  return action as TableActionType;
})();
