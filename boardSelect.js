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
var Bingo = require('./bingo.js');
var LoadingView = require('./loadingView.js');


class boardSelect extends Component {

  constructor(props){
    super(props);
    this.state = {
      loaded:false,
      boards:[]
    }
    
  }
  componentDidMount(){
    this.getBoards();
  }

  getBoards() {
    fetch('http://localhost:4000/mobile/listBoards')
    .then((response) => response.json())
    .then((boardsArray) => {
      var boardTitles = [];
      this.setState({
        boards:boardsArray,
        loaded:true
      })
    })
    .catch((error) => {
      console.error(error);
    }).done()
  }

  chooseBoard(index){
    this.props.navigator.push({
      component: Bingo,
      passProps: {tiles:this.state.boards[index]}
    })
  }

  buildRows(index){
    return(
      <View key={index} style={styles.row}>
      <StatusBar barStyle={'default'}/>
        <TouchableHighlight style={styles.titleTouch} activeOpacity={.5} onPress={() => this.chooseBoard(index)}>
          <View style={styles.titleContainer}>
            <Text style={styles.title}>{this.state.boards[index].name}</Text>
          </View>
        </TouchableHighlight>
      </View>
    );
  }

  goBack(){
    this.props.navigator.pop();
  }

  render() {
    if(!this.state.loaded){
      return(
        <LoadingView/>
      );
    }else{
      return (
        <View style={styles.container}>
          <TouchableHighlight /*underlayColor={'#6E6E6E'}*/ activeOpacity={.5} style={styles.button} onPress={() => this.goBack()}>
            <Text style={{color: '#FFF',fontFamily: 'OpenSans'}}>Back</Text>
          </TouchableHighlight>
        <ScrollView style={styles.scrollView}>
          <View style={styles.column}>
            {this.state.boards.map((name, index) => this.buildRows(index))}
          </View>
        </ScrollView>
        </View>
      );
    }

     
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
  title:{
    textAlign: 'left',
    padding: 20,
    fontSize: 12,
    color: '#FFFFFF',
    fontFamily: 'OpenSans'
  },
  titleContainer:{
    height: (deviceWidth / 5) - 6,
    width: deviceWidth - 30,
    justifyContent: 'center',
    backgroundColor: '#1D293F',
    // marginLeft: 10,
  },
  titleTouch:{
    marginBottom:15,
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

module.exports = boardSelect;