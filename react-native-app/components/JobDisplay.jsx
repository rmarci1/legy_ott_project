import { View, Text, TouchableOpacity, Image, TouchableWithoutFeedback, Animated, Easing } from 'react-native'
import React, { useRef, useState } from 'react'
import { Heart } from "lucide-react-native";
const JobDisplay = ({image,title,containerStyles,name,date,saved,currLimit,limit,imageStyles,handlePress,nameStyle,titleStyle,dateStyle}) => {
  const [isLiked,setIsLiked] = useState(saved);
  const animatedValue = useRef(new Animated.Value(0.5)).current;

  const handleClick = () => {
     Animated.sequence([
       Animated.timing(animatedValue, {
         toValue: 1,
         duration: 300,
         easing: Easing.ease,
         useNativeDriver: false,
       }),
       Animated.timing(animatedValue, {
         toValue: 0.5,
         duration: 350,
         easing: Easing.ease,
         useNativeDriver: false,
       })
     ]).start();
     setIsLiked(!isLiked);
  }
  return (
        <View className={`rounded-3xl px-2 justify-center ${containerStyles}`}>
          <View className='flex-row mt-2'>
            <View className={`rounded-full items-center justify-center ${imageStyles}`}>
                <Image
                    source={image}
                    resizeMode='cover'
                    className='w-10 h-10 mt-1 rounded-full'
                />
            </View>
            <View className='ml-2 w-[75%]'>
                <View className='flex-row justify-between'>
                  <Text className={`font-pregular ${nameStyle}`}>{name}</Text>
                  <TouchableWithoutFeedback
                    onPress={handleClick}
                  >
                  <Animated.View style={{
                    transform: [{
                      scale: animatedValue.interpolate({
                        inputRange: [0.5, 1],
                        outputRange: [1, 1.5],
                      })
                    }]
                  }} pointerEvents="box-none">
                    <Heart size={20} color={isLiked ? "red" : "gray"} fill={isLiked ? "red" : "none"} className='h-full'/>
                  </Animated.View>
                  </TouchableWithoutFeedback>
                </View>
                <Text className={`font-pbold text-lg ${titleStyle}`}>{title}</Text>
                <Text className={`font-pregula text-base ${dateStyle}`}><Text className='text-blue-400'>{date}</Text> × {currLimit} / {limit} fő</Text>
            </View>
        </View>
    </View>
  )
}

export default JobDisplay