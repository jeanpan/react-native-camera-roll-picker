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
    this.imageSize = ((width - (this.props.imagesPerRow+1) * this.props.imageMargin) / this.props.imagesPerRow);

    //Fetch
    var fetchParams = {
      first: 1000,
      groupTypes: this.props.groupTypes,
      assetType: this.props.assetType,
    };

    if (Platform.OS === "android") delete fetchParams.groupTypes;
    if (this.state.lastCursor) fetchParams.after = this.state.lastCursor;

    CameraRoll.getPhotos(fetchParams)
      .then((data) => {
        //split to rows
        var rows=[];
        while (data.edges.length > 0){
            rows.push(data.edges.splice(0,this.props.imagesPerRow));
        }
        //cloneWithRows
        this.setState({dataSource: this.state.dataSource.cloneWithRows(rows)})
      });
  }


  _selectImage(image) {
    var selected = this.state.selected;
    var index = selected.indexOf(image);

    if (index >= 0) {
      selected.splice(index, 1);
    } else {
      if (selected.length < this.props.maximum) selected.push(image);
      else selected = [image];
    }
    this.setState({ selected: selected });
    this.props.callback(this.state.selected);
  }
  render(){
    return (
      <View style={[ styles.wrapper, { padding: this.props.imageMargin, paddingRight: 0, backgroundColor: this.props.backgroundColor}, ]}>
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

    var items=[];
    data.forEach(item =>{
      items.push(
        <TouchableOpacity
          style={{marginBottom: this.props.imageMargin, marginRight: this.props.imageMargin}}
          onPress={event => this._selectImage(item.node.image)}>
          <Image
            source={{uri: item.node.image.uri}}
            style={{height: this.imageSize, width: this.imageSize}} >

            { (this.state.selected.indexOf(item.node.image) >= 0)? selectedMarker : null }

          </Image>
        </TouchableOpacity>
      )
    })
    return(
      <View style={styles.row}>
        {items}
      </View>
    )
  }
}

const styles = StyleSheet.create({
  wrapper:{
    flex: 1,
  },
  listContainer: {
    flexDirection: 'column',
  },
  row:{
    flexDirection: 'row',
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
  backgroundColor: React.PropTypes.string,
}
CameraRollPicker.defaultProps = {
  groupTypes: 'SavedPhotos',
  maximum: 15,
  imagesPerRow: 3,
  imageMargin: 5,
  assetType: 'Photos',
  backgroundColor: 'white',
  callback: function(d) {
    console.log(d);
  },
}

export default CameraRollPicker;
