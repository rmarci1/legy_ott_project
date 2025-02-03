import { View, Text, ScrollView, FlatList, Pressable, StyleSheet, ImageBackground } from 'react-native'
import React from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import images from '@/constants/images'

const anotherone = () => {
  return (
    <SafeAreaView className='h-full'>
      <ImageBackground
        source={images.blur}
        className='h-full w-full'
        blurRadius={100}
      />
    </SafeAreaView>
  )
}
const styles = StyleSheet.create({
});

export default anotherone