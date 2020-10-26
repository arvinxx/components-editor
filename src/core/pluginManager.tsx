import React, { FC } from 'react';

export interface PluginInstance<S = {}> {
  /**
   * 插件名称
   */
  name: string;
  /**
   * 插件渲染方法
   */
  Panel: FC;
  /**
   * 需要插件扩展的数据状态
   */
  state?: S;
  /**
   * 根据 State 中的 key 对 config 配置项进行控制的方法
   */
  propList?: PropConfig[];
  /**
   * 开启插件面板的选择器
   */
  selector?: () => Element;
  /**
   * 代码编辑器
   */
  editor?: any;
  /**
   * 面板显示的标识符
   * 用户与编辑器的交互状态会实时修改相应的 token
   * 编辑器面板会识别这个 token ,从而显示包含 token 的插件面板
   */
  renderToken: GlobalToken | string;
}

interface PropConfig {
  /**
   * 在 props 中的字段名
   */
  key: string;
  type: 'enum' | 'number' | 'string';
  /**
   * 显示在编辑器的配置项名称
   */
  name?: string;
  /**
   * 是否需要对配置项进行进一步说明
   */
  note?: string;
  /**
   * 相关说明的URL链接
   */
  refURL?: string;
  /**˚
   * 保存在编辑器中的字段名
   *
   * 默认的话和 props 的一致
   */
  stateKey?: string;
  /**
   * 这个配置项的默认值
   */
  defaultValue?: any;
  /**
   * 当联动 prop 的状态值改变时 如何对参数的 props 进行修改
   */
  handleProp?: (state: any) => any;
  enum?: EnumType[];
}
interface EnumType {
  key: string;
  value: string;
}

type GlobalToken = 'global';

interface PluginManager {
  isRegister: boolean;
  plugins: { [key: string]: PluginInstance };
  register: (plugin: PluginInstance) => void;
  GlobalPanel: FC;
  SpecificPanel: FC<{ token: string }>;
  tokenList: string[];
}

export const pluginManager: PluginManager = {
  /**
   * 判断插件是否注册完毕
   * 避免重复注册
   */
  isRegister: false,
  /**
   * 待注册的插件列表
   */
  plugins: {},
  /**
   * 供选择区分的 token 比如
   * 选中 header 时 headerCell 的 token 就是 header
   * 单元格的 token 就是 cell
   * 通过相应的 token 来区分显示在哪
   */
  tokenList: [],
  /**
   * 插件注册方法
   */
  register(plugin: PluginInstance) {
    const { name, Panel, selector, renderToken } = plugin;
    if (name in this.plugins) {
      throw Error(
        `插件列表中已包含 ${name},请确保没有重名插件! 该插件为:${JSON.stringify(
          plugin,
          () => {},
          2,
        )}`,
      );
    }

    // 注册插件
    this.plugins[name] = { Panel, selector, renderToken, name };
    // 导入 token
    if (!this.tokenList.includes(renderToken)) {
      this.tokenList.push(renderToken);
    }
  },
  /**
   * 渲染全局配置面板
   * @constructor
   */
  GlobalPanel: () => {
    return (
      <>
        {Object.values(pluginManager.plugins)
          .filter((p) => p.renderToken === 'global')
          .map((p) => (
            <p.Panel key={p.name} />
          ))}
      </>
    );
  },
  /**
   * 根据 token 进行显示
   * @param token
   */
  SpecificPanel: ({ token }) => {
    return (
      <>
        {Object.values(pluginManager.plugins)
          .filter((p) => p.renderToken === token)
          .map((p) => (
            <p.Panel key={p.name} />
          ))}
      </>
    );
  },
};
