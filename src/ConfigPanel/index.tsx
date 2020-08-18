import React, { FC } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { ConnectState, ProTableModelState } from '@/models/connect';

import TableConfig from '@/components/TableConfig';
import HeaderConfig from '@/components/HeaderConfig';
import CellConfig from './CellConfig';

const ConfigPanel: FC = () => {
  const dispatch = useDispatch();
  const { focusedCellKey, activeHeader } = useSelector<
    ConnectState,
    ProTableModelState
  >((state) => state.protable);

  if (focusedCellKey === '' && activeHeader === '') {
    return <TableConfig />;
  }

  return activeHeader !== '' ? (
    <HeaderConfig
      onBack={() => {
        dispatch({
          type: 'protable/save',
          payload: { activeHeader: '', focusedCellKey: '' },
        });
      }}
    />
  ) : (
    <CellConfig
      onBack={() => {
        dispatch({
          type: 'protable/save',
          payload: { activeHeader: '', focusedCellKey: '' },
        });
      }}
    />
  );
};

export default ConfigPanel;
