import { PluginInstance } from '@/core';
import Panel from './Panel';

const plugin: PluginInstance = {
  name: 'ToolBar',
  Panel,
  renderToken: 'global',
};

export default plugin;
