import React, { FC, useRef, useState } from 'react';
import { Button } from 'antd';
import { IntlProvider } from 'react-intl';
import { DragAndDrop } from '@/components';
import classNames from 'classnames';

import ProTable from './ProTable';
import ConfigPanel from './ConfigPanel';
import locale from './locales/zh-CN';

import './index.less';

const ProComponentEditor: FC = () => {
  const configCtn = useRef<HTMLDivElement>(null);

  const [visible, setVisible] = useState(false);
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
          <DragAndDrop>
            <ProTable />
          </DragAndDrop>
        </div>
        <div ref={configCtn} className="ant-pro-table-editor-side">
          <ConfigPanel
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
