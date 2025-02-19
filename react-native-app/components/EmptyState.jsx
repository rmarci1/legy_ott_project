import { View, Text, Image } from 'react-native'
import React from 'react'
import { FontAwesome5 } from '@expo/vector-icons'
import CustomButton from './CustomButton'
import images from '@/constants/images'

const EmptyState = ({title,substitle}) => {
  return (
    <View className='w-full justify-center items-center flex'>

        <Image
            resizeMode='cover'
            source={images.empty}
            className='w-[500px] h-[400px]'
        />
        <View className='flex-row items-center'>
            <Text className='font-pregular text-3xl text-center'>{title}<Text className='text-primary'> {substitle}</Text></Text>
        </View>
    
    </View>
  )
}

export default EmptyState