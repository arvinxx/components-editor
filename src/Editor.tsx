import React, { FC, useRef, useState } from 'react';
import { Button } from 'antd';
import { IntlProvider } from 'react-intl';
import { DragAndDrop } from '@/components';

import ProTable from './ProTable';
import ConfigPanel from './ConfigPanel';
import locale from './locales/zh-CN';

import './index.less';

const ProComponentEditor: FC = () => {
  const configCtn = useRef();

  const [visible, setVisible] = useState(false);
  return (
    <div className="ant-pro-table-editor-container">
      <IntlProvider messages={locale} locale="zh-CN" defaultLocale="zh-CN">
        <div className="ant-pro-table-editor-left">
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
        <div
          ref={(ref) => {
            configCtn.current = ref;
          }}
          className="ant-pro-table-editor-side"
        >
          <ConfigPanel visible={visible} getContainer={configCtn.current} />
        </div>
      </IntlProvider>
    </div>
  );
};

export default ProComponentEditor;
