import React, { useRef, useEffect } from 'react';
import { StyleSheet, Animated, TouchableOpacity, Easing } from 'react-native';
import { IconFlagJapan, IconFlagUnitedStates} from '../assets/icon-flags';
import { useLang, useLangUpdate } from './LangContext';

function ToggleLanguage() {
    const locale = useLang();
    const toggleLocale = useLangUpdate();
    const isOn = locale === 'ja';

    // Initialize at the correct position so we don't flash the wrong flag on mount.
    const positionButton = useRef(new Animated.Value(isOn ? 1 : 0)).current;

    const initialOpacityOn    = positionButton.interpolate({inputRange:[0, 1],outputRange:[0, 1]});
    const initialOpacityOff   = positionButton.interpolate({inputRange:[0, 1],outputRange:[1, 0]});

    useEffect(() => {
        Animated.timing(positionButton,{
            toValue: isOn ? 1 : 0,
            duration:400,
            easing:Easing.ease,
            useNativeDriver:false
        }).start();
    }, [isOn]);

    const onPress = () => {
        toggleLocale(isOn ? 'en' : 'ja');
    };

    return (
        <TouchableOpacity activeOpacity={1} onPress={onPress} >
            <Animated.View style={[styles.mainStyles ]} >
                <Animated.View style={[styles.flags, { opacity: initialOpacityOff }]}>
                    <IconFlagUnitedStates />
                </Animated.View>
                <Animated.View style={[styles.flags, { opacity: initialOpacityOn }]}>
                    <IconFlagJapan />
                </Animated.View>
            </Animated.View>
        </TouchableOpacity>
    );
}

export default ToggleLanguage;

const styles = StyleSheet.create({
    mainStyles: {
        height: 44,
        width: 32,
        position: "relative",
        overflow: "hidden",
    },
    flags: {
        position: "absolute",
        left: -15,
        top: 10,
    }
});
