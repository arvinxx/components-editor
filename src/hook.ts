import { useDispatch } from 'dva';
import { TablePaginationConfig } from 'antd/es/table';
import { TableAction } from './model';
import { TableRowSelection } from 'antd/es/table/interface';
import { ButtonType } from 'antd/es/button';
import { SearchConfig } from '@ant-design/pro-table/es/form';

/**
 * 修改表格的 hook
 **/
export const useHandleTable = () => {
  const dispatch = useDispatch();

  return {
    /**
     * 修改 Table 的配置状态
     * @param payload
     */
    handleTableState: (payload: any) => {
      dispatch({
        type: TableAction.save,
        payload,
      });
    },
    /**
     * 修改表格的全局配置
     * @param key
     * @param value
     */
    handleTableConfig: (key: string, value: any) => {
      dispatch({
        type: TableAction.setConfig,
        payload: {
          [key]: value,
        },
      });
    },
    /**
     * 修改 Pagination 配置
     */
    handleTablePagination: (payload: TablePaginationConfig) => {
      dispatch({
        type: TableAction.setTablePagination,
        payload,
      });
    },
    /**
     * 修改 AdvancedSearch 配置
     */
    handleTableSearch: (payload: SearchConfig) => {
      dispatch({
        type: TableAction.setTableSearch,
        payload,
      });
    },

    /**
     * 修改 RowSelection 配置
     */
    handleTableRowSelection: (payload: TableRowSelection<any>) => {
      dispatch({
        type: TableAction.setTableRowSelection,
        payload,
      });
    },
    /**
     * 修改单元文本
     * @param {number} row 行索引
     * @param {string} col 列字段索引
     * @param {string} content 文本内容
     **/
    handleCellText: (row: number, col: string, content: string) => {
      dispatch({
        type: TableAction.setCellText,
        payload: {
          row,
          col,
          content,
        },
      });
    },
    /**
     * 修改列配置项
     * @param {string} ColumnDataIndex 列索引
     * @param {string} field 需修改字段
     * @param {any} value 修改值
     **/
    handleColumnConfig: (
      ColumnDataIndex: string,
      field: string,
      value: any,
    ) => {
      dispatch({
        type: TableAction.handleColumnConfig,
        payload: {
          dataIndex: ColumnDataIndex,
          field,
          value,
        },
      });
    },

    /**
     * 删除 Column 的 enum 对象
     * @param columnIndex
     * @param enumIndex
     */
    deleteColumnEnum: (columnIndex: number, enumIndex: number) => {
      dispatch({
        type: TableAction.deleteColumnEnum,
        payload: {
          columnIndex,
          enumIndex,
        },
      });
    },
    /**
     * 添加 enum 对象
     * @param columnIndex
     * @param text
     */
    addColumnEnum: (columnIndex: number, text: string) => {
      dispatch({
        type: TableAction.addColumnEnum,
        payload: { columnIndex, text },
      });
    },
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
    ) => {
      dispatch({
        type: TableAction.handleColumnEnum,
        payload: {
          columnIndex,
          enumIndex,
          text,
        },
      });
    },
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
    ) => {
      dispatch({
        type: TableAction.handleColumnEnum,
        payload: {
          columnIndex,
          enumIndex,
          ...payload,
        },
      });
    },

    /**
     * 添加 ToolBar 操作按钮
     * @param text 字符串
     * @param type 按钮类型
     */
    addToolBarActions: (text: string, type?: ButtonType) => {
      dispatch({
        type: TableAction.addToolBarActions,
        payload: {
          text,
          type,
        },
      });
    },
    /**
     * 删除 ToolBar 操作按钮
     * @param index
     */
    deleteToolBarActions: (index: number) => {
      dispatch({
        type: TableAction.deleteToolBarActions,
        payload: { index },
      });
    },
    /**
     * 修改 ToolBar 操作按钮
     * @param index
     * @param payload
     */
    handleToolBarActions: (
      index: number,
      payload: { text?: string; type?: string },
    ) => {
      dispatch({
        type: TableAction.handleToolBarActions,
        payload: { index, ...payload },
      });
    },

    /**
     * 修改表格主题
     */
    handleTableTheme(key: string, color: string) {
      dispatch({
        type: TableAction.handleTheme,
        payload: { [key]: color },
      });
    },
  };
};
