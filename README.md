# IFrame-Tunnel

Send text/data and notifications to and from embedded Iframes.

## Getting started
```
npm i iframe-tunnel
```

## Run the Demo
The following script will compile the examples and start a static server
```
npm run demo
```
If all goes well then you should be able to open [http://localhost:3000](http://localhost:3000)

## Using iframe-tunnel with vanilla javascript

> Note. To use iframe-tunnel without a module builder you will need to run webpack to create a browser compatible version.


## Building for vanilla javascript
* npm run browser-build
* copy the file browser/iframe-tunnel.js file into your project

## Example Usage

> The example below uses ES6 for clarity however you'll probably need to use ES5 for full compatibility
host.html

```html
  <iframe id="some-iframe" src="client.html"></iframe>
```
```
  <script src="iframe-tunnel.js"></script>
  <script> 
    const tunnel = window.IFrameTunnel.connect({iframeId: 'some-iframe'});
    tunnel.onMessage('client-message', data=>{
      console.log(`message received from client: ${data}`);
    });
  
    tunnel.sendMessage('host-message', 'Hello Client');
  </script>
```

client.html

```
  <script src="iframe-tunnel.js"></script>
  <script>
    const tunnel = window.IFrameTunnel.connect();
    tunnel.onMessage('host-message', data=>{
      console.log(`message received from host: ${data}`);
    });
  
    tunnel.sendMessage('client-message', 'Hello Host');
  </script>
```

