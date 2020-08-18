import { Col, Row } from 'antd';

import React, { FC, ReactNode } from 'react';

interface PanelLayoutProps {
  title?: ReactNode;
  children: ReactNode | ReactNode[];
  marginTop?: number;
  leftCol?: number;
  rightCol?: number;
  widthGutter?: number;
  heightGutter?: number;
  align?: 'top' | 'middle' | 'bottom' | 'stretch';
}
const PanelLayout: FC<PanelLayoutProps> = ({
  title,
  children,

  marginTop,
  leftCol = 6,
  rightCol = 18,
  widthGutter = 8,
  heightGutter = 12,
  align,
}) => (
  <Row
    gutter={[widthGutter, heightGutter]}
    style={marginTop ? { marginTop } : undefined}
    align={align}
  >
    {title ? <Col span={leftCol}>{title}</Col> : undefined}
    <Col span={title ? rightCol : 24}>
      {children instanceof Array ? (
        <Row gutter={[8, 8]}>
          {children.map((item, index) => {
            return <Col key={index}>{item}</Col>;
          })}
        </Row>
      ) : (
        children
      )}
    </Col>
  </Row>
);

export default PanelLayout;
