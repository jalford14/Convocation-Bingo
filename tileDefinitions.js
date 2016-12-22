import React, { Component } from 'react';
import {
  AppRegistry,
  StyleSheet,
  Text,
  View,
  NavigatorIOS,
  ScrollView,
  TouchableHighlight,
  StatusBar
} from 'react-native';

var deviceWidth = require('Dimensions').get('window').width;
var deviceHeight = require('Dimensions').get('window').height;


var Menu = require('./menu.js');

var tileOptions;

class TileDefinitions extends Component {

  constructor(props){
    super(props);
    var definitions = [];
    var tiles = [];
    if(typeof this.props.definitions !== 'undefined'){
      tileOptions = this.props.definitions;
      for(var i = 0; i < tileOptions.length; i++){
        tiles.push(tileOptions[i].key);
        definitions.push(tileOptions[i].def);
      }
    }else{
      definitions = this.props.defs;
      tiles = this.props.tiles
    }
    
    
    this.state = {
      tiles: tiles,
      definitions: definitions,
    }
  }

  buildRows(index){
    return(
      <View key={index} style={styles.row}>
      <StatusBar barStyle={'default'}/>
        <View style={styles.tile}>   
          <Text style={styles.tileText}>{this.state.tiles[index]}</Text>
        </View>
        <View style={styles.definitionContainer}>
          <Text style={styles.definitionText}>{this.state.definitions[index]}</Text>
        </View>
      </View>
    );
  }

  goBack(){
    this.props.navigator.pop();
  }

  render() {

      return (
        <View style={styles.container}>
          <TouchableHighlight /*underlayColor={'#6E6E6E'}*/ activeOpacity={.5} style={styles.button} onPress={() => this.goBack()}>
            <Text style={{color: '#FFF',fontFamily: 'OpenSans'}}>Back</Text>
          </TouchableHighlight>
        <ScrollView style={styles.scrollView}>
          <View style={styles.column}>
            {this.state.tiles.map((tile, index) => this.buildRows(index))}
          </View>
        </ScrollView>
        </View>
      );
    }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#E1E1E1',
  },
  column: {
    flexDirection: 'column',
  },
  row: {
    flexDirection: 'row',
  },
  tile:{
    width: (deviceWidth / 5) - 6,
    height: (deviceWidth / 5) - 6,
    justifyContent: 'center',
    marginLeft: 5,
    marginBottom: 5,
    backgroundColor: '#419BF8',
  },
  tileText:{
    textAlign: 'center',
    padding: 2,
    fontSize: 11,
    color: '#FFFFFF',
    fontFamily: 'OpenSans'
  },
  definitionText:{
    textAlign: 'left',
    padding: 20,
    fontSize: 12,
    color: '#FFFFFF',
    fontFamily: 'OpenSans'
  },
  definitionContainer:{
    height: (deviceWidth / 5) - 6,
    width: 4 *((deviceWidth / 5) - 6),
    justifyContent: 'center',
    backgroundColor: '#1D293F',
    marginLeft: 10,
  },
  scrollView:{
    marginTop: 20,
  },
  button:{
    marginTop: 30,
    height: 30,
    width: deviceWidth - 30,
    backgroundColor: '#222222',
    justifyContent: 'center',
    alignItems: 'center'
  }
  

});

module.exports = TileDefinitions;