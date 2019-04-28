import React from 'react';
import {Table} from 'antd';
import moment from 'moment';

export function SwapScheduleTable({
  startDate = Date.now(),
  endDate = Date.now(),
  count = 0,
  amountA = 0,
  amountB = 0,
}) {
  let dataSource;

  if (count === 0) {
    dataSource = [];
  } else if (count === 1) {
    dataSource = [
      {
        key: 1,
        date: new Date(startDate),
        amountA: amountB,
        amountB: amountA,
      },
    ];
  } else {
    dataSource = new Array(count);
    const amountStep = 1 / count;
    const dateStep = Math.floor((endDate - startDate) / (count - 1));

    for (let i = 0; i < count; i++) {
      dataSource[i] = {
        key: i,
        date: startDate + i * dateStep,
        amountA: Math.floor(amountB - amountStep * amountB * (count - (1 + i))),
        amountB: Math.floor(amountA - amountStep * amountA * (count - (1 + i))),
      };
    }
  }

  return (
    <Table
      title={() => <strong>Payouts schedule</strong>}
      columns={[
        {
          title: 'Date',
          key: 'date',
          dataIndex: 'date',
          render: value => moment(value).format('lll'),
        },
        {
          title: 'Available amount (to A)',
          key: 'sideATokens',
          dataIndex: 'amountA',
          render: v => {
            if (v > 0) {
              return v.toLocaleString({
                maximumFractionDigits: 0,
              });
            } else {
              return '0';
            }
          },
        },
        {
          title: 'Available amount (to B)',
          key: 'sideBTokens',
          dataIndex: 'amountB',
          render: v => {
            if (v > 0) {
              return v.toLocaleString({
                maximumFractionDigits: 0,
              });
            } else {
              return '0';
            }
          },
        },
      ]}
      dataSource={dataSource}
      bordered
      pagination={false}
    />
  );
}
