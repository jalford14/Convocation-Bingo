import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableHighlight,
  Animated,
  Easing,
  NavigatorIOS,
  TouchableWithoutFeedback,
  StatusBar
} from 'react-native';

var deviceWidth = require('Dimensions').get('window').width;
var deviceHeight = require('Dimensions').get('window').height;

// var active = '#419BF8';
var active = 'rgba(65, 155, 248, 1.00)';
var ACTIVE = 1;
// var innactive = '#1D293F';
var innactive = 'rgba(29, 41, 63, 1.00)';
var INNACTIVE = 0;
// var victory = '#84A12C';
var victory = 'rgba(132, 161, 44, 1.00)';
var VICTORY = 2;

var Menu = require('./menu.js');
var Help = require('./help.js');
var TileDefinitions = require('./tileDefinitions.js');
var Styles = require('./styles.js');

// var tileOptions;
var tileOptions = require('./tileOptions.json')
var tileOptionsCount;

var timing = Animated.timing;
var parallel = Animated.parallel;
var sequence = Animated.sequence;
var stagger = Animated.stagger;

var defaultDefinition = "Hold down on a tile to view the definition";

var _this;

var bingos = {
  1: { 1: 0, 2: 1, 3: 2, 4: 3, 5: 4, active: false},
  2: { 1: 5, 2: 6, 3: 7, 4: 8, 5: 9, active: false},
  3: { 1: 10, 2: 11, 3: 12, 4: 13, 5: 14, active: false},
  4: { 1: 15, 2: 16, 3: 17, 4: 18, 5: 19, active: false},
  5: { 1: 20, 2: 21, 3: 22, 4: 23, 5: 24, active: false},
  6: { 1: 0, 2: 5, 3: 10, 4: 15, 5: 20, active: false},
  7: { 1: 1, 2: 6, 3: 11, 4: 16, 5: 21, active: false},
  8: { 1: 2, 2: 7, 3: 12, 4: 17, 5: 22, active: false},
  9: { 1: 3, 2: 8, 3: 13, 4: 18, 5: 23, active: false},
  10: { 1: 4, 2: 9, 3: 14, 4: 19, 5: 24, active: false},
  11: { 1: 0, 2: 6, 3: 12, 4: 18, 5: 24, active: false},
  12: { 1: 4, 2: 8, 3: 12, 4: 16, 5: 20, active: false}
}
  var tileColors = [];
  var tileStatus = [];
  var tileMargins = [];
  var tileWidth = deviceWidth / 5 + .2/* - 6*/;
  var twentyFive = [0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24];

class Bingo extends Component {

  constructor(props){
    super(props);
    _this = this;

    // tileOptions = this.props.tiles.data;
    tileOptions = tileOptions;
    tileOptionsCount = tileOptions.length;
    
    for(var i = 0; i < 25; i++){
      tileColors[i] = innactive;
      tileStatus[i] = 0;
    }

    var shiftDistance = -(deviceHeight/2 + deviceWidth/2 + 50);
    this.anims = twentyFive.map(() => new Animated.Value(shiftDistance));
    this.shadowAnims = twentyFive.map(() => new Animated.Value(0));
    this._animatedValues = twentyFive.map(() => new Animated.Value(0));
    this.colorAnims = twentyFive.map((index) => this._animatedValues[index].interpolate({
      inputRange: [0,1,2],
      outputRange: [innactive, active, victory]
    }));
    this.definitionAnim = new Animated.Value(deviceWidth)
    this.bingoAnims = [0,1,2,3,4,5].map(() => new Animated.Value(0));
    this.opacityAnims = twentyFive.map(() => new Animated.Value(1));
    var generatedData = this.generateTiles();
    this.state = {
      shiftDistance: shiftDistance,
      tiles: generatedData.tiles,
      definitions: generatedData.defs,
      tileColors: tileColors,
      tileStatus: tileStatus,
      victoryX: new Animated.Value(30),
      victoryY: new Animated.Value(0),
      promptX: new Animated.Value(30),
      promptY: new Animated.Value(0),
      optionsX: new Animated.Value(30),
      optionsY: new Animated.Value(0),
      victoryRotate: new Animated.Value(0),
      touchable: false,
      currentDefinition: defaultDefinition,
    }
  }
  componentDidMount(){
    this.runStartingAnimation(1500);
  }
  reinitializeTileOptions(){
    for(key in tileOptions){
      tileOptions[key].selected = false;
    }
  }
  generateTiles(){
    var randomSelection = [];
    tileOptions[0].selected=true;
    randomSelection.push(tileOptions[0])
    while(randomSelection.length < 25){
      var randSelect = Math.floor((Math.random() * tileOptionsCount));
      if(!tileOptions[randSelect].selected){
        randomSelection.push(tileOptions[randSelect]);
        tileOptions[randSelect].selected = true;
      }
    }
    var generatedTiles = [];
    var generatedDefs = [];
    generatedTiles[12] = tileOptions[0].key;
    generatedDefs[12] = tileOptions[0].def;
    this.animateColor(12, ACTIVE);
    this.colorAnims[12]._value = active;
    tileColors[12] = active;
    tileStatus[12] = 1;
    var home;
    var rand;
    for(var i = 1; i < 25; i++){ // make it allow more than 25
      rand = Math.floor((Math.random() * 25));
      home = rand % 25;
      if(typeof generatedTiles[home] === 'undefined'){
        generatedTiles[home] = randomSelection[i].key;
        generatedDefs[home] = randomSelection[i].def;
      }else{
        while(typeof generatedTiles[home % 25] !== 'undefined'){
          home++;
        }
        generatedTiles[home%25] = randomSelection[i].key;
        generatedDefs[home%25] = randomSelection[i].def;
      }
    }
    return {tiles: generatedTiles, defs: generatedDefs};
  }

