import React from 'react';

import SimpleLayout from '../containers/simpleLayout';

export default function ErrorScreen({children}) {
  return (
    <SimpleLayout>
      <h1>Oooops!..</h1>
      {React.Children.count(children) > 0 ? (
        children
      ) : (
        <p>Something went totally wrong!</p>
      )}
    </SimpleLayout>
  );
}
