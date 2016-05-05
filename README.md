# react-native-camera-roll-picker
CameraRoll Picker component for React native

<a href="https://raw.githubusercontent.com/jeanpan/react-native-camera-roll-picker/master/demo/demo.gif"><img src="https://raw.githubusercontent.com/jeanpan/react-native-camera-roll-picker/master/demo/demo.gif" width="350"></a>

##Add to Project
1. Make sure node_modules/react-native/Libraries/CameraRoll/RCTCameraRoll.xcodeproj has been imported to project libraries by following the [libraries linking instructions](https://facebook.github.io/react-native/docs/linking-libraries-ios.html).
2. Install component through npm
```
$ npm install react-native-camera-roll-picker --save
```
3. Require component
```
var CameraRollPicker = require('react-native-camera-roll-picker');
```

##Basic Usage
```js
<CameraRollPicker
  callback={this.getSelectedImages} />
```

##Props
- `callback` : Callback function when images was selected.
- `groupTypes` : The group where the photos will be fetched, one of 'Album', 'All', 'Event', 'Faces', 'Library', 'PhotoStream' and 'SavedPhotos'. Default is *SavedPhotos*
- `assetType` : The asset type, one of 'Photos', 'Videos' or 'All'. Default is *Photos*
- `batchSize` : Number of images per fetch. Default is *25*
- `maximum` : Maximum number of selected images. Default is *15*
- `imagesPerRow` : Number of images per row. Default is *3*
- `imageMargin` : Margin size of one image. Default is *5*
- `selectMulti` : can select more than one image or only select on image. default is true

##Run Example
```
$ git clone https://github.com/jeanpan/react-native-camera-roll-picker.git
$ cd react-native-camera-roll-picker
$ cd Example
$ npm install
$ react-native run-ios
```
