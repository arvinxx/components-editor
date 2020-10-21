import { TableRowSelection } from 'antd/es/table/interface';
import { createStore, PROTABLE_NAMESPACE } from '@/core/model';

/**
 * Row Selection 状态
 */
export interface ProTableRowSelectionState {
  /**
   * 多选配置项
   */
  rowSelection: TableRowSelection<any>;
  /**
   * 显示批量操作
   */
  showRowSelection: boolean;
  /**
   * 渲染 Alert 提示条
   */
  showAlertRender: boolean;
}

export const proTableRowSelectionState: ProTableRowSelectionState = {
  showAlertRender: true,
  showRowSelection: true,
  rowSelection: {
    columnWidth: 60,
    type: 'checkbox',
  },
};

/**
 * 返回的 Hooks 方法
 */
export interface RowSelectionHook extends ProTableRowSelectionState {
  /**
   * 控制显示多选
   */
  setShowRowSelection: (show: boolean) => void;
  /**
   * 控制显示 AlertRender
   */
  setShowAlertRender: (show: boolean) => void;
  setRowSelection: (
    rowSelection: ProTableRowSelectionState['rowSelection'],
  ) => void;

  handleRowSelection: (
    value: Partial<ProTableRowSelectionState['rowSelection']>,
  ) => void;
}

/**
 * 行选择器 Model
 */
export const useProTableRowSelection = (): RowSelectionHook => {
  const { useStore, mutate } = createStore<keyof ProTableRowSelectionState>(
    PROTABLE_NAMESPACE,
  );
  const [rowSelection, setRowSelection] = useStore(
    'rowSelection',
    proTableRowSelectionState.rowSelection,
  );
  const [showAlertRender, setShowAlertRender] = useStore(
    'showAlertRender',
    proTableRowSelectionState.showAlertRender,
  );

  const [showRowSelection, setShowRowSelection] = useStore(
    'showRowSelection',
    proTableRowSelectionState.showRowSelection,
  );

  return {
    rowSelection,
    showRowSelection,
    showAlertRender,
    setShowRowSelection,
    setShowAlertRender,
    setRowSelection,
    handleRowSelection: (value) => {
      mutate('rowSelection', value, true);
    },
  };
};
