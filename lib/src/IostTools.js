const bs58 = require('bs58')
const IOST =require( 'iost')
const axios = require('axios')

module.exports = class IostTools{
  constructor(nodeUrl, chainId, accountName, secKey) {
    this.chainId = chainId
    this.nodeUrl = nodeUrl
    this.sdk = new IOST.IOST({
      gasRatio: 1,
      gasLimit: 4000000,
      delay:0,
    });

    this.sdk.setRPC(new IOST.RPC(new IOST.HTTPProvider(nodeUrl)))

    const account = new IOST.Account(accountName)
    const kp = new IOST.KeyPair(bs58.decode(secKey))

    account.addKeyPair(kp, "owner")
    account.addKeyPair(kp, "active")

    this.sdk.setAccount(account)
    this.sdk.account = account

  }
  async getAccount(accountName){
    const output = await axios({
      baseURL: this.nodeUrl,
      method: 'get',
      url: '/getAccount/' + accountName + '/1',
    })
    return output.data
  }

  async pledgeGas(from, to, amount){
    const data = [from, to, amount]
    let result
    try{
      result = await this.sendTx('gas.iost', 'pledge', data, amount)
    }catch(err){
      result = err.message
    }
    return result
  }
  async buyRam(from, to, amount){
    const data = [from, to, amount]
    let result
    try{
      result = await this.sendTx('ram.iost', 'buy', data, amount)
    }catch(err){
      result = err.message
    }
    return result
  }
  async send(from, to, amount, memo){
    const data = ['iost', from, to, amount, memo]
    let result
    try{
      result = await this.sendTx('token.iost', 'transfer', data, amount)
    }catch(err){
      result = err.message
    }
    return result
  }
  sendTx(address, abi, args, approvedAmount=0){

    let tx = this.sdk.callABI(address, abi, args)
    if(approvedAmount>0){
      tx.addApprove("iost", Number.parseInt(approvedAmount))
    }

    tx.setChainID(this.chainId)
    this.sdk.account.signTx(tx)

    return this.sdk.currentRPC.transaction.sendTx(tx)
  }

  async deployContract(contractJson, abiJson, contractId = ''){
    var result
    const data = {
      ID: contractId,
      Code: contractJson,
      Info: JSON.parse(abiJson)
    }

    const action = contractId.length >0?"updateCode": 'setCode'

    try{
      result = await this.sendTx("system.iost", action, [JSON.stringify(data)])
    }catch(err){
      result = err.message
    }
    return result
  }

// https://testnet.explorer.iost.io/api/account/champ_admin/txs
// https://testnet.explorer.iost.io/api/tx/F8Np5fKyu3LVitc5vNXWRaMwa8UcaidC4twnUZbdd8Qc
   async getTransactionsForAccount (accountName) {
    const output = await axios({
      baseURL: 'https://testnet.explorer.iost.io',
      method: 'get',
      url: '/api/account/' + accountName + '/txs',
    })

    return output.data.data.txnList
  }

  async getTransactionByHash (txHash) {
    const output = await axios({
      baseURL: this.nodeUrl,
      method: 'get',
      url: '/getTxByHash/' + txHash,
    })

    return output.data.transaction
  }

  /**
   *
   * @param accountName
   * @param txMatcher
   * @param txDetailMatcher
   * @returns {Promise<Array>}
   * @example
   findTransactionsBy(
   "champ_admin",
   async tx =>
   tx.to === CONTRACT && tx.gasUsed > 35000 && tx.gasUsed < 50000,
   async tx =>
   tx.input.indexOf(HEX) > -1
   ).then((result) => {
      console.log('Inner Hex ', result)
  })
   */
  async findTransactionsBy (accountName, txMatcher, txDetailMatcher = null) {
    const txs = await this.getTransactionsForAccount(accountName)
    let result = []

    if(txs === null) return result
    for(let tx of txs){
      if(await txMatcher(tx)){
        if(txDetailMatcher !== null){
          const innerTx = await this.getTransactionByHash(tx.hash)
          if(await txDetailMatcher(innerTx)) result.push(innerTx)
        }else{
          result.push(tx)
        }
      }
    }

    return result
  }
}
