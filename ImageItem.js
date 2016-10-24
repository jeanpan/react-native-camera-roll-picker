import React, {Component} from 'react';
import {
  Image,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
} from 'react-native';

class ImageItem extends Component {
  constructor(props){
    super(props)
  }

  componentWillMount() {
    var {width} = Dimensions.get('window');
    var {imageMargin, imagesPerRow, containerWidth} = this.props;

    if(typeof containerWidth != "undefined") {
      width = containerWidth;
    }
    this._imageSize = (width - (imagesPerRow + 1) * imageMargin) / imagesPerRow;
  }

  render() {
    var {item, selected, selectedMarker, imageMargin} = this.props;

    var marker = selectedMarker ? selectedMarker :
        <Image
          style={[styles.marker, {width: 25, height: 25}]}
          source={require('./circle-check.png')}
          />;

    var image = item.node.image;

    return (
      <TouchableOpacity
        style={{marginBottom: imageMargin, marginRight: imageMargin}}
        onPress={() => this._handleClick(image)}>
        <Image
          source={{uri: image.uri}}
          style={{height: this._imageSize, width: this._imageSize}} >
          { (selected) ? marker : null }
        </Image>
      </TouchableOpacity>
    );
  }

  _handleClick(item) {
    this.props.onClick(item);
  }
}

const styles = StyleSheet.create({
  marker: {
    position: 'absolute',
    top: 5,
    right: 5,
    backgroundColor: 'transparent',
  },
})

ImageItem.defaultProps = {
  item: {},
  selected: false,
}

ImageItem.propTypes = {
  item: React.PropTypes.object,
  selected: React.PropTypes.bool,
  selectedMarker: React.PropTypes.element,
  imageMargin: React.PropTypes.number,
  imagesPerRow: React.PropTypes.number,
  onClick: React.PropTypes.func,
}

export default ImageItem;
