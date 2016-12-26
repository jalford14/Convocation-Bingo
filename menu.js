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
  StatusBar,
  PanResponder,
  Image,
} from 'react-native';

var Bingo = require('./bingo.js');
var TileDefinitions = require('./tileDefinitions.js');
var Help = require('./help.js');
var Contact = require('./contact.js');
var MenuBackground = require('./images/menu-background.png')

// var boardSelect = require('./boardSelect.js');

var sequence = Animated.sequence;
var timing = Animated.timing;
var parallel = Animated.parallel;
var stagger = Animated.stagger;
var delay = Animated.delay;

var active = 'rgba(65, 155, 248, 1.00)';
var ACTIVE = 1;
var innactive = 'rgba(29, 41, 63, 1.00)';
var INNACTIVE = 0;
var victory = 'rgba(132, 161, 44, 1.00)';
var VICTORY = 2;

var tileOptions = require('./tileOptions.json');

var deviceWidth = require('Dimensions').get('window').width;
var deviceHeight = require('Dimensions').get('window').height;
var tileButtonWidth = deviceWidth/2.5;
var tileWidth = deviceWidth / 5 + .5/* - 6*/;
var _this;

class Menu extends Component {

  constructor(props){
    super(props);
    _this = this;
    
    var shiftDistance = -(deviceHeight/2 + deviceWidth/2 + 50); // Distance to be moved down from above screen

    this.anims = [0,1,2,3,4,5,6,7,8,9,10].map(() => new Animated.Value(/*shiftDistance*/0));
    this.opacityAnims = [0,1,2,3,4,5,6,7,8,9,10].map(() => new Animated.Value(0));
    this._animatedValues = [0,1,2,3,4].map(() => new Animated.Value(0));
    this.colorAnims = [0,1,2,3,4].map((index) => this._animatedValues[index].interpolate({
      inputRange: [0,1,2,3],
      outputRange: [innactive, active, victory, innactive]
    }));
  }

  componentDidMount(){
    this.runBingoSequence();
    this.colorInterval = setInterval(() => {
      this.runBingoSequence();
    }, 3500)
    this.runStartingAnimation();
  }

  runStartingAnimation(){
    Animated.stagger(30,
      this.opacityAnims.map((anim) => timing(anim, {
        toValue: 1,
        easing: Easing.bounce, //bounce, linear, elastic(1)
        duration: 2000,
      }))
    ).start(/*function(){
      _this.bounceInterval = setInterval(() => {
        var randomIndex = Math.floor((Math.random() * 11))
        _this.bounce(randomIndex)
      }, 2500)
    }*/);
  }
  runBingoSequence(){
    var activeObj = {
      toValue: 1,
      duration: 300,
    }
    var victoryObj = {
      toValue: 2,
      duration: 300
    }
    var innactiveObj = {
      toValue: 3,
      duration: 300
    }
    var activeSequence = [0,1,2,3,4].map((index) => timing(this._animatedValues[index],activeObj))
    var victoryParallel = [0,1,2,3,4].map((index) => timing(this._animatedValues[index],victoryObj))
    var innactiveParallel = [0,1,2,3,4].map((index) => timing(this._animatedValues[index],innactiveObj))
    Animated.sequence([
      delay(500),
      stagger(300,activeSequence),
      parallel(victoryParallel),
      delay(500),
      parallel(innactiveParallel)
    ]).start(function(){
      for(var i = 0; i < _this._animatedValues.length; i++)
        _this._animatedValues[i]._value = 0;
    });
  }

  play(){
    // clearInterval(this.bounceInterval)
    // clearInterval(this.colorInterval)
    this.props.navigator.push({
        /*component: boardSelect,*/
        component: Bingo,
      });
  }
  definitions(){
    this.props.navigator.push({
      component: TileDefinitions,
      passProps: {definitions: tileOptions}
    })
  }
  howTo(){
    this.props.navigator.push({
      component: Help,
    })
  }
  contact(){
    this.props.navigator.push({
      component: Contact,
    })
  }

  bounce(index){
    var timing = Animated.timing;
    Animated.sequence([
      timing(this.anims[index],{
        toValue: -50,
        easing: Easing.elastic(.5),
        duration: 200,
    }),
      timing(this.anims[index],{
        toValue: 0,
        easing: Easing.bounce,
        duration: 500
      })
    ]).start()
  }
  returnConvoLetter(key, index){
    return(
        <Animated.View key={key+index} style={{opacity: this.opacityAnims[index],transform: [{translateY: this.anims[index]}]}}>
          <TouchableHighlight activeOpacity={1} underlayColor={'rgba(225,225,225,0)'} onPress={() => this.bounce(index)}>
            <Text style={styles.convoText}>{key}</Text>
          </TouchableHighlight>
        </Animated.View>
      )
  }
  // returnBingoLetter(key, index){
  //   return(
  //       <Animated.View key={key+index} style={{opacity: this.opacityAnims[index],transform: [{translateY: this.anims[index]}]}}>
  //         <TouchableHighlight activeOpacity={1} underlayColor={'rgba(225,225,225,0)'} onPress={() => this.bounce(index)}>
  //           <Text style={styles.bingoText}>{key}</Text>
  //         </TouchableHighlight>
  //       </Animated.View>
  //     )
  // }
  // <View style={{flexDirection: 'row', marginTop: 20}}>
  //   {["B","I","N","G","O","!"].map((key,index) => this.returnBingoLetter(key,index))}
  // </View>

