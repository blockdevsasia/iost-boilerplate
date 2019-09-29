require('dotenv').config({path: __dirname + '/../../.env.test'});

const {wait1sec} = require('../src/testutils')
const IostTools = require('../src/IostTools')
const assert = require('chai').assert
const contract = `class HelloWorld {
    init() {
    }
    hello(someone) {
        return 'hello ' + someone;
    }
}
module.exports = HelloWorld;`

const abi = `{
  "lang": "javascript",
  "version": "1.0.0",
  "abi": [
    {
      "name": "hello",
      "args": [
        "string"
      ],
      "amount_limit": []
    }
  ]
}`

const iostTools = new IostTools(
  process.env.IOST_NODE_URL,
  process.env.IOST_CHAIN_ID,
  process.env.ADMIN_ACCOUNTNAME,
  process.env.ADMIN_SECKEY
)

describe('#IostTools', function () {
  var contractId
  describe('#SDK', function () {
    it('should instantiate the class with SDK constructor ', async () => {

      assert(iostTools.chainId === process.env.IOST_CHAIN_ID, 'Chain ID needs to be set')
      assert(iostTools.sdk.account._id === process.env.ADMIN_ACCOUNTNAME, 'Account needs to be set')
      assert(iostTools.sdk.currentRPC._provider._host === process.env.IOST_NODE_URL, 'NodeUrl needs to be set')

    })
  })

  describe('#Functionalities', function () {
    it('should deploy a contract ', async () => {
      const result = await iostTools.deployContract(contract,abi)
      contractId = JSON.parse(result.pre_tx_receipt.returns[0])[0]
      assert(result.pre_tx_receipt.status_code === 'SUCCESS', 'Deploying contract failed with error: ' + result.pre_tx_receipt.message)
    })
  })

  describe('#CallContract', function () {
    before(wait1sec);
    it('should call a contract method ', async function () {
      const result = await iostTools.sendTx(contractId, 'hello', ['test'])
      assert(result.pre_tx_receipt.status_code === 'SUCCESS', 'Calling contract failed with error: ' + result.pre_tx_receipt.message)
      assert(result.pre_tx_receipt.returns[0] === '["hello test"]', 'Unexpected output of hello function')
    })
  })


  describe('#Functions', function () {
    it('GetAccount', async function () {
      const result = await iostTools.getAccount(process.env.TEST_IOSTACCOUNT)
      assert(result.name === process.env.TEST_IOSTACCOUNT, 'Unexpected output of GetAccount function')
    })
    it('Send', async function () {
      const result = await iostTools.send(process.env.TEST_IOSTACCOUNT, process.env.TEST_IOSTACCOUNT, "1", 'testing')
      before(wait1sec);

      assert(result.pre_tx_receipt.status_code === 'SUCCESS', 'Sending failed with error: ' + result.pre_tx_receipt.message)
    })
  })
})

