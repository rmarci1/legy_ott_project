import { View, Text, TouchableOpacity, Image, TouchableWithoutFeedback, Animated, Easing } from 'react-native'
import React, { useRef, useState } from 'react'
import { Heart } from "lucide-react-native";
import { updateSaved } from '@/lib/api';
import { useGlobalContext } from '@/context/GlobalProvider';
const JobDisplay = ({image,containerStyles,item,imageStyles,handleUpdate,nameStyle,titleStyle,dateStyle}) => {
  const {saved,setJobs,setSaved,user}= useGlobalContext();
  //console.log("id: " + item.id + " isLiked: " + isLiked);
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
     await update(!item.isSaved);
    }
    const update = async (isLiked) => {
         console.log("fif");
         const response = await updateSaved(isLiked,item.id,user.id,user.username);
         let temp = saved;
         if(!isLiked) temp.pop(item.id)
         else {
           temp.push({...item, isSaved: isLiked});
         }
         setJobs((prevJobs) => prevJobs.map((job) => job.id !== item.id ? job : {...job, isSaved:isLiked}));
         setSaved(temp);
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
                  <Text className={`font-pregular ${nameStyle}`}>{item.from}</Text>
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
                    <Heart size={20} color={item.isSaved ? "red" : "gray"} fill={item.isSaved ? "red" : "none"} className='h-full'/>
                  </Animated.View>
                  </TouchableWithoutFeedback>
                </View>
                <Text className={`font-pbold text-lg ${titleStyle}`}>{item.name}</Text>
                <Text className={`font-pregula text-base ${dateStyle}`}><Text className='text-blue-400'>{item.date.split('T')[0]}</Text> × {item.current_attending} / {item.max_attending} fő</Text>
            </View>
        </View>
    </View>
  )
}

export default JobDisplay