  tileTouch(tileSpace){
    if(!this.state.touchable || tileSpace == 12)
      return
    if(tileColors[tileSpace] == victory) this.resetVictoryColors(tileSpace);
    if(tileStatus[tileSpace] || this.colorAnims[tileSpace]._value == victory){
      this.colorAnims[tileSpace]._value = innactive;
      this.animateColor(tileSpace, INNACTIVE)
    }
    else{
      this.colorAnims[tileSpace]._value = active;
      this.animateColor(tileSpace, ACTIVE)
    }
    (tileStatus[tileSpace] || this.colorAnims[tileSpace]._value == victory) ? tileStatus[tileSpace] = 0 : tileStatus[tileSpace] = 1;
    this.setState({
      tileColors: tileColors,
      tileStatus: tileStatus,
    }, function(){
      this.checkGameStatus()
    })
  }
  setVictoryColors(obj, callback){
    for(var key in obj){
      // this.colorAnims[obj[key]]._config.outputRange[1] = victory;
      tileColors[obj[key]] = victory;
      if(key != 'active') this.animateColor(obj[key], VICTORY)
    }
    this.setState({tileColors: tileColors});
    callback()
  }
  resetVictoryColors(space){
    for(var k1 in bingos){
      if(bingos[k1].active){
        for(var k2 in bingos[k1]){
          if(bingos[k1][k2] == space && typeof bingos[k1][k2] !== "boolean"){ //Had to test for boolean. When space 1 the .active would compare as true
            for(var k3 in bingos[k1]){
              if(bingos[k1][k3] == space) continue; 
              if(k3 != 'active') this.animateColor(bingos[k1][k3], ACTIVE)
              tileColors[bingos[k1][k3]] = active;
              bingos[k1].active = false;
            }
            bingos[k1].active = false;
            this.setState({tileColors: tileColors})
          }
        }
      }
    }
    this.setState({tileColors: tileColors})
  }
  checkGameStatus(){
      for(var k1 in bingos){
        var victoryCount = 0;
        for(var k2 in bingos[k1]){
          if(tileStatus[bingos[k1][k2]])
            victoryCount++;
          else break;
        }
        if(victoryCount == 5){
          this.setVictoryColors(bingos[k1], function(){
            if(!bingos[k1].active){
              _this.runVictoryAnimation(bingos[k1]);
              bingos[k1].active = true;
            }
          })
        }else
          bingos[k1].active = false;
      }
  }
  generateNewBoard(){
    this.setState({touchable: false}, function(){
      this.runExitAnimation(this, function(_this){
        Animated.timing(_this.definitionAnim,{
          toValue: deviceWidth,
          easing: Easing.elastic(.75),
          duration: 1,
        }).start();
        _this.reinitializeTileOptions();
        _this.resetTileColors();
        var data = _this.generateTiles();
        _this.setState({tiles: data.tiles, definitions: data.defs, currentDefinition: defaultDefinition}, function(){
          this.runStartingAnimation(1500, function(){
            this.setState({touchable: true})
          });
        })
      });
    })
  }
  resetTileColors(){
    for(var i = 0; i < 25; i++){
      this.animateColor(i, INNACTIVE)
      this.colorAnims[i]._value = innactive;
      tileColors[i] = innactive;
      tileStatus[i] = 0;
    }
  }
  reinitializeVictory(_this){
    _this.setState({
      victoryY: new Animated.Value(0),
      // touchable: true,
    })
  }
  reset(){
    for(var i = 0; i < 25; i++){
      this.animateColor(i, INNACTIVE)
      this.colorAnims[i]._value = innactive
      tileColors[i] = innactive;
      tileStatus[i] = 0;
    }
    this.colorAnims[12]._value = active;
    this.animateColor(12, ACTIVE)
    tileColors[12] = active;
    tileStatus[12] = 1;
    if(this.state.currentDefinition !== defaultDefinition){
      Animated.sequence([
        timing(this.definitionAnim,{
          toValue: -deviceWidth,
          easing: Easing.elastic(.75),
          duration: 200
        }),
        timing(this.definitionAnim,{
          toValue: deviceWidth,
          easing: Easing.elastic(.75),
          duration: 1,
        })
        ]).start(function(){
          _this.setState({
            tileColors: tileColors,
            touchable: true,
            currentDefinition: defaultDefinition},function(){
              Animated.timing(this.definitionAnim,{
                toValue: 0,
                easing: Easing.elastic(.75),
                duration: 300,
              }).start()
            })
          
        })
    }
    
  }

