import { View, Text, TextInput, TouchableOpacity } from 'react-native'
import React from 'react'
import { Ionicons } from '@expo/vector-icons'

const SettingsField = ({title,value,handleChangeText,containerStyles}) => {
  return (
    <View className={`${containerStyles}`}>
        <Text className='text-xl font-extrabold text-white'>{title}</Text>
        <View className="relative w-80 bg-gray-800 border-b-2 border-x border-white rounded-xl p-2 mt-4 justify-between flex-row items-center">
        <TextInput
            value={value}
            onChangeText={(e) => handleChangeText(e)}
            className="text-white text-xl ml-2 font-plight"
        />
        <TouchableOpacity
            className=""
        >
            <Ionicons name="pencil" size={24} color="white" className='mr-1' />
        </TouchableOpacity>
        </View>
    </View>
  )
}

export default SettingsField