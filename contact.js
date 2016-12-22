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

var Styles = require('./styles.js');

class Menu extends Component {

  constructor(props){
    super(props);
    this.state = {

    }
  }

  sendEmail(){
    if(this.state.text == ''){
      this.setState({text : 'Please enter something'})
    }else if(this.state.text == 'Please enter something'){
      this.setState({text : 'Please enter something'})
    }
    else{
      Communications.email(['justin@davidpritchard.com'],null,null,null,this.state.text);
    }
    
  }

  render() {
      return (
        <View style={styles.container}>
        <StatusBar barStyle={'default'}/>
          <TouchableHighlight /*underlayColor={'#6E6E6E'}*/ activeOpacity={.5} style={[styles.button]} onPress={() => this.props.navigator.pop()}>
            <Text style={styles.buttonText}>Back</Text>
          </TouchableHighlight>
          <View style={styles.helpContainer}>
            <Text style={styles.helpText}>Have a good suggestion for a new tile? Send us a message and let us know! Please contact us with any additional questions, bugs, or concerns.</Text>
          </View>
          <View style={{}}>
            <TextInput
              style={styles.textInput}
              autoFocus={true}
              onChangeText={(text) => this.setState({text})}
              value={this.state.text}/>
          </View>
          <TouchableHighlight /*underlayColor={'#6E6E6E'}*/ activeOpacity={.5} style={styles.button} onPress={() => this.sendEmail()}>
            <Text style={styles.buttonText}>Suggest Tile</Text>
          </TouchableHighlight>
        </View>
      );
    }
}

const styles = StyleSheet.create({
  container: {
    padding: 30,
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-start',
    backgroundColor: '#E1E1E1',
  },
  button: {
    backgroundColor: '#222222',
    height: deviceHeight/20,
    width: deviceWidth - 30,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    color: '#FFFFFF',
    fontFamily: 'OpenSans'
  },
  helpContainer:{
    width: deviceWidth,
    // height: deviceHeight/3,
  },
  helpText:{
    color: '#000000',
    fontSize: 30,
    padding: 15,
    fontFamily: 'OpenSans'
  },
  textInput:{
    width: deviceWidth - 30,
    height: deviceHeight/20,
    backgroundColor: '#FFFFFF',
    margin: 10,
    fontFamily: 'OpenSans'
  }
  

});

module.exports = Menu;
