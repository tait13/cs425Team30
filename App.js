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
import ImagePicker from 'react-native-image-picker';

class HomeScreen extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      titleText: "Welcome!",
      avatarSource: null,
    };
    this.selectPhotoTapped = this.selectPhotoTapped.bind(this);
  }

  selectPhotoTapped() {
      const options = {
        quality: 1.0,
        maxWidth: 500,
        maxHeight: 500,
        storageOptions: {
          skipBackup: true,
        },
      };

      ImagePicker.showImagePicker(options, (response) => {
        console.log('Response = ', response);

        if (response.didCancel) {
          console.log('User cancelled photo picker');
        } else if (response.error) {
          console.log('ImagePicker Error: ', response.error);
        } else if (response.customButton) {
          console.log('User tapped custom button: ', response.customButton);
        } else {
          let source = { uri: response.uri };

          // You can also display the image using data:
          // let source = { uri: 'data:image/jpeg;base64,' + response.data };

          this.setState({
            avatarSource: source,
          });
        }
      });
    }


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
              title="Gallery"
              color="#841584"
              onPress={this.selectPhotoTapped.bind(this)}>
              <View
                style={[
                  styles.avatar,
                  styles.avatarContainer,
                  { marginBottom: 20 },
                ]}
              >
                {this.state.avatarSource === null ? (
                  <Text>Select a Photo</Text>
                ) : (
                  <Image style={styles.avatar} source={this.state.avatarSource} />
                )}
              </View>

            />
          </View>

        </View>
      </View>
    );
  }
}

// class GalleryScreen extends React.Component {
//   constructor(props) {
//     super(props);
//     this.state = {
//       checkedPermissions: false,
//       photos: [],
//     };
//     console.log("------------------------------------------------");
//     console.log(PermissionsAndroid.check(PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE));
//     console.log("------------------------------------------------");

//   }
//   async requestExternalStoragePermission() {
//         try {
//             const granted = PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
//                  {'title': 'Requesting Camera Roll Access.','message': 'TEST'});

//                 if(granted === PermissionsAndroid.RESULTS.GRANTED){

//                 } else {
//                     Alert.alert('Did Not Grant Permission To Access Camera Roll.')
//                 }

//            }
//         catch (err){
//             console.warn(err);
//         }

//         return;
//   }

//   render(){

//         console.log(this.state.checkedPermissions);
//         try{
//             if(this.state.checkedPermissions !== true)
//             {
//                 console.log(this.checkedPermissions);
//                 this.requestExternalStoragePermission();

//                 CameraRoll.getPhotos({
//                        first: 20,
//                        assetType: 'Photos',
//                      })
//                      .then(r =>
//                        this.setState({ photos: r.edges }))
//                      .catch((err) => {
//                         //Error Loading Images
//                         Alert.alert('Error Loading Images. Does the device have access to the necessary permissions.');
//                         console.log(err);

//                      })
//                  this.setState({checkedPermissions : true});
//             }
//         }
//         catch (err){
//             console.warn(err);
//         }
//         console.log(this.checkedPermissions);

//     const {navigate} = this.props.navigation;


//     return(
//         <ScrollView contentContainerStyle={styles.gallery}>

//           {this.state.photos.map((p,i) => {

//           return (

//             <Image

//               key={i}
//               style = {{
//                 width: 100,
//                 height: 100,
//               }}

//               source={{ uri: p.node.image.uri}}

//             />
//           );
//         })}

//         </ScrollView>
//       );
//     }
//   }


const AppNavigator = createStackNavigator({
  Home: {screen: HomeScreen},
  //Camera: {screen: CameraScreen},
  //Gallery: {screen: GalleryScreen},
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
