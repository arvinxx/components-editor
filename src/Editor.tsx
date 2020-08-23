import React, { FC, useRef, useState } from 'react';
import { Button } from 'antd';

import { IntlProvider } from 'react-intl';

import { DndProvider, createDndContext } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import ProTable from './ProTable';
import ConfigPanel from './ConfigPanel';

import './index.less';

import locale from './locales/zh-CN';

const RNDContext = createDndContext(HTML5Backend);

const ProComponentEditor: FC = () => {
  const manager = useRef(RNDContext);
  const configCtn = useRef();

  const [visible, setVisible] = useState(false);
  return (
    <div className="ant-pro-table-editor-container">
      <IntlProvider messages={locale} defaultLocale="zh-CN">
        <div className="ant-pro-table-editor-left">
          <Button
            onClick={() => {
              setVisible(!visible);
            }}
          >
            打开抽屉
          </Button>
          <DndProvider manager={manager.current.dragDropManager!}>
            <ProTable />
          </DndProvider>
        </div>
        <div
          ref={(ref) => {
            console.log(ref);
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
