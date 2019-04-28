import React from 'react';

import NavLink from './NavLink';

export default function NavMenu({
  menu = 'nav',
  menuProps = {},
  item = 'span',
  itemProps = {},
  selectedItemProps = {},
  items = [],
  selectedItem,
}) {
  return React.createElement(
    menu,
    menuProps,
    items.map(({target, params, label}) =>
      React.createElement(
        item,
        {
          ...(target === selectedItem ? selectedItemProps : itemProps),
          key: target,
        },
        <NavLink target={target} params={params}>
          {label}
        </NavLink>,
      ),
    ),
  );
}
