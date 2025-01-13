import { View, Text, TouchableOpacity } from 'react-native'
import React from 'react'

const CustomButton = ({handlePress,title,containerStyles,textStyles,isLoading}) => {
  return (
    <TouchableOpacity
        onPress={handlePress}
        activeOpacity={0.7}
        className={`${containerStyles} rounded-3xl min-h-[60px] w-full justify-center items-center ${isLoading ? 'opacity-50' : ''}`}
        disabled={isLoading}
    >
        <Text className={`text-xl font-bold ${textStyles}`}>{title}</Text>
    </TouchableOpacity>
  )
}

export default CustomButton