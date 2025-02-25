import { View, Text, TouchableOpacity } from 'react-native'
import React from 'react'
import { AntDesign } from '@expo/vector-icons'

const PreferenceButton = ({title,containerStyles,handlePress, isFocused}) => {
  return (
      <TouchableOpacity
        className={`bg-[#292929] border-2 ${isFocused? 'border-primary' : 'border-[#292929]'} items-center justify-center px-4 py-3 h-14 rounded-lg ${containerStyles}`}
        onPress={handlePress}
      > 
        {title === "X" ? <AntDesign name="close" size={24} color="white" /> : <Text className='text-white text-lg font-pmedium'>{title}</Text>}
      </TouchableOpacity>
  )
}

export default PreferenceButton