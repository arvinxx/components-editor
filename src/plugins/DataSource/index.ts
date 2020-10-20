import { PluginInstance } from '@/core';
import Panel from './Panel';

const plugin: PluginInstance = {
  name: 'DataSource',
  Panel,
  renderToken: 'global',
};

export default plugin;
