import React from 'react';
import {Icon, Alert} from 'antd';

export function TransactionProgress({state, ...props}) {
  return (
    <div {...props}>
      {getIcon(state)}
      {getError(state)}
    </div>
  );
}

function getIcon(state) {
  if (!state.isDone) {
    return wrapIcon(<Icon type="loading" />);
  } else if (state.status === 'accepted') {
    return wrapIcon(
      <Icon type="check-circle" theme="twoTone" twoToneColor="#52c41a" />,
    );
  }
}

function wrapIcon(icon) {
  return (
    <div style={{padding: '30px', textAlign: 'center', fontSize: '24px'}}>
      {icon}
    </div>
  );
}

function getError(state) {
  if (state.isRejected) {
    return (
      <Alert
        message="Rejection"
        description="Transaction was rejected."
        type="warning"
        showIcon
      />
    );
  } else if (state.isFailed) {
    return (
      <Alert
        message="Error"
        description="Transaction failed due to error."
        type="error"
        showIcon
      />
    );
  } else {
    return null;
  }
}
