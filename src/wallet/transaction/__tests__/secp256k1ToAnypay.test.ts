import { BN } from 'bn.js';
import { addressToScript } from '@keyper/specs';
import CKB from '@nervosnetwork/ckb-sdk-core';
import { getUnspentCells } from '@utils/apis';
import { createRawTx } from '../txGenerator';
import { configService } from '../../../config';
import { bobAddresses, aliceAddresses } from '../../../test/fixture/address';
import { secp256k1Dep } from '../../../test/fixture/deps';

jest.mock('@utils/apis');

describe('Transaction test', () => {
  const ckb = new CKB(configService.CKB_RPC_ENDPOINT);

  it('send transaction from secp256k1 to anypay', async () => {
    const { privateKey } = bobAddresses;
    const fromAddress = bobAddresses.secp256k1.address;
    const toAddress = aliceAddresses.anyPay.address;

    const lock = addressToScript(fromAddress);
    const toLock = addressToScript(toAddress);
    const toAmount = new BN(11100000000);
    const fee = new BN(100000000);
    const totalConsumed = toAmount.add(fee);

    const deps = [secp256k1Dep];

    const lockHash = bobAddresses.secp256k1.lock;
    const params = {
      capacity: toAmount,
    };
    const unspentCells = await getUnspentCells(lockHash, params);
    function getTotalCapity(total, cell) {
      return BigInt(total) + BigInt(cell.capacity);
    }
    const totalCapity = unspentCells.reduce(getTotalCapity, 0);

    const cells = {
      cells: unspentCells,
      total: new BN(totalCapity),
    };

    const signObj = createRawTx(toAmount, toLock, cells, lock, deps, fee);
    console.log('--- rawTx ---', JSON.stringify(signObj));

    const signedTx = ckb.signTransaction(privateKey)(signObj.tx, []);
    const realTxHash = await ckb.rpc.sendTransaction(signedTx);
    console.log('realTxHash =>', JSON.stringify(realTxHash));
  });
});
