import { SearchConfig } from '@ant-design/pro-table/es/Form';
import { createStore, PROTABLE_NAMESPACE } from '@/models/utils';

/**
 * Search 状态
 */
interface ProTableSearchState {
  search: SearchConfig;
  showSearch: boolean;
}

export const searchState: ProTableSearchState = {
  showSearch: true,
  search: {
    collapsed: true,
  },
};

/**
 * 返回的 Hooks 方法
 */
export interface SearchHooks extends ProTableSearchState {
  /**
   * 控制是否显示
   */
  setShowSearch: (show: boolean) => void;
  /**
   * 修改 search 中的任意一个值
   * @param value
   */
  handleSearch: (value: Partial<SearchConfig>) => void;
}

/**
 * ProTable 的高级搜索 Model
 */
export const useProTableSearch = (): SearchHooks => {
  const { useStore, mutate } = createStore<keyof ProTableSearchState>(
    PROTABLE_NAMESPACE,
  );
  const [search] = useStore('search', searchState.search);

  const [showSearch, setShowSearch] = useStore(
    'showSearch',
    searchState.showSearch,
  );
  return {
    search,
    showSearch,
    setShowSearch,
    handleSearch: (value) => {
      mutate('search', (state: ProTableSearchState['search']) => {
        return { ...state, ...value };
      });
    },
  };
};
