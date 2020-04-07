import { MESSAGE_TYPE } from './utils/constants'
import { mnemonicToSeedSync, validateMnemonic } from './wallet/mnemonic';
import Keystore from './wallet/keystore';
import Keychain from './wallet/keychain';

import { AccountExtendedPublicKey, ExtendedPrivateKey } from "./wallet/key";
import { AddressType, AddressPrefix } from './wallet/address';
import {getBalanceByPublicKey} from './balance';
import {sendSimpleTransaction} from './sendSimpleTransaction';
/**
 * Listen messages from popup
 */
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {

  if (request.messageType === MESSAGE_TYPE.IMPORT_MNEMONIC) {
    // call import mnemonic method
    const mnemonic = request.mnemonic.trim();
    const password = request.password.trim();
    const confirmPassword = request.confirmPassword.trim();

    if (password != confirmPassword) {
      // TODO
      // return err
    }

    //助剂词有效性的验证
    const isValidateMnemonic = validateMnemonic(mnemonic);
    console.log(isValidateMnemonic)
    if(!isValidateMnemonic){
      console.log('isValidateMnemonic: ', "Not a ValidateMnemonic");
      chrome.runtime.sendMessage(MESSAGE_TYPE.IS_NOT_VALIDATE_MNEMONIC);
      return;
    }

    // TODO
    // words 是否在助记词表中

    const seed = mnemonicToSeedSync(mnemonic)
    const masterKeychain = Keychain.fromSeed(seed)

    const extendedKey = new ExtendedPrivateKey(
      masterKeychain.privateKey.toString('hex'),
      masterKeychain.chainCode.toString('hex')
    )

    const keystore = Keystore.create(extendedKey, password);
    console.log("keystore=>",JSON.stringify(keystore));
    const accountKeychain = masterKeychain.derivePath(AccountExtendedPublicKey.ckbAccountPath);

    const accountExtendedPublicKey = new AccountExtendedPublicKey(
      accountKeychain.publicKey.toString('hex'),
      accountKeychain.chainCode.toString('hex'),
    )

    // 判断 AddressPrefix Mainnet=>Testnet
    const addrTestnet = accountExtendedPublicKey.address(AddressType.Receiving, 0, AddressPrefix.Testnet);
    const addrMainnet = accountExtendedPublicKey.address(AddressType.Receiving, 0, AddressPrefix.Mainnet);
    console.log('addrTestnet: ' + JSON.stringify(addrTestnet));

    const wallet = {
      keystore: keystore.toJson(),
      testnet: {
        address: addrTestnet.address,
        path: addrTestnet.path,
        pubKey: addrTestnet.publicKey
      },
      mainnet: {
        address: addrMainnet.address,
        path: addrMainnet.path,
        pubKey: addrMainnet.publicKey
      },
    }

    chrome.storage.sync.set({ wallet,}, () => {
      console.log('wallet is set to storage: ' + JSON.stringify(wallet));
    });

    chrome.runtime.sendMessage(MESSAGE_TYPE.VALIDATE_PASS)
  }

  if (request.messageType === MESSAGE_TYPE.REQUEST_ADDRESS_INFO) {
    chrome.storage.sync.get(['wallet'], function({ wallet }) {
      console.log('Wallet is ' + JSON.stringify(wallet));
      const message: any = {
        messageType: MESSAGE_TYPE.ADDRESS_INFO
      }
      if (wallet) {
        message.address = {
          testnet: wallet.testnet.address,
          mainnet: wallet.mainnet.address,
        }
      }
      console.log('message: ', message);

      chrome.runtime.sendMessage(message)
    });
  }

  // get balance by address
  if (request.messageType === MESSAGE_TYPE.REQUEST_BALANCE_BY_ADDRESS) {
    chrome.storage.sync.get(['wallet'], async function({ wallet }) {

      console.log('wallet ===> ' + JSON.stringify(wallet));

      let balance = ""
      if (wallet) {
        const publicKey = '0x' + wallet[request.network].pubKey;
        const capacityAll = await getBalanceByPublicKey(publicKey);
        balance = capacityAll.toString()
      }

      chrome.runtime.sendMessage({
        balance,
        messageType: MESSAGE_TYPE.BALANCE_BY_ADDRESS
      })
    });
  }

  //发送交易
  if (request.messageType === MESSAGE_TYPE.SEND_TX) {

    chrome.storage.sync.get(['wallet'], async function( {wallet} ) {

      //1- 从chrome.runtime.sendMessage({ ...values, messageType: MESSAGE_TYPE.SEND_TX })获取values的值
      const toAddress = request.address.trim();
      const amount = request.amount.trim();
      const fee = request.fee.trim();
      const password = request.password.trim();

      //keystore ===>masterKeychain
      console.log("wallet SendTx =>", wallet);

      const keystore = Keystore.fromJson(JSON.stringify(wallet.keystore)); //参数是String

      const masterPrivateKey = keystore.extendedPrivateKey(password)
      console.log("masterPrivateKey =>", masterPrivateKey);

      const masterKeychain = new Keychain(
        Buffer.from(masterPrivateKey.privateKey, 'hex'),
        Buffer.from(masterPrivateKey.chainCode, 'hex'),
      )

      const privateKey = '0x' + masterKeychain.derivePath(wallet['testnet'].path)
        .privateKey.toString('hex')

      const fromAddress = wallet['testnet'].address;

      const sendTxHash = await sendSimpleTransaction(
                                  privateKey,
                                  fromAddress,
                                  toAddress,
                                  BigInt(amount),
                                  BigInt(fee));

      console.log("sendTxHash=>", sendTxHash);

      // chrome.runtime.sendMessage({
      //   sendTxAmount: sendTxAmount,
      //   messageType: MESSAGE_TYPE.SEND_TX_BY_AMOUNT
      // })
    });

  }

});
