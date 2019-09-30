# IOST+Quasar+Firebase boilerplate
<img src="https://www.blockdevs.asia/wp-content/uploads/2019/02/IOST-BlockDevs-Asia.png">

<h2> Installation Instructions</h2>
<ol>
    <li><a href="https://nodejs.org/en/download/"> Install Node.JS</a></li>
    <li><a href="https://quasar.dev/start/quasar-cli">Install Quasar CLI</a></li>
    <li><a href="https://developers.iost.io/docs/en/4-running-iost-node/iWallet.html">Install IOST Iwallet CLI</a></li>
    <li><a href="https://chrome.google.com/webstore/detail/iwallet/kncchdigobghenbbaddojjnnaogfppfj?hl=en">Install IOST Iwallet Chrome Extension</a></li>
        <li><a href="https://docs.docker.com/get-started/#prepare-your-docker-environment">Install Docker</a></li>
    <li>Optional: Install Firebase CLI (not yet fully implemented)</li>
    <li>Clone Git repo<pre>git clone https://github.com/blockdevs-asia/iost-boilerplate.git</pre></li>
    <li>cd into the root project folder <pre>cd iost-boilerplate</pre></li>
    <li>Install dependencies for client: <pre>npm run install:client</pre></li>
    <li>Install 'admin' account for local node': <pre>npm run install:localadmin</pre></li>
    <li>Optional: Install dependencies for firebase: <pre>npm run install:firebase</pre></li>
</ol>
<h3>Now it's time to start everything</h3>
<p>Best is to run the start commands below each in their own terminal so they can be individually stopped/started/monitored</p>
<ol>
<li>Start the Quasar browser app<pre>npm run start:client</pre></li>
<li>Start the local IOST node for unit testing<pre>npm run start:localnode</pre></li>
</ol>
<h3>Try the unit tests</h3>
<p>Tests are configured to run with root project folder as working directory.</p>
<ol>
<li>Run the test for the shared libraries<pre>npm run test:lib</pre></li>
<li>Run the test for the "app" contract<pre>npm run test:contracts</pre></li>
</ol>
<h3>Run the contract deploy script</h3>
<p>Currently, publishing to Local is pointless for testing with iWallet as only MAINNET and TESTNET can be used. MAINNET publishing is coming soon (or do a pull request!)</p>
<p>Publishing with this script will also update the CONTRACT_ID in the .env.dev, .env.prod environment files that are automatically read into the application.</p>
<p>Make sure to kill and restart the Quasar app after you published a contract!</p>
<ol>
<li>Deploy to Local net (docker)<pre>npm run deploycontract:local</pre></li>
<li>Deploy to TESTNET<pre>npm run deploycontract:testnet</pre></li>
</ol>
<h3>Further setup</h3>
<p>As mentioned, there are "dotenv" config files. Make sure you create your own "App Admin" account in IOST, and put the name and seckey in the ADMIN_ACCOUNT and ADMIN_SECKEY fields.</p>
