import { TagType } from '@/typings/table';

import { createStore, defaultTableData, PROTABLE_NAMESPACE } from './utils';

export interface CellType {
  key: string;
  content: string | TagType;
}

export interface RowType {
  key: string;
  [key: string]: CellType | string | any[];
}

/**
 * ProTable 数据源状态
 */
export interface ProtableDataSourceState {
  /**
   * 假数据源
   */
  mockDataSource: RowType[];
  /**
   * 数据类型
   */
  dataSourceType: 'mock' | 'online';
  /**
   * 线上数据 url
   */
  onlineUrl?: string;
  /**
   * 线上数据
   */
  onlineDataSource: RowType[];
  /**
   * 显示预览面板
   */
  showDataPreviewPanel: boolean;
  /**
   * 是否需要刷新面板
   */
  shouldRefreshData: boolean;
}

export const protableDataSourceState: ProtableDataSourceState = {
  dataSourceType: 'mock',
  // 生成初始化表格数据
  mockDataSource: defaultTableData.dataSource,
  shouldRefreshData: false,
  showDataPreviewPanel: false,
  onlineUrl: '',
  onlineDataSource: [],
};

/**
 * 返回的 Hooks 方法
 */
export interface ProtableDataSourceHook {
  dataSourceConfig: Omit<ProtableDataSourceState, 'mockDataSource'>;
  mockDataSource: ProtableDataSourceState['mockDataSource'];
  setMockDataSource: (
    dataSource: ProtableDataSourceState['mockDataSource'],
  ) => void;
  handleTableDataSourceConfig: (
    payload: Partial<ProtableDataSourceState>,
  ) => void;
  handleMockCellText: (row: number, col: string, content: string) => void;
}

/**
 * 数据源 Model
 */
export const useProTableDataSource = () => {
  const { useStore, mutate } = createStore<
    'dataSourceConfig' | 'mockDataSource'
  >(PROTABLE_NAMESPACE);
  const { mockDataSource: x, ...res } = protableDataSourceState;
  const [dataSourceConfig] = useStore('dataSourceConfig', res);
  const [mockDataSource, setMockDataSource] = useStore(
    'mockDataSource',
    protableDataSourceState.mockDataSource,
  );

  return {
    dataSourceConfig,
    mockDataSource,
    /**
     * 全量修改 mock 数据源的方法
     */
    setMockDataSource,
    /**
     * 修改表格数据源的配置
     * @param value
     */
    handleTableDataSourceConfig: (value) => {
      const entries = Object.entries(value);

      mutate('dataSourceConfig', (state) => {
        entries.forEach(([key, newValue]) => {
          if (state[key]) {
            state[key] = newValue;
          }
        });
      });
    },
    /**
     * 修改 mock数据源的文本
     * @param rowIndex
     * @param columnDataIndex
     * @param content
     */
    handleMockCellText(rowIndex, columnDataIndex, content) {
      mutate('mockDataSource', (state: ProtableDataSourceState) => {
        if (state[rowIndex][columnDataIndex]) {
          state[rowIndex][columnDataIndex].content = content;
        }
      });
    },
  };
};
