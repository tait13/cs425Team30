import React, {Component} from 'react';
import {
  Platform,
  StyleSheet,
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
  ActivityIndicator,
  TouchableHighlight,
  TouchableOpacity,
  TextInput,
  } from 'react-native';
import { createStackNavigator, createAppContainer } from "react-navigation";
import ImagePicker from 'react-native-image-picker';
import { Container, Header, Title, Content, Footer, FooterTab, Button, Left, Right, Body, Icon, Item, Input, Picker, Form } from 'native-base';



class HomeScreen extends React.Component {

  static navigationOptions = {
      header: null,
    };

  //Default constructor for Home Screen
  constructor(props) {
    super(props);
    this.state = {
      titleText: "Please choose how you would like to load an image.",
      imageSelected: false,
      notParsed: true,
      test: false,
      postCalled: false,
      databaseLoaded: false,
      refresh: false,
    };
  }

//Manages Camera
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

  }

  //Manages Gallery Access
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

    }

//Request permission to access android device storage
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
//Request permission to access android camera
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

//Used to parse an image
//Uploads image to webserver using POST call and recieves parsed data as json
_post = () =>{
        this.setState({
            postCalled: true,
        });
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
        .then((response) => {
          console.log(response);
          return response.json();
          })
        .then((receivedData) => {
            console.log(data);

            console.log(this.state.notParsed);
            console.log(receivedData);

            this.setState({
                notParsed: false,
                parsedStrings: receivedData.Strings,
                origUri: receivedData.originalImage,
                uri: receivedData.imageURL,
                wordObjArray: [],
                currentJSON: JSON.stringify(receivedData),
            }, function(){});


            console.log(this.state.parsedStrings.length);

            //Push words to new array
            
            for(wordIndex = 0; wordIndex < this.state.parsedStrings.length; wordIndex++)
            {
              var wordObj = {Word:this.state.parsedStrings[wordIndex].Word, Bounds:this.state.parsedStrings[wordIndex].Bounds};
              // console.log(wordObj);
              this.state.wordObjArray.push(wordObj);
              this.state.parsedStrings[wordIndex].selectedValueIndex = -1;

            }
            // console.log(this.state.wordObjArray);
            console.log(this.state.parsedStrings.length);
            console.log(this.state.wordObjArray.length);
            console.log(this.state.parsedStrings);
            console.log(this.state.uri);
        })
        .catch((error) => {
            console.error(error);
        });
    }

//Sets state back to home
_reset = () => {
      this.setState({
          imageSelected: false,
          notParsed: true,
          test: false,
          postCalled: false,
          databaseLoaded: false,
          refresh: false,
          loadedSingleObject: false,
      });
}

//Accesses database to view every upload asset
_database = () => {
      this.setState({
          databaseLoaded: true,
      });
      var data = new FormData();
      data.append('Total', 25);

      return fetch('https://cs425.alextait.net/retrieveAssets.php', {
          method: 'POST',
          headers: {
              Accept: 'application/json',
              'Content-Type': 'multipart/form-data',
          },
          body: data
      })
      .then((response) => {
        console.log(response);
        return response.json();
        })
      .then((receivedData) => {
          console.log(data);
          console.log(receivedData);

          this.setState({
              retrievedData: receivedData.rows,
              totalRows: receivedData.rowCount,
          }, function(){});
      })
      .catch((error) => {
          console.error(error);
      });
}

//Uploads asset data to the database
_upload = () => {
      var data = new FormData();
      data.append('originalImageLoc', this.state.origUri);
      data.append('boxedImageLoc', this.state.uri);
      data.append('name', 'test');

      console.log(this.state.currentJSON);
      data.append('json', this.state.currentJSON)

      console.log(data);

      return fetch('https://cs425.alextait.net/databaseUpload.php', {
                      method: 'POST',
                      headers: {
                          Accept: 'text/plain',
                          'Content-Type': 'multipart/form-data',
                      },
                      body: data
                  })
                  .then((response) => { console.log(response); return response;})
                  .catch((error) => {
                      console.error(error);
                  });
}

