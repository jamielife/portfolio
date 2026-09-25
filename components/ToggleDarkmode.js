import React, { useRef, useEffect } from 'react';
import { Text, StyleSheet, Animated, TouchableOpacity, Easing } from 'react-native';
import { Box, Icon, useColorMode } from "native-base";
import { MaterialIcons } from "@expo/vector-icons";

function ToggleDarkmode() {
    const { colorMode, toggleColorMode } = useColorMode();
    // The animation's "on" state is light mode (sun visible).
    const isOn = colorMode === 'light';

    // Initialize at the correct position so we don't flash the wrong icon on mount.
    const positionButton = useRef(new Animated.Value(isOn ? 1 : 0)).current;

    const positionInterPol    = positionButton.interpolate({inputRange:[0, 1],outputRange:[0, -50]});
    const positionInterPol2   = positionButton.interpolate({inputRange:[0, 1],outputRange:[50, 0]});
    const initialOpacityOn    = positionButton.interpolate({inputRange:[0, 1],outputRange:[0, 1]});
    const initialOpacityOff   = positionButton.interpolate({inputRange:[0, 1],outputRange:[1, 0]});
    const initialOpacityOff2  = positionButton.interpolate({inputRange:[0, 1],outputRange:[.5, 0]});

    useEffect(() => {
        Animated.timing(positionButton,{
            toValue: isOn ? 1 : 0,
            duration:600,
            easing:Easing.ease,
            useNativeDriver:false
        }).start();
    }, [isOn]);

    const onPress = () => {
        toggleColorMode();
    };

    return (
        <TouchableOpacity activeOpacity={1} onPress={onPress} >
            <Animated.View style={[styles.mainStyles]} >
                <Animated.View style={[styles.celestialObjects, { transform:[{ translateY: positionInterPol }], opacity: initialOpacityOff }]}>
                    <Icon as={MaterialIcons} name="nightlight-round" size="xl" color="white" />
                    <Box ml={-1} mt={1} w={1} h={3} style={styles.glow}> </Box>
                    <Box ml={-1} mt={1} w={1} h={3} style={styles.glow}> </Box>
                    <Box ml={-1} mt={1} w={1} h={3} style={styles.glow}> </Box>
                </Animated.View>

                <Animated.View style={[styles.celestialObjects, { transform:[{ translateY: positionInterPol2 }], opacity: initialOpacityOn }]}>
                    <Icon as={MaterialIcons} name="wb-sunny" size="xl" color="rgba(255, 166, 0, 1)" />
                </Animated.View>

                <Animated.View style={[{opacity: initialOpacityOff2 }]}><Text style={{color: "rgba(255, 217, 0, 1)", fontSize: 10 }}>.</Text></Animated.View>
                <Animated.View style={[{position: "absolute", top: 9, left: -2 }, { opacity: initialOpacityOff2 }]}><Text style={{color:"rgba(255,255,255,1)"}}>.</Text></Animated.View>
                <Animated.View style={[{position: "absolute", bottom: 4, left: 10 }, { opacity: initialOpacityOff2 }]}><Text style={{color:"rgba(255,255,255,1)", fontSize: 10 }}>.</Text></Animated.View>
                <Animated.View style={[{position: "absolute", bottom: 2, right: 9 }, { opacity: initialOpacityOff2 }]}><Text style={{color:"rgba(255,217,0,.75)"}}>.</Text></Animated.View>
                <Animated.View style={[{position: "absolute", top: 2, right: 9 }, { opacity: initialOpacityOff2 }]}><Text style={{color:"rgba(255,255,255,.75)", fontSize: 10 }}>.</Text></Animated.View>
            </Animated.View>
        </TouchableOpacity>
    );
}

export default ToggleDarkmode;

const styles = StyleSheet.create({
    mainStyles: {
        height: 44,
        width: 44,
        position: "relative",
        overflow: "hidden",
    },
    celestialObjects: {
        position: "absolute",
        left: 6,
        top: 9,
    },
    glow: {
        position: "absolute",
        left: 12,
        top: 5,
        color: "#ffffff",
        shadowColor: "#fff000",
        shadowOffset: {
            width: 0,
            height: 0,
        },
        shadowOpacity: 1,
        shadowRadius: 12,

        elevation: 15,
    }
});
