import React from 'react';

import NavMenu from '../components/NavMenu';

export default function SimpleLayout({children}) {
  return (
    <>
      <header>
        <div className="container topBox">
          <NavMenu
            menuProps={{
              style: {display: 'inline-block'},
            }}
            itemProps={{
              style: {marginRight: '8px'},
            }}
            items={[
              {
                target: 'home',
                label: 'Home',
              },
            ]}
          />
        </div>
      </header>
      <main>
        <div className="container topBox">{children}</div>
      </main>
      <footer>
        <div className="container topBox">
          &copy; <a href="https://rumk.in">Paul Rumkin</a>, 2019.
        </div>
      </footer>
    </>
  );
}
