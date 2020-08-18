import React, { FC, useState } from 'react';
import { Button, Row, Col, Space, message } from 'antd';
import { useIntl } from 'umi';
import dayjs from 'dayjs';

import relativeTime from 'dayjs/plugin/relativeTime';
import 'dayjs/locale/zh-cn';

import { useSelector } from 'dva';
import {
  ConnectState,
  ProComponentModelState,
  ProTableModelState,
} from '@/models/connect';
import { isDev } from '@/utils';
import copy from 'copy-to-clipboard';
import styles from './style.less';
import ImportConfig from '../ImportConfig';

dayjs.locale('zh-cn');
dayjs.extend(relativeTime);

interface FooterProps {
  showConfig?: boolean;
  onOk: () => void;
  onCopyData: () => void;
  onReset?: () => void;
}

const Footer: FC<FooterProps> = React.memo((props) => {
  const { formatMessage } = useIntl();
  const { isUpdate, activeTabKey } = useSelector<
    ConnectState,
    ProComponentModelState
  >((state) => state.component);
  const table = useSelector<ConnectState, ProTableModelState>(
    (state) => state.protable,
  );
  const { onOk, onReset, onCopyData, showConfig } = props;

  const [showImport, setShowImport] = useState(false); // 导入状态配置

  return (
    <Row className={styles.container} justify="space-between">
      <Col>
        {showConfig ? (
          <>
            <Space>
              <Button
                onClick={() => {
                  if (activeTabKey === 'protable') {
                    copy(JSON.stringify(table));
                    message.success(
                      formatMessage({
                        id: 'components.footer.config.export.copy-success',
                      }),
                    );
                  }
                }}
              >
                {formatMessage({ id: 'components.footer.config.export' })}
              </Button>
              <Button
                onClick={() => {
                  setShowImport(true);
                }}
              >
                {formatMessage({ id: 'components.footer.config.import' })}
              </Button>
            </Space>
            <ImportConfig handleVisible={setShowImport} visible={showImport} />
          </>
        ) : null}
      </Col>
      <Col>
        {!onReset ? null : (
          <Button onClick={onReset}>
            {formatMessage({ id: 'components.footer.reset' })}
          </Button>
        )}
        {isDev ? (
          <Button type="default" onClick={onCopyData}>
            {formatMessage({
              id: 'components.footer.copy',
            })}
          </Button>
        ) : null}
        <Button type="primary" onClick={onOk}>
          {formatMessage({
            id: isUpdate
              ? 'components.footer.update'
              : 'components.footer.generate',
          })}
        </Button>
      </Col>
    </Row>
  );
});

export default Footer;
