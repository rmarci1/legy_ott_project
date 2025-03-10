import { View, Text, TextInput, TouchableOpacity } from 'react-native'
import React, { useState } from 'react'
import { AntDesign, Ionicons } from '@expo/vector-icons'

const SettingsField = ({title, value, handleChangeText, containerStyles, multiline, handleUpdate, editable, showArrow, handleArrowPress}) => {
  const [arrowState,setArrowState] = useState(false);
  return (
    <View className={`${containerStyles}`}>
        <Text className='text-xl font-extrabold text-white'>{title}</Text>
        <View className={`relative bg-gray-800 border-b-2 border-x border-white rounded-xl p-2 mt-4 ${!multiline && "h-[64px]"}`}>
        <TextInput
            editable= {editable}
            value={value}
            onChangeText={(e) => handleChangeText(e)}
            className={`text-white text-lg ml-2 font-plight pr-10 flex-1`}
            multiline={multiline}
        />
        {(!showArrow || arrowState) &&
          <TouchableOpacity
              onPress={handleUpdate}
              className='absolute bottom-6 right-2'
          >
              <Ionicons name="pencil" size={24} color="white" className='mr-1' />
          </TouchableOpacity>
        }

        { showArrow && 
          <TouchableOpacity
            className = {`absolute ${arrowState? "top-4" : "bottom-6"} right-4`}
            onPress = {() => {
              setArrowState((prev) => !prev);
              handleArrowPress();
            }}
          > 
            <AntDesign name={arrowState? "caretup" : "caretdown"} size={20} color="white" />
          </TouchableOpacity>
        }

        </View>
    </View>
  )
}

export default SettingsField