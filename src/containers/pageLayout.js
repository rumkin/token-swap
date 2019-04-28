import React from 'react';
import {Layout, Row, Col} from 'antd';

import {useApi} from '../hooks/api';
import MainMenu from './mainMenu';

const {Content, Footer} = Layout;

export default function PageLayout({children}) {
  const ethereum = useApi('ethereum');

  return (
    <Layout style={{backgroundColor: '#fff'}}>
      <div
        style={{
          borderBottom: '1px solid #e8e8e8',
        }}
      >
        <div className="container" style={{padding: '0 24px'}}>
          <Row>
            <Col span={12}>
              <MainMenu />
            </Col>
            <Col
              span={12}
              style={{
                textAlign: 'right',
                padding: '0 16px',
                lineHeight: '64px',
              }}
            >
              {ethereum.connected ? 'Connected' : 'Disconnected'}
            </Col>
          </Row>
        </div>
      </div>
      <Content className="container app-main topBox">{children}</Content>
      <div>
        <div className="container">
          <div className="topBox">
            &copy; <a href="https://rumk.in">Paul Rumkin</a>, 2019.
          </div>
        </div>
      </div>
    </Layout>
  );
}
