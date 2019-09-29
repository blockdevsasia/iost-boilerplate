class HelloWorld {
  init() {
  }
  hello(someone) {

    storage.mapPut(someone, "lastGreeting", String(tx.time).substring(0,13));
    return 'hello ' + someone;
  }
}
module.exports = HelloWorld;
