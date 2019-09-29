const axios = require('axios')

module.exports = class AppTools {
  constructor(iostTools, contractId) {

    this.iostTools = iostTools
    this.contractId = contractId
  }

  async greet(name) {
    let result = false

    try {
      await this.iostTools.sendTx(this.contractId, 'hello', [name])
      result = true
    } catch (err) {
      console.error(err)
    }

    return result
  }

  getLastGreeting(name) {
    return axios({
      baseURL: process.env.IOST_NODE_URL,
      method: 'post',
      url: '/getBatchContractStorage',
      data: {
        id: this.contractId,
        key_fields: [
          {'field': 'lastGreeting', 'key': name}
        ],
        by_longest_chain: true
      }
    }).then((output) => {
      return output.data
    })
  }
}