//Passes creation time of selected asset to the server to retrieve its' parsed data
_chooseFromDatabase = (item) => {
      console.log(item);
      this.setState({
                  loadedSingleObject: true,
              });
              var data = new FormData();
              data.append('creationTime', item.creationTime);

              return fetch('https://cs425.alextait.net/retrieveSpecificAsset.php', {
                  method: 'POST',
                  headers: {
                      Accept: 'application/json',
                      'Content-Type': 'multipart/form-data',
                  },
                  body: data
              })
              .then((response) => {
                console.log(response);
                return response.json();
                })
              .then((receivedData) => {
                  console.log(data);
                  console.log(receivedData);

                  this.setState({
                      creationTime: receivedData.creationTime,
                      originalImageLoc: receivedData.originalImageLoc,
                      boxedImageLoc: receivedData.boxedImageLoc,
                      parsedStrings: JSON.parse(receivedData.assetJSON),
                      
                  }, function(){});

                  console.log(this.state.parsedStrings);
              })
              .catch((error) => {
                  console.error(error);
              });
}

_homeScreenRender = () =>
{
  //Home Screen render
  return (
    <View style={styles.container2}>

    {/* <Text style={styles.text1}>
        {this.state.titleText}{'\n'}{'\n'}
      </Text> */}
      
      <View style={styles.container1}>
      <Image source={{uri: 'https://cs425.alextait.net/unrlogo.png'}} style = {{alignSelf: "center", width:200, height:200, marginBottom: 20, }}/>
      
          <Button iconLeft block backgroundColor="#66ccff" style = {{marginBottom: 2}} onPress={this._cameraButton}>
            <Icon name="camera" />
            <Text>  Camera</Text>
          </Button>

          <Button iconLeft block backgroundColor="#33ccff" style = {{marginBottom: 2}} onPress={this._galleryButton}>
            <Icon name="image" />
            <Text>  Gallery</Text>
          </Button>
          <Button iconLeft block backgroundColor="#66ccff" style = {{marginBottom: 2}} onPress={this._database}>
            <Text>  Previous Uploads</Text>
          </Button>
        
      </View>
    </View>
  );

}

_databaseViewRender = () => 
{
  //Renders screen to view database entries
  return (
    <View style={styles.container3} >
      <Header style={{ backgroundColor: '#33ccff' }}>
        <Left>
          <Button transparent onPress={this._reset}>
            <Icon name='arrow-back' />
            <Text> Back </Text>
          </Button>
        </Left>
        <Body>

        </Body>
      </Header>
      <View style={styles.buttonContainer}>
          <View style={styles.centeredSmallText}>
          <Text>Total Results: {this.state.totalRows}</Text>
          </View>
          <FlatList

              data={this.state.retrievedData}
              renderItem={({item}) =>


                    <TouchableOpacity style={styles.touchableContainer} onPress={() => this._chooseFromDatabase(item)}>
                    <View style={styles.centeredSmallText}>
                    <Text>Creation Time: {item.creationTime}</Text>
                    <Image source = {{uri: item.originalImageLoc}} style = {styles.imageStyle} />
                    </View>
                    </TouchableOpacity>
              }
          />
      </View>
  </View>
  );
}

_singleDatabaseEntryRender = () => 
{
  return (
    <View style={styles.container3} >
    <Header style={{ backgroundColor: '#33ccff' }}>
    <Left>
      <Button transparent onPress={this._reset}>
        <Icon name='home' />
        <Text> Home </Text>
      </Button>
    </Left>
    <Body>

    </Body>
    </Header>
        <View style={styles.boxedImage} >
            <Image source={{uri: this.state.boxedImageLoc}} style = {styles.imageStyle} />
        </View>
        <Text>Already in Database</Text>

        <View style={styles.buttonContainer}>
            <FlatList
                data={this.state.parsedStrings}

                renderItem={({item}) => <Text>{item.Word}{"\n"}Bounds:{"\n"}{item.Bounds}</Text>}


            />
        </View>
    </View>
  );
}

_readyToParseRender = () =>
{
  //Renders screen to view selected image and parse
  return (
    <Container>
      <Header style={{ backgroundColor: '#33ccff' }}>
        <Left>
          <Button transparent onPress={this._reset}>
            <Icon name='arrow-back' />
            <Text> Back </Text>
          </Button>
        </Left>
        <Body>
          
        </Body>
      </Header>
      <Image source = {this.state.parseSource} style = {styles.imageStyle} />

      <Button block backgroundColor='#33ccff' onPress={this._post} >
        <Text>Parse</Text>
      </Button>
    </Container>  
  );
}

_waitingOnParseRender = () => 
{
  //Render while waiting for image to be parsed
  return (
    <View style={styles.container3}>
    <Header style={{ backgroundColor: '#33ccff' }}>
      <Left>
        <Button transparent onPress={this._reset}>
          <Icon name='home' />
          <Text> Home </Text>
        </Button>
      </Left>
      <Body>
        
      </Body>
    </Header>
     <Image source = {this.state.parseSource} style = {styles.imageStyle} />

      <View style={styles.container2}>
          <View style={styles.buttonContainer}>
              <ActivityIndicator size="large" color="#0000ff" />
           </View>
      </View>
    </View>
  );
}

