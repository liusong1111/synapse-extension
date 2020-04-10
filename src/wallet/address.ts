import { AddressPrefix, AddressType as Type, pubkeyToAddress } from '@nervosnetwork/ckb-sdk-utils'
import * as ckbUtils from '@nervosnetwork/ckb-sdk-utils'
import { AccountExtendedPublicKey } from './key'
import { Ckb } from '../utils/constants'

export { AddressPrefix }

export enum AddressType {
  Receiving = 0, // External chain
  Change = 1, // Internal chain
}

export const publicKeyToAddress = (publicKey: string, prefix = AddressPrefix.Testnet) => {
  const pubkey = publicKey.startsWith('0x') ? publicKey : `0x${publicKey}`
  return pubkeyToAddress(pubkey, {
    prefix,
    type: Type.HashIdx,
    codeHashOrCodeHashIndex: '0x00',
  })
}

export default class Address {
  publicKey?: string
  address: string
  path: string // BIP44 path
  blake160: string

  constructor(address: string, path: string = Address.pathForReceiving(0), blake160: string = "") {
    this.address = address
    this.path = path
    this.blake160= blake160
  }

  public static fromPublicKey = (publicKey: string, path: string, prefix: AddressPrefix = AddressPrefix.Testnet) => {
    const address = publicKeyToAddress(publicKey, prefix)
    const instance = new Address(address, path)
    instance.publicKey = publicKey
    return instance
  }

  public static pathFor = (type: AddressType, index: number) => {
    return `${AccountExtendedPublicKey.ckbAccountPath}/${type}/${index}`
  }

  public static pathForReceiving = (index: number) => {
    return Address.pathFor(AddressType.Receiving, index)
  }

  public static pathForChange = (index: number) => {
    return Address.pathFor(AddressType.Change, index)
  }

  public static toBlake160 = (publicKey: string) => {
    const val = ckbUtils.blake160(publicKey)
    return val
  }

  public getBlake160 = () => {
    const val = "0x"+ ckbUtils.blake160("0x" + this.publicKey, "hex")
    return val
  }

  public publicKeyHash = () => {
    return this.getBlake160()
  }
}
