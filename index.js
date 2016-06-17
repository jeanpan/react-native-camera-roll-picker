'use strict';

var React = require('react');
var ReactNative = require('react-native');

var {
  ActivityIndicatorIOS,
  CameraRoll,
  Image,
  Platform,
  StyleSheet,
  View,
  Text,
  Image,
  TouchableOpacity,
  ScrollView,
  Dimensions,
} = ReactNative;

var CameraRollPicker = React.createClass({
  propTypes: {
    groupTypes: React.PropTypes.oneOf([
      'Album',
      'All',
      'Event',
      'Faces',
      'Library',
      'PhotoStream',
      'SavedPhotos',
    ]),

    batchSize: React.PropTypes.number,

    maximum: React.PropTypes.number,

    assetType: React.PropTypes.oneOf([
      'Photos',
      'Videos',
      'All',
    ]),

    imagesPerRow: React.PropTypes.number,

    imageMargin: React.PropTypes.number,

    callback: React.PropTypes.func,
  },

  getDefaultProps: function() {
    return {
      groupTypes: 'SavedPhotos',
      batchSize: 30,
      maximum: 15,
      imagesPerRow: 3,
      imageMargin: 5,
      selectedMarker: null,
      assetType: 'Photos',
      callback: function(d) {
        console.log(d);
      },
    };
  },

  getInitialState: function() {
    return {
      images: [],
      selected: [],
      lastCursor: null,
      loadingMore: false,
      noMore: false,
    };
  },

  componentDidMount: function() {
    var { width } = Dimensions.get('window');

    var imageMargin = this.props.imageMargin,
        imagesPerRow = this.props.imagesPerRow;

    this._imageSize = (width - (imagesPerRow + 1) * imageMargin) / imagesPerRow;

    this.fetch();
  },

  fetch: function() {
    if (!this.state.loadingMore) {
      this.setState({ loadingMore: true }, () => { this._fetch(); });
    }
  },

  _fetch: function() {

    var fetchParams = {
      first: this.props.batchSize,
      groupTypes: this.props.groupTypes,
      assetType: this.props.assetType,
    };

    if (Platform.OS === "android") {
      // not supported in android
      delete fetchParams.groupTypes;
    }

    if (this.state.lastCursor) {
      fetchParams.after = this.state.lastCursor;
    }

    CameraRoll.getPhotos(fetchParams)
      .then((data) => this._appendImages(data), (e) => console.log(e));
  },

  _appendImages: function(data) {
    var assets = data.edges;
    // android will return image which width and height = -1;
    var images = assets.map((asset) => asset.node.image).filter(image => image.width > 0 && image.height > 0);

    this.setState({
      loadingMore: false,
    });

    if (!data.page_info.has_next_page) {
      this.setState({
        noMore: true,
      });
    }

    if (assets.length > 0) {
      this.setState({
        lastCursor: data.page_info.end_cursor,
        images: this.state.images.concat(images),
      })
    }
  },

  _selectImage: function(image) {
    var selected = this.state.selected;

    var index = selected.indexOf(image);

    if (index >= 0) {
      selected.splice(index, 1);
    } else {
      if (selected.length < this.props.maximum) {
        selected.push(image);
      }
    }

    this.setState({
      selected: selected,
    });

    this.props.callback(this.state.selected);
  },

  _onEndReached: function() {
    if (!this.state.noMore) {
      this.fetch();
    }
  },

  handleScroll: function(event) {
    var layoutHeight = event.nativeEvent.layoutMeasurement.height,
        imageHeight = this._imageSize + this.props.imageMargin * 2,
        imagesPerScreen = Math.ceil(layoutHeight / imageHeight) * this.props.imagesPerRow,
        currentScrollViewHeight = event.nativeEvent.contentOffset.y + layoutHeight,
        loadMoreScrollHeight = (this.props.batchSize / imagesPerScreen) * layoutHeight;

    if (currentScrollViewHeight > loadMoreScrollHeight) {
      this._onEndReached();
    }
  },

  render: function() {
    var imageMargin = this.props.imageMargin,
        imageSize = this._imageSize,
        selectedMarker = this.props.selectedMarker
                          ?
                          this.props.selectedMarker
                          :
                          <Image
                            style={[ styles.checkIcon, { width: 25, height: 25, right: imageMargin + 5 }, ]}
                            source={require('./circle-check.png')}
                          />;

    return (
      <ScrollView
        style={styles.container}
        onScroll={this.handleScroll} scrollEventThrottle={16}>
        <View style={[ styles.imageContainer, { padding: imageMargin, paddingRight: 0, }, ]}>
          { this.state.images.map((image) => {
              return (
                <TouchableOpacity
                  key={image.uri}
                  style={{ position: 'relative', marginBottom: imageMargin, }}
                  onPress={this._selectImage.bind(null, image.uri)}>
                  <Image
                    style={{ width: imageSize, height: imageSize, marginRight: imageMargin, }}
                    source={{ uri: image.uri }}
                  >
                    {
                      this.state.selected.indexOf(image.uri) >= 0
                      ?
                      selectedMarker
                      :
                      null
                    }
                  </Image>
                </TouchableOpacity>
              );
            })
          }
        </View>
      </ScrollView>
    );
  },
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  imageContainer: {
    flex: 1,
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  checkIcon: {
    position: 'absolute',
    top: 5,
    backgroundColor: 'transparent',
  },
});

module.exports = CameraRollPicker;
