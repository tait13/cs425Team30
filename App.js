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
  Modal,
  } from 'react-native';
import { createStackNavigator, createAppContainer } from "react-navigation";
import ImagePicker from 'react-native-image-picker';
import { Container, Root, Header, Title, Content, Footer, FooterTab, Button, Left, Right, Body, Icon, Item, Input, Picker, Form, Segment, Thumbnail, Card, CardItem, Toast } from 'native-base';
import fileType from 'react-native-file-type';




class HomeScreen extends React.Component {

  static navigationOptions = {
      header: null,
    };

  //Default constructor for Home Screen
  //Sets Global Variables
  constructor(props) {
    super(props);
    this.state = {
      imageSelected: false,
      notParsed: true,
      test: false,
      postCalled: false,
      databaseLoaded: false,
      refresh: false,
      refresh2: false,
      valuesSaved: false,
      names:[],
      values:[],
      units:[],
      doneLoadingEntry: false,
      JSONSaved: false,
      doneSavingJSON: false,
      entryName: '',
      entryType: '',
      Manufacturer: '',
      Location: '',
      addNewModalVisible: false,
      newName: '',
      newValue: '',
      newUnit: '',
      uploaded: false,
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
          // console.log(this.state.parseSource.type);
          // console.log(response.type);

          if(this.state.parseSource.type === null)
          {
            fileType(this.state.parseSource.uri).then((type) => {this.state.parseSource.type = type.mime})
          }
          
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
                // console.log(granted);
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
_sendImageToOCR = () =>{

        this.setState({
            postCalled: true,
        });

        //Create Form to Post
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

            if(receivedData.Status === "Success")
            {
              this.setState({
                  notParsed: false,
                  parsedStrings: receivedData.Strings,
                  origUri: receivedData.originalImage,
                  uri: receivedData.imageURL,
                  wordObjArray: [],
                  currentJSON: JSON.stringify(receivedData),
              }, function(){});

              console.log(this.state.wordObjArray);
              console.log(this.state.parsedStrings.length);

              //Push words to new array
              for(wordIndex = 0; wordIndex < this.state.parsedStrings.length; wordIndex++)
              {
                var wordObj = {Word:this.state.parsedStrings[wordIndex].Word, Bounds:this.state.parsedStrings[wordIndex].Bounds};
                this.state.wordObjArray.push(wordObj);
                this.state.parsedStrings[wordIndex].type = -1;

              }
            }
            else
            {
              Alert.alert("Error", receivedData.Message, [{text: 'OK', onPress:() => {this._reset()}}]);
            }
            
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
          valuesSaved: false,
          names: [],
          values: [],
          units: [],
          doneLoadingEntry: false,
          JSONSaved: false,
          doneSavingJSON: false,
          entryName: "",
          entryType: "",
          Manufacturer: '',
          Location: '',
          retrievedData: [],
          
      });


}

//Accesses database to view every upload asset
_database = () => {
      this.setState({
          databaseLoaded: true,
      });
      var data = new FormData();
      data.append('Total', 25);

      return fetch('https://cs425.alextait.net/retrieveAssetsWithJSON.php', {
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


//Adds each formatted value to a json string to be passed to database
_saveJSON = () => {

  var allEntriesHaveValue = true;

  for(entryIndex = 0; entryIndex < this.state.names.length; entryIndex++)
  {
    if(this.state.names[entryIndex].valueIndex == -1)
    {
      allEntriesHaveValue = false;
    }
  }

  console.log(this.state.names);

  if(allEntriesHaveValue)
  {
    var tmpJSONObj = [];

    for(entryIndex = 0; entryIndex < this.state.names.length; entryIndex++)
    {
      if(this.state.names[entryIndex].unitIndex != -1)
      {
        tmpJSONObj.push({EntryName: this.state.names[entryIndex], Value: this.state.values[this.state.names[entryIndex].valueIndex], Unit: this.state.units[this.state.names[entryIndex].unitIndex]});
      }
      else
      {
        tmpJSONObj.push({EntryName: this.state.names[entryIndex], Value: this.state.values[this.state.names[entryIndex].valueIndex], Unit: {Word: null}});
      }
      
    }
    console.log(tmpJSONObj);

    this.state.currentJSON = JSON.stringify(tmpJSONObj);

    
    this.setState({
      JSONSaved: true,
    }, function(){});
  }
  else
  {
    Alert.alert('An entry is missing a value!', 'Please ensure all entries have a corresponding value.');
  }
  

}

//Uploads asset data to the database
_upload = () => {

      
    if(this.state.entryName === "" || this.state.entryType === "" || this.state.Location === "" || this.state.Manufacturer === "")
    {
      Alert.alert('Please Fill Out All Fields');
    }
    else
    {
      var data = new FormData();
      data.append('originalImageLoc', this.state.origUri);
      data.append('boxedImageLoc', this.state.uri);
      data.append('name', this.state.entryName);
      data.append('type', this.state.entryType);
      data.append('location', this.state.Location);
      data.append('manufacturer', this.state.Manufacturer);

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
                  .then((response) => { return response.json();}).then(
                    (receivedData) => {
                      console.log(receivedData);
                      
                      console.log(receivedData.Time);
                      this._chooseFromDatabase({creationTime: receivedData.Time});
                      this.setState({creationTime: receivedData.Time});
                      return receivedData;
                    })
                  .catch((error) => {
                      console.error(error);
                  });
    }
}

//Calls backend to delete an item from the database
_deleteFromDatabase = (item) => {

  Alert.alert('Are you sure you would like to delete this entry?',
  'This action is irreversable.',
    [{text: 'Cancel', onPress: () => console.log('Cancelled'), style:'cancel',},
      {text: 'Delete', onPress: () => {
          var data = new FormData();
          data.append('creationTime', this.state.creationTime);

          return fetch('https://cs425.alextait.net/deleteEntry.php', {
              method: 'POST',
              headers: {
                  Accept: 'text/plain',
                  'Content-Type': 'multipart/form-data',
              },
              body: data
          })
          .then((response) => { return response.text();}).then((text) => 
          {
            this.state.retrievedData = [];
            this._database();

            console.log(text);
            this.setState({
              doneLoadingEntry: false,
              loadedSingleObject: false,
            }, function(){});

            
            

            return text;
          })
          .catch((error) => {
              console.error(error);
          });
      },},
    ],
    {cancelable: false},

  );

  
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

                  
                  this.state.parsedStrings = JSON.parse(receivedData.assetJSON);
                  
                  

                  this.setState({
                    creationTime: receivedData.creationTime,
                    originalImageLoc: receivedData.originalImageLoc,
                    boxedImageLoc: receivedData.boxedImageLoc,
                    currentName: receivedData.Name,
                    currentLocation: receivedData.Location,
                    currentType: receivedData.Type,
                    currentManufacturer: receivedData.Manufacturer,
                    doneLoadingEntry: true,
                    
                }, function(){});

                if(this.state.JSONSaved)
                {
                  this.setState({
                    uploaded: true,
                  }, function(){});
                  Alert.alert("Upload Successful");
                }
                console.log(this.state.parsedStrings);
              })
              .catch((error) => {
                  console.error(error);
              });
}

//Changes state of modal visible
_setModalVisible = (newState) =>
{
  this.setState({
    addNewModalVisible: newState,
    
}, function(){});
  console.log(this.state.addNewModalVisible);
} 


//Adds a new name value and unit based on text entered into modal
_addNewEntry = () =>
{
  if(this.state.newName ==="")
  {
    Alert.alert('No text for Name Entered');
  }
  else
  {

    this._setModalVisible(false);

    if(this.state.newUnit === "" && this.state.newValue === "")
    {
      var wordObj = {Word:this.state.newName, Bounds:null, valueIndex:-1, unitIndex:-1};
      this.state.names.push(wordObj);

      wordObj = {Word:this.state.newValue, Bounds:null};
      this.state.values.push(wordObj);
    }
    else if(this.state.newUnit === "")
    {
      var wordObj = {Word:this.state.newName, Bounds:null, valueIndex:this.state.values.length, unitIndex:-1};
      this.state.names.push(wordObj);

      wordObj = {Word:this.state.newValue, Bounds:null};
      this.state.values.push(wordObj);
    }
    else if(this.state.newValue === "")
    {
      var wordObj = {Word:this.state.newName, Bounds:null, valueIndex:-1, unitIndex:this.state.units.length};
      this.state.names.push(wordObj);
      wordObj = {Word:this.state.newValue, Bounds:null};
      this.state.values.push(wordObj);
      wordObj = {Word:this.state.newUnit, Bounds:null};
      this.state.units.push(wordObj);
    }
    else
    {
      var wordObj = {Word:this.state.newName, Bounds:null, valueIndex:this.state.values.length, unitIndex:this.state.units.length};
      this.state.names.push(wordObj);

      wordObj = {Word:this.state.newValue, Bounds:null};
      this.state.values.push(wordObj);
      wordObj = {Word:this.state.newUnit, Bounds:null};
      this.state.units.push(wordObj);
    }
    

    this.setState({
      newName: "",
      newValue: "",
      newUnit: "",
      refresh: !this.state.refresh,
    }, function(){});

    console.log(this.state.names);
    console.log(this.state.values);
    console.log(this.state.units);
  }
    
}
_homeScreenRender = () =>
{
  //Home Screen render
  return (
    <View style={styles.container2}>
      
      <View style={styles.container1}>
      <Text style={{alignSelf:"center", fontSize:30, textAlign: 'center',fontWeight:'bold'}}>Asset Configuration Through Images</Text>
      <Image source={{uri: 'https://cs425.alextait.net/unrlogo.png'}} style = {{alignSelf: "center", width:200, height:200, marginBottom: 20, marginTop: 20}}/>
      
          <Button iconLeft block backgroundColor="#66ccff" style = {{marginBottom: 2}} onPress={this._cameraButton}>
            <Icon name="camera" />
            <Text style={{fontWeight:'bold'}}>  Camera</Text>
          </Button>

          <Button iconLeft block backgroundColor="#33ccff" style = {{marginBottom: 2}} onPress={this._galleryButton}>
            <Icon name="image" />
            <Text style={{fontWeight:'bold'}}>  Gallery</Text>
          </Button>
          <Button iconLeft block backgroundColor="#66ccff" style = {{marginBottom: 2}} onPress={this._database}>
            <Icon name="cloud"/>
            <Text style={{fontWeight:'bold'}}>  Previous Uploads</Text>
          </Button>
          {/* <Button iconLeft block backgroundColor="#33ccff" style = {{marginBottom: 2}} onPress={() => this._setModalVisible(true)}>
            <Text>  Test</Text>
          </Button> */}

          
        
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
        <Body style={{justifyContent:'flex-start', marginLeft:10}}>
          <Text style={{fontWeight: 'bold', fontSize:20}} >Database Entries</Text>
        </Body>
      </Header>
      <View style={styles.databaseEntries}>
          {/* <View style={styles.centeredSmallText}>
          <Text>Total Results: {this.state.totalRows}</Text>
          </View> */}
          <FlatList

              data={this.state.retrievedData}
              renderItem={({item}) =>

                  
                    <TouchableOpacity style={styles.touchableContainer} onPress={() => this._chooseFromDatabase(item)}>
                      <Card style={styles.cardContainer}>
                        
                        
                        <Thumbnail square large source = {{uri: item.originalImageLoc}}  />
                          <Text style={{marginHorizontal:7}}><Text style={{fontWeight: 'bold',}}>{item.Name}{"\n"}</Text>
                          Location: {item.Location}{"\n"}
                          Type: {item.Type}{"\n"}
                          Manufacturer: {item.Manufacturer}{"\n"}
                          Creation Time: {item.creationTime}
                          </Text>
                      </Card>
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
    <Container>
      <Header style={{ backgroundColor: '#33ccff' }}>
        <Left>
          <Button transparent onPress={() => {
            this._database();
            this.setState({
            doneLoadingEntry: false,
            loadedSingleObject: false,
          });
          
          }}>
            <Icon name='arrow-back' />
            <Text> Back </Text>
          </Button>
        </Left>
        <Body>
        </Body>
      </Header>
      <Content style={styles.singleDatabaseEntry}>
        <Image backgroundColor="#5e5e5e" source={{uri: this.state.boxedImageLoc}} style = {styles.imageStyle} resizeMode = "contain"/>
        <Button iconLeft block backgroundColor="#33ccff" style = {{marginBottom: 2}} onPress={() =>{this._deleteFromDatabase(this.state.creationTime)} }>
          <Text>Delete From Database</Text>
        </Button>
        
        <Text style={{marginHorizontal:15}}><Text style={{fontWeight: 'bold', fontSize:16}}>{this.state.currentName}{"\n"}</Text>
        <Text style={{fontWeight: 'bold',}}>Location: </Text>{this.state.currentLocation}{"\n"}
        <Text style={{fontWeight: 'bold',}}>Type: </Text>{this.state.currentType}{"\n"}
        <Text style={{fontWeight: 'bold',}}>Manufacturer:</Text> {this.state.currentManufacturer}{"\n"}
        <Text style={{fontWeight: 'bold',}}>Creation Time: </Text>{this.state.creationTime}
          </Text>
        <FlatList
                  data={this.state.parsedStrings}

                  renderItem={({item}) => <Text style={{fontWeight: 'bold', marginHorizontal:15,}}>{item.EntryName.Word}:<Text style={{fontWeight: '400'}}> {item.Value.Word} {item.Unit.Word}</Text></Text>}


              />
        {/* <View style={{flexDirection:"column", alignItems:"flex-start"}}>
          <View >
              <Image source={{uri: this.state.boxedImageLoc}} style = {styles.imageStyle} resizeMode = "contain"/>
          </View>

          <View style={styles.buttonContainer}>
              <FlatList
                  data={this.state.parsedStrings}

                  renderItem={({item}) => <Text>{item.EntryName.Word}: {item.Value.Word} {item.Unit.Word}</Text>}


              />
          </View>
        </View> */}
      </Content>
    </Container>
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
      <Content>
      <Image source = {this.state.parseSource} style = {styles.imageStyleFullScreen} resizeMode={"contain"}/>
      
      </Content>
      <Footer>
        <FooterTab>
          <Button block backgroundColor='#33ccff' onPress={this._sendImageToOCR} >
            <Text>Parse</Text>
          </Button>
        </FooterTab>
      </Footer>
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
     <Image source = {this.state.parseSource} style = {styles.imageStyle} resizeMode={"contain"}/>

      <View style={styles.container2}>
          <View style={styles.buttonContainer}>
              <ActivityIndicator size="large" color="#0000ff" />
           </View>
      </View>
    </View>
  );
}

_genericLoadingRender = () => 
{
  //Displays an activity indicator in the center of the screen
  return (
    <View style={styles.container3}>
    <Header style={{ backgroundColor: '#33ccff' }}>
      <Left>
        
      </Left>
      <Body>
        
      </Body>
    </Header>
     

      <View style={styles.container2}>
          <View style={styles.buttonContainer}>
              <ActivityIndicator size="large" color="#0000ff" />
           </View>
      </View>
    </View>
  );
}

//Seperates all parsed words into their proper arrays (names, values, units)
_seperateWords = () =>
{
  this.setState({
    valuesSaved: true,

  });

  //Loop through each word and create new word object in proper arrays
  for(parsedStringIndex = 0; parsedStringIndex < this.state.parsedStrings.length; parsedStringIndex++)
  {
    if(this.state.parsedStrings[parsedStringIndex].type == 1)
    {
      var wordObj = {Word:this.state.parsedStrings[parsedStringIndex].Word, Bounds:this.state.parsedStrings[parsedStringIndex].Bounds, valueIndex:-1, unitIndex:-1};
      this.state.names.push(wordObj);
    }
    else if(this.state.parsedStrings[parsedStringIndex].type == 2)
    {
      var wordObj = {Word:this.state.parsedStrings[parsedStringIndex].Word, Bounds:this.state.parsedStrings[parsedStringIndex].Bounds};
      this.state.values.push(wordObj);
    }
    else if(this.state.parsedStrings[parsedStringIndex].type == 3)
    {
      var wordObj = {Word:this.state.parsedStrings[parsedStringIndex].Word, Bounds:this.state.parsedStrings[parsedStringIndex].Bounds};
      this.state.units.push(wordObj);
    }
  }

}

_imageParsedRender = () =>
{
  //Render when image has been parsed and data received  
  return (

    <View style={styles.container3} >
    <Header style={{ backgroundColor: '#33ccff' }} hasSegment>
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
        <Image backgroundColor="#5e5e5e" source={{uri: this.state.uri}} style = {styles.imageStyle} />
      </View>
      <Button full backgroundColor='#33ccff' 
      onPress={this._seperateWords}>
        <Text> Next </Text>
      </Button>
      <View style={styles.buttonContainer}>
        <FlatList
          data={this.state.parsedStrings}
          extraData={this.state}
          
          renderItem={({item, index}) =>
               
          <Item regular>
          <Input 
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
                    selectedValue={this.state.parsedStrings[index].type}
                    onValueChange={(itemValue) => {
                      this.state.parsedStrings[index].type = itemValue;
                      this.setState({
                        refresh: !this.state.refresh,
                      });
                    }}>
              <Picker.Item label="Select a type" value={-1} />  
              <Picker.Item label="Name" value={1} />
              <Picker.Item label="Value" value={2} />
              <Picker.Item label="Unit" value={3} />
            </Picker>

            
            
            <Button backgroundColor='#33ccff' onPress={() => {
              this.state.parsedStrings.splice(index,1);
              this.state.wordObjArray.splice(index,1);

              this.setState({
                refresh: !this.state.refresh,
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


_parsedStringsCombiningRender = () =>
{
  //Render when parsed strings have been editted and erroneous values have been deleted 
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
        <Image backgroundColor="#5e5e5e" source={{uri: this.state.uri}} style = {styles.imageStyle} />
      </View>
      <View style={{flexDirection:'row',justifyContent:'space-evenly'}}>
        <Button full backgroundColor='#33ccff' 
        onPress={() => this._setModalVisible(true)} style={{width:(Dimensions.get('window').width/2), margin:4, marginTop:0}}>
          <Text> Add New Entry </Text>
        </Button>
        <Button full  backgroundColor='#33ccff' 
        onPress={this._saveJSON} style={{width:(Dimensions.get('window').width/2), margin:4, marginTop:0}}>
          <Text> Next </Text>
        </Button>
        
      </View>
      <View style={styles.buttonContainer}>
        <FlatList
          data={this.state.names}
          extraData={this.state}
          key={this.state.refresh}
          renderItem={({item, index}) =>
               
          <Item style={{flex:1, flexDirection: 'row'}} regular>
          <Input style={{flex:1}}
            onChangeText={(text) => {
              item.Word = text;
              // this.state.wordObjArray[index].Word = text;
              this.setState({
                  refresh: !this.state.refresh,
                  //currentJSON: JSON.stringify(this.state.parsedStrings)
                  }); 
              console.log(item.Word);
              console.log(this.state.names.length);
            }} 
            value={item.Word} />

            <Picker style={{flex:1}} mode = "dropdown" iosIcon={<Icon name="arrow-down"/>} placeholder="Select a value" 
                    selectedValue={this.state.names[index].valueIndex}
                    onValueChange={(itemValue) => {
                      this.state.names[index].valueIndex = itemValue;
                      this.setState({
                        refresh: !this.state.refresh,
                      });
                      
                    }}>
              <Picker.Item label="Select a value" value={-1} />  
                {
                  //Map all words to each picker
                  this.state.values.map(
                    (strings, valueObjIndex) =>  {return <Picker.Item label={strings.Word} value={valueObjIndex}/>}
                  )
                }
            </Picker>
            <Picker style={{flex:1}}  mode = "dropdown" iosIcon={<Icon name="arrow-down"/>} placeholder="Select a unit" 
                    selectedValue={this.state.names[index].unitIndex}
                    onValueChange={(itemValue) => {
                      this.state.names[index].unitIndex = itemValue;
                      this.setState({
                        refresh: !this.state.refresh,
                      });
                    }}>
              <Picker.Item label="Select a value" value={-1} />  
                {
                  //Map all words to each picker
                  this.state.units.map(
                    (strings, unitObjIndex) =>  {return <Picker.Item label={strings.Word} value={unitObjIndex}/>}
                  )
                }
            </Picker>
           
          </Item>
          }
        />
        </View>
        </Content>

        <Modal animationType="slide" visible={this.state.addNewModalVisible}
            transparent={true} presentationStyle="formSheet" onRequestClose={() => {this._setModalVisible(false);}}
          >
          <View style={{backgroundColor:'#ffffff',
            width:'100%',
            position: 'absolute',
            bottom: 0,
      }}>
            <Button block backgroundColor="#33ccff" onPress={this._addNewEntry}><Text>Save</Text></Button>
            <Item >
              <Input  placeholder="Name" onChangeText={(text) => {this.state.newName = text}}></Input>
            </Item>
            <Item>
              <Input  placeholder="Value" onChangeText={(text) => {this.state.newValue = text}} ></Input>
            </Item>
            <Item>
              <Input  placeholder="Unit" onChangeText={(text) => {this.state.newUnit = text}}></Input>
            </Item>
          </View>
      </Modal>
    </View>
  );
}

_saveEntryRender = () =>
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
    <Content>
      <View style={styles.boxedImage} >
        <Image source={{uri: this.state.uri}} style = {styles.imageStyle} />
      </View>
      <Button full backgroundColor='#33ccff' 
      onPress={this._upload}>
        <Text> Upload To Database </Text>
      </Button>
      
      <Item>
        <Text>Type: </Text>
        <Picker mode="dropdown" iosIcon={<Icon name="arrow-down"/>} 
          selectedValue={this.state.entryType}
          onValueChange={(itemValue) => {this.setState({
            entryType: itemValue,
          });}}
        >
          <Picker.Item label="Select a Type" value={""}/>
          <Picker.Item label="Motor" value={"Motor"}/>
          <Picker.Item label="Pump" value={"Pump"}/>
          <Picker.Item label="Fan" value={"Fan"}/>
          <Picker.Item label="Generator" value={"Generator"}/>
          <Picker.Item label="Chiller" value={"Chiller"}/>
          <Picker.Item label="Compressor" value={"Compressor"}/>
        </Picker>
      </Item>
      <Item >
        <Input  placeholder="Name" onChangeText={(text) => {this.state.entryName = text}}></Input>
      </Item>
      <Item>
        <Input  placeholder="Manufacturer" onChangeText={(text) => {this.state.Manufacturer = text}}></Input>
      </Item>
      <Item>
        <Input  placeholder="Location" onChangeText={(text) => {this.state.Location = text}}></Input>
      </Item>
        
    </Content>
    </View>
  );
}

_uploadedRender = () =>
{
  return (
    <Container>
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
      <Content style={styles.singleDatabaseEntry}>
        <Image backgroundColor="#5e5e5e" source={{uri: this.state.boxedImageLoc}} style = {styles.imageStyle} resizeMode = "contain"/>
        <Button iconLeft block backgroundColor="#33ccff" style = {{marginBottom: 2}} onPress={() =>{this._deleteFromDatabase(this.state.creationTime)} }>
          <Text>Delete From Database</Text>
        </Button>
        
        <Text style={{marginHorizontal:15}}><Text style={{fontWeight: 'bold', fontSize:16}}>{this.state.currentName}{"\n"}</Text>
        <Text style={{fontWeight: 'bold',}}>Location: </Text>{this.state.currentLocation}{"\n"}
        <Text style={{fontWeight: 'bold',}}>Type: </Text>{this.state.currentType}{"\n"}
        <Text style={{fontWeight: 'bold',}}>Manufacturer:</Text> {this.state.currentManufacturer}{"\n"}
        <Text style={{fontWeight: 'bold',}}>Creation Time: </Text>{this.state.creationTime}
          </Text>
        <FlatList
                  data={this.state.parsedStrings}

                  renderItem={({item}) => <Text style={{fontWeight: 'bold', marginHorizontal:15,}}>{item.EntryName.Word}:<Text style={{fontWeight: '400'}}> {item.Value.Word} {item.Unit.Word}</Text></Text>}


              />
        {/* <View style={{flexDirection:"column", alignItems:"flex-start"}}>
          <View >
              <Image source={{uri: this.state.boxedImageLoc}} style = {styles.imageStyle} resizeMode = "contain"/>
          </View>

          <View style={styles.buttonContainer}>
              <FlatList
                  data={this.state.parsedStrings}

                  renderItem={({item}) => <Text>{item.EntryName.Word}: {item.Value.Word} {item.Unit.Word}</Text>}


              />
          </View>
        </View> */}
      </Content>
    </Container>
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
              if(!this.state.doneLoadingEntry)
              {
                return this._genericLoadingRender();
              }
              else
              {
                return this._singleDatabaseEntryRender();
              }
              
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
          if(!this.state.valuesSaved)
          {
            return this._imageParsedRender();
          }
          else
          {
            if(!this.state.JSONSaved)
            {
              return this._parsedStringsCombiningRender();
            }
            else
            {
              if(!this.state.uploaded)
              {
                return this._saveEntryRender();
              }
              else
              {
                return this._uploadedRender();
              }
              
            }
          }
            
        }
    }
  }
}

const AppNavigator = createStackNavigator({
  Home: {screen: HomeScreen},
});

export default (createAppContainer(AppNavigator));



const styles = StyleSheet.create({
  text1: {
    fontSize: 24,
    justifyContent: 'center',
    fontWeight: 'bold',
    alignItems: 'center',
    marginLeft: 20,
    marginRight: 20,
    marginTop: 50,
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
    height: Dimensions.get('window').width * 9 / 16,
    marginTop: 0,
  },
  imageStyleFullScreen: {
    width: Dimensions.get('window').width ,
    height: Dimensions.get('window').height-90,
    marginTop: 0,
  },
  touchableContainer: {
    
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
  },
  databaseEntries: {
    flexDirection: 'column',
    alignItems: 'center',
    alignSelf: 'center',
    justifyContent: 'center',
    marginBottom:60,
  },
  cardContainer: {
    
    flexDirection: 'row',
    alignItems:'flex-start',
    alignSelf:'center',
    justifyContent:'flex-start',
    width: Dimensions.get('window').width - 18,
  },
  singleDatabaseEntry: {
    justifyContent:'flex-start',
    alignItems:'flex-start',
    alignSelf:'center',
  },
});