  handleLongPressIn(tile){
    // this.setState({currentDefinition: this.state.definitions[tile]})
  }
  handlePressOut(tile){
    var opacityAnimObj = {
      toValue: 1,
      easing: Easing.elastic(1),
      duration: 700
    }
    var shadowAnimObj = {
      toValue: 0,
      easing: Easing.linear,
      duration: 500
    }
    var opacityAnimations = twentyFive.map((index) => timing(_this.opacityAnims[index],opacityAnimObj));
    var shadowAnimations = twentyFive.map((index) => timing(_this.shadowAnims[index],shadowAnimObj));
    Animated.parallel([
      parallel(opacityAnimations),
      parallel(shadowAnimations),
      sequence([
        timing(this.definitionAnim,{
          toValue: -deviceWidth,
          easing:Easing.elastic(.75),
          duration: 200,
        }),
        timing(this.definitionAnim,{
          toValue: deviceWidth,
          easing: Easing.linear,
          duration: 1,
        })
      ])
      
    ]).start(function(){
      _this.setState({currentDefinition: defaultDefinition},function(){
        Animated.timing(_this.definitionAnim,{
          toValue: 0,
          easing: Easing.elastic(.75),
          duration: 300
        }).start()
      })
    });
  }
  navigateBack(){
    this.reinitializeTileOptions();
    this.props.navigator.pop();
  }
  navigateHelp(){
    this.props.navigator.push({
      title: "Help",
      component: Help,
    });
  }
  showOptions(){
    this.setState({touchable: false}, function(){
      Animated.timing(this.state.optionsY, {
        toValue: - deviceHeight + (deviceHeight - (deviceWidth-60))/2 - 75,
        easing: Easing.elastic(1),
        duration: 500,
        delay: 300,
      }).start()
    })
    
  }
  navigateToDefinitions(){
    this.props.navigator.push({
      component: TileDefinitions,
      passProps:{tiles: this.state.tiles, defs: this.state.definitions}
    })
  }
  /*Animations*/
  runStartingAnimation(duration){
    var animObj = {
      toValue: 0,
      easing: Easing.elastic(1.1),
      duration: duration,
    }
    var animations = [0,1,2,3,4].map((index1) => stagger(80,[0,1,2,3,4].map((index2) => timing(this.anims[index1*5 + index2],animObj))));
    animations.push(timing(this.definitionAnim,{
        toValue: 0,
        easing: Easing.elastic(.75),
        duration: 400
      }))
    Animated.stagger(200,animations).start(function(){
      _this.setState({touchable: true})
    });
  }
  runVictoryAnimation(obj){
    var validTiles = []
    var values = Object.values(obj);
    for(var i = 0; i < 25; i++){
      if(values.indexOf(i) === -1)
        validTiles.push(i);
    }
    var opacityAnimObj1 = {
      toValue: .4,
      easing: Easing.elastic(1),
      duration: 750
    }
    var opacityAnimObj2 = {
      toValue: 1,
      easing: Easing.elastic(1),
      duration: 750
    }
    var animations1 = validTiles.map((index) => timing(this.opacityAnims[index],opacityAnimObj1))
    var animations2 = validTiles.map((index) => timing(this.opacityAnims[index],opacityAnimObj2))
    Animated.sequence([
      parallel(animations1),
      parallel(animations2)
    ]).start()
    this.setState({
      touchable: false,
    }, function(){
      timing(this.state.victoryY, {
        toValue: - deviceHeight + (deviceHeight - (deviceWidth-60))/2 - 75,
        easing: Easing.elastic(1),
        duration: 500,
        delay: 750,
      }).start(function(){
        clearInterval(_this.bingoBounceInterval)
        for(var i=0;i<_this.bingoAnims.length;i++)
          _this.bingoAnims[i]._value=0
        _this.animateBingoText();
        _this.bingoBounceInterval = setInterval(() => {
          _this.animateBingoText();
        }, 1500);
      });
    })
  }
  runExitAnimation(_this, callback){
    var animObj = {
      toValue: this.state.shiftDistance,
      easing: Easing.elastic(1.1),
      duration: 1000,
    }
    var animations = [0,1,2,3,4].map((index1) => stagger(100,[0,1,2,3,4].map((index2) => timing(_this.anims[index1*5+index2],animObj))))
    animations.push(timing(_this.definitionAnim,{
        toValue: -deviceWidth,
        easing: Easing.elastic(.75),
        duration: 200
      }))
    Animated.stagger(100,animations).start(function(){
      callback(_this);
    });
  }
  opacityAnimation(tile){
    var opacityAnimObj = {
      toValue: .6,
      easing: Easing.linear,
      duration: 400
    }
    var validTileArr = []
    for(var i = 0; i < 25; i++)
      if(i !== tile)
        validTileArr.push(i);
    var animations = validTileArr.map((index) => timing(_this.opacityAnims[index],opacityAnimObj));
    animations.push(timing(_this.shadowAnims[tile],{
      toValue: .75,
      easing:Easing.linear,
      duration: 400
    }))
    Animated.parallel([
      parallel(animations),
      sequence([
        timing(_this.definitionAnim,{
          toValue: -deviceWidth,
          easing: Easing.elastic(.75),
          duration: 200
        }),
        timing(_this.definitionAnim,{
          toValue: deviceWidth,
          easing: Easing.elastic(.75),
          duration: 1
        })
      ])
    ]).start(function(){
      _this.setState({currentDefinition: _this.state.definitions[tile]},function(){
        Animated.timing(_this.definitionAnim,{
          toValue: 0,
          easing: Easing.elastic(.75),
          duration: 300
        }).start()
      })
    });
  }
  definitionAnimation(value,duration,callback){
    Animated.timing(this.definitionAnim,{
      toValue: value,
      easing: Easing.elastic(.75),
      duration: duration
    }).start(function(){
      callback(_this);
    })
  }
  animateBingoText(){
    var animations = [0,1,2,3,4,5].map((index) => sequence([
      timing(this.bingoAnims[index],{
        toValue: -40,
        easing: Easing.elastic(.5),
        duration: 250,
      }),
      timing(this.bingoAnims[index],{
        toValue: 0,
        easing: Easing.bounce,
        duration: 500
      })
    ]));
    Animated.stagger(70,animations).start();
  }
  animateColor(index, value){
    Animated.timing(this._animatedValues[index], {
      toValue: value,
      duration: 500,
    }).start()
  }
  viewBoard(yAnim, reset){
    console.log('view board')
    clearInterval(this.bingoBounceInterval)
    this.setState({touchable: true}, function(){
      Animated.timing(yAnim,{
        toValue: 0,
        easing: Easing.elastic(1),
        duration: 500
      }).start(function(){
        // _this.reinitializeVictory(_this);
        if(reset)
          _this.generateNewBoard()
      });
    })
  };
  showResetPrompt(){
    this.setState({touchable: false}, function(){
      Animated.timing(this.state.promptY, {
        toValue: - deviceHeight + (deviceHeight - (deviceWidth-60))/2 - 75,
        easing: Easing.elastic(1),
        duration: 500,
        delay: 300,
      }).start()
    })
  }
  /*End Animations*/
  

