import React from 'react';
import {Col as AntdCol} from 'antd';

export {Row} from 'antd';
export function Col({
  mobile = 24,
  tablet = 24,
  desktop = 24,
  children,
  ...props
}) {
  return (
    <AntdCol
      xs={mobile}
      sm={tablet}
      md={tablet}
      lg={desktop}
      xl={desktop}
      sl={desktop}
      {...props}
    >
      {children}
    </AntdCol>
  );
}
