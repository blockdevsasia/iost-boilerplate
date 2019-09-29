<template>
  <q-page class="flex flex-center">

    <div>
    <q-input v-model="name" label="What's your name?"/>
    <q-btn label="Greet" :disabled="name.length===0" @click="doIt"></q-btn>
    <q-btn label="When was the last greeting?" @click="lastGreeting"></q-btn>
    </div>
  </q-page>
</template>

<script>
  // import { Notify } from 'quasar'
  const axios = require('axios')
  const IOST = require('iost')
  const CONTRACT_ID = process.env.CONTRACT_ID

  async function sayHello(name) {
    let res = 'NOT INSTALLED'
    if(typeof IWalletJS === 'undefined') return res

    if (IWalletJS.network !== undefined) {
      try {
        const account = await IWalletJS.enable()
        const SDK = IWalletJS.newIOST(IOST)
        const network = (SDK.currentRPC._provider._host.indexOf('test') >= 0 ? 'TESTNET' : 'MAINNET')

        const tx = SDK.callABI(CONTRACT_ID, "hello", [name]);

        SDK.signAndSend(tx)
          .on('pending', (pending) => {console.log('ja?', pending)})
        res = 'OK'

      } catch (e) {
        if (e.type === 'locked') {
          res = 'LOCKED'
        }
      }
    } else {
      res = 'NO_ACCOUNT_LOADED'
    }
    return res
  }

  export default {
    name: 'PageIndex',
    data() {
      return {
        name: ''
      }
    },
    methods: {
      async lastGreeting(){
        return axios({
          baseURL: process.env.IOST_NODE_URL,
          method: 'post',
          url: '/getBatchContractStorage',
          data: {
            id: CONTRACT_ID,
            key_fields: [
              {'field': 'lastGreeting', 'key': this.name}
            ],
            by_longest_chain: true
          }
        }).then((output) => {
          const last = output.data.datas[0]
          if(last === 'null'){
            this.$q.notify({
              message: 'Hm, you never greeted!',
              color: 'red'
            })
          }else{
            this.$q.notify({
              message: 'It was on ' + Date(last),
              color: 'green'
            })
          }

        })
      },
      async doIt() {
        const res = await sayHello(this.name)
        console.log(res)
        if(res !== 'OK'){
          this.$q.notify({
            message: 'You need to install iWallet and load an account! (' + res + ')',
            color: 'red'
          })
        }

      }
    },
  }
</script>
