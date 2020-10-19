import React, { FC, MouseEventHandler } from 'react';
import { Row, Col, Input } from 'antd';
import { ArrowLeftOutlined } from '@ant-design/icons';

import { useIntl } from 'react-intl';
import { useProTableInteract } from '@/models/interact';
import { useProTableColumn } from '@/models/columns';
import { useProTableDataSource } from '@/models/dataSource';

import styles from './style.less';

interface CellConfigProps {
  onBack?: MouseEventHandler<HTMLElement>;
  onReset?: MouseEventHandler<HTMLElement>;
}
const CellConfig: FC<CellConfigProps> = ({ onBack }) => {
  const { interact } = useProTableInteract();
  const { activeCellKey } = interact;

  const { handleMockCellText, mockDataSource } = useProTableDataSource();
  const { columns } = useProTableColumn();
  const { formatMessage } = useIntl();

  const [row, col] = activeCellKey.split('-').map(Number); // 数字化

  const rowData = mockDataSource[row];

  const cell = Object.entries(rowData || {})?.find(
    (entry) => entry[0] === columns[col].dataIndex,
  );

  const getText = () => {
    if (!cell) return '';
    const value = cell[1];
    if (typeof value === 'string') {
      return value;
    }
    if (value instanceof Array) {
      return '';
    }
    if (typeof value.content === 'string') {
      return value.content;
    }
    return value.content.text;
  };
  return (
    <div>
      <div className={styles.configTitle} onClick={onBack}>
        <ArrowLeftOutlined style={{ marginRight: 4 }} />
        {formatMessage({ id: 'page.component.element.cell' })}
      </div>
      <div>
        <Row gutter={8}>
          <Col span={6}>文本</Col>
          <Col span={18}>
            <Input
              size="small"
              value={getText()}
              onChange={(e) => {
                handleMockCellText(row, cell?.[0]!, e.target.value);
              }}
            />
          </Col>
        </Row>
        {/* <div style={{ marginTop: 8 }}> */}
        {/*  <TextFillConfig single /> */}
        {/* </div> */}
      </div>
    </div>
  );
};

export default CellConfig;
