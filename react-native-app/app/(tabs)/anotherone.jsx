import { View, Text, ScrollView, FlatList, Pressable, StyleSheet, ImageBackground, Animated, Easing, Touchable, TouchableOpacity } from 'react-native'
import React, { useEffect, useMemo, useRef, useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Heart } from "lucide-react-native";
const anotherone = () => {
  const [isLiked,setIsLiked] = useState(false);
  const animatedValue = useRef(new Animated.Value(0.5)).current;

  const handleClick = () => {
    Animated.sequence([
      Animated.timing(animatedValue, {
        toValue: 1,
        duration: 250,
        easing: Easing.ease,
        useNativeDriver: false,
      }),
      Animated.timing(animatedValue, {
        toValue: 0.5,
        duration: 250,
        easing: Easing.ease,
        useNativeDriver: false,
      })
    ]).start();
    setIsLiked(!isLiked);
  }
  return (
    <SafeAreaView className='h-full items-center justify-center'>
      <TouchableOpacity
        onPress={handleClick}
      >
        <Animated.View style={{
          transform: [{
            scale: animatedValue.interpolate({
              inputRange: [0.5, 1],
              outputRange: [1, 1.5],
            })
          }]
        }} className="border">
          <Heart size={30} color={isLiked ? "red" : "gray"} fill={isLiked ? "red" : "none"} className='h-full'/>
        </Animated.View>
      </TouchableOpacity>
    </SafeAreaView>
  )
}

export default anotherone