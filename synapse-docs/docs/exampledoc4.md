---
id: doc4
title: API
sidebar_label: API
---

## 目录

> 本文档参数更新有延迟，如有出入请以最新代码为准

- [`address`](#address)

  - [`/address/{lockHash}`](#/address/{lockHash})

- [`cell`](#cell)
  - [`/cell/getUnspentCells`](#/cell/getUnspentCells)
  - [`/cell/getCellsByLockHashAndTypeScriptss`](#/cell/getCellsByLockHashAndTypeScripts)
  - [`/cell/getTxHistoriesByLockHash`](#/cell/getTxHistoriesByLockHash)
  - [`/cell/getUnspentCapacity`](#/cell/getUnspentCapacity)

## Address

---

### `/address/{lockHash}`

Returns the address info of by lockHash.

#### 调用示例

- 请求方式: Get

```bash
curl -X GET http://{localhost:port}/address/0x98ddfc5f3e0836ee1bda3ebef2f0156abb74b632dc9c6a412dce53a13e4c6fdb

```

```json
{
  "errCode": 0,
  "errMsg": "",
  "data": {
    "capacity": "499989999000"
  }
}
```

## Cell

---

### `/cell/getUnspentCells`

Returns unspentCells by search params.

#### 调用示例

- 请求方式: Get

```bash

curl -X GET "http://{localhost:port}/cell/getUnspentCells?lockHash=0x5d67b4eeb98698535f76f1b34a77d852112a35072eb6b834cb4cc8868ac02fb2&status=live&limit=10&hasData=true"

```

```json
{
  "errCode": 0,
  "errMsg": "",
  "data": [
    {
      "blockHash": "0x15a9c2420d561603a0146b0a687d0b7969af68a999cc110f161ff087ecb93c4f",
      "lock": {
        "codeHash": "0x9bd7e06f3ecf4be0f2fcd2188b23f1b9fcc88e5d4b65a8637b17723bbda3cce8",
        "hashType": "type",
        "args": "0x9b84887ab2ea170998cff9895675dcd29cd26d4d"
      },
      "lockHash": "0x5d67b4eeb98698535f76f1b34a77d852112a35072eb6b834cb4cc8868ac02fb2",
      "outPoint": {
        "txHash": "0x225b836c15ec5892ce888f2670cb0897880b392caaf16bd89b77847c3b2439fa",
        "index": "0x0"
      },
      "outputData": "0x11",
      "outputDataLen": "0x1",
      "capacity": "0x2540be400",
      "type": {
        "codeHash": null,
        "hashType": null,
        "args": null
      },
      "typeHash": null,
      "dataHash": "0xd81488bff2b05b434abf93c4e604235ada1850a9165f579a7069bcb0f4d9f574",
      "status": "live"
    },
    {
      "blockHash": "0x9c50c8ce9f5a3cb0d0b535e16333d1e1afdff52abcb254dc6b3147f054e793c3",
      "lock": {
        "codeHash": "0x9bd7e06f3ecf4be0f2fcd2188b23f1b9fcc88e5d4b65a8637b17723bbda3cce8",
        "hashType": "type",
        "args": "0x9b84887ab2ea170998cff9895675dcd29cd26d4d"
      },
      "lockHash": "0x5d67b4eeb98698535f76f1b34a77d852112a35072eb6b834cb4cc8868ac02fb2",
      "outPoint": {
        "txHash": "0xb131ddd29ad63788763b598cabba9a7df23b2dee8f787bed6adcb0ffa7e82415",
        "index": "0x0"
      },
      "outputData": "0x73796e61707365",
      "outputDataLen": "0x7",
      "capacity": "0x1954fc400",
      "type": {
        "codeHash": null,
        "hashType": null,
        "args": null
      },
      "typeHash": null,
      "dataHash": "0xf276b360de7dc210833e8efb1f19927ecd8ff89e94c72d29dc20813fe8368564",
      "status": "live"
    }
  ]
}
```

### `/cell/getTxHistoriesByLockHash`

Returns transaction list by lockHash.

#### 调用示例

- 请求方式: Get

```bash

curl 'http://{localhost:port}/cell/getTxHistoriesByLockHash' \
  -H 'Connection: keep-alive' \
  -H 'Accept: application/json, text/plain, */*' \
  -H 'User-Agent: Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/83.0.4103.116 Safari/537.36' \
  -H 'Content-Type: application/json;charset=UTF-8' \
  -H 'Origin: chrome-extension://dbcnhckpjnneichbndfmapdohnpleomb' \
  -H 'Accept-Language: zh-CN,zh;q=0.9,en;q=0.8' \
  --data-binary '{"lockHash":"0x5d67b4eeb98698535f76f1b34a77d852112a35072eb6b834cb4cc8868ac02fb2"}' \
  --compressed \
  --insecure

```

```json
{
  "errCode": 0,
  "errMsg": "",
  "data": [
    {
      "hash": "0xfbe8560611786f34c2d557878f58210e37db9f53dc4f19b5409d4ccde7cc30f7",
      "blockNum": 205980,
      "timestamp": 1594370369036,
      "inputs": [
        {
          "capacity": 971599900000,
          "lockHash": "0x5d67b4eeb98698535f76f1b34a77d852112a35072eb6b834cb4cc8868ac02fb2",
          "lockCodeHash": "0x9bd7e06f3ecf4be0f2fcd2188b23f1b9fcc88e5d4b65a8637b17723bbda3cce8",
          "lockArgs": "0x9b84887ab2ea170998cff9895675dcd29cd26d4d",
          "lockHashType": "type"
        }
      ],
      "outputs": [
        {
          "capacity": 11500000000,
          "lockHash": "0xf1990f2110ea1d510a3298bad00dfae6f64fcb5f5e5e29ecfc645d4e85dc9342",
          "lockCodeHash": "0x9bd7e06f3ecf4be0f2fcd2188b23f1b9fcc88e5d4b65a8637b17723bbda3cce8",
          "lockArgs": "0xbc76e06a53193d3cb2fd0eb331237cb021fe39ea",
          "lockHashType": "type"
        },
        {
          "capacity": 960099890000,
          "lockHash": "0x5d67b4eeb98698535f76f1b34a77d852112a35072eb6b834cb4cc8868ac02fb2",
          "lockCodeHash": "0x9bd7e06f3ecf4be0f2fcd2188b23f1b9fcc88e5d4b65a8637b17723bbda3cce8",
          "lockArgs": "0x9b84887ab2ea170998cff9895675dcd29cd26d4d",
          "lockHashType": "type"
        }
      ],
      "fee": 10000,
      "amount": 11500010000,
      "income": false
    },
    {
      "hash": "0xfb6b9c673a4504f1ec7a9a06e8c49f01957a15cac27bc2fc821828281f16894c",
      "blockNum": 205968,
      "timestamp": 1594369787414,
      "inputs": [
        {
          "capacity": 982999910000,
          "lockHash": "0x5d67b4eeb98698535f76f1b34a77d852112a35072eb6b834cb4cc8868ac02fb2",
          "lockCodeHash": "0x9bd7e06f3ecf4be0f2fcd2188b23f1b9fcc88e5d4b65a8637b17723bbda3cce8",
          "lockArgs": "0x9b84887ab2ea170998cff9895675dcd29cd26d4d",
          "lockHashType": "type"
        }
      ],
      "outputs": [
        {
          "capacity": 11400000000,
          "lockHash": "0xf1990f2110ea1d510a3298bad00dfae6f64fcb5f5e5e29ecfc645d4e85dc9342",
          "lockCodeHash": "0x9bd7e06f3ecf4be0f2fcd2188b23f1b9fcc88e5d4b65a8637b17723bbda3cce8",
          "lockArgs": "0xbc76e06a53193d3cb2fd0eb331237cb021fe39ea",
          "lockHashType": "type"
        },
        {
          "capacity": 971599900000,
          "lockHash": "0x5d67b4eeb98698535f76f1b34a77d852112a35072eb6b834cb4cc8868ac02fb2",
          "lockCodeHash": "0x9bd7e06f3ecf4be0f2fcd2188b23f1b9fcc88e5d4b65a8637b17723bbda3cce8",
          "lockArgs": "0x9b84887ab2ea170998cff9895675dcd29cd26d4d",
          "lockHashType": "type"
        }
      ],
      "fee": 10000,
      "amount": 11400010000,
      "income": false
    }
  ]
}
```

### `/cell/getCellsByLockHashAndTypeScripts`

Returns cells information by lockHash and typeScripts.

#### 调用示例

- 请求方式: Get

```bash

curl 'http://{localhost:port}/cell/getCellsByLockHashAndTypeScripts' \
  -H 'Connection: keep-alive' \
  -H 'Accept: application/json, text/plain, */*' \
  -H 'User-Agent: Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/83.0.4103.116 Safari/537.36' \
  -H 'Content-Type: application/json;charset=UTF-8' \
  -H 'Origin: chrome-extension://dbcnhckpjnneichbndfmapdohnpleomb' \
  -H 'Accept-Language: zh-CN,zh;q=0.9,en;q=0.8' \
  --data-binary '{"lockHash":"0x5d67b4eeb98698535f76f1b34a77d852112a35072eb6b834cb4cc8868ac02fb2"}' \
  --compressed \
  --insecure

```

```json
{
  "errCode": 0,
  "errMsg": "",
  "data": {
    "udts": [
      {
        "typeHash": null,
        "capacity": "6800000000",
        "outputdata": "0x73796e61707365",
        "type": null
      },
      {
        "typeHash": null,
        "capacity": "6800000000",
        "outputdata": "0x73796e61707365",
        "type": null
      },
      {
        "typeHash": null,
        "capacity": "6800000000",
        "outputdata": "0x73796e61707365",
        "type": null
      }
    ],
    "capacity": "980099890000"
  }
}
```

### `/cell/getUnspentCapacity/`

Returns unspent cells total capacity.

#### 调用示例

- 请求方式: Get

```bash

curl 'http://{localhost:port}/cell/getUnspentCapacity/?lockHash=0x5d67b4eeb98698535f76f1b34a77d852112a35072eb6b834cb4cc8868ac02fb2' \
  -H 'Connection: keep-alive' \
  -H 'Accept: application/json, text/plain, */*' \
  -H 'User-Agent: Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/83.0.4103.116 Safari/537.36' \
  -H 'Accept-Language: zh-CN,zh;q=0.9,en;q=0.8' \
  -H 'If-None-Match: W/"2f-7iI6o5IGuSHO2rbWv3gBX4hNBBs"' \
  --compressed \
  --insecure

```

```json
{
  "errCode": 0,
  "errMsg": "",
  "data": "980099890000"
}
```
