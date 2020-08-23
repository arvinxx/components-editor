import { TablePaginationConfig } from 'antd/es/table';

import { createStore, KeyValue, PROTABLE_NAMESPACE } from './utils';

/**
 * Pagination 状态
 */
export interface ProTablePaginationState {
  /**
   * 是否显示分页器
   * */
  showPagination: boolean;
  /**
   * 分页器配置项
   * */
  pagination: TablePaginationConfig;
}

export const paginationState: ProTablePaginationState = {
  pagination: {
    position: ['bottomRight'],
    total: 100,
    size: 'default',
  },
  showPagination: false,
};

/**
 * 返回的 Hooks 方法
 */
export interface PaginationHooks extends ProTablePaginationState {
  /**
   * 控制显示 Pagination
   */
  setShowPagination: (show: boolean) => void;
  /**
   * 修改 pagination 中的任意一个值
   * @param value
   */
  handlePagination: (value: KeyValue) => void;
}

/**
 * ProTable 的分页器 Model
 */
export const useProTablePagination = (): PaginationHooks => {
  const { useStore, mutate } = createStore<keyof ProTablePaginationState>(
    PROTABLE_NAMESPACE,
  );
  const [pagination] = useStore('pagination', paginationState.pagination);

  const [showPagination, setShowPagination] = useStore(
    'showPagination',
    paginationState.showPagination,
  );

  return {
    pagination,
    showPagination,
    setShowPagination,
    handlePagination: (value) => {
      mutate('pagination', (state: ProTablePaginationState['pagination']) => {
        return { ...state, ...value };
      });
    },
  };
};
