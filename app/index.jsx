import {Image, ImageBackground, SafeAreaView, StatusBar, Text, TouchableOpacity, View } from 'react-native'
import React, { useRef, useState } from 'react'
import "../global.css"
import images from "@/constants/images"
import CustomButton from '@/components/CustomButton'
import Swiper from "react-native-swiper"
import { router } from 'expo-router'
const list = [
  {id: 1, title: "Itt megtalálhatod a kívánt munkádat és nagyszerű élményekkel gazdagodhatsz közben", mainPicture: "growing"},
  {id: 2, title: "Bővítsd meg az önkénteseid számát egyszerűen, átlátható módon", mainPicture: "expand"},
  {id: 3, title: "Szerezz új akár életre szóló kapcsolatokat, és válj egy közösség részévé", mainPicture: "communication"}
];

const logos = (item) => {
  switch(item){
    case "communication" :
      return images.communication
    case "growing" : 
      return images.growing
    case "expand" :
      return images.expand
  }
}
const renderItem = (item) => {
  return (
    <View key={item.id} className='items-center justify-center mt-12'>
      <Image
        source={logos(item.mainPicture)}
        resizeMode='contain'
        className='w-[348px] h-[330px] flex'
      />
      <Text className='text-white font-rlight text-xl text-center mt-4 mx-5'>{item.title}</Text>
    </View>
  )
}
const index = () => {
  const [index, setIndex] = useState(0);
  const swiperRef = useRef(null);
  return (
    <SafeAreaView className='h-full'>
      <ImageBackground source={images.welcomebg} resizeMode='cover' className='h-full'>
      <StatusBar translucent backgroundColor="transparent" barStyle="light-content"/>
        <View className='flex-1 justify-center items-center mt-5'>
            <Swiper
              ref={swiperRef}
              autoplay={true}
              onIndexChanged={(index) => setIndex(index)}
              dot={<Image source={images.dot} resizeMode='contain' className='mr-4'/>}
              activeDot={<Image source={images.active_dot} resizeMode='contain' className='mr-4'/>}
              index={index}
              className=''
            >
              {list.map((item) => renderItem(item))}
            </Swiper>
            <Text className='text-4xl font-rbold text-[#EFB8C8] text-center'> Légy ott!</Text>
            <Text className='font-rregular text-lg text-white text-center mt-3 mx-6'>Csatlakozz több mint 10000 felhasználóhóz mint hirdető vagy önkéntesként</Text>
            <View className='w-[85%]'>
            <CustomButton
              handlePress={() => router.navigate("/(auth)/signup")}
              title="Fiók készítése"
              containerStyles="mt-14"
            />
            </View>
            <View className='flex-row mt-5 mb-20'>
            <Text className='font-rregular text-white'>Már van fiókod?</Text>
            <TouchableOpacity className='font-rbold' onPress={() => router.navigate("/(auth)/login")}><Text className='text-white font-rbold'>Jelentkezz be!</Text></TouchableOpacity>
            </View>
            </View>
      </ImageBackground>
    </SafeAreaView>
  )
}

export default index