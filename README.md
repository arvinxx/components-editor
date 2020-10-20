# @ant-design/pro-components-editor

用于支持重型组建的编辑，提供一个体验良好的高端可视化组件配置器，同时支持 sketch 的配置。

## 开发

- 通过 yarn 或者 npm 执行 yarn
- 执行 yarn start
- 运行 npm publish 进行
- 执行 npm test 执行测试

> 相关的的技术栈准备 https://www.yuque.com/chenshuai/web/szlnbw

## 技术栈

- [dumi](https://d.umijs.org/)
- [father](https://github.com/umijs/father)

## 项目架构

- core: 包含核心模块运行机制,包括插件机制

### Core

- 插件管理器
- 编辑器面板
- 待包裹的 Pro 组件

## API

| Props | 类型 | 例子 | 说明 |
| --- | --- | --- | --- |
| state |  |  | 编辑器状态 |
| config | string |  | Pro Components 的 props 配置参数 |
| columns | string |  | 可以从编辑器获取的 columns 属性值 |
| jsCode | string |  | js 代码 |
| tsCode | string |  | ts 代码 |
| onChange | `( {state,columns,code} ) => void` |  | 编辑器状态修改器 |
| plugins | `PluginInstance[]` |  | 外部注入的插件集 |
