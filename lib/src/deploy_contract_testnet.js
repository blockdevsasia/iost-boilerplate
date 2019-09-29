const ENVPATH = '.env.prod'
require('dotenv').config({path: ENVPATH})

const {changeContractInEnv} = require('./testutils')

const fs = require('fs')

const IostTools = require('./IostTools')

const iostTools = new IostTools(
  process.env.IOST_NODE_URL,
  process.env.IOST_CHAIN_ID,
  process.env.ADMIN_ACCOUNTNAME,
  process.env.ADMIN_SECKEY
)

contract = fs.readFileSync(__dirname + "/../../contracts/src/" + process.env.APP_NAME + '.js', {encoding: 'utf-8'})
abi = fs.readFileSync(__dirname + "/../../contracts/src/" + process.env.APP_NAME + '.abi', {encoding: 'utf-8'})

const result = iostTools.deployContract(contract,abi).then((result) => {
  console.log('Contract' + result.hash)
  changeContractInEnv(
    __dirname + '/../../.env.prod',
    'Contract' + result.hash
  )
  changeContractInEnv(
    __dirname + '/../../.env.dev',
    'Contract' + result.hash
  )
})
