import React, { Component } from 'react';
import {
  Image,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
} from 'react-native';
import PropTypes from 'prop-types';

class ImageItem extends Component {
  constructor(props) {
    super(props)
  }

  componentWillMount() {
    var { width } = Dimensions.get('window');
    var { imageMargin, imagesPerRow, containerWidth } = this.props;

    if (typeof containerWidth != "undefined") {
      width = containerWidth;
    }
    this._imageSize = (width - (imagesPerRow + 1) * imageMargin) / imagesPerRow;
  }

  render() {
    var { item, selected, selectedMarker, imageMargin } = this.props;

    var marker = selectedMarker ? selectedMarker :
      <Image
        style={[styles.marker, { width: 25, height: 25 }]}
        source={require('./circle-check.png')}
      />;

    var image = item.node.image;

    return (
      <TouchableOpacity
        style={{ marginBottom: imageMargin, marginRight: imageMargin }}
        onPress={() => this._handleClick(image)}>
        <Image
          source={{ uri: image.uri }}
          style={{ height: this._imageSize, width: this._imageSize }} />
        {(selected) ? marker : null}
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
  item: PropTypes.object,
  selected: PropTypes.bool,
  selectedMarker: PropTypes.element,
  imageMargin: PropTypes.number,
  imagesPerRow: PropTypes.number,
  onClick: PropTypes.func,
}

export default ImageItem;
