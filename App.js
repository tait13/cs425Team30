import React, {Component} from 'react';
import {
  Platform,
  StyleSheet,
  Button,
  Alert,
  Registry,
  Text,
  View,
  ScrollView,
  CameraRoll,
  Image,
  PermissionsAndroid,
  } from 'react-native';
import { createStackNavigator, createAppContainer } from "react-navigation";

class HomeScreen extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      titleText: "Please choose how you would like to load an image. boom",
    };
  }

  _cameraButton() {
    Alert.alert('You tapped the button!'); //replace with button function
  };

  render() {
    const {navigate} = this.props.navigation;
    return (
      <View style={styles.container2}>

       <Text style={styles.text1}>
          {this.state.titleText}{'\n'}{'\n'}
        </Text>

        <View style={styles.container1}>

          <View style={styles.buttonContainer}>
            <Button
              onPress={this._cameraButton}
              title="Camera"
            />
          </View>

          <View style={styles.buttonContainer}>
            <Button
              title="Gallery"
              color="#841584"
              onPress={() => navigate('Gallery')}

            />
          </View>

        </View>
      </View>
    );
  }
}

class GalleryScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      checkedPermissions: false,
      photos: [],
    };
    console.log("------------------------------------------------");
    console.log(PermissionsAndroid.check(PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE));
    console.log("------------------------------------------------");

  }
  async requestExternalStoragePermission() {
        try {
            const granted = PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
                 {'title': 'Requesting Camera Roll Access.','message': 'TEST'});

                if(granted === PermissionsAndroid.RESULTS.GRANTED){

                } else {
                    Alert.alert('Did Not Grant Permission To Access Camera Roll.')
                }

           }
        catch (err){
            console.warn(err);
        }

        return;
  }

  render(){

        console.log(this.state.checkedPermissions);
        try{
            if(this.state.checkedPermissions !== true)
            {
                console.log(this.checkedPermissions);
                this.requestExternalStoragePermission();

                CameraRoll.getPhotos({
                       first: 20,
                       assetType: 'Photos',
                     })
                     .then(r =>
                       this.setState({ photos: r.edges }))
                     .catch((err) => {
                        //Error Loading Images
                        Alert.alert('Error Loading Images. Does the device have access to the necessary permissions.');
                        console.log(err);

                     })
                 this.setState({checkedPermissions : true});
            }
        }
        catch (err){
            console.warn(err);
        }
        console.log(this.checkedPermissions);

    const {navigate} = this.props.navigation;


    return(
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
      );
    }
  }


const AppNavigator = createStackNavigator({
  Home: {screen: HomeScreen},
  //Camera: {screen: CameraScreen},
  Gallery: {screen: GalleryScreen},
});

export default createAppContainer(AppNavigator);

const styles = StyleSheet.create({
  text1: {
    fontSize: 24,
    justifyContent: 'center',
    fontWeight: 'bold',
    alignItems: 'center',
    marginLeft: 20,
    marginRight: 20,
    marginTop: 150,
  },
  container2: {
    flex: 1,
    justifyContent: 'space-between',
    marginLeft: 20,
    marginRight: 20,
  },
  container1: {
    flex: 1,
    justifyContent: 'center',

  },
  buttonContainer: {
    margin: 20,
  },
  gallery: {
    flexWrap: 'wrap',
    flexDirection: 'row',
  },
});
