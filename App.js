/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, {Component} from 'react';
import {Platform, StyleSheet, Text, View, Image, Button, Alert, ScrollView, CameraRoll, PermissionsAndroid} from 'react-native';

const instructions = Platform.select({
  ios: 'Press Cmd+R to reload,\n' + 'Cmd+D or shake for dev menu',
  android:
    'Double tap R on your keyboard to reload,\n' +
    'Shake or press menu button for dev menu',
});



type Props = {};
export default class App extends Component<Props> {
    constructor(props){
        super(props);
        this.state = {
            photos: [],
        }
    }
    _handleButtonPress = () => {
       //Checks for permissions and asks user if not already obtained
       console.log(PermissionsAndroid.check(PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE));
       if (PermissionsAndroid.check(PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE))
       {
       //Loads the camera roll
        CameraRoll.getPhotos({
                   first: 20,
                   assetType: 'Photos',
                 })
                 .then(r =>
                   this.setState({ photos: r.edges }))
                 .catch((err) => {
                    //Error Loading Images
                    Alert.alert('Error Loading Images');
                    console.log(err);

                 })
       }

       else {
            const granted = PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
             {'title': 'Requesting Camera Roll Access.','message': 'TEST'});

            if(granted === PermissionsAndroid.RESULTS.GRANTED){
                CameraRoll.getPhotos({
                                   first: 20,
                                   assetType: 'Photos',
                                 })
                                 .then(r =>
                                   this.setState({ photos: r.edges }))
                                 .catch((err) => {
                                    //Error Loading Images
                                    Alert.alert('Error Loading Images');
                                    console.log(err);

                                 })
            } else {
                Alert.alert('Did Not Grant Permission To Access Camera Roll.')
            }

       }

       };

    _postTest = () => {
        var data = new FormData();
        data.append('imageLoc', 'serial.png');

        fetch('https://cs425.alextait.net/test.php', {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'multipart/form-data',
            },
            body: data
        })
        .then((response) => {
            console.log(data);
            console.log(response);
        })
        .catch((error) => {
            console.error(error);
        });
    };
  render() {
    return (
      <View style={{flexDirection:'column'}}>

        <View style={{flexDirection:'row'}}>
            <Button style={{flexDirection:'row'}} onPress={this._handleButtonPress}
               title = "Load Image"
            />
            <Button style={{flexDirection:'row', alignItems:'flex-end'}} onPress={this._postTest}
               title = "Process Image"
            />
        </View>

        <ScrollView contentContainerStyle={styles.gallery}>
          {this.state.photos.map((p,i) => {
          return (
            <Image
                key={i}
                style = {{
                  width: 100,
                  height: 100,
                }}
                source={{ uri: p.node.image.uri}}
            />
          );
          })}
        </ScrollView>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  },
  button: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'flex-start',

  },
  gallery: {
    flexWrap: 'wrap',
    flexDirection: 'row',
  },
});

