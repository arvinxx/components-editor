import { PluginInstance } from '@/core';
import Panel from './Panel';

const plugin: PluginInstance = {
  name: 'RowSelection',
  Panel,
  renderToken: 'global',
};

export default plugin;
