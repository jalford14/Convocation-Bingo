import React, { Component } from 'react';
import {
  AppRegistry,
  StyleSheet,
  Text,
  View,
  TouchableHighlight,
  Animated,
  Easing,
  NavigatorIOS,
  TextInput,
  StatusBar
} from 'react-native';

import Communications from 'react-native-communications';

var deviceWidth = require('Dimensions').get('window').width;
var deviceHeight = require('Dimensions').get('window').height;

class Help extends Component {

  constructor(props){
    super(props);
  }

  sendEmail(){
    if(this.state.text == ''){
      this.setState({text : 'Please enter something'})
    }else if(this.state.text == 'Please enter something'){
      this.setState({text : 'Please enter something'})
    }
    else{
      Communications.email(['justin@davidpritchard.com'],null,null,null,this.state.text); //Add a subject
    }
    
  }

  render() {

      return (
        <View style={styles.container}>
        <StatusBar barStyle={'default'}/>
          <TouchableHighlight /*underlayColor={'#6E6E6E'}*/ activeOpacity={.5} style={styles.button} onPress={() => this.props.navigator.pop()}>
            <Text style={{color: '#FFFFFF'}}>Back</Text>
          </TouchableHighlight>
          <View style={styles.helpContainer}>
            <Text style={styles.helpText}>The rules are simple, listen and look for the events on the tile. When an event happens, select it. Get 5 tiles in a row either vertically, horizontally, or diagonally and you win! Curious about what a tile means? Simply hold down on a tile and a definition will appear below. If you have a good suggestion for some new tiles or have any additional questions, please visit the contact us page from the menu.</Text>
          </View>
        </View>
      );
    }
}

const styles = StyleSheet.create({
  container: {
    padding: 30,
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    backgroundColor: '#E1E1E1',
  },
  button: {
    backgroundColor: '#222222',
    height: deviceHeight/20,
    width: deviceWidth - 30,
    alignItems: 'center',
    justifyContent: 'center',
  },
  helpContainer:{
    width: deviceWidth,
    // height: deviceHeight/3,
  },
  helpText:{
    color: '#000000',
    fontSize: 23,
    padding: 15,
    fontFamily: 'OpenSans'
  },
  textInput:{
    width: deviceWidth - 30,
    height: deviceHeight/20,
    backgroundColor: '#FFFFFF',
    margin: 50
  }
  

});

module.exports = Help;
