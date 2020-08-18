import React, { FC, memo, useState } from 'react';
import { useSelector } from 'react-redux';
import { Drawer, Radio, Space, Button } from 'antd';
import { ConnectState, ProTableModelState } from '@/models/connect';

import { useHandleTable } from '@/hook';

import ReactJson from 'react-json-view';

const { Button: RadioButton, Group } = Radio;
const ProTablePage: FC = memo(() => {
  const table = useSelector<ConnectState, ProTableModelState>(
    (state) => state.protable
  );
  const [index, setIndex] = useState(0);

  const [placement, setPlacement] = useState('left');
  const { handleTableState } = useHandleTable();

  const { showDataPreviewPanel, previewData } = table;

  return (
    <Drawer
      // @ts-ignore
      placement={placement}
      visible={showDataPreviewPanel}
      maskClosable={false}
      onClose={() => {
        handleTableState({ showDataPreviewPanel: false });
      }}
      title={
        <div>
          数据预览
          <Group
            size={'small'}
            style={{ marginLeft: 16 }}
            value={placement}
            onChange={(e) => {
              setPlacement(e.target.value);
            }}
          >
            <RadioButton value={'left'}>左</RadioButton>
            <RadioButton value={'bottom'}>下</RadioButton>
          </Group>
        </div>
      }
      width={400}
      height={300}
      mask={false}
    >
      {/*<Space style={{ marginBottom: 8 }}>*/}
      {/*  <Button>刷新</Button>*/}
      {/*</Space>*/}
      {previewData ? (
        <>
          <div style={{ marginBottom: 16 }}>
            共 {previewData.length} 条数据
            <Space style={{ marginLeft: 16 }}>
              <Button
                size={'small'}
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
                size={'small'}
                disabled={index + 1 >= previewData.length}
                onClick={() => {
                  if (index + 1 < previewData.length) {
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
            src={previewData[index]}
          />
        </>
      ) : null}
    </Drawer>
  );
});

export default ProTablePage;
