import { PluginInstance } from '@/core';
import Panel from './Panel';

const plugin: PluginInstance = {
  name: 'Pagination',
  Panel,
  renderToken: 'global',
};

export default plugin;
