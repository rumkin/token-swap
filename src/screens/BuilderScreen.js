import React, {useState} from 'react';
import {Modal, Button} from 'antd';
import moment from 'moment';
import copy from 'clipboard-copy';

import PageLayout from '../containers/pageLayout';
import NavLink from '../components/NavLink';
import {SwapBuilder} from '../components/swaps/builder';
import {TransactionPreview} from '../components/ethereum/TransactionPreview';
import {TransactionProgress} from '../components/ethereum/TransactionProgress';

import {useLock} from '../hooks/history';
import {useApi} from '../hooks/api';
import {useTransaction} from '../hooks/ethereum';

// FIXME Uncomment
// const initialState = {
//   sideA: {
//     token: '0x' + '0'.repeat(39) + '1',
//     output: '0x' + '0'.repeat(39) + '1',
//     amount: 1,
//   },
//   sideB: {
//     token: '0x' + '0'.repeat(39) + '1',
//     output: '0x' + '0'.repeat(39) + '1',
//     amount: 1,
//   },
//   payouts: {
//     startDate: undefined,
//     endDate: undefined,
//     count: 1,
//   },
// };

const initialState = {
  sideA: {
    token: '0x' + '0'.repeat(39) + '1',
    output: '0x' + '0'.repeat(39) + '1',
    amount: 1,
  },
  sideB: {
    token: '0x' + '0'.repeat(39) + '1',
    output: '0x' + '0'.repeat(39) + '1',
    amount: 1,
  },
  payouts: {
    startDate: moment()
      .startOf('day')
      .add(1, 'days')
      .valueOf(),
    endDate: moment()
      .startOf('day')
      .add(1, 'days')
      .valueOf(),
    count: 1,
  },
};

export default function BuilderScreen() {
  const abiEncoder = useApi('abiEncoder');
  const ethereum = useApi('ethereum');

  // Set builder screen status: undefined, 'ready', 'sending' or 'done'
  const [state, setState] = useState();
  const [form, setForm] = useState(initialState);
  const [isFormChanged, setFormChanged] = useState(false);
  const [txData, setTxData] = useState();
  const [tx, setTx] = useState();
  const txState = useTransaction(tx);

  useLock('All changes will be lost. Are you sure?', isFormChanged);

  return (
    <PageLayout>
      <h1>Swap Builder</h1>

      <SwapBuilder
        data={form}
        update={newForm => {
          setForm(newForm);
          setFormChanged(true);
        }}
        reset={
          isFormChanged
            ? () => {
                setForm(initialState);
                setFormChanged(false);
              }
            : null
        }
        complete={() => {
          setState('ready');
          setTxData(
            abiEncoder([
              form.sideA.token,
              form.sideA.output,
              String(form.sideA.amount),
              form.sideB.token,
              form.sideB.output,
              String(form.sideB.amount),
              String(form.payouts.startDate),
              String(form.payouts.endDate),
              String(form.payouts.count),
            ]),
          );
        }}
      />

      {state && (
        <Modal
          key="transaction"
          title="Transaction"
          visible={true}
          okText="Send"
          okButtonProps={{
            disabled: !ethereum.connected,
          }}
          onOk={() => {
            setState('sending');
            setTx(
              ethereum.sendTransaction(
                {
                  from: ethereum.accounts[0],
                  to: '0xe0f93b0aaca34cef329d5ed2d42ce1532cb44f37',
                  value: '0',
                  data: txData,
                },
                'SwapRegistry',
              ),
            );
          }}
          onCancel={() => {
            setState();
          }}
        >
          <TransactionPreview
            to="0xe0f93b0aaca34cef329d5ed2d42ce1532cb44f37"
            data={txData}
            accounts={ethereum.accounts}
          />
        </Modal>
      )}
      {state === 'sending' && txState && (
        <Modal
          key="sending"
          title="Transaction"
          visible={true}
          footer={
            txState.isDone ? (
              <Button
                onClick={() => {
                  setTx();
                  setState();
                }}
              >
                Close
              </Button>
            ) : null
          }
          onCancel={
            txState.isDone
              ? () => {
                  setTx();
                  setState();
                }
              : null
          }
          closable={txState.isDone ? true : false}
        >
          <TransactionProgress state={txState} />
          {txState.status === 'accepted' && (
            <SwapReceipt receipt={txState.receipt} />
          )}
        </Modal>
      )}
    </PageLayout>
  );
}

function SwapReceipt({receipt}) {
  const nav = useApi('nav');
  const address = receipt.events.SwapCreated[0].at;
  return (
    <div>
      <dl>
        <dt>Contract address</dt>
        <dd>
          <NavLink target="contract" params={{address}}>
            {address}
          </NavLink>
          <Button icon="copy" onClick={() => copy(address)} />
        </dd>
        <dt>Link</dt>
        <dd>
          <NavLink target="contract" params={{address}} />
          <Button
            icon="copy"
            onClick={() => copy(nav.contract.toUrl({address}))}
          />
        </dd>
      </dl>
    </div>
  );
}
