import React, {
  FC,
  SyntheticEvent,
  useEffect,
  useRef,
  useState,
  useCallback,
} from 'react';
import { Resizable } from 'react-resizable';
import classnames from 'classnames';
import { PlusCircleFilled } from '@ant-design/icons';

import { useDrag, useDrop } from 'react-dnd';

import { CellType, ColumnType } from '@/typings/table';
import { useThrottleFn } from '@umijs/hooks';

import { generateColumn } from '@/utils';
import { useProTableInteract } from '@/models/interact';
import { useProTableDataSource } from '@/models/dataSource';
import { useProTableColumn } from '@/models/columns';
import styles from './TableHeader.less';

const type = 'DragableHeader';

interface ResizeableTitleProps extends ColumnType {
  title: string;
  active: boolean;
  dataIndex: string;
  columnIndex: number;
}

const TableHeader: FC<ResizeableTitleProps> = (props) => {
  const {
    title,
    dataIndex,
    active,
    valueType,
    showActionEllipsis,
    widthType,
    valueEnum,
    columnIndex,
    children,
    isLink,
    copyable,
    hideInSearch,
    ellipsis,
    ...restProps
  } = props;

  const { interact, handleTableInteract } = useProTableInteract();
  const { mockDataSource, setMockDataSource } = useProTableDataSource();
  const { columns, setColumns, handleTableColumn } = useProTableColumn();

  const { activeColumnKey, resizingIndex, resizingWidth } = interact;

  const header = useRef<HTMLTableHeaderCellElement>(null);
  const dragBar = useRef<HTMLSpanElement>(null);
  const [startX, setStartX] = useState(0); // 起始坐标,用于计算宽度
  const [startWidth, setStartWidth] = useState(0); // 起始宽度
  const column = columns[columnIndex];

  /**
   * 获取组件宽度
   */
  const getStartWidth = () => {
    if (header.current) {
      const bcr = header.current!.getBoundingClientRect();
      return bcr.width;
    }
    return 0;
  };
  /**
   * 调整 dataSource
   */
  const adjustDataSource = (newColumns: ColumnType[]) => {
    let newDataSource = mockDataSource.concat([]);

    for (let i = 0; i < newColumns.length; i += 1) {
      const newColumn = newColumns[i];
      newDataSource = newDataSource.map((row, rowIndex) => {
        // 如果在 row 里找不到这个 dataIndex
        // 说明是新的数据列表
        if (!row[newColumn.dataIndex]) {
          // 进行添加
          Object.assign(row, {
            [newColumn.dataIndex]: {
              content: '----',
              key: `${rowIndex}-${i}`,
            },
          });
        } else {
          // 如果能找到,那么则说明是已有的,重新调整一下 row 和 column 的 key
          (row[newColumn.dataIndex] as CellType).key = `${rowIndex}-${i}`;
        }
        return row;
      });
    }
    return newDataSource;
  };

  useEffect(() => {
    if (!header.current) return;

    // 计算宽度
    const width = getStartWidth();

    handleTableInteract({
      resizingWidth: column?.width ? column.width : width,
    });
    setStartWidth(column?.width ? column.width : width);
  }, [header.current]);

  /**
   * 缩放
   * @param e
   */
  const handleResize = (e: SyntheticEvent) => {
    // @ts-ignore
    const newWidth = startWidth + (e.screenX - startX);

    handleTableInteract({ resizingWidth: newWidth });
  };
  const { run } = useThrottleFn(handleResize, 16);

  /**
   * 更新尺寸
   * @param e
   */
  const updateSize = (e: SyntheticEvent) => {
    const field = column?.widthType === 'number' ? 'width' : 'widthPercent';

    handleTableInteract({ resizingIndex: '' });
    // @ts-ignore
    const newWidth = startWidth + (e.screenX - startX);
    handleTableInteract({ resizingWidth: newWidth });
    if (column) {
      handleTableColumn(column.dataIndex, field, Number(newWidth?.toFixed(0)));
    }
  };

  /**
   * 在某个 dataIndex 前后添加新列
   */
  const addNewColumn = (cindex: number) => {
    let newColumns = columns.concat([]);

    const newColumn = generateColumn({ columnIndex: cindex.toString() });
    newColumns.splice(cindex, 0, newColumn); // 在前面添加一列
    // 针对新的列调整 key 和 dataIndex
    newColumns = newColumns.map((col, index) => ({
      ...col,
      key: index.toString(),
    }));

    // 调整 dataSource
    const newDataSource = adjustDataSource(newColumns);

    setColumns(newColumns);
    setMockDataSource(newDataSource);
  };

  //* *****  表格拖拽  ********//
  const moveColumn = useCallback(
    (dragIndex: number, hoverIndex: number) => {
      const dragRow = columns[dragIndex];
      const newColumns = columns.concat([]);
      newColumns.splice([
        [dragIndex, 1],
        [hoverIndex, 0, dragRow],
      ]);
      setColumns(newColumns);
      setMockDataSource(adjustDataSource(newColumns));
    },
    [columns],
  );

  const [{ isOver, dropClassName }, drop] = useDrop({
    accept: type,
    collect: (monitor) => {
      const { columnIndex: dragIndex } = monitor.getItem() || {};
      if (dragIndex === columnIndex) {
        return {};
      }
      return {
        isOver: monitor.isOver(),
        dropClassName:
          dragIndex > columnIndex ? styles.dragingLeft : styles.dragingRight,
      };
    },

    drop: (item) => {
      // @ts-ignore
      moveColumn(item.columnIndex, columnIndex);
    },
  });
  const [, drag, preview] = useDrag({
    item: { type, columnIndex },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  drag(dragBar);
  drop(header);
  //* *****  表格拖拽  ********//

  const isResizing = resizingIndex === column?.dataIndex;
  const isActive = activeColumnKey === column?.key;

  return (
    <Resizable
      className={styles.container}
      width={isResizing ? resizingWidth : column?.width || 0}
      height={0}
      handle={
        <span
          className={classnames({
            [styles.handle]: true,
            [styles.resizing]: isResizing,
          })}
          onClick={(e) => {
            e.stopPropagation();
          }}
          onDragCapture={(e) => {
            e.stopPropagation();
          }}
        />
      }
      onResize={run}
      onResizeStart={(e: { screenX: React.SetStateAction<number> }) => {
        // @ts-ignore
        setStartX(e.screenX);
        const width = getStartWidth();
        handleTableInteract({ resizingWidth: width });
        setStartWidth(column?.width ? column.width : width);

        if (column?.dataIndex) {
          handleTableColumn(column?.dataIndex, 'widthType', 'number');
          handleTableInteract({ resizingIndex: column?.dataIndex });
        }
      }}
      onResizeStop={updateSize}
      draggableOpts={{ enableUserSelectHack: false }}
    >
      <th
        {...restProps}
        ref={(ref) => {
          preview(ref);
          // @ts-ignore
          header.current = ref;
        }}
        className={classnames({
          [styles.activeHeader]: isActive,
          [styles.header]: true,
          [dropClassName]: isOver,
        })}
      >
        {isActive ? (
          <span
            className={styles.leftAdd}
            onClick={() => {
              addNewColumn(columnIndex);
            }}
          >
            <PlusCircleFilled className={styles.plusIcon} />
          </span>
        ) : null}
        {children}

        {isActive ? (
          <span
            className={styles.rightAdd}
            onClick={() => {
              addNewColumn(columnIndex + 1);
            }}
          >
            <PlusCircleFilled className={styles.plusIcon} />
          </span>
        ) : null}
        {isActive ? <span ref={dragBar} className={styles.dragBar} /> : null}
      </th>
    </Resizable>
  );
};

export default TableHeader;
