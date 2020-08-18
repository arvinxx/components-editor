import React, { FC } from 'react';
import { useSelector } from 'dva';
import { ConnectState, ProTableModelState } from '@/models/connect';
import { Col, Row } from 'antd';
import Code from './Code';
import {
  tableString,
  dataSourceString,
  columnsString,
  importString,
} from './codeString';

const ProCode: FC = () => {
  const table = useSelector<ConnectState, ProTableModelState>(
    (state) => state.protable
  );
  const { config, columns, dataSource } = table;

  return (
    <>
      <Row gutter={24} justify={'space-between'}>
        <Col span={12}>
          <Code
            title={'依赖代码'}
            language={'js'}
            code={importString(table)}
            type={'table'}
          />
          <Code
            title={'Table 表格代码'}
            language={'jsx'}
            code={tableString(table)}
            type={'table'}
          />
          <Code
            language={'jsx'}
            title={'Columns 列代码'}
            code={columnsString(columns)}
            type={'columns'}
          />
        </Col>
        <Col span={12}>
          <Code
            title={'DataSource 测试数据集'}
            code={dataSourceString(dataSource, columns)}
            type={'dataSource'}
          />
        </Col>
      </Row>
    </>
  );
};

export default ProCode;
