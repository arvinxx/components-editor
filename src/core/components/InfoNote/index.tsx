import React, { FC } from 'react';
import { Tooltip } from 'antd';

import { InfoCircleOutlined } from '@ant-design/icons';

interface InfoNoteProps {
  title: string;
  /**
   * 提供导航向其他业务页面的 URL
   */
  url?: string;
}
const InfoNote: FC<InfoNoteProps> = ({ title, url }) => {
  const onClick = () => {
    window.open(url, '_blank');
  };

  return (
    <Tooltip title={title}>
      <InfoCircleOutlined onClick={url ? onClick : undefined} />
    </Tooltip>
  );
};
export default InfoNote;
