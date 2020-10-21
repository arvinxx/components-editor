import { createStore, PROTABLE_NAMESPACE } from '@/core/model';

/**
 * ProTable 交互状态
 */
export interface ProtableInteractState {
  /**
   * 选中的列key
   * */
  activeColumnKey: string;
  /**
   * 选中的单元格key
   * */
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
   * 表格识别到的宽度
   */
  tableTotalWidth?: number;
}

export const protableInteractState: ProtableInteractState = {
  activeCellKey: '',
  activeColumnKey: '',
  resizingWidth: 0,
  resizingIndex: '',
};

/**
 * 返回的 Hooks 方法
 */
export interface ProtableInteractHook {
  interact: ProtableInteractState;
  handleTableInteract: (key: Partial<ProtableInteractState>) => void;
}

/**
 * 交互 Model
 */
export const useProTableInteract = (): ProtableInteractHook => {
  const { useStore, mutate } = createStore<'interact'>(PROTABLE_NAMESPACE);
  const [interact] = useStore('interact', protableInteractState);

  return {
    interact,
    handleTableInteract: (value) => {
      mutate('interact', (state: ProtableInteractState) => {
        return { ...state, ...value };
      });
    },
  };
};
