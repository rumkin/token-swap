import React from 'react';
import {Form, Input} from 'antd';

export function SwapSideForm({
  values: {token = '', output = '', amount = 0},
  onChange = () => {},
}) {
  const commit = () => {
    onChange({
      token,
      output,
      amount,
    });
  };

  return (
    <Form>
      <Form.Item label="Token" extra="Token address" colon={false}>
        <Input
          onChange={({target}) => {
            token = target.value;
            commit();
          }}
          value={token}
        />
      </Form.Item>
      <Form.Item
        label="Output"
        extra="Destination address for receiving tokens"
        colon={false}
      >
        <Input
          onChange={({target}) => {
            output = target.value;
            commit();
          }}
          value={output}
        />
      </Form.Item>
      <Form.Item label="Amount" extra="Amount of tokens to swap" colon={false}>
        <Input
          type="number"
          onChange={({target}) => {
            amount = parseInt(target.value, 10);
            commit();
          }}
          value={amount}
          min={1}
        />
      </Form.Item>
    </Form>
  );
}
