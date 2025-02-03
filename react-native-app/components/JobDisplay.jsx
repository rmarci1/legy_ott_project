import { View, Text, TouchableOpacity, Image } from 'react-native'
import React from 'react'

const JobDisplay = ({image,title,containerStyles,name,date,limit,imageStyles,handlePress,nameStyle,titleStyle,dateStyle}) => {
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
            <View className='ml-2'>
                <Text className={`font-pregular ${nameStyle}`}>{name}</Text>
                <Text className={`font-pbold text-lg ${titleStyle}`}>{title}</Text>
                <Text className={`font-pregula text-sm ${dateStyle}`}>{date} × Max: {limit} fő</Text>
            </View>
        </View>
    </View>
  )
}

export default JobDisplay