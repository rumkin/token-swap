export default [
  {
    constant: true,
    inputs: [],
    name: 'getData',
    outputs: [
      {
        name: '',
        type: 'address',
      },
      {
        name: '',
        type: 'address',
      },
      {
        name: '',
        type: 'uint256',
      },
      {
        name: '',
        type: 'address',
      },
      {
        name: '',
        type: 'address',
      },
      {
        name: '',
        type: 'uint256',
      },
      {
        name: '',
        type: 'uint256',
      },
      {
        name: '',
        type: 'uint256',
      },
      {
        name: '',
        type: 'uint256',
      },
    ],
    payable: false,
    stateMutability: 'view',
    type: 'function',
  },
  {
    constant: false,
    inputs: [],
    name: 'chargebackB',
    outputs: [],
    payable: false,
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    constant: false,
    inputs: [],
    name: 'chargebackA',
    outputs: [],
    payable: false,
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        name: '_tokenA',
        type: 'address',
      },
      {
        name: '_outputA',
        type: 'address',
      },
      {
        name: '_amountA',
        type: 'uint256',
      },
      {
        name: '_tokenB',
        type: 'address',
      },
      {
        name: '_outputB',
        type: 'address',
      },
      {
        name: '_amountB',
        type: 'uint256',
      },
      {
        name: '_payoutStart',
        type: 'uint256',
      },
      {
        name: '_payoutEnd',
        type: 'uint256',
      },
      {
        name: '_payoutCount',
        type: 'uint256',
      },
    ],
    payable: false,
    stateMutability: 'nonpayable',
    type: 'constructor',
  },
];
