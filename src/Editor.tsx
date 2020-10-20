import React, { FC, useRef, useState } from 'react';
import { Button } from 'antd';
import { IntlProvider } from 'react-intl';
import classNames from 'classnames';

import { EditorPanel, ProTable } from '@/core';
import locale from './locales/zh-CN';

import './index.less';

const ProComponentEditor: FC = () => {
  const configCtn = useRef<HTMLDivElement>(null);

  const [visible, setVisible] = useState(true);
  return (
    <div className="ant-pro-table-editor-container">
      <IntlProvider messages={locale} locale="zh-CN" defaultLocale="zh-CN">
        <div
          className={classNames({
            'ant-pro-table-editor-left': true,
            'ant-pro-table-editor-side-active': visible,
          })}
        >
          <Button
            onClick={() => {
              setVisible(!visible);
            }}
          >
            打开抽屉
          </Button>
          <ProTable />
        </div>
        <div ref={configCtn} className="ant-pro-table-editor-side">
          <EditorPanel
            onClose={() => {
              setVisible(false);
            }}
            visible={visible}
            getContainer={configCtn.current!}
          />
        </div>
      </IntlProvider>
    </div>
  );
};

export default ProComponentEditor;
