import { ButtonType } from 'antd/es/button';
import update from 'immutability-helper';
import { createStore, PROTABLE_NAMESPACE } from './utils';

export type ActionType = { text: string; type: ButtonType };

/**
 * Row Selection 状态
 */
export interface ProTableToolBarState {
  /**
   * 显示标题
   */
  showTitle: boolean;
  /**
   * 显示工具栏
   */
  showToolBar: boolean;
  /**
   * 渲染操作按钮栏
   */
  toolBarActions: ActionType[];
  title: string;
}

export const proTableRowSelectionState: ProTableToolBarState = {
  showTitle: false,
  showToolBar: false,
  title: '表格标题',
  toolBarActions: [],
};

/**
 * 返回的 Hooks 方法
 */
export interface ToolBarHook extends ProTableToolBarState {
  setShowTitle: (show: boolean) => void;
  setShowToolBar: (show: boolean) => void;
  setTitle: (title: string) => void;
  setToolBarActions: (toolBar: ActionType[]) => void;
  /**
   * 给 Toolbar 工具列添加按钮
   */
  addToolBarActions: (text: string, type?: ButtonType) => void;
  /**
   * 删除 ToolBar 操作按钮
   * @param index
   */
  deleteToolBarActions: (index: number) => void;
  /**
   * 修改 ToolBar 操作按钮
   * @param index
   * @param payload
   */
  handleToolBarActions: (
    index: number,
    payload: { text?: string; type?: ButtonType },
  ) => void;
}

/**
 * ProTable 的分页器 Model
 */
export const useProTableToolBar = (): ToolBarHook => {
  const { useStore, mutate } = createStore<keyof ProTableToolBarState>(
    PROTABLE_NAMESPACE,
  );

  const [showTitle, setShowTitle] = useStore(
    'showTitle',
    proTableRowSelectionState.showTitle,
  );
  const [title, setTitle] = useStore('title', proTableRowSelectionState.title);

  const [showToolBar, setShowToolBar] = useStore(
    'showToolBar',
    proTableRowSelectionState.showToolBar,
  );

  const [toolBarActions, setToolBarActions] = useStore(
    'toolBarActions',
    proTableRowSelectionState.toolBarActions,
  );

  return {
    showToolBar,
    showTitle,
    title,
    setTitle,
    setShowTitle,
    setShowToolBar,
    toolBarActions,
    setToolBarActions,
    addToolBarActions(text, type) {
      mutate('toolBarActions', (state: ActionType[]) => {
        // 如果存在重复 不添加
        const isExist = state?.find((a) => a.text === text);
        if (isExist) return state;
        return (
          state?.concat([{ text, type: type ?? 'default' }]) || [
            { text, type: type ?? 'default' },
          ]
        );
      });
    },
    deleteToolBarActions(index) {
      mutate('toolBarActions', (state: ActionType[]) => {
        return update(state, { $splice: [[index, 1]] });
      });
    },

    handleToolBarActions(index, { text, type }) {
      mutate('toolBarActions', (state: ActionType[]) => {
        // 如果存在重复 不添加
        const isExist = state.find((a) => a.text === text);
        if (isExist) return state;

        // 修改文本或类型
        const content = state[index];
        if (text) content.text = text;
        if (type) content.type = type;

        return update(state, {
          [index]: { $set: content },
        });
      });
    },
  };
};
