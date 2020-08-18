import React, { FC, MouseEventHandler } from 'react';
import { Row, Col, Input } from 'antd';
import { ArrowLeftOutlined } from '@ant-design/icons';

import { useDispatch, useSelector } from 'react-redux';
import { ConnectState, ProTableModelState } from '@/models/connect';
import { useIntl } from 'umi';

import styles from './style.less';
import { CellType } from 'typings/data/table';

interface CellConfigProps {
  onBack?: MouseEventHandler<HTMLElement>;
  onReset?: MouseEventHandler<HTMLElement>;
}
const CellConfig: FC<CellConfigProps> = ({ onBack }) => {
  const dispatch = useDispatch();
  const {
    config,
    focusedCellKey,
    activeHeader,
    columns,
    dataSource,
  } = useSelector<ConnectState, ProTableModelState>((state) => state.protable);
  const { formatMessage } = useIntl();

  // 数字化

  const [row, col] = focusedCellKey.split('-').map(Number);
  const rowData = dataSource[row];
  const cell = Object.entries(rowData).find(
    (entry) => entry[0] === columns[col].dataIndex
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
              size={'small'}
              // @ts-ignore
              value={cell && (cell[1] as CellType).content}
              onChange={(e) => {
                dispatch({
                  type: 'table/setCellText',
                  payload: {
                    row,
                    col: cell && cell[0],
                    content: e.target.value,
                  },
                });
              }}
            />
          </Col>
        </Row>
        {/*<div style={{ marginTop: 8 }}>*/}
        {/*  <TextFillConfig single />*/}
        {/*</div>*/}
      </div>
    </div>
  );
};

export default CellConfig;
