import { PluginInstance } from '@/core';
import Panel from './Panel';

const plugin: PluginInstance = {
  name: 'SearchBar',
  Panel,
  renderToken: 'search',
};

export default plugin;
