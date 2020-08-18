import React, { FC, useState } from 'react';
import { Modal, Input, Upload, message } from 'antd';

import { useIntl } from 'umi';
import dayjs from 'dayjs';

import relativeTime from 'dayjs/plugin/relativeTime';
import 'dayjs/locale/zh-cn';

import styles from './style.less';
import { useSelector } from 'dva';
import {
  ConnectState,
  ProComponentModelState,
  ProTableModelState,
} from '@/models/connect';
import { useHandleTable } from '@/hook';

dayjs.locale('zh-cn');
dayjs.extend(relativeTime);

interface ImportConfigProps {
  handleVisible: (visible: boolean) => void;
  visible: boolean;
}

const { TextArea } = Input;
const ImportConfig: FC<ImportConfigProps> = React.memo(
  ({ visible, handleVisible }) => {
    const { formatMessage } = useIntl();

    const { handleTableState } = useHandleTable();
    const [config, setConfig] = useState('');
    return (
      <Modal
        title={'导入配置'}
        visible={visible}
        onCancel={() => {
          handleVisible(false);
        }}
        onOk={(e) => {
          try {
            const table = JSON.parse(config);

            handleTableState(table);
            handleVisible(false);
          } catch (e) {
            message.error('配置文件可能不正确,请检查后重试');
          }
        }}
      >
        <TextArea
          placeholder={'请复制配置文本到输入框中'}
          style={{ minHeight: 120 }}
          onChange={(e) => {
            setConfig(e.target.value);
          }}
        />
      </Modal>
    );
  }
);

export default ImportConfig;