  buildRow(index){
    return(
      <TouchableWithoutFeedback key={"tile_" + index} delayLongPress={100} delayPressIn={100} onPressIn={() => this.opacityAnimation(index)} onLongPress={() => this.handleLongPressIn(index)} onPressOut={() => this.handlePressOut(index)} onPress={() => this.tileTouch(index)}>
        <Animated.View style={[styles.tile, {width: tileWidth, height: tileWidth, transform: [{translateY: this.anims[index]}], backgroundColor: this.colorAnims[index], shadowOpacity: this.shadowAnims[index],opacity: this.opacityAnims[index]}]}>
          <Animated.View style={[styles.tile,{width: tileWidth, height: tileWidth}]}>
            <Text style={[styles.tileText]}>{this.state.tiles[index]}</Text>
          </Animated.View>
        </Animated.View>
      </TouchableWithoutFeedback>
    );
  }
  buildBoard(index){
    var element = index*5;
    return(
      <View key={element} style={styles.row}>
        {[0,1,2,3,4].map((_index) =>this.buildRow(element + _index))}
      </View>
    );
  }
  getBingoLetter(key,index){
    return(
      <Animated.View key={key} style={{transform: [{translateY: this.bingoAnims[index]}]}}>
        <TouchableHighlight underlayColor={'#E1E1E1'} onPress={() => this.bounce(index)}>
          <Text style={styles.bannerText}>{key}</Text>
        </TouchableHighlight>
      </Animated.View>
    )
  }
  bingoBanner(){
    return(
      <Animated.View style={[styles.banner,{transform:[{translateX: this.state.victoryX}, {translateY: this.state.victoryY}/*,{rotate: interpolateRotateAnimation}*/] }]}>
        <View style={{flexDirection: 'row'}}>
          {['B','I','N','G','O','!'].map((key,index) => this.getBingoLetter(key,index))}
        </View>
        <TouchableHighlight style={{backgroundColor: '#222222', padding: 10, width: deviceWidth - 90, height: (deviceWidth - 60)/6, alignItems: 'center'}} onPress={() => this.viewBoard(this.state.victoryY, false)}>
          <Text style={{color: '#FFFFFF',fontFamily: 'OpenSans', fontSize: tileWidth/3.5,justifyContent:'center'}}>Dismiss</Text>
        </TouchableHighlight>
      </Animated.View>
    )
  }
  optionsBanner(){
    return(
      <Animated.View style={[styles.banner,{transform:[{translateX:this.state.optionsX},{translateY:this.state.optionsY}]}]}>
        <TouchableHighlight style={{justifyContent: 'center', alignItems: 'center', padding: 10, width: deviceWidth - 90, height: (deviceWidth - 60)/6, backgroundColor: '#222222'}} onPress={() => this.navigateToDefinitions()}>
          <Text style={{color: '#FFFFFF',fontFamily: 'OpenSans', fontSize: tileWidth/5}}>View Definitions of Current Board</Text>
        </TouchableHighlight>
        <TouchableHighlight style={{justifyContent: 'center', alignItems: 'center', padding: 10, width: deviceWidth - 90, height: (deviceWidth - 60)/6, backgroundColor: '#222222'}} onPress={() => this.navigateHelp()}>
          <Text style={{color: '#FFFFFF',fontFamily: 'OpenSans', fontSize: tileWidth/5}}>How To Play</Text>
        </TouchableHighlight>
        <TouchableHighlight style={{justifyContent: 'center', alignItems: 'center', padding: 10, width: deviceWidth - 90, height: (deviceWidth - 60)/6, backgroundColor: '#222222'}} onPress={() => this.viewBoard(this.state.optionsY, false)}>
          <Text style={{color: '#FFFFFF',fontFamily: 'OpenSans', fontSize: tileWidth/5}}>Dismiss</Text>
        </TouchableHighlight>
      </Animated.View>
    )
  }
  resetPrompt(){
    return(
      <Animated.View style={[styles.banner,{transform:[{translateX: this.state.promptX}, {translateY: this.state.promptY}/*,{rotate: interpolateRotateAnimation}*/] }]}>
        <View style={{flexDirection: 'column', justifyContent: 'center', alignItems:'center', height: (deviceWidth - 60)/2}}>
          <Text style={{fontSize: tileWidth / 2}}>Are You Sure?</Text>
          <Text style={{fontSize: tileWidth / 3.5, textAlign: 'center', padding: 10}}>The current board and progress will be lost.</Text>
        </View>
        <View style={{justifyContent:'space-around', height: (deviceWidth - 60)/2}}>
          <TouchableHighlight style={{justifyContent: 'center', backgroundColor: '#222222', padding: 10, width: deviceWidth - 90, alignItems: 'center', height: (deviceWidth - 60)/6}} onPress={() => this.viewBoard(this.state.promptY, true)}>
            <Text style={{color: '#FFFFFF',fontFamily: 'OpenSans', fontSize: tileWidth/3.5}}>Yes</Text>
          </TouchableHighlight>
          <TouchableHighlight style={{justifyContent: 'center', backgroundColor: '#222222', padding: 10, width: deviceWidth - 90, alignItems: 'center', height: (deviceWidth - 60)/6}} onPress={() => this.viewBoard(this.state.promptY, false)}>
            <Text style={{color: '#FFFFFF',fontFamily: 'OpenSans', fontSize: tileWidth/3.5}}>No</Text>
          </TouchableHighlight>
        </View>
      </Animated.View>
    )
  }

