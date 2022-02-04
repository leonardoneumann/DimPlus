## DIM Plus Extension for Chrome

Some quality of life additions to our beloved DIM , for now only including basic light.gg community usage information.

![Alt text](./1_lightgg_integration.png?raw=true "My precious Messenger")

### Guide
[How to install it](https://www.youtube.com/watch?v=em6Nu4GzXnA&ab_channel=LeoN)

## Downloads
[Build 0.3](https://github.com/leonardoneumann/DimPlus/releases/download/public_release_0.3/DimPlus_build_0.3.zip)


### Building and Testing the source code

This project needs to be built in order to take advantage of the Chrome Extension API, such as using the Content script to get the extension's ID, or using the Chrome Storage API. These features cannot be used when running this project locally.

To load as a developer extension inside of Chrome:

1. `npm run build` <br>
2. Navigate to `chrome://extensions/` in your browser <br>
3. Toggle the `Developer mode` switch on in the top right hand corner <br>
4. Click the `Load unpacked` button in the top left corner <br>
5. Select the `build` folder inside of this project folder <br>

Builds the app for Chrome to the `build` folder.<br>

