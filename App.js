import * as React from 'react';
import { Text, View, StyleSheet, TouchableOpacity, SafeAreaView, Image, Dimensions, FlatList, Switch, TextInput } from 'react-native';
import Pad from './components/view/pad'
import ColorPicker from 'react-native-wheel-color-picker';
import * as SplashScreen from 'expo-splash-screen';
import { useFonts } from 'expo-font';
import AsyncStorage from '@react-native-async-storage/async-storage';
import DialogInput from 'react-native-dialog-input';
import Slider from '@react-native-community/slider';

SplashScreen.preventAutoHideAsync(); 

/* The Painter App allows user to create original drawings with a limited set of tools akin to a limited, mobile version of a Microsoft Paint. There are five tools the artist has to their disposal: brush, rectangle, ellipse, line, and eraser. In addition to these tools, there is a "brush size" slider that operates the stroke width for the brush as well as the thickness of the rectangles and circles. There is also a color wheel, which is imported from React Native Wheel Color picker which allows the user to pick any color they choose. There is also a "Rounded Borders" slider that changes the border radius for the rectangle tool, allowing the artist to create rounded borders on their app. There is also a switch for filling the shape in order to create full shapes for the rectangle and ellipses. There is also an undo button in the top right that lets the user rewind from their previous mistakes. On the top left, there is a "Save and Exit" button and a "Save" button. These buttons update the Async Storage array that holds the users saved projects. This way, the artist can create multiple projects and save them all on the same device. I am displaying the artists' projects via a Flatlist, similar to how I did it for the Weather App. The tools provided to the user are simple, but functional and essential.

LIMITATION #1: I could have used lists and loops more effectively in certain parts of the app to simplify the code. Most notably, the toolbar at the bottom row is displayed via seperate TouchableOpacities, instead of a FlatList item. I started the app without the FlatList, and by now I have individualized each item so much to the point where it would be exhausting and time-consuming to change everything into a FlatList afterwards. However, I acknowledge that my code could be more efficient.

LIMITATION #2: I feel that my aesthetic and design of the app is somewhat basic compared to my previous apps. My original idea for the main Project screen was for the little boxes next to the project title to display a preview of the drawing that the user has created in that file. However, I could not figure out how to do this properly. The main drawback of my app's aesthetic, however, is the color scheme. Almost all my other apps use a darker color scheme utilizing darker shades because I generally believe that those colors can create a sleeker, more minimalist look. However, I can justify not utilizing these color schemes for this app because it is a painter app, so the white screen and lighter colors are better for the artist. 

LIMITATION #3: When the artist uses the rectangle tool and are initially clicking and dragging to create the shape, the initial spot that the user presses on is missing a corner when the user is holding down their touch. This is a minute issue, however, because the missing corner fills itself in when the user releases their touch. 

LIMITATION #4: When the artist uses the ellipse tool and are initially clicking an dragging to create the shape, the preview is that of a rectangle. The reason for this is because I do not know how to create a Path component with a path that looks like an ellipse. However, when the user releases their touch, the shape becomes an accurate representation of an ellipse.

LIMITATION #5: If the user a rectangle, circle, or line in such a way where it underlaps the top buttons (save, exit, and undo), these buttons are no longer going to be able to be pressed. */

