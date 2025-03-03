import { View, Text, TouchableOpacity, Image, TouchableWithoutFeedback, Animated, Easing } from 'react-native'
import React, { useCallback, useMemo, useRef, useState } from 'react'
import { Heart } from "lucide-react-native";
import { updateSaved } from '@/lib/api';
import { useGlobalContext } from '@/context/GlobalProvider';
const JobDisplay = ({image,containerStyles,item,imageStyles,nameStyle,titleStyle,dateStyle,handleProfile, createing, handleSave}) => {
  const {setJobs}= useGlobalContext();
  const animatedValue = useRef(new Animated.Value(0.5)).current;
  const handleClick = async () => {
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
     await update(item.profiles[0]?.saveForLater ? !item.profiles[0]?.saveForLater : true);
    }
    const update = async (isLiked) => {
        await updateSaved(isLiked,item.id);
        setJobs((prevJobs) => prevJobs.map((job) => job.id !== item.id ? job : {...job, profiles: [{isApplied: false, saveForLater: isLiked}]}));
        if(handleSave) handleSave(isLiked);
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
                  <TouchableOpacity
                    onPress={() => handleProfile(item.from)}
                    activeOpacity={0.7}
                  >
                    <Text className={`font-pregular ${nameStyle}`}>{item.from}</Text>
                  </TouchableOpacity>
                  {!createing && <TouchableWithoutFeedback
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
                    <Heart size={20} color={item.profiles[0]?.saveForLater ? "red" : "gray"} fill={item.profiles[0]?.saveForLater ? "red" : "none"} className='h-full'/>
                  </Animated.View>
                  </TouchableWithoutFeedback>}
                </View>
                <Text className={`font-pbold text-lg ${titleStyle}`}>{item.name}</Text>
                <Text className={`font-pregula text-base ${dateStyle}`}><Text className='text-blue-400'>
                  {typeof item.date === 'object' ? item.date.toISOString().split('T')[0] : item.date.split('T')[0]}</Text> × {item.current_attending} / {item.max_attending} fő
                </Text>
            </View>
        </View>
    </View>
  )
}
export default JobDisplay