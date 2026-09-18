import 'react-native-gesture-handler';
import { StyleSheet, StatusBar, Linking, Platform } from 'react-native';
import React from 'react';
import { View, NativeBaseProvider, extendTheme, useColorModeValue } from "native-base";
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { DrawerContentScrollView, DrawerItemList, DrawerItem  } from '@react-navigation/drawer';
import createDrawerNavigator from './navigation/createDrawerNavigator';
import linking from './navigation/linking';
import { BlurView } from 'expo-blur';
import { FBAalytics } from './firebaseConfig';
import { logEvent } from "firebase/analytics";

import Home     from './screens/Home';
import Work     from './screens/Work';
import Posts    from './screens/Posts';
import LeftNav  from './components/NavigationLeft';
import RightNav from './components/NavigationRight';
import WorkDetail from './screens/WorkDetail';

import { LangProvider, useI18n } from './components/LangContext';

//global.intro = "Hello! I'm am app developer based in Richmond, VA!";
global.navMargins = { base: 2, sm: 8,  md: 12, lg: 32, xl: 64 };

// Define the config
const config = {
  useSystemColorMode: false,
  initialColorMode: "dark",
  background: 'transparent'
};

const colors = {
  primary: {
    50: '#ddf8ff',
    100: '#b5e6fb',
    200: '#89d4f4',
    300: '#5dc2ee',
    400: '#35b1e9',
    500: '#1e98cf',
    600: '#1176a2',
    700: '#045475',
    800: '#003448',
    900: '#171717',
   }
}

export const theme = extendTheme({ config, colors });

const colorModeManager = {
  get: async () => {
    let val = localStorage.getItem('@color-mode');
    if (val === null) val = 'dark'; 
    return val === 'dark' ? 'dark' : 'light';
  },
  set: async (value) => {
    let strValue = value ? value.toString() : '';
    localStorage.setItem('@color-mode', strValue);
  },
};

/* Fix
{
  50: '#ffe2e7',
  100: '#ffb3bb',
  200: '#fc8393',
  300: '#f9526d',
  400: '#f6224b',
  500: '#dd0939',
  600: '#ad0320',
  700: '#7c000e',
  800: '#4d0002',
  900: '#200400',
} */

function HomeDrawer() {
  return (
    <View alignItems="center" _dark={{ bg: "trueGray.900" }} _light={{ bg: "primary.50" }} flex={1}>
      <Home />
    </View>
  );
}

function WorkDrawer() {
  return (
    <View alignItems="center" _dark={{ bg: "trueGray.900" }} _light={{ bg: "primary.50" }} flex={1}>
      <Work />   
    </View>
  );
}

function WorkDetailDrawer({route}) {
  return (
    <View alignItems="center" _dark={{ bg: "trueGray.900" }} _light={{ bg: "primary.50" }} flex={1}>
      <WorkDetail data={route} key={route.key} />   
    </View>
  );
}

function PostsDrawer() {
  return (
    <View alignItems="center" _dark={{ bg: "trueGray.900" }} _light={{ bg: "primary.50" }} flex={1}>
      <Posts />
    </View>
  );
}

const Drawer = createDrawerNavigator();
const Stack = createNativeStackNavigator();

function CustomDrawerContent(props) {
  const bg = useColorModeValue(colors.primary[50], colors.primary[900]);
  const text = useColorModeValue(colors.primary[900], colors.primary[50]);  

  const handleButtonClick = async (url, event_name) => {
    Linking.openURL(url);        
    await logEvent(FBAalytics, event_name, {
      // event parameters
      location: "sidebar",
    });
  };  

  return (
    <DrawerContentScrollView {...props}>
      <DrawerItemList {...props} />
      <DrawerItem label="Resume" inactiveTintColor={ text } onPress={() => handleButtonClick('https://jamietaylor.me/resume-jamie-taylor.pdf', 'resume_opened')} />
      <DrawerItem label="Source Code" inactiveTintColor={ text } //icon={() => <Icon as={MaterialCommunityIcons} name="github" size="xl"  />}
        onPress={() => { handleButtonClick("https://github.com/jamielife/portfolio", 'github_opened')}}>      
      </DrawerItem>
    </DrawerContentScrollView>
  );
}

const customScreenOptions = {
  headerTransparent: true,
  headerBackground: () => ( <BlurView tint={useColorModeValue("light", "dark")} intensity={30} style={StyleSheet.absoluteFill} /> ),
  headerLeft: (props)  => ( <LeftNav /> ),
  headerRight: (props) => (<RightNav /> ),
  headerTitle: "",
  headerBlurEffect: "regular",
  headerTransparent: true,
  //title: `${i18n.t('posts')} : ${i18n.t('name')}`,    
}

function DrawerMenu({colors}) {
  const bg = useColorModeValue(colors.primary[50], colors.primary[900]);
  const text = useColorModeValue(colors.primary[900], colors.primary[50]);
  //known React Navigation issues manual fixes
  document.body.style.backgroundColor = bg;
  document.body.style.overflowX = "hidden";
  const i18n = useI18n();
  let siteName = i18n.t('name'); 

  return (
    <Drawer.Navigator 
      useLegacyImplementation 
      screenOptions={{
        headerShown: true, 
        drawerPosition: 'right',
        overlayColor: 'rgba(0,0,0,.5)',              
        drawerActiveTintColor: text,
        drawerInactiveTintColor: text,
        drawerStyle: { backgroundColor: bg, },
        unmountOnBlur: true,
      }}      
      drawerContent={(props) => <CustomDrawerContent {...props} />} >
        <Drawer.Screen name="Home"  component={HomeDrawer}  options={customScreenOptions} />
        <Drawer.Screen name="Work"  component={WorkMenu}    options={customScreenOptions} />        
        <Drawer.Screen name="Posts" component={PostsDrawer} options={customScreenOptions} />    
    </Drawer.Navigator>
  );
}

function WorkMenu(){
  const bg = useColorModeValue(colors.primary[50], colors.primary[900]);
  const text = useColorModeValue(colors.primary[900], colors.primary[50]);
  const i18n = useI18n();

  return (
    <Stack.Navigator initialRouteName="WorkOverview" 
      useLegacyImplementation
      screenOptions={{
        headerShown: true, 
        drawerPosition: 'right',
        overlayColor: 'rgba(0,0,0,.5)',              
        drawerActiveTintColor: text,
        drawerInactiveTintColor: text,
        drawerStyle: { backgroundColor: bg, },
        title: "Work",
        unmountOnBlur: true,
      }} >
      <Stack.Screen name="WorkOverview" component={WorkDrawer}       options={{ headerShown: false }} />
      <Stack.Screen name="WorkDetail"   component={WorkDetailDrawer} options={{ headerShown: false }} />
    </Stack.Navigator>  
  );
}

export default function App() {
  return (
    <NativeBaseProvider colorModeManager={colorModeManager} theme={theme} flex={1}>
      <LangProvider>        
          <NavigationContainer flex={1} linking={Platform.OS === 'web' ? linking : undefined} >
          <StatusBar backgroundColor="rgb(0, 52, 72)" barStyle="light-csontent" hidden={false} />
          <DrawerMenu colors={colors} />
        </NavigationContainer>
      </LangProvider>
    </NativeBaseProvider>
  );
}
