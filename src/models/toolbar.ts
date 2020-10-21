import { ButtonType } from 'antd/es/button';
import { createStore, PROTABLE_NAMESPACE } from '@/core/model';

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
  showTitle: true,
  showToolBar: true,
  title: '表格标题',
  toolBarActions: [],
};

/**
 * ProTable 的分页器 Model
 */
export const useProTableToolBar = () => {
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
    /**
     * 给 Toolbar 工具列添加按钮
     */
    addToolBarActions(text: string, type?: ButtonType) {
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
    /**
     * 删除 ToolBar 操作按钮
     * @param index
     */
    deleteToolBarActions(index: number) {
      mutate('toolBarActions', (state: ActionType[]) => {
        state.splice(index, 1);
      });
    },
    /**
     * 修改 ToolBar 操作按钮
     * @param index
     * @param payload
     */
    handleToolBarActions(
      index: number,
      { text, type }: { text?: string; type?: ButtonType },
    ) {
      mutate('toolBarActions', (state: ActionType[]) => {
        // 如果存在重复 不添加
        const isExist = state.find((a) => a.text === text);
        if (isExist) return;

        // 修改文本或类型
        const content = state[index];
        if (text) content.text = text;
        if (type) content.type = type;

        state[index] = content;
      });
    },
  };
};
