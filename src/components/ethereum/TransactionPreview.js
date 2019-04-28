import React from 'react';
import {Button, Tooltip, message, Select} from 'antd';
import copy from 'clipboard-copy';

const {Option} = Select;

function CopyButton({value, tooltip}) {
  const btn = (
    <Button
      shape="circle"
      icon="copy"
      size="small"
      onClick={() => {
        copy(value);
        message.success('Value copied', 2);
      }}
    />
  );

  return tooltip ? <Tooltip title={tooltip}>{btn}</Tooltip> : btn;
}

export function TransactionPreview({to, data = '', accounts = []}) {
  return (
    <dl>
      <dt>Network</dt>
      <dd>
        <Select defaultValue={1} style={{minWidth: '100px'}}>
          <Option value={1}>Main</Option>
          <Option value={2}>Ropsten</Option>
          <Option value={4}>Kovan</Option>
          <Option value={4}>Rinkeby</Option>
        </Select>
      </dd>
      <dt>From</dt>
      <dd>
        {accounts.length ? (
          <Select defaultValue={accounts[0]} style={{minWidth: '100px'}}>
            {accounts.map((account, i) => (
              <Option key={account} value={account}>
                {account}
              </Option>
            ))}
          </Select>
        ) : (
          'No accounts'
        )}
      </dd>
      <dt>
        To <CopyButton value={to} />
      </dt>
      <dd>{to}</dd>
      <dt>
        Amount <CopyButton tooltip="Copy value in weis" />
      </dt>
      <dd>0 Ethers</dd>
      <dt>
        Transaction data <CopyButton value={data} />
      </dt>
      <dd>
        <code
          style={{
            overflowWrap: 'break-word',
            display: 'block',
            maxHeight: '300px',
            overflowY: 'auto',
          }}
        >
          {data}
        </code>
      </dd>
    </dl>
  );
}
