import { useDispatch } from 'dva';
import { TableAction } from './ProTable/model';

/**
 * 修改表格的 hook
 * */
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
     * 修改单元文本
     * @param {number} row 行索引
     * @param {string} col 列字段索引
     * @param {string} content 文本内容
     * */
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
