import React from 'react';
import {Form, DatePicker, Input} from 'antd';
import moment from 'moment';

const tomorrow = () =>
  moment()
    .startOf('day')
    .add(1, 'days')
    .valueOf();

export function SwapPayoutsForm({
  values: {startDate = tomorrow(), endDate = tomorrow(), count},
  onChange = () => {},
}) {
  const commit = () => {
    onChange({
      startDate,
      endDate,
      count,
    });
  };

  return (
    <Form>
      <Form.Item
        labelCol={{span: 24}}
        wrapperCol={{span: 24}}
        colon={false}
        label="Start date"
        extra="Date of first payout"
      >
        <DatePicker
          value={moment(startDate)}
          onChange={date => {
            if (date === null) {
              startDate = Date.now;
            } else {
              startDate = date.startOf('day').valueOf();
            }

            if (endDate === startDate) {
              count = 1;
            } else if (count < 2) {
              count = 2;
            }

            commit();
          }}
        />
      </Form.Item>
      <Form.Item
        labelCol={{span: 24}}
        wrapperCol={{span: 24}}
        colon={false}
        label="End date"
        extra="Date of last payout"
      >
        <DatePicker
          value={moment(endDate)}
          onChange={date => {
            if (date === null) {
              endDate = startDate;
            } else {
              endDate = date.startOf('day').valueOf();
            }

            if (endDate === startDate) {
              count = 1;
            } else if (count < 2) {
              count = 2;
            }
            commit();
          }}
        />
      </Form.Item>

      <Form.Item
        labelCol={{span: 24}}
        wrapperCol={{span: 24}}
        colon={false}
        label="Count"
        extra="Number of payouts"
      >
        <Input
          type="number"
          min={1}
          max={100}
          value={count}
          onChange={({target}) => {
            if (endDate !== startDate) {
              count = parseInt(target.value, 10);
            } else {
              count = 1;
            }

            commit();
          }}
        />
      </Form.Item>
    </Form>
  );
}
