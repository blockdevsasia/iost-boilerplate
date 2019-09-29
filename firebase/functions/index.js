const functions = require('firebase-functions');

if(process.env.FUNCTIONS_EMULATOR){
  require('dotenv').config({path: __dirname + '/../../.env.dev'});
}else{
  // Load the firebase config into the "process.env" collection so the script keeps working normally
  // https://stackoverflow.com/questions/44766536/how-do-you-setup-local-environment-variables-for-cloud-functions-for-firebase/45064266#45064266
  const config = functions.config();
// Porting envs from firebase config
  for (const key in config.envs){
    process.env[key.toUpperCase()] = config.envs[key];
  }
}

const Firestore = require('@google-cloud/firestore');

const db = new Firestore({
  projectId: 'dlt-champ',
  keyFilename: './serviceAccountKey.json',
});

const IostTools = require('./lib/IostTools')
const AppTools = require('./lib/AppTools')

const iostTools = new IostTools(
  process.env.IOST_NODE_URL,
  process.env.IOST_CHAIN_ID,
  process.env.ADMIN_ACCOUNTNAME,
  process.env.ADMIN_SECKEY
)

appTools = new AppTools(
  db,
  iostTools,
  process.env.CONTRACT_ID
)

exports.iostManagement = functions.region('asia-east2').https.onCall((data, context) => {
  const authId = context.auth.uid
  const operation = data.operation

  let result = undefined
  try{
    switch(operation){
      case 'registerIostForUid':

        const random = Math.floor((Math.random() * 20) + 1)
        result = appTools.registerIostForUid(authId, data.iostAccount, 2, random)
        break
      case 'resetAccount':
        result = appTools.resetAccount(authId, data.accountName)
        break
      case 'checklevel2':
        result = appTools.checklevel2(authId, data.accountName, data.solution)
        break
      case 'checklevel3':
        result = appTools.checklevel3(authId, data.accountName, data.solution)
        break
      case 'checklevel4':
        result = appTools.checklevel4(authId, data.accountName, data.solution)
        break
      case 'checklevel5':
        result = appTools.checklevel5(authId, data.accountName, data.solution)
        break
    }
    return result
  }catch(err){
    return err
  }
});
