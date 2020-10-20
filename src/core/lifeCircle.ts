import defaultPlugins from '@/plugins';
import { pluginManager, PluginInstance } from './pluginManager';

export const initManager = (plugins?: PluginInstance[]) => {
  // 插件管理器初始化注册
  try {
    defaultPlugins.forEach((plugin) => {
      pluginManager.register(plugin);
    });
    plugins?.forEach((plugin) => {
      pluginManager.register(plugin);
    });
  } catch (e) {
    console.error(e);
  }
};