  returnBingoTiles(key,index){
    return(
      <Animated.View key={key} style={[styles.tile,{width: tileWidth, height: tileWidth, backgroundColor: this.colorAnims[index]}]}>
        <Animated.View style={[styles.tile,{width: tileWidth, height: tileWidth}]}>
          <Text style={[styles.tileText,{fontSize: tileWidth/2}]}>{key}</Text>
        </Animated.View>
      </Animated.View>
    )
  }

  render() {
      return (
          <Image style={styles.backgroundImage} source={MenuBackground}>
          <StatusBar barStyle={'light-content'}/>
            
            <View style={styles.textContainer}>
              
              <View style={{flexDirection: 'row', marginTop: 20, width:deviceWidth - 10, justifyContent:'space-around',alignItems:'center'}}>
                {["C","O","N","V","O","C","A","T","I","O","N"].map((key, index) => this.returnConvoLetter(key,index))}
              </View>

              <View style={{flexDirection: 'row'}}>
                {["B","I","N","G","O"].map((key,index) => this.returnBingoTiles(key,index))}
              </View>

            </View>
              
            <View style={{flex: 1, height: deviceHeight/2 * 3, flexDirection: 'column', justifyContent: 'center', alignItems: 'center'}}>
              <View style={{flex: 1, width: deviceWidth, flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center'}}>
                <TouchableHighlight underlayColor={active} style={[styles.tile, {borderColor: '#FFF',borderWidth: 1,width: tileButtonWidth, height: tileButtonWidth, backgroundColor: innactive}]} onPress={() => this.play()}>
                  <View style={[styles.tile,{width: tileButtonWidth, height: tileButtonWidth}]}>
                    <Text style={[styles.tileText,{fontSize: tileButtonWidth / 6}]}>Play</Text>
                  </View>
                </TouchableHighlight>
                <TouchableHighlight underlayColor={active} style={[styles.tile, {borderColor: '#FFF', borderWidth: 1, width: tileButtonWidth, height: tileButtonWidth, backgroundColor: innactive}]} onPress={() => this.definitions()}>
                  <View style={[styles.tile,{width: tileButtonWidth, height: tileButtonWidth}]}>
                    <Text style={[styles.tileText,{fontSize: tileButtonWidth / 6}]}>Tile Definitions</Text>
                  </View>
                </TouchableHighlight>
              </View>
              <View style={{flex: 1, width: deviceWidth, flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center'}}>
                <TouchableHighlight underlayColor={active} style={[styles.tile, {borderColor: '#FFF', borderWidth: 1, width: tileButtonWidth, height: tileButtonWidth, backgroundColor: innactive}]} onPress={() => this.howTo()}>
                  <View style={[styles.tile,{width: tileButtonWidth, height: tileButtonWidth}]}>
                    <Text style={[styles.tileText,{fontSize: tileButtonWidth / 6}]}>How To Play</Text>
                  </View>
                </TouchableHighlight>
                <TouchableHighlight underlayColor={active} style={[styles.tile, {borderColor: '#FFF', borderWidth: 1, width: tileButtonWidth, height: tileButtonWidth, backgroundColor: innactive}]} onPress={() => this.contact()}>
                  <View style={[styles.tile,{width: tileButtonWidth, height: tileButtonWidth}]}>
                    <Text style={[styles.tileText,{fontSize: tileButtonWidth / 6}]}>Contact Us</Text>
                  </View>
                </TouchableHighlight>
              </View>
            </View>
          </Image>
      );
    }
}


/*<TouchableHighlight activeOpacity={.5} style={styles.button} onPress={() => this.play()}>
  <Text style={styles.buttonText}>Play</Text>
</TouchableHighlight>
<TouchableHighlight activeOpacity={.5} style={styles.button} onPress={() => this.definitions()}>
  <Text style={styles.buttonText}>Tile Definitions</Text>
</TouchableHighlight>
<TouchableHighlight activeOpacity={.5} style={styles.button} onPress={() => this.howTo()}>
  <Text style={styles.buttonText}>How To Play</Text>
</TouchableHighlight>
<TouchableHighlight activeOpacity={.5} style={styles.button} onPress={() => this.contact()}>
  <Text style={styles.buttonText}>Contact Us</Text>
</TouchableHighlight>*/

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#E1E1E1',
  },
  textContainer:{
    // height: 200,
    justifyContent: 'center',
    alignItems: 'center',
    // transform: [{translateY: -deviceHeight/4}],
    height: deviceHeight/3
  },
  convoText:{
    fontSize: 45,
    color: '#FFF',
    fontFamily: 'OpenSans',
  },
  bingoText:{
    fontSize: 60,
    color: '#FFF',
    fontFamily: 'OpenSans'
  },
  // liberty:{
  //   color: "#FFF",
  //   fontSize: 50,
  //   fontFamily: 'PT Serif'
  // },
  // university:{
  //   color: "#FFF",
  //   fontSize: 50,
  //   fontFamily: 'PT Serif'
  // },
  button:{
    width: deviceWidth-30,
    height: deviceHeight / 10,
    backgroundColor: '#222222',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  buttonText:{
    fontSize: 20,
    fontFamily: 'OpenSans',
    color: '#FFFFFF'
  },
  backgroundImage:{
    flex: 1,
    width: undefined,
    height: undefined,
    backgroundColor: 'transparent',
    justifyContent: 'center',
    alignItems: 'center'
  },
  tile:{
    justifyContent: 'center',
    alignItems: 'center',
    padding: 3,
    width: 200,
    height: 200,
  },
  tileText:{
    textAlign: 'center',
    color: '#FFFFFF',
    fontFamily: 'OpenSans',
  }
});

module.exports = Menu;
