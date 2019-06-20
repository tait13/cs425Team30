# Asset Configuration Through Images
Asset Configuration Through Images is a mobile/desktop application designed to decrease the time it takes an engineer to retrieve operating values from machine information plates. The application uses Optical Character Recognition to quickly parse the machine data from an image and allow the engineer to easily export said data to an external file. Previous methods required the engineer to enter this data manually which is extremely time intensive. The mobile and desktop components have access to a shared cloud-based database to view and edit previously saved machine data.
 
The goal of Asset Configuration Through Images is to decrease the amount of time it takes for an engineer to retrieve the operating ranges from a machine’s data panel. The current method for retrieving the machine data requires the engineer to write down and enter the ranges manually. This is often done in spaces where it would be difficult to bring a laptop. By allowing the engineer to use their mobile device, the team intends to decrease the overall time it takes for an engineer to enter machine data to their software. This will allow them to retrieve the configuration data of more devices during their shift, which will allow them to focus their efforts on other tasks. The application will also provide the engineers with a centralized database to easily access the multitude of assets they have processed.

The mobile application is created using Javascript and React Native while the backend utilizes a MySQL database and is programmed in PHP. Asset Configuration Through Images utilizes Google Cloud Vision's Optical Character Recognition API to parse the text from machine plates. 


### Development Environment setup (outdated):

Dependencies Needed:

React-native:
https://facebook.github.io/react-native/docs/getting-started Under Building Projects with Native Code

react-navigation
https://reactnavigation.org/docs/en/getting-started.html
```bash
yarn add react-native-gesture-handler
# or with npm
# npm install --save react-native-gesture-handler
```

Steps to Clone Project:
```bash
react-native init ProjectName
clone repo into ProjectName Folder
npm install
react-native link react-native-gesture-handler
react-native run-android
```
