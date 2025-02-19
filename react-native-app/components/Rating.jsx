import { View, Text, TouchableOpacity } from 'react-native'
import React, { useEffect, useState } from 'react'
import { AntDesign } from '@expo/vector-icons';

const Rating = ({item,handleProfile}) => {
  const [showMoreRating,setShowMoreRating] = useState(false);
  const [readMoreRating,setReadMoreRating] = useState(false);
  useEffect(() => {
    if(item.desc.length > 100){
        setReadMoreRating(true);
    }
  })
  console.log(item.review);
  return (
    <View key={item} className='mt-5 w-[90%] self-center'>
      <View className='flex-row justify-between items-center'>
      <TouchableOpacity
        className='w-[70%]'
        onPress={() => handleProfile(item.reviewer_un)}
      >
        <Text className='text-purple-400 font-plight text-lg'>{item.reviewer_un}</Text>
      </TouchableOpacity>
      <View className='flex-row w-[30%]'>
        <AntDesign name="star" size={18} color={item.review>=1 ? "yellow" : "white"} />
        <AntDesign name="star" size={18} color={item.review>=2 ? "yellow" : "white"} />
        <AntDesign name="star" size={18} color={item.review>=3 ? "yellow" : "white"} />
        <AntDesign name="star" size={18} color={item.review>=4 ? "yellow" : "white"} />
        <AntDesign name="star" size={18} color={item.review==5 ? "yellow" : "white"} />
      </View>
      </View>
      <Text className='text-white font-pmedium mt-4'>{(readMoreRating && !showMoreRating)? item.desc.substring(0,50)+"..." : item.desc}</Text>
      {readMoreRating && (
        <TouchableOpacity
          onPress={() => setShowMoreRating(!showMoreRating)}
          className=' border-white'
        >
          <Text className='font-pbold text-teal-900'>{showMoreRating? "Kevesebb" : "Olvass többet"}</Text>
        </TouchableOpacity>
      )}  
    </View>
  )
}

export default Rating