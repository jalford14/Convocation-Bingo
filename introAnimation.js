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
  NavigatorIOS,
  TextInput,
  StatusBar
} from 'react-native';

import Communications from 'react-native-communications';

var deviceWidth = require('Dimensions').get('window').width;
var deviceHeight = require('Dimensions').get('window').height;

var Menu = require('./menu.js');

var tileWidth = deviceWidth/5;
// var active = '#419BF8';
var active = 'rgba(65, 155, 248, 1.00)';
var ACTIVE = 1;
// var innactive = '#1D293F';
var innactive = 'rgba(29, 41, 63, 1.00)';
var INNACTIVE = 0;
// var victory = '#84A12C';
var victory = 'rgba(132, 161, 44, 1.00)';
var VICTORY = 2;
// var active = 'rgba(65, 155, 248, 1.00)';
// var ACTIVE = '#419BF8';
// var innactive = '#1D293F';
// var victory = '#84A12C';

var colors = [innactive, innactive, innactive, innactive, innactive];
var text = ['','','','','']

class Intro extends Component {
  mixins: [TimerMixin]

  constructor(props){

    super(props);

    this.widthAnims = [0,1,2,3,4].map(() => new Animated.Value(tileWidth/2.5));
    this.heightAnims = [0,1,2,3,4].map(() => new Animated.Value(tileWidth/2.5));

    this._animatedValues = [0,1,2,3,4].map(() => new Animated.Value(0));
    this.colorAnims = [0,1,2,3,4].map((index) => this._animatedValues[index].interpolate({
      inputRange: [0,1,2],
      outputRange: [innactive, active, victory]
    }));
    this.opacityAnims = [0,1,2,3,4,5,6,7,8,9,10].map(() => new Animated.Value(0))
    
    this.state = {
      color: colors,
      text: text
    }
  }

  componentDidMount(){
    setTimeout(() => {this.tileGrow()},500)
  }

  tileGrow(){
    _this = this;
    var timing = Animated.timing;
    Animated.parallel(
      this.widthAnims.map((width) => timing(width,{
        toValue: tileWidth,
        easing: Easing.elastic(1.5),
        duration: 600,
      }))
    ).start(function(){
      _this.selectTiles(_this);
    })
  }

  selectTiles(_this){
    var timing = Animated.timing;
    Animated.stagger(200,[
        timing(this._animatedValues[0],{
          toValue: 1,
          duration: 200
        }),
        timing(this._animatedValues[1],{
          toValue: 1,
          duration: 200
        }),
        timing(this._animatedValues[2],{
          toValue: 1,
          duration: 200
        }),
        timing(this._animatedValues[3],{
          toValue: 1,
          duration: 200
        }),
        timing(this._animatedValues[4],{
          toValue: 1,
          duration: 200
        })
      ]).start(function(){
        _this.convoOpacity();
        _this.victory();
      })
  }
  convoOpacity(){
    var timing = Animated.timing;
    Animated.stagger(30,
      this.opacityAnims.map((anim) => timing(anim, {
        toValue: 1,
        easing: Easing.bounce, //bounce, linear, elastic(1)
        duration: 3300,
      }))).start()
  }

  victory(){
    _this = this
    var timing = Animated.timing;
    Animated.parallel([
        timing(this._animatedValues[0],{
          toValue: 2,
          duration: 200
        }),
        timing(this._animatedValues[1],{
          toValue: 2,
          duration: 200
        }),
        timing(this._animatedValues[2],{
          toValue: 2,
          duration: 200
        }),
        timing(this._animatedValues[3],{
          toValue: 2,
          duration: 200
        }),
        timing(this._animatedValues[4],{
          toValue: 2,
          duration: 200
        })
      ]).start(function(){
        ['B','I','N','G','O'].map((letter, index) => text[index] = letter)
        _this.setState({text: text}, function(){
          setTimeout(() => {this.navigateToMenu()}, 1500)
        })
      })
  }

  navigateToMenu(){
    this.props.navigator.push({
      title: 'Menu',
      component: Menu
    })
  }
  returnTile(tile, index){
    return(
        <Animated.View key={tile} style={[styles.tile,{backgroundColor: this.colorAnims[index]/*this.state.color[index]*/, width: this.widthAnims[index], height: this.widthAnims[index], marginLeft: index * tileWidth}]}>
          <Text style={styles.text}>{this.state.text[index]}</Text>
        </Animated.View>
      )
  }
  returnConvo(key, index){
    return(
        <Animated.View key={index + key} style={{opacity: this.opacityAnims[index]}}>
          <Text style={styles.convoText}>{key}</Text>
        </Animated.View>
      )
  }

  render() {
      return (
        <View style={styles.container}>
        <StatusBar barStyle={'default'}/>
          <View style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'center', height: 200}}>
            {['C','O','N','V','O','C','A','T','I','O','N'].map((key, index) => this.returnConvo(key,index))}
          </View>
          {['B','I','N','G','O'].map((tile, index) => this.returnTile(tile, index))}
          <View style={{height: 120}}/>
        </View>
      );
    }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: '#E1E1E1',
  },
  tile:{
    justifyContent: 'center',
    alignItems: 'center',
    borderColor: '#222222',
    shadowColor: '#222222',
    shadowOffset: {width: -7, height: -7},
    shadowRadius: .5,
  },
  text:{
    fontSize: 30,
    fontFamily: 'OpenSans',
    color: '#FFFFFF'
  },
  convoText:{
    fontSize: 50,
    color: '#000000',
    fontFamily: 'OpenSans'
  },
});

module.exports = Intro;
