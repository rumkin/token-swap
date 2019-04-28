import React from 'react';
import {Card, Icon, Button} from 'antd';

import {Row, Col} from '../Grid';

import {SwapSideForm} from './sideForm';
import {SwapPayoutsForm} from './payoutsForm';
import {SwapScheduleTable} from './scheduleTable';

export function SwapBuilder({
  data: {sideA, sideB, payouts},
  update,
  reset = null,
  complete,
}) {
  const commit = () => {
    update({
      sideA,
      sideB,
      payouts,
    });
  };

  return (
    <>
      <Row gutter={8}>
        <Col mobile={24} tablet={24} desktop={12} style={{marginBottom: '8px'}}>
          <Card
            title={
              <>
                <Icon type="swap-right" /> Side A
              </>
            }
          >
            <SwapSideForm
              values={sideA}
              onChange={data => {
                sideA = data;
                commit();
              }}
            />
          </Card>
        </Col>
        <Col mobile={24} tablet={24} desktop={12} style={{marginBottom: '8px'}}>
          <Card
            title={
              <>
                <Icon type="swap-left" /> Side B
              </>
            }
          >
            <SwapSideForm
              values={sideB}
              onChange={data => {
                sideB = data;
                commit();
              }}
            />
          </Card>
        </Col>
      </Row>
      <Card
        title={
          <>
            <Icon type="schedule" /> Payouts
          </>
        }
        style={{marginBottom: '8px'}}
      >
        <Row gutter={8}>
          <Col
            mobile={24}
            tablet={24}
            desktop={8}
            style={{marginBottom: '8px'}}
          >
            <SwapPayoutsForm
              values={payouts}
              onChange={data => {
                payouts = data;
                commit();
              }}
            />
          </Col>
          <Col
            mobile={24}
            tablet={24}
            desktop={16}
            style={{marginBottom: '8px'}}
          >
            <SwapScheduleTable
              startDate={payouts.startDate}
              endDate={payouts.endDate}
              count={payouts.count}
              amountA={sideA.amount}
              amountB={sideB.amount}
            />
          </Col>
        </Row>
      </Card>
      <Row>
        <Col span={24} style={{textAlign: 'right', marginBottom: '8px'}}>
          <Button
            onClick={reset}
            disabled={!reset}
            style={{marginRight: '8px'}}
          >
            Reset
          </Button>
          <Button onClick={complete} type="primary">
            Prepare transaction...
          </Button>
        </Col>
      </Row>
    </>
  );
}
