export default [
  {
    constant: false,
    inputs: [
      {
        name: 'tokenA',
        type: 'address',
      },
      {
        name: 'outputA',
        type: 'address',
      },
      {
        name: 'amountA',
        type: 'uint256',
      },
      {
        name: 'tokenB',
        type: 'address',
      },
      {
        name: 'outputB',
        type: 'address',
      },
      {
        name: 'amountB',
        type: 'uint256',
      },
      {
        name: 'payoutStart',
        type: 'uint256',
      },
      {
        name: 'payoutEnd',
        type: 'uint256',
      },
      {
        name: 'payoutCount',
        type: 'uint256',
      },
    ],
    name: 'createSwap',
    outputs: [
      {
        name: '',
        type: 'address',
      },
    ],
    payable: false,
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        name: 'at',
        type: 'address',
      },
      {
        indexed: false,
        name: 'sideA',
        type: 'address',
      },
      {
        indexed: false,
        name: 'sideB',
        type: 'address',
      },
    ],
    name: 'SwapCreated',
    type: 'event',
  },
  {
    constant: true,
    inputs: [
      {
        name: 'token',
        type: 'address',
      },
    ],
    name: 'countTokenSwaps',
    outputs: [
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
    constant: true,
    inputs: [
      {
        name: 'token',
        type: 'address',
      },
      {
        name: 'i',
        type: 'uint256',
      },
    ],
    name: 'getTokenSwapByIndex',
    outputs: [
      {
        name: '',
        type: 'address',
      },
    ],
    payable: false,
    stateMutability: 'view',
    type: 'function',
  },
];
