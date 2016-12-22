import React, { Component } from 'react';
import TimerMixin from 'react-timer-mixin';
import {
  AppRegistry,
  StyleSheet,
  Text,
  View,
  TouchableHighlight,
  Animated,
  Easing,
  NavigatorIOS
} from 'react-native';

var Menu = require('./menu.js');
var Help = require('./help.js');
var Intro = require('./introAnimation.js');
var Bingo = require('./bingo.js');
var BoardSelect = require('./boardSelect');

var deviceWidth = require('Dimensions').get('window').width;
var deviceHeight = require('Dimensions').get('window').height;

class ConvoBingo extends Component {
  mixins: [TimerMixin]

  constructor(props){
    super(props);
    
    this.state = {
      
    }
  }

  render() {
      return (
        <NavigatorIOS
          style={styles.navigationContainer}
          navigationBarHidden={true}
          initialRoute={{
            component: Intro,
            title: 'Intro',
          }}
        />
      );
    }
}

const styles = StyleSheet.create({
  navigationContainer: {
   flex: 1
  }
});

AppRegistry.registerComponent('ConvoBingo', () => ConvoBingo);