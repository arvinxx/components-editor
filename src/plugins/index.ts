import { PluginInstance } from '@/core';
import StyleConfig from './GlobalStyle';
import DataSource from './DataSource';
import AdvancedSearch from './AdvancedSearch';
import ToolBar from './ToolBar';
import Pagination from './Pagination';
import RowSelection from './RowSelection';
import CellText from './CellText';

import HeaderStyle from './HeaderStyle';
import ColumnData from './ColumnData';

import SearchBar from './SearchBar';

/**
 * 核心插件集
 */
const plugins: PluginInstance[] = [
  // 默认全局
  StyleConfig,
  DataSource,
  AdvancedSearch,
  ToolBar,
  RowSelection,
  Pagination,
  // 单元格
  CellText,
  // 表头
  HeaderStyle,
  ColumnData,
  // 搜索框
  SearchBar,
];

export default plugins;
