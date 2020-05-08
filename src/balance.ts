import Address, { AddressType, publicKeyToAddress, AddressPrefix } from './wallet/address';
import loadCells from './wallet/balance/loadCells';
import { Ckb } from './utils/constants';

const CKB = require('@nervosnetwork/ckb-sdk-core').default;
const ckb = new CKB(Ckb.remoteRpcUrl);

export const getBalanceByPublicKey = async (publicKey) => {
  const publicKeyHash = `0x${ckb.utils.blake160(publicKey, 'hex')}`;

  await ckb.loadSecp256k1Dep();
  const lockHash = ckb.generateLockHash(publicKeyHash, ckb.config.secp256k1Dep);

  const tipBlockNumber = await ckb.rpc.getTipBlockNumber();

  const cells = await loadCells({
    lockHash: lockHash,
    start: BigInt(30000),
    end: tipBlockNumber,
    STEP: '0x64',
    rpc: ckb.rpc,
  });

  let capacityAll = BigInt(0);
  for (let cell of cells) {
    capacityAll = capacityAll + BigInt(cell.capacity);
  }

  return BigInt(capacityAll);
};

export const getlockHash = async (publicKey) => {
  const publicKeyHash = `0x${ckb.utils.blake160(publicKey, 'hex')}`;

  await ckb.loadSecp256k1Dep();
  const lockHash = ckb.generateLockHash(publicKeyHash, ckb.config.secp256k1Dep);
  return lockHash;
};

export const getBalanceByLockHash = async (lockHash) => {
  const tipBlockNumber = await ckb.rpc.getTipBlockNumber();

  const cells = await loadCells({
    lockHash: lockHash,
    start: BigInt(30000),
    end: tipBlockNumber,
    STEP: '0x64',
    rpc: ckb.rpc,
  });

  let capacityAll = BigInt(0);
  for (let cell of cells) {
    capacityAll = capacityAll + BigInt(cell.capacity);
  }

  return BigInt(capacityAll);
};
