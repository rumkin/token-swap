export const byName = {
  mainnet: 1,
  ropsten: 2,
  kovan: 3,
  rinkeby: 4,
};

export const byId = {
  1: 'mainnet',
  2: 'ropsten',
  3: 'kovan',
  4: 'rinkeby',
};

export function getName(chainId) {
  return byName[chainId] || chainId;
}
