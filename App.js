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
  FlatList,
  Dimensions,
  } from 'react-native';
import { createStackNavigator, createAppContainer } from "react-navigation";
import ImagePicker from 'react-native-image-picker';



class HomeScreen extends React.Component {

  static navigationOptions = {
      header: null,
    };

  constructor(props) {
    super(props);
    this.state = {
      titleText: "Please choose how you would like to load an image.",
      imageSelected: false,
      notParsed: true,
    };
  }


  _cameraButton = () =>{
    const options = {
      title: 'Select Image',
      storageOptions: {
        skipBackup: true,
        path: 'images',
      },
    };

    ImagePicker.launchCamera(options, (response) => {
      console.log('Response = ', response);

      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.error) {
        console.log('ImagePicker Error: ', response.error);
      } else if (response.customButton) {
        console.log('User tapped custom button: ', response.customButton);
      } else {
        const source = { uri: response.uri, type: response.type};

        // You can also display the image using data:
        // const source = { uri: 'data:image/jpeg;base64,' + response.data };

        this.setState({
          parseSource: source,
          imageSelected: true,
        });
        console.log(source);
      }
    });
    Alert.alert('You tapped the button!'); //replace with button function

  }

  _galleryButton = () =>{
      const options = {
        title: 'Select Image',
        storageOptions: {
          skipBackup: true,
          path: 'images',
        },
      };

      ImagePicker.launchImageLibrary(options, (response) => {
        console.log('Response = ', response);

        if (response.didCancel) {
          console.log('User cancelled image picker');
        } else if (response.error) {
          console.log('ImagePicker Error: ', response.error);
        } else if (response.customButton) {
          console.log('User tapped custom button: ', response.customButton);
        } else {
          const source = { uri: response.uri, type: response.type};

          // You can also display the image using data:
          // const source = { uri: 'data:image/jpeg;base64,' + response.data };

          this.setState({
            parseSource: source,
            imageSelected: true,
          });
          console.log(source);
        }
      });
      Alert.alert('You tapped the button!'); //replace with button function

    }

async requestExternalStoragePermission(){
        try {
            const granted = await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
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

  async requestCameraPermission(){
          try {
              const granted = await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.CAMERA,
                   {'title': 'Requesting Camera Access.','message': 'TEST'});

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

    _post = () =>{
            var data = new FormData();
            data.append('photo', {uri: this.state.parseSource.uri, type: this.state.parseSource.type, name:'testPhoto',});
            data.append('imageLoc', 'serial.png');

            return fetch('https://cs425.alextait.net/docuTest.php', {
                method: 'POST',
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'multipart/form-data',
                },
                body: data
            })
            .then((response) => { console.log(response); return response.json();})
            .then((receivedData) => {
                console.log(data);

                console.log(this.state.notParsed);
                console.log(receivedData.Strings.length);
                this.setState({
                    notParsed: false,
                    parsedStrings: receivedData.Strings,
                    uri: receivedData.imageURL,
                }, function(){});
                console.log(this.state.uri);
            })
            .catch((error) => {
                console.error(error);
            });
        }

  _reset = () => {
        this.setState({
            imageSelected: false,
            notParsed: true,
        });
  }

  render() {
    this.requestExternalStoragePermission();
    this.requestCameraPermission();
    const {navigate} = this.props.navigation;

    if(this.state.imageSelected === false)
    {
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
                  onPress={this._galleryButton}

                />
                </View>
            </View>
          </View>
        );
    }
    else
    {
        if(this.state.notParsed)
        {
            return (
                      <View style={styles.container3}>

                       <Image source = {this.state.parseSource} style = {styles.imageStyle} />

                        <View style={styles.container2}>
                            <View style={styles.buttonContainer}>
                                <Button
                                  title="Parse"
                                  color="#841584"
                                  onPress={this._post}
                                />
                             </View>
                             <View style={styles.buttonContainer}>
                                 <Button
                                   title="Reset"
                                   color="#841584"
                                   onPress={this._reset}
                                 />
                              </View>

                        </View>
                      </View>
                    );
        }
        else
        {
            return (

                        <View style={styles.container3} >
                            <View style={styles.boxedImage} >
                                <Image source={{uri: this.state.uri}} style = {styles.imageStyle} />
                            </View>
                            <View style={styles.buttonContainer}>
                                <Button
                                  title="Reset"
                                  color="#841584"
                                  onPress={this._reset}
                                />
                             </View>
                            <View style={styles.buttonContainer}>
                                <FlatList
                                    data={this.state.parsedStrings}
                                    renderItem={({item}) => <Text>{item.Word}{"\n"}Bounds:{"\n"}{item.Bounds}</Text>}
                                />
                            </View>
                        </View>
                    );
        }
    }
  }
}

class GalleryScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      checkedPermissions: false,
      photos: [],
    };
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

class ParseScreen extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            notParsed : true,
            imageSourceLoaded : false,
            uri : '',
            parsedStrings : [],

        };
    }
    _upload = () => {
        var data = new FormData();
        console.log(this.state.imageSource);
        console.log(this.state.imageSource.type);
        data.append('photo', {uri: this.state.imageSource.uri, type: this.state.imageSource.type, name:'testPhoto',});
        console.log(data);
        data.append('imageLoc', 'serial.png');
        return fetch('https://cs425.alextait.net/docuTest.php', {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'multipart/form-data',
            },
            body: data,
        })
        .then(response => {
            console.log(data);
            console.log(response);
        });
    }
    _post = () =>{
        var data = new FormData();
        data.append('photo', {uri: this.state.imageSource.uri, type: this.state.imageSource.type, name:'testPhoto',});
        data.append('imageLoc', 'serial.png');

        return fetch('https://cs425.alextait.net/docuTest.php', {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'multipart/form-data',
            },
            body: data
        })
        .then((response) => { console.log(response); return response.json();})
        .then((receivedData) => {
            console.log(data);

            console.log(this.state.notParsed);
            console.log(receivedData.Strings.length);
            this.setState({
                notParsed: false,
                parsedStrings: receivedData.Strings,
                uri: receivedData.imageURL,
            }, function(){});
            console.log(this.state.uri);
        })
        .catch((error) => {
            console.error(error);
        });
    }

    render() {
        const {navigate} = this.props.navigation;
        const imageSource = this.props.navigation.getParam('imageSource', 'null');
        if(this.state.imageSourceLoaded === false)
        {
            console.log(imageSource);
            this.setState({imageSource: imageSource, imageSourceLoaded: true,});
        }
        if(this.state.notParsed)
        {
            return (
                <View style={styles.container1} >

                    <View style={styles.boxedImage} >
                        <Image source={imageSource} style = {styles.imageStyle} />
                    </View>
                    <View style={styles.buttonContainer}>
                        <Button
                            title = "Parse Image"
                            color = "#841584"
                            onPress={this._post}
                        />
                    </View>
                </View>
            );
        }
        return (

            <View style={styles.container3} >
                <View style={styles.boxedImage} >
                    <Image source={{uri: this.state.uri}} style = {styles.imageStyle} />
                </View>
                <View style={styles.buttonContainer}>
                    <FlatList
                        data={this.state.parsedStrings}
                        renderItem={({item}) => <Text>{item.Word}{"\n"}Bounds:{"\n"}{item.Bounds}</Text>}
                    />
                </View>
            </View>
        );
    }
}
const AppNavigator = createStackNavigator({
  Home: {screen: HomeScreen},
  //Camera: {screen: CameraScreen},
  Gallery: {screen: GalleryScreen},
  Parse: {screen: ParseScreen},
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
    justifyContent: 'center',
    marginLeft: 20,
    marginRight: 20,
  },
  container3: {
      flex: 1,
      justifyContent: 'space-between',
      marginLeft: 0,
      marginRight: 0,
    },
  container1: {
    flex: 1,
    justifyContent: 'center',

  },
  buttonContainer: {
    margin: 0,
  },
  boxedImage: {
      margin: 0,
    },
  gallery: {
    flexWrap: 'wrap',
    flexDirection: 'row',
  },
  imageStyle: {
    width: Dimensions.get('window').width ,
    height:200
  },
});
