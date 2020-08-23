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

  const { columns } = useProTableColumn();
  const { dataSourceConfig } = useProTableDataSource();

  const { formatMessage } = useIntl();

  // 数字化

  const [row, col] = activeCellKey.split('-').map(Number);
  const rowData = dataSourceConfig[row];
  const cell = Object.entries(rowData).find(
    (entry) => entry[0] === columns[col].dataIndex,
  );

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
              // @ts-ignore
              value={cell && (cell[1] as CellType).content}
              onChange={(e) => {
                // dispatch({
                //   type: 'table/setCellText',
                //   payload: {
                //     row,
                //     col: cell && cell[0],
                //     content: e.target.value,
                //   },
                // });
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
