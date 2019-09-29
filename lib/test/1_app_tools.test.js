const ENVPATH = __dirname + '/../../.env.test'
require('dotenv').config({path: ENVPATH})

const axios = require('axios')
const fs = require('fs')

const {wait1sec, changeContractInEnv} = require('../src/testutils')
const IostTools = require('../src/IostTools')
const AppTools = require('../src/AppTools')
const assert = require('chai').assert

let contractId

const CONTRACT_NAME = 'app'

const RANDOM = "6"

const iostTools = new IostTools(
  process.env.IOST_NODE_URL,
  process.env.IOST_CHAIN_ID,
  process.env.ADMIN_ACCOUNTNAME,
  process.env.ADMIN_SECKEY
)

// const Firestore = require('@google-cloud/firestore');
//
// const db = new Firestore({
//   projectId: 'dlt-app',
//   keyFilename: './../../firebase/functions/serviceAccountKey.json',
// });


describe('#AppTools', function () {
  let contract, abi

  describe('#Deploy', function () {
    it('Load App contract from file', function () {
      contract = fs.readFileSync(__dirname + "/../../contracts/src/" + CONTRACT_NAME + '.js', {encoding: 'utf-8'})
      abi = fs.readFileSync(__dirname + "/../../contracts/src/" + CONTRACT_NAME + '.abi', {encoding: 'utf-8'})
    })

    it('Deploy App Contract', async () => {
      const result = await iostTools.deployContract(contract, abi)
      contractId = JSON.parse(result.pre_tx_receipt.returns[0])[0]
      changeContractInEnv(ENVPATH, contractId)
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

  describe('#Calls', function () {
    const name = 'John Smith'
    beforeEach(wait1sec)
    it('Call greet ', async function () {

      const result = await appTools.greet(name)
      assert(result===true, 'Calling greet failed')
      await wait1sec()
      const output = await appTools.getLastGreeting(name)
      assert(output.datas[0] !== "null", 'getLastGreeting: unexpected results from registration')
    })
  })
})
