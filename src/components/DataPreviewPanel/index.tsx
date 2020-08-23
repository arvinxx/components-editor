import React, { FC, memo, useState } from 'react';
import { Drawer, Radio, Space, Button } from 'antd';
import ReactJson from 'react-json-view';
import { useProTableDataSource } from '../../models/dataSource';

const { Button: RadioButton, Group } = Radio;
const ProTablePage: FC = memo(() => {
  const {
    dataSourceConfig,
    handleTableDataSourceConfig,
  } = useProTableDataSource();

  const [index, setIndex] = useState(0);

  const [placement, setPlacement] = useState('left');

  const { onlineDataSource, dataSourceType } = dataSourceConfig;

  if (dataSourceType === 'mock') return <div />;

  return (
    <Drawer
      // @ts-ignore
      placement={placement}
      visible={dataSourceConfig.showDataPreviewPanel}
      maskClosable={false}
      onClose={() => {
        handleTableDataSourceConfig({ showDataPreviewPanel: false });
      }}
      title={
        <div>
          数据预览
          <Group
            size="small"
            style={{ marginLeft: 16 }}
            value={placement}
            onChange={(e) => {
              setPlacement(e.target.value);
            }}
          >
            <RadioButton value="left">左</RadioButton>
            <RadioButton value="bottom">下</RadioButton>
          </Group>
        </div>
      }
      width={400}
      height={300}
      mask={false}
    >
      {onlineDataSource && onlineDataSource.length === 0 ? null : (
        <>
          <div style={{ marginBottom: 16 }}>
            共 {onlineDataSource?.length} 条数据
            <Space style={{ marginLeft: 16 }}>
              <Button
                size="small"
                disabled={index - 1 < 0}
                onClick={() => {
                  if (index - 1 >= 0) {
                    setIndex(index - 1);
                  }
                }}
              >
                上一条
              </Button>
              <Button
                size="small"
                disabled={index + 1 >= onlineDataSource.length}
                onClick={() => {
                  if (index + 1 < onlineDataSource.length) {
                    setIndex(index + 1);
                  }
                }}
              >
                下一条
              </Button>
            </Space>
          </div>
          <ReactJson
            name={`第${index + 1}条数据`}
            collapseStringsAfterLength={22}
            enableClipboard={false}
            src={onlineDataSource[index]}
          />
        </>
      )}
    </Drawer>
  );
});

export default ProTablePage;
