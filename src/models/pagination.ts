import { TablePaginationConfig } from 'antd/es/table';

import { createStore, PROTABLE_NAMESPACE } from './utils';

/**
 * Pagination 状态
 */
export interface ProTablePaginationState {
  showPagination: boolean;
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
 * ProTable 的分页器 Model
 */
export const useProTablePagination = () => {
  const { useStore, mutate } = createStore<keyof ProTablePaginationState>(
    PROTABLE_NAMESPACE,
  );
  const [pagination] = useStore('pagination', paginationState.pagination);

  const [showPagination, setShowPagination] = useStore(
    'showPagination',
    paginationState.showPagination,
  );

  return {
    /**
     * 是否显示分页器
     * */
    pagination,
    /**
     * 分页器配置项
     * */
    showPagination,
    /**
     * 控制显示 Pagination
     */
    setShowPagination,
    /**
     * 修改 pagination 中的任意一个值
     * @param value
     */ handlePagination: (value: Record<string, any>) => {
      mutate('pagination', value, true);
    },
  };
};
