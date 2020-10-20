import { PluginInstance } from '@/core';
import Panel from './Panel';

const plugin: PluginInstance = {
  name: 'Style',
  Panel,
  renderToken: 'global',
};

export default plugin;
