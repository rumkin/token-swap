import React from 'react';
import {Menu} from 'antd';

import NavLink from '../components/NavLink';
import {useRouter} from '../hooks/router';

export default function MainMenu() {
  const [screen] = useRouter();
  const items = [
    {
      target: 'home',
      label: 'Home',
    },
    {
      target: 'builder',
      label: 'New Swap',
    },
  ];

  return (
    <Menu
      mode="horizontal"
      selectable={false}
      defaultSelectedKeys={[screen]}
      style={{lineHeight: '64px', borderBottom: '0px'}}
    >
      {items.map(item => (
        <Menu.Item key={item.target}>
          <NavLink target={item.target} params={item.params}>
            {item.label}
          </NavLink>
        </Menu.Item>
      ))}
    </Menu>
  );
}