_imageParsedRender = () =>
{
  //Render when image has been parsed and data received  
  return (

    <View style={styles.container3} >
    <Header style={{ backgroundColor: '#33ccff' }}>
    <Left>
      <Button transparent onPress={this._reset}>
        <Icon name='home' />
        <Text> Home </Text>
      </Button>
    </Left>
    <Body>
      
    </Body>
    </Header>
    <Content>
      <View style={styles.boxedImage} >
        <Image source={{uri: this.state.uri}} style = {styles.imageStyle} />
      </View>
      <Button full backgroundColor='#33ccff' onPress={this._upload}>
        <Text> Upload To Database</Text>
      </Button>
      <View style={styles.buttonContainer}>
        <FlatList
          data={this.state.parsedStrings}
          extraData={this.state}
          keyExtractor={(item, index) => item.Word}
          renderItem={({item, index}) =>
               
          <Item regular>
          <TextInput 
            onChangeText={(text) => {
              item.Word = text;
              // this.state.wordObjArray[index].Word = text;
              this.setState({
                  refresh: !this.state.refresh,
                  //currentJSON: JSON.stringify(this.state.parsedStrings)
                  }); 
              console.log(item.Word);
              console.log(this.state.parsedStrings.length);
            }} 
            value={item.Word} />

          <Right style={{flexDirection: 'row', alignItems: 'flex-end'}}>
            <Picker  mode = "dropdown" iosIcon={<Icon name="arrow-down"/>} placeholder="Select a word" 
                    selectedValue={this.state.parsedStrings[index].selectedValueIndex}
                    onValueChange={(itemValue) => {
                      this.state.parsedStrings[index].selectedValueIndex = itemValue;
                      this.setState({
                        refresh: !this.state.refresh,
                      });
                    }}>
              <Picker.Item label="Select a word" value={-1} />  
                {
                  //Map all words to each picker
                  this.state.parsedStrings.map(
                    (strings, wordObjIndex) =>  {return <Picker.Item label={strings.Word} value={wordObjIndex}/>}
                  )
                }
            </Picker>
            <Button backgroundColor='#33ccff' onPress={() => {
              this.state.parsedStrings.splice(index,1);
              this.state.wordObjArray.splice(index,1);

              //Shift selected value index to correspond to updated array
              for(parsedStringIndex = 0; parsedStringIndex < this.state.parsedStrings.length; parsedStringIndex++)
              {
                if(this.state.parsedStrings[parsedStringIndex].selectedValueIndex == index)
                {
                  this.state.parsedStrings[parsedStringIndex].selectedValueIndex = -1;
                }
                else if(this.state.parsedStrings[parsedStringIndex].selectedValueIndex >= index)
                {
                  this.state.parsedStrings[parsedStringIndex].selectedValueIndex--;
                }

              }

              this.setState({
                refresh: !this.state.refresh,
                //currentJSON: JSON.stringify(this.state.parsedStrings)
                });
              }}>
              <Icon name='close'/>
              </Button>
            </Right>
          </Item>
          }
        />
        </View>
        </Content>
    </View>
  );
}

//Render call
  render() {

    //Check permissions
    this.requestExternalStoragePermission();
    this.requestCameraPermission();
    const {navigate} = this.props.navigation;
    
    
    if(this.state.imageSelected === false)
    {
    //Screens available when no image is selected
        if(this.state.databaseLoaded === false)
        {
            return this._homeScreenRender();
        }
        else
        {
            //Renders screen to view a single chosen database entry
            if(this.state.loadedSingleObject)
            {
              return this._singleDatabaseEntryRender();
            }
            else
            {
              return this._databaseViewRender();
            }
            
        }
    }
    else
    {
        if(this.state.notParsed)
        {
            if(this.state.postCalled === false)
            {
                return this._readyToParseRender();
            }
            else
            {
                return this._waitingOnParseRender();
            }

        }
        else
        {
            return this._imageParsedRender();
        }
    }
  }
}

const AppNavigator = createStackNavigator({
  Home: {screen: HomeScreen},
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
  centeredSmallText: {
      margin: 0,
      justifyContent: 'center',
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
  touchableContainer: {
    backgroundColor: '#DDDDDD',

  },
});
