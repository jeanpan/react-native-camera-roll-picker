import React,{Component} from 'react'
import {
  CameraRoll
  ,Image
  ,Platform
  ,StyleSheet
  ,View
  ,Text
  ,Dimensions
  ,TouchableOpacity
  ,ListView
} from 'react-native'

import SGListView from 'react-native-sglistview'

class CameraRollPicker extends Component{
  constructor(props) {
    super(props);
  
    this.state = {
      images: [],
      selected: [],
      dataSource: new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2})
    };
  }
  componentWillMount() {
    var { width } = Dimensions.get('window');
    this.imageSize = ((width - (this.props.imagesPerRow+2) * this.props.imageMargin) / this.props.imagesPerRow);

    //Fetch
    var fetchParams = {
      first: this.props.batchSize,
      groupTypes: this.props.groupTypes,
      assetType: this.props.assetType,
    };

    if (Platform.OS === "android") delete fetchParams.groupTypes;
    if (this.state.lastCursor) fetchParams.after = this.state.lastCursor;

    CameraRoll.getPhotos(fetchParams)
      .then((data) => {
        this.setState({dataSource: this.state.dataSource.cloneWithRows(data.edges)})
      });
  }


  _selectImage(image) {
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
  }

  render(){
    return (
      <View style={[ styles.wrapper, { padding: this.props.imageMargin, paddingRight: 0, }, ]}>
        <SGListView
          style={styles.list}
          contentContainerStyle={styles.listContainer}
          dataSource={this.state.dataSource}
          renderRow={rowData => this.renderRow(rowData)} />
      </View>
    );
  }
  renderRow(data){
    var selectedMarker = this.props.selectedMarker ?
                          this.props.selectedMarker
                          :
                          <Image
                            style={[ styles.checkIcon, { width: 25, height: 25, right: this.props.imageMargin + 5 }, ]}
                            source={require('./circle-check.png')}
                          />
    return(
      <TouchableOpacity 
        style={{marginBottom: this.props.imageMargin, marginRight: this.props.imageMargin}}>
        <Image 
          source={{uri: data.node.image.uri}} 
          style={{height: this.imageSize, width: this.imageSize}} >

          { (this.state.selected.indexOf(data.node.image.uri) >= 0)? selectedMarker : null }

        </Image>
      </TouchableOpacity>
    )
  }
}

const styles = StyleSheet.create({
  wrapper: {
    borderWidth: 1,
    borderColor: 'black',
    flex: 1,
  },
  listContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'flex-start',
    backgroundColor: '#fff',
  },
  checkIcon: {
    position: 'absolute',
    top: 5,
    backgroundColor: 'transparent',
  },
})

CameraRollPicker.propTypes = {
  groupTypes: React.PropTypes.oneOf([
    'Album',
    'All',
    'Event',
    'Faces',
    'Library',
    'PhotoStream',
    'SavedPhotos',
  ]),
  maximum: React.PropTypes.number,
  assetType: React.PropTypes.oneOf([
    'Photos',
    'Videos',
    'All',
  ]),
  imagesPerRow: React.PropTypes.number,
  imageMargin: React.PropTypes.number,
  callback: React.PropTypes.func,
  selectedMarker: React.PropTypes.element,
}
CameraRollPicker.defaultProps = {
  groupTypes: 'SavedPhotos',
  maximum: 15,
  imagesPerRow: 3,
  imageMargin: 5,
  selectedMarker: null,
  assetType: 'Photos',
  callback: function(d) {
    console.log(d);
  },
}

export default CameraRollPicker;