export default function App() {

  const [color, setColor] = React.useState("#3DDC84");
  const [screen, setScreen] = React.useState(2)
  const [strokeWidth, setStrokeWidth] = React.useState(10);
  const [fillSelected, setFillSelected] = React.useState(false);
  const [paintHistory, setPaintHistory] = React.useState([]);
  const [isDialogVisible, setIsDialogVisible] = React.useState(false);
  const [selectedID, setSelectedID] = React.useState(-1);
  const [roundedBorders, setRoundedBorders] = React.useState(0);
  const [actualCanvas, setActualCanvas] = React.useState(false);
  const [savedProjects, setSavedProjects] = React.useState([]);

  const [justStarted, setJustStarted] = React.useState(true); // On User Opens App
  React.useEffect(() => {
    if (justStarted) {
      setList();
      setJustStarted(false);
    }
  }, [justStarted])

  const storeList = async (newvalue) => { // On User Creates New Project or Saves Current Project
    try {
      const jsonValue = JSON.stringify(newvalue)
      await AsyncStorage.setItem('savedProjects', jsonValue)
    } catch (err) {
      console.error(err);
    }
  }

  const setList = async () => { // On User Opens App
    try {
      const value = await AsyncStorage.getItem('savedProjects');
      if (value !== null && value !== "undefined" && JSON.parse(value).length !== 0) {
        setSavedProjects(JSON.parse(value));
      }
    } catch(err) {
        console.error(err);
      }
  };

  const toggleSwitch = () => { //Function for Switch
    setFillSelected(previousState => !previousState);
  }; 

  const windowWidth = Dimensions.get('window').width;

  const [drawingTools, setDrawingTools] = React.useState([
    {
      penSelected: true,
      rectSelected: false,
      ellipseSelected: false,
      eraserSelected: false,
      lineSelected: false,
    },
  ]);

  const onChangeColor = (color) => {
    setColor(color);
  }

  const [fontsLoaded] = useFonts({ // Importing Custom Fonts
    'sfns': require('./assets/madetommy.otf'),
  });

  const onLayoutRootView = React.useCallback(async () => { //Function that calls on Custom Font
    if (fontsLoaded) {
      await SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  if (!fontsLoaded) {
    return null;
  }

  const removeFromList = (id) => {
    let tempArray = [...savedProjects];
    tempArray.splice(id, 1);
    for (let i = 0; i < tempArray.length; i++) {
      tempArray[i].id = i;
    } 

    setSavedProjects(tempArray);
    storeList(tempArray);
  }

  const Item = ({ id }) => (
    <View style={{flexDirection: 'row', width: windowWidth * 0.9, marginLeft: '5%', justifyContent: 'flex-end'}}>
      <TouchableOpacity style={[styles.newProject, {flex: 1}]} onPress={() => {
        setPaintHistory(savedProjects[id].stroke);
        setSelectedID(id);
        setScreen(0);
        setActualCanvas(true);
      }}>
        <View style={styles.imagePreview}>
          <Text style={{fontSize: 70, textAlign: 'center', fontFamily: 'sfns', justifyContent: 'center', width: '100%'}}>
          {id + 1}
          </Text>
        </View>
        <Text style={styles.projectName}>
          {savedProjects[id].name}
        </Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.removeButton} onPress={() => {removeFromList(id);}}>
        <Image style={[styles.colorPickerIcon, {width: '100%', height: '100%', borderRadius: 0, alignSelf: 'center', borderWidth: 0}]} source={require('./assets/trashcan2.png')} resizeMode={'contain'}/>
      </TouchableOpacity>
    </View>
  )

  const renderItem = ({ item }) => ( // Rendering Item for Flat List
    <Item id={item.id}/>
  );

  if (screen == 0) {
    return (
      <View style={styles.container} onLayout={onLayoutRootView}>
        <Pad
        color = {drawingTools[0].eraserSelected ? 'white' : color}
        strokeWidth = {strokeWidth}
        onChangeStrokes={(previousStrokes) => {setPaintHistory(previousStrokes)}}
        strokes={paintHistory}
        shape={(drawingTools[0].eraserSelected ? "Eraser" : (drawingTools[0].penSelected ? "Pen" : (drawingTools[0].rectSelected ? "Rect" : (drawingTools[0].ellipseSelected ? "Ellipse" : "Line"))))}
        fill={(fillSelected ? color : "none")}
        roundedBorders={roundedBorders}
        actualCanvas={actualCanvas}
        onSave={() => {
          let newArray = [...savedProjects];
          newArray[selectedID].stroke = [...paintHistory];
          setSavedProjects(newArray);
          storeList(newArray); 
        }}
        onExit={() => {
          setScreen(2);
          setActualCanvas(false);
          setSelectedID(-1);          
        }}
        />
        <View style={[styles.toolbar, {height: '12%'}]}>
          <View style={{flexDirection: 'column', justifyContent: 'space-around', width: '75%', borderRightWidth: 1, borderColor: 'darkgrey', height: '100%', paddingTop: '1%'}}>
            <Text style={styles.descriptiveText2}>
            Brush Size: {strokeWidth}
            </Text>
            <View style={styles.sliderView}>
              <Slider value={strokeWidth} maximumValue={100} minimumValue={1} step={1} onValueChange={(w) => setStrokeWidth(w)} minimumTrackTintColor="#f66747" maximumTrackTintColor="#fff" /> 
            </View>
            <Text style={styles.descriptiveText2}>
            Border Radius: {roundedBorders}
            </Text>
            <View style={styles.sliderView}>
              <Slider value={roundedBorders} maximumValue={50} minimumValue={0} step={1} onValueChange={(w) => setRoundedBorders(w)} minimumTrackTintColor="#f66747" maximumTrackTintColor="#fff" /> 
            </View>
          </View>
          <View style={{flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center', width: '25%'}}>
            <Text style={styles.descriptiveText2}>
            Fill
            </Text>
            <Switch
            trackColor={{ false: "#767577", true: "#8ED6C5" }}
            thumbColor={fillSelected ? "#f4f3f4" : "#f4f3f4"}
            ios_backgroundColor="#3e3e3e"
            onValueChange={toggleSwitch}
            value={fillSelected}
            /> 
          </View>
        </View>
        <View style={styles.toolbar}>
          <TouchableOpacity style={[styles.icon, {borderLeftWidth: 0}]} onPress={() => {setScreen(1)}}>
            <View style={[styles.colorPickerIcon, {backgroundColor: color}]} />
            <Text style={styles.descriptiveText}>
            Color
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.icon, {backgroundColor: (drawingTools[0].penSelected ? '#8ED6C5' : '#e2e5de')}]}
            onPress={() => {
              let tempArray = [
                {
                  penSelected: true,
                  rectSelected: false,
                  ellipseSelected: false,
                  eraserSelected: false,   
                  lineSelected: false,           
                }
              ];
              setDrawingTools(tempArray);
            }}>
            <Image style={[styles.colorPickerIcon, {backgroundColor: '#e2e5de', borderColor: '#e2e5de', borderRadius: 0}]} source={require('./assets/pen.png')} resizeMode={'contain'}/>
            <Text style={styles.descriptiveText}>
            Brush
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.icon, {backgroundColor: (drawingTools[0].rectSelected ? '#8ED6C5' : '#e2e5de')}]}
            onPress={() => {
              let tempArray = [
                {
                  penSelected: false,
                  rectSelected: true,
                  ellipseSelected: false,
                  eraserSelected: false,     
                  lineSelected: false,         
                }
              ];
              setDrawingTools(tempArray);
            }}>
            <View style={[styles.colorPickerIcon, {backgroundColor: '#e2e5de', borderRadius: 0}]} />
            <Text style={styles.descriptiveText}>
            Rect
            </Text>
          </TouchableOpacity>
          <TouchableOpacity  style={[styles.icon, {backgroundColor: (drawingTools[0].ellipseSelected ? '#8ED6C5' : '#e2e5de')}]} onPress={() => {
            let tempArray = [
              {
                penSelected: false,
                rectSelected: false,
                ellipseSelected: true,
                eraserSelected: false,   
                lineSelected: false,           
              }
            ];
            setDrawingTools(tempArray);
          }}>
            <View style={[styles.colorPickerIcon, {backgroundColor: '#e2e5de', borderRadius: 30}]} />
            <Text style={styles.descriptiveText}>
            Ellipse
            </Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.icon, {backgroundColor: (drawingTools[0].lineSelected ? '#8ED6C5' : '#e2e5de')}]} onPress={() => {
            let tempArray = [
              {
                penSelected: false,
                rectSelected: false,
                ellipseSelected: false,
                eraserSelected: false,  
                lineSelected: true,            
              }
            ];
            setDrawingTools(tempArray);
          }}>
            <Image style={[styles.colorPickerIcon, {backgroundColor: '#e2e5de', borderColor: '#e2e5de', borderRadius: 0}]} source={require('./assets/line2.png')} resizeMode={'contain'}/>
            <Text style={styles.descriptiveText}>
            Line
            </Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.icon, {backgroundColor: (drawingTools[0].eraserSelected ? '#8ED6C5' : '#e2e5de')}]} onPress={() => {
            let tempArray = [
              {
                penSelected: false,
                rectSelected: false,
                ellipseSelected: false,
                eraserSelected: true,   
                lineSelected: false,           
              }
            ];
            setDrawingTools(tempArray);
          }}>
            <Image style={[styles.colorPickerIcon, {backgroundColor: '#e2e5de', borderColor: '#e2e5de', borderRadius: 0}]} source={require('./assets/eraser.png')} resizeMode={'contain'}/>
            <Text style={styles.descriptiveText}>
            Eraser
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  if (screen == 1) {
    return (
      <SafeAreaView style={styles.container} onLayout={onLayoutRootView}>
        <View style={{width: "90%", height: '70%', justifyContent: 'flex-start', alignSelf: 'center'}}>
          <Text style={[styles.descriptiveText2, {textAlign: 'center', fontSize: 30}]}>
          {color}
          </Text>
				  <ColorPicker
				  color={color}
				  onColorChange={(color) => onChangeColor(color)}
				  thumbSize={30}
				  sliderSize={30}
				  noSnap={true}
				  row={false}
          swatches={false}
				  />
        </View>
        <TouchableOpacity onPress={() => {setScreen(0); setColor(color)}}>
          <View style={{borderRadius: 10, backgroundColor: color, marginVertical: '10%', width: '70%', alignSelf: 'center', borderWidth: 1, borderColor: 'black'}}>
            <Text style={[styles.paragraph, {textAlign: 'center', paddingHorizontal: 30, paddingVertical: 20, color: '#f5f5f5', fontSize: 20}]} numberOfLines={1}>
            Choose Color 
            </Text>
          </View>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  if (screen == 2) {
    return (
      <SafeAreaView style={[styles.container, {alignItems: 'flex-start'}]} onLayout={onLayoutRootView}>
        <Text style = {[styles.projectList, {width: '90%', alignSelf: 'center', marginTop: '10%', marginBottom: '5%'}]}>
        Projects
        </Text>
        <TouchableOpacity style={[styles.newProject, {marginBottom: '5%', width: windowWidth * 0.9, marginLeft: '5%'}]} onPress={() => {
          setIsDialogVisible(true);
        }}>
          <View style={styles.imagePreview}>
            <Text style={{fontSize: 90, textAlign: 'center', fontFamily: 'sfns', justifyContent: 'center', width: '100%', bottom: 10}}>
            +
            </Text>
          </View>
          <Text style={styles.projectName}>
          New Project
          </Text>
        </TouchableOpacity>
        <FlatList
        data={savedProjects}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        style={{width: '100%', height: '100%'}}
        />
        <DialogInput
        isDialogVisible={isDialogVisible}
        title={"Enter Project Name"}
        hintInput ={"New Project"}
        submitInput={ (inputText) => {
        let newArray = [...savedProjects];
        newArray.push({
          name: inputText,
          id: 0,
          stroke: []
        });
        for (var i = 0; i < newArray.length; i++) {
          newArray[i].id = i;
        }    
        setSavedProjects(newArray);
        storeList(newArray);
        setIsDialogVisible(false);
        }}
        closeDialog={() => {setIsDialogVisible(false)}}>
        </DialogInput>
      </SafeAreaView>
    );
  }
}

const windowWidth = Dimensions.get('window').width;
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: 'white'
  },
  colorPickerIcon: {
    width: 35,
    height: 35,
    justifyContent: 'center',
    borderWidth: 2,
    borderRadius: 10,
  },
  descriptiveText: {
    fontSize: 9,
    marginHorizontal: '5%',
    justifyContent: 'center',
    color: 'gray',
    textAlign: 'center',
    fontFamily: 'sfns'
  },
  paragraph: {
    fontFamily: 'sfns',
    fontSize: 24,
    color: 'white'
  },
  toolbar: {
    backgroundColor: '#e2e5de',
    width: '100%',
    height: '10%',
    borderColor: 'darkgrey',
    flexDirection: 'row',
    alignItems: 'center',
    borderTopWidth: 1,
  },
  descriptiveText2: {
    fontSize: 12,
    marginLeft: '4%',
    fontFamily: 'sfns'
  },
  icon: {
    flexDirection: 'column',
    alignItems: 'center',
    padding: 10,
    borderLeftWidth: 1,
    borderLeftColor: 'darkgrey',
    width: windowWidth / 6,
    height: '100%',
    alignSelf: 'center',
    justifyContent: 'center'
  },
  sliderView: {
    width: '90%',
    justifyContent: 'center',
    paddingHorizontal: 10
  },
  projectList: {
    fontSize: 50,
    color: 'black',
  },
  newProject: {
    backgroundColor: 'lightgrey',
    width: '90%',
    height: windowWidth * 0.3,
    alignSelf: 'flex-start',
    borderRadius: 10,
    flexDirection: 'row',
    justifyContent: 'flex-start',
    marginBottom: '5%'
  },
  imagePreview: {
    borderWidth: 2,
    width: windowWidth * 0.25,
    height: windowWidth * 0.25,
    marginLeft: '5%',
    borderRadius: 10,
    justifyContent: 'center',
    alignSelf: 'center',

  },
  projectName: {
    fontSize: 25,
    color: 'black',
    fontFamily: 'sfns',
    marginLeft: '5%',
    alignSelf: 'center',
    width: windowWidth * 0.4
  },
  removeButton: {
    width: windowWidth * 0.1,
    height: windowWidth * 0.12,
    alignSelf: 'center',
    justifyContent: 'center',
    padding: 5,
    position: 'absolute',
    right: windowWidth * 0.05,
    top: '25%',
  },
});
