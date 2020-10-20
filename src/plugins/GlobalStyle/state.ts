import { createStore, PROTABLE_NAMESPACE } from '@/core';
import { SizeType } from 'antd/lib/config-provider/SizeContext';

export interface GlobalStyleState {
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
}

export const state: GlobalStyleState = {
  bordered: false,
  showHeader: true,
  size: 'large',
  width: 1200,
  widthType: 'auto',
};

/**
 * 全局表格配置项
 */
export const useGlobalStyle = () => {
  const { useStore, mutate } = createStore<'config'>(PROTABLE_NAMESPACE);
  const [config] = useStore<GlobalStyleState>('config', state);

  return {
    config,
    /**
     * 修改表格配置项
     * @param value
     */
    handleTableConfig: (value) => {
      mutate('config', (s: GlobalStyleState) => {
        return { ...s, ...value };
      });
    },
  };
};
