require('dotenv').config({path: __dirname + '/../../.env.test'})
const axios = require('axios')
const fs = require('fs')

const {wait1sec} = require('../../lib/src/testutils')
const IostTools = require('../../lib/src/IostTools')
const AppTools = require('../../lib/src/AppTools')
const assert = require('chai').assert

let contractId

const CONTRACT_NAME = 'app'

const iostTools = new IostTools(
  process.env.IOST_NODE_URL,
  process.env.IOST_CHAIN_ID,
  process.env.ADMIN_ACCOUNTNAME,
  process.env.ADMIN_SECKEY
)

let appTools

describe('#AppContract', function () {
  let contract, abi

  describe('#Deploy', function () {
    it('Load App contract from file', function () {
      contract = fs.readFileSync(__dirname + "/../../contracts/src/" + CONTRACT_NAME + '.js', {encoding: 'utf-8'})
      abi = fs.readFileSync(__dirname + "/../../contracts/src/" + CONTRACT_NAME + '.abi', {encoding: 'utf-8'})
    })

    it('Deploy App Contract', async () => {
      const result = await iostTools.deployContract(contract, abi)
      contractId = JSON.parse(result.pre_tx_receipt.returns[0])[0]
      assert(result.pre_tx_receipt.status_code === 'SUCCESS', 'Deploying contract failed with error: ' + result.pre_tx_receipt.message)

    })
  })

  describe('#Initialize AppTools', function () {
    it('Constructor', function () {
      appTools = new AppTools(
        iostTools,
        contractId
      )
      assert(appTools.contractId === contractId, 'ContractId should be set')
    })
  })

  describe('#hello', function () {
    const name = "John Smith"
    beforeEach(wait1sec)

    it('Call hello ', async function () {
      const output = await iostTools.sendTx(
        contractId,
        'hello',
        [name]
      )
      assert(output.pre_tx_receipt.status_code === 'SUCCESS', 'Calling hello failed with error: ' + output.pre_tx_receipt.message)

      await wait1sec()
      const registration = await appTools.getLastGreeting(name)
      assert(registration.datas[0] !== "null", 'unexpected results from hello')
    })
  })
})
