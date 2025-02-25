import { View, Text, TouchableOpacity, Image } from 'react-native'
import React from 'react'
import { Entypo } from '@expo/vector-icons';
import images from '@/constants/images';
import { router } from 'expo-router';

const EmptyView = ({title, close}) => {
  return (
    <View className='min-h-full items-center justify-center'>
        {close && <View className='absolute top-[5%] left-5'>
                      <TouchableOpacity
                          onPress={() => {
                              router.replace('/(tabs)/home');
                            }}
                          >
                        <Entypo name="chevron-thin-left" size={30} color="black" />
                      </TouchableOpacity>
                    </View>}
        <Text className='font-rbold text-4xl text-center text-primary'>{title}</Text>
        <Image
            resizeMode='contain'
            source={images.search}
            className='w-[90%] h-[40%]'
        />
    </View>
  )
}

export default EmptyView