import React, { FC } from 'react';
import { Button, Switch } from 'antd';

import { Random } from 'mockjs';
import { useProTableColumn } from '@/models/columns';
import { useProTableDataSource } from '@/models/dataSource';
import { useProTableInteract } from '@/models/interact';
import PanelLayout from '../PanelLayout';

interface NumberFillConfigProps {
  single?: boolean;
}
const ContentFill: FC<NumberFillConfigProps> = ({ single }) => {
  const { columns, handleTableColumn } = useProTableColumn();
  const { interact } = useProTableInteract();
  const { mockDataSource, handleMockCellText } = useProTableDataSource();

  const { activeColumnKey } = interact;

  const index = columns.findIndex((col) => col.key === activeColumnKey);
  const column = columns[index];

  const setColumnCellContent = (fn: () => string) => {
    if (!single) {
      mockDataSource.forEach((_: any, i: number) => {
        handleMockCellText(i, column.dataIndex, fn());
      });
    }
  };

  const setColumnConfig = (field: string, value: any) => {
    handleTableColumn(column.dataIndex, field, value);
  };

  const title = () => {
    switch (column.valueType) {
      case 'text':
        return '填充文本';
      case 'date':
        return '填充日期';
      case 'dateTime':
        return '填充日期时间';
      case 'time':
        return '填充时间';
      case 'digit':
        return '填充数字';
      case 'money':
        return '填充金额';
      case 'percent':
        return '填充百分比';
      default:
        return '';
    }
  };
  const Content = () => {
    switch (column.valueType) {
      // 纯文本
      case 'text':
        return (
          <>
            <PanelLayout>
              <Button
                size="small"
                onClick={() => {
                  setColumnCellContent(() =>
                    Random.integer(100000000000, 1000000000000).toString(),
                  );
                }}
              >
                编号
              </Button>
            </PanelLayout>
            <PanelLayout>
              <Button
                size="small"
                onClick={() => {
                  setColumnCellContent(() => Random.ctitle());
                }}
              >
                短中文
              </Button>
              <Button
                size="small"
                onClick={() => {
                  setColumnCellContent(() => Random.csentence());
                }}
              >
                长中文
              </Button>

              <Button
                size="small"
                onClick={() => {
                  setColumnCellContent(() => Random.title());
                }}
              >
                短英文
              </Button>
              <Button
                size="small"
                onClick={() => {
                  setColumnCellContent(() => Random.sentence());
                }}
              >
                长英文
              </Button>
            </PanelLayout>
            <PanelLayout>
              <Button
                size="small"
                onClick={() => {
                  setColumnCellContent(() => Random.domain());
                }}
              >
                域名
              </Button>
              <Button
                size="small"
                onClick={() => {
                  setColumnCellContent(() => Random.url('http'));
                }}
              >
                网址
              </Button>
              <Button
                size="small"
                onClick={() => {
                  setColumnCellContent(() => Random.ip());
                }}
              >
                IP
              </Button>
            </PanelLayout>
          </>
        );
      // 数字
      case 'digit':
        return (
          <PanelLayout>
            <Button
              size="small"
              onClick={() => {
                setColumnCellContent(() => Random.integer(0, 1000).toString());
              }}
            >
              短数字
            </Button>
            <Button
              size="small"
              onClick={() => {
                setColumnCellContent(() =>
                  Random.integer(100000, 100000000000).toString(),
                );
              }}
            >
              长数字
            </Button>
          </PanelLayout>
        );
      case 'percent':
        return (
          <PanelLayout>
            <Button
              size="small"
              onClick={() => {
                setColumnCellContent(() => Random.integer(0, 100).toString());
              }}
            >
              整数
            </Button>
            <Button
              size="small"
              onClick={() => {
                setColumnCellContent(() => Random.float(0, 100).toString());
              }}
            >
              小数
            </Button>
            <Button
              size="small"
              onClick={() => {
                setColumnCellContent(() => Random.float(0, 1000).toString());
              }}
            >
              大于 100%
            </Button>
          </PanelLayout>
        );
      case 'money':
        return (
          <PanelLayout>
            <Button
              size="small"
              onClick={() => {
                setColumnCellContent(() => Random.integer(0, 1000).toString());
              }}
            >
              小额
            </Button>
            <Button
              size="small"
              onClick={() => {
                setColumnCellContent(() =>
                  Random.integer(100000, 100000000).toString(),
                );
              }}
            >
              大额
            </Button>
            <Button
              size="small"
              onClick={() => {
                setColumnCellContent(() => Random.float(0, 100).toString());
              }}
            >
              小数
            </Button>
          </PanelLayout>
        );
      // 日期
      case 'date':
        return (
          <PanelLayout>
            <Button
              size="small"
              onClick={() => {
                setColumnCellContent(() =>
                  Random.date('yyyy-MM-dd HH:mm:ss').toString(),
                );
              }}
            >
              随机日期
            </Button>
            <Button
              size="small"
              onClick={() => {
                setColumnCellContent(() => {
                  const year = new Date().getFullYear();
                  return Random.date(`${year}-MM-dd HH:mm:ss`).toString();
                });
              }}
            >
              近1年
            </Button>
            <Button
              size="small"
              onClick={() => {
                setColumnCellContent(() => {
                  const year = new Date().getFullYear();
                  const month = new Date().getUTCMonth();

                  return new Date(
                    Random.date(`${year}-${month}-dd HH:mm:ss`),
                  ).toISOString();
                });
              }}
            >
              近1月
            </Button>
          </PanelLayout>
        );
      case 'dateTime':
        return (
          <PanelLayout>
            <Button
              size="small"
              onClick={() => {
                setColumnCellContent(() =>
                  Random.date('yyyy-MM-dd HH:mm:ss').toString(),
                );
              }}
            >
              随机
            </Button>
            <Button
              size="small"
              onClick={() => {
                setColumnCellContent(() => {
                  const year = new Date().getFullYear();
                  return Random.date(`${year}-MM-dd HH:mm:ss`).toString();
                });
              }}
            >
              近1年
            </Button>
            <Button
              size="small"
              onClick={() => {
                setColumnCellContent(() => {
                  const year = new Date().getFullYear();
                  const month = new Date().getUTCMonth();
                  return Random.date(`${year}-${month}-dd HH:mm:ss`).toString();
                });
              }}
            >
              近1月
            </Button>
          </PanelLayout>
        );
      case 'time':
        return (
          <PanelLayout>
            <Button
              size="small"
              onClick={() => {
                setColumnCellContent(() => {
                  return Random.datetime().toString();
                });
              }}
            >
              随机
            </Button>
          </PanelLayout>
        );
      default:
        return <div>213</div>;
    }
  };
  return (
    <>
      {column.valueType === 'text' ? (
        <PanelLayout title="链接状态">
          <Switch
            size="small"
            checked={column && column!.isLink}
            onChange={(value) => {
              setColumnConfig('isLink', value);
            }}
          />
        </PanelLayout>
      ) : null}
      <PanelLayout title={title()}>
        <Content />
      </PanelLayout>
    </>
  );
};

export default ContentFill;