  render() {
      return (
        <View style={styles.container}>
        <StatusBar barStyle={'default'}/>
          <View style={styles.boardAndMenu}>
            <View style={styles.menu}>
              <TouchableHighlight /*underlayColor={'#6E6E6E'}*/ activeOpacity={.5} style={styles.button} onPress={() => this.navigateBack()}>
                <Text style={styles.buttonText}>Back</Text>
              </TouchableHighlight>
              <TouchableHighlight /*underlayColor={'#6E6E6E'}*/ activeOpacity={.5} style={styles.button} onPress={() => /*this.generateNewBoard()*/this.showResetPrompt()}>
                <Text style={styles.buttonText}>New Board</Text>
              </TouchableHighlight>
              <TouchableHighlight /*underlayColor={'#6E6E6E'}*/ activeOpacity={.5} style={styles.button} onPress={() => this.reset()}>
                <Text style={styles.buttonText}>Reset</Text>
              </TouchableHighlight>
              <TouchableHighlight /*underlayColor={'#6E6E6E'}*/ activeOpacity={.5} style={styles.button} onPress={() => this.showOptions()}>
                <Text style={styles.buttonText}>Options</Text>
              </TouchableHighlight>
            </View>

            <View style={styles.bingoBoard}>
              {[0,1,2,3,4].map((index) => this.buildBoard(index))}
            </View>
          </View>
          <View style={styles.definitionContainer}>
            <Animated.View style={{backgroundColor: 'transparent', transform: [{translateX: this.definitionAnim}]}}>
              <Text style={styles.definitionText}>{this.state.currentDefinition}</Text>
            </Animated.View>
          </View>

          {this.bingoBanner()}
          {this.resetPrompt()}
          {this.optionsBanner()}
          
        </View>
      );
    }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#E1E1E1',
  },
  button:{
    backgroundColor: '#222222',
    height: 50,
    justifyContent: 'center',
    alignItems:'center'
  },
  buttonText:{
    paddingRight: 20,
    paddingLeft: 20,
    color: '#FFFFFF',
    fontFamily: 'OpenSans',
    fontSize: tileWidth / 6,
  },
  menu:{
    marginTop: 20,
    flexDirection: 'row',
    backgroundColor: '#222222',
    width: deviceWidth,
    justifyContent: 'space-around',
  },
  boardAndMenu:{
    flexDirection: 'column',
    alignSelf: 'flex-start',
  },
  bingoBoard:{
    height: deviceWidth,
    width: deviceWidth,
    backgroundColor: '#6E6E6E',
    flex: 1,
    justifyContent: 'space-around',
  },
  row:{
    flexDirection: 'row',
    width: deviceWidth,
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  tile:{
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#222222',
    shadowOffset: {width: -6, height: -6},
    shadowRadius: 1.25,
    padding: 3,
    width: tileWidth,
    height: tileWidth
  },
  tileText:{
    textAlign: 'center',
    color: '#FFFFFF',
    fontFamily: 'OpenSans',
    fontSize: tileWidth / 6.5,
  },
  definitionContainer:{
    alignSelf: 'flex-end',
    padding: 15,
    backgroundColor: /*'#6E6E6E'*/'#E1E1E1',
    width: deviceWidth,
    height: deviceHeight - deviceWidth - 50 - 20,
    marginBottom: 75,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 10,
    borderColor: '#222222'
  },
  definitionText:{
    color: '#000',
    fontFamily: 'OpenSans',
    textAlign: 'center',
    fontSize: tileWidth/3,
  },
  banner:{
    backgroundColor: '#E1E1E1',
    justifyContent: 'space-around',
    alignItems: 'center',
    position: 'absolute',
    opacity: 1,
    borderWidth: 1,
    width: deviceWidth - 60,
    height: deviceWidth - 60,
  },
  bannerText:{
    fontSize: tileWidth,
    fontFamily: 'OpenSans',
  }

});

module.exports = Bingo;