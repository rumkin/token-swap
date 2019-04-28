import React from 'react';

import NavLink from '../NavLink';

export default function SwapReceipt({receipt}) {
  return (
    <div>
      <dl>
        <dt>Swap Contract Address</dt>
        <dd>{receipt.events.SwapCreated[0].at}</dd>
      </dl>
    </div>
  );
}
