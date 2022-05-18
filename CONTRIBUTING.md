# Contributing

## Development

This repository contains all of the required source code files to make changes to this extension. The "master" branch contains the source code for the latest stable release.

If you want to make changes to this extension, you are welcome to do so. All files for the extension are located in the "src" folder. The source code of upcoming versions (if any) will be located in another branch.

Because there are some differences between the add-on for Firefox vs the add-on for Chromium-based browsers, you will first need to run our build script. To do so, either run the `build.bat` file (on Windows) or `build.sh` file (on Linux). This will create copies of the necessary files under the "build" folder. The folder will continue two sub-folders: One for Firefox and another for Chromium. You will then be able to debug the extension on your browser by pointing the browser to that folder.


It's important to note that the contents of the "build" folder are not saved to the GitHub repository when you make a commit or pull request to the source code. Therefore, any code changes should be made to the files in the "src" folder and then you should run the build script to update the files you are testing in the browser.


The majority of the files in the source code are compatible with all supported browsers. However, there are some files that are exclusive to either the Firefox version or Chromium-based version of the add-on. These files are listed below:

| Firefox Only | Chromium Only |
| ------------ | ------------- |
| manifest-firefox.json | manifest-chromium.json |


We strongly reccomend to use the [web-ext](https://www.npmjs.com/package/web-ext) to test your development with this tool you can start an firefox or a chromium browser to test and you can use hot reload.

### Useful links to development
| Description |
| ------------ |
| [Get Started with chrome extension](https://developer.chrome.com/docs/extensions/mv3/getstarted/) |
| [Get Started with firefox extesion](https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions) |
| [Cli tool Web-Ext](https://www.npmjs.com/package/web-ext) |
| [Web-Ext Problem with snap Firefox](ttps://github.com/mozilla/web-ext/issues/1696) |
| [Firefox Doesn't support manifest v3](https://discourse.mozilla.org/t/when-will-web-ext-support-manifest-v3/91514) |
| [how-to-install-firefox-deb-apt-ubuntu](https://www.omgubuntu.co.uk/2022/04/how-to-install-firefox-deb-apt-ubuntu-22-04) |