import defaultPlugins from '@/plugins';
import { pluginManager, PluginInstance } from './pluginManager';

export const initManager = (plugins?: PluginInstance[]) => {
  // 如果已经注册 避免重复注册
  if (pluginManager.isRegister) return;
  // 插件管理器初始化注册
  try {
    defaultPlugins.forEach((plugin) => {
      pluginManager.register(plugin);
    });
    plugins?.forEach((plugin) => {
      pluginManager.register(plugin);
    });
    pluginManager.isRegister = true;
  } catch (e) {
    console.error(e);
  }
};
