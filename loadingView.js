import React, { Component } from 'react';
import {
  AppRegistry,
  StyleSheet,
  Text,
  View,
  NavigatorIOS,
  ScrollView,
  TouchableHighlight,
  StatusBar,
  ActivityIndicatorIOS
} from 'react-native';


var deviceWidth = require('Dimensions').get('window').width;
var deviceHeight = require('Dimensions').get('window').height;

class LoadingView extends Component {
	constructor(props) {
	  super(props);
	
	  this.state = {};
	}
	render(){
		return (
			<View style={styles.loadingContainer}>
			  <Text style={styles.loadingText}>LOADING...</Text>
			  <ActivityIndicatorIOS style={styles.scrollSpinner}/>
			</View>
		);
	}
};

const styles = StyleSheet.create({
	loadingContainer: {
		flex: 1,
		justifyContent: 'space-around',
		alignItems: 'center',
		backgroundColor: 'white',
		paddingTop: 15,
		paddingBottom: 15,
	},
	reloadWrapper: {
		height: 60,
		marginTop: 10,
	},
	loadingText: {
		alignSelf: 'center',
		fontSize: 15,
		fontFamily: 'OpenSans',
		letterSpacing: 3,
		color: '#5D5035',
		fontWeight: '300'
	},
	scrollSpinner: {
		backgroundColor: 'white',
		width: deviceWidth,
		height: 50,
		marginTop: 10,
	}
})


module.exports = LoadingView;