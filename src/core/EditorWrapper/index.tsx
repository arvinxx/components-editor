import React, {
  FC,
  useEffect,
  useRef,
  Children,
  ReactNode,
  ReactComponentElement,
} from 'react';
import { devtools } from 'stook-devtools';
import useMergeState from 'use-merge-value';
import { Button } from 'antd';
import classNames from 'classnames';
import { IntlProvider } from 'react-intl';
import { initManager } from '@/core';
import { EditorPosition, DefaultComponents } from '@/typings/EditorWrapper';
import locale from '@/locales/zh-CN';
import EditorPanel from './Panel';

import styles from './index.less';

if (process.env.NODE_ENV !== 'production') {
  devtools.init();
}

interface EditorWrapperProps {
  /**
   * 包含的组件或组件类型
   * 可以传入的默认值有 ProTable
   */
  component?: DefaultComponents | string | ReactNode;
  /**
   * 编辑器类型
   * 默认为 panel
   */
  editorType?:
    | 'panel' // 面板形式展示
    | 'fix' // 固定展示
    | 'float'; // 悬浮面板
  /**
   * 编辑器显示位置
   * 可选有 左边或者右边
   */
  position?: EditorPosition;
  /**
   * 是否显示编辑器
   */
  visible?: boolean;
  /**
   * 编辑器状态改变
   * @param visible
   */
  onVisibleChange?: (visible: boolean) => void;
}

/**
 * 编辑器组件
 * 传入component 或者 children
 * 可自动识别相应的组件类型
 */
const EditorWrapper: FC<EditorWrapperProps> = ({
  children,
  visible,
  onVisibleChange,
  component,
}) => {
  if (!component && Children.count(children) !== 1) {
    throw Error('EditorWrapper 必须传入 component Props 或包含子组件');
  }

  // 针对 传入的 children 做一次组件类型校验
  if (
    (children as ReactComponentElement<any>)?.type.displayName !== 'ProTable'
  ) {
    throw Error(
      '不支持的组件类型,请确保子组件是编辑器支持的组件类型( ProTable 等)',
    );
  }

  console.log(children, Reflect.ownKeys(children?.props));
  const configCtn = useRef<HTMLDivElement>(null);

  const [showPanel, setVisible] = useMergeState(true, {
    value: visible,
    defaultValue: true,
    onChange: onVisibleChange,
  });

  useEffect(() => {
    initManager();
  }, []);

  return (
    <div className={styles.container}>
      <IntlProvider messages={locale} locale="zh-CN" defaultLocale="zh-CN">
        <div
          className={classNames({
            [styles.left]: true,
            [styles.active]: showPanel,
          })}
        >
          <Button
            onClick={() => {
              setVisible(!showPanel);
            }}
          >
            打开抽屉
          </Button>
          {children}
        </div>
        <div ref={configCtn} className={styles.side}>
          <EditorPanel
            onClose={() => setVisible(!showPanel)}
            visible={showPanel}
            getContainer={configCtn.current!}
          />
        </div>
      </IntlProvider>
    </div>
  );
};

export default EditorWrapper;
