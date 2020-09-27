import { SizeType } from 'antd/lib/config-provider/SizeContext';
import { createStore, PROTABLE_NAMESPACE } from './utils';

/**
 * ProTable 的简单配置项
 */
export interface ProtableConfigState {
  /**
   * 显示边框
   */
  bordered: boolean;
  /**
   * 大小
   * */
  size: SizeType;
  /**
   * table 总宽
   */
  width: number;
  /**
   * 宽度类型
   */
  widthType: 'auto' | 'fixed';
  /**
   * 显示表头
   */
  showHeader: boolean;
  /**
   * 加载中
   */
  showLoading: boolean;
  /**
   * 是否显示空数据状态
   * */
  showEmpty: boolean;
}

export const protableConfigState: ProtableConfigState = {
  bordered: false,
  showEmpty: false,
  showLoading: false,
  showHeader: true,
  size: 'large',
  width: 1200,
  widthType: 'auto',
};

/**
 * 返回的 Hooks 方法
 */
export interface ProtableConfigHook {
  config: ProtableConfigState;
  handleTableConfig: (state: Partial<ProtableConfigState>) => void;
}

/**
 * 简单配置的 Model
 */
export const useProTableConfig = (): ProtableConfigHook => {
  const { useStore, mutate } = createStore<'config'>(PROTABLE_NAMESPACE);
  const [config] = useStore<ProtableConfigState>('config', protableConfigState);

  return {
    config,
    /**
     * 修改表格配置项
     * @param value
     */
    handleTableConfig: (value) => {
      mutate('config', (state: ProtableConfigState) => {
        console.log(value);
        return { ...state, ...value };
      });
    },
  };
};
