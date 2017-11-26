# DomoticzWeMoHub
WeMo virtual hub exposing devices from Domoticz.

WeMo devices are nativelly supported by **Amazon Echo** so if you have Echo you can easily **control your Domoticz switches**.

### Installation
1. You need to have NPM. If you don't have it yet please install [NodeJS](https://nodejs.org)
2. Clone this repo `git clone https://github.com/maxwroc/DomoticzWeMoHub.git`
3. Go to the DomoticzWeMoHub directory and install required packages `npm install`
4. Make sure your Domoticz is up and running
5. Run the following `node service.js`

    If your Domoticz runs on different machine or other port than 8080 provide overrides as arguments
    
    E.g. `node service.js -host 192.168.1.23 -port 80`
6. The above should show you the list of available switches with their IDs
7. To start server you need to provide `-devices` arg with the comma-separated (without spaces) IDs

    E.g. `node service.js -host 192.168.1.23 -port 80 -devices 3,6,9,15,24`
8. You should see a "Listening..." message in the console
9. Tell your Alexa: "discover devices"
10. Alexa should automatically discover all the devices. Now you should be able to interact with switches just by saying for example "Alexa turn on living room light"

### Dependencies
* [FauxMoJS](https://www.npmjs.com/package/fauxmojs) - I had to copy its code as the original NPM package is old and doesn't have a required fix. Once the new version is released I will remove the forked code
