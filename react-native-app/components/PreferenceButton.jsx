import { View, Text, TouchableOpacity } from 'react-native'
import React from 'react'
import { AntDesign } from '@expo/vector-icons'
import { FlashList } from '@shopify/flash-list'
const getDays = (title) => {
    if(title === "3 nap"){
      return 3;
    }
    else if(title === "1 hét"){
      return 7;
    }
    else if(title === "2 hét"){
      return 14;
    }
    else if(title === "1 hónap"){
      return 31;
    }
    else{
      return null;
    }
}
const renderItem = (item,index,isFocused,handlePress,type) => {
  return (
  <TouchableOpacity
    key={index}
    className={`bg-[#292929] border-2 ${isFocused? 'border-primary' : 'border-[#292929]'} justify-center px-4 py-3 h-14 rounded-lg self-start`}
    onPress={() => type === "location" ? handlePress(item) : handlePress(getDays(item),item)}
  > 
    {item === "X" ? <AntDesign name="close" size={24} color="white" /> : <Text className='text-white text-lg font-pmedium'>{item}</Text>}
  </TouchableOpacity>
  )
}
const PreferenceButton = ({titles,handlePress, givenDay, type}) => {
  return (
    <View className='flex-row flex-wrap w-[85%] mt-5 self-center gap-2 gap-y-4'>
        {titles.map((item, index) => renderItem(item, index, givenDay? item===givenDay : false, handlePress, type))}
    </View>
  )
}

export default PreferenceButton