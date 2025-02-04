import { View, Text, StyleSheet } from 'react-native'
import React from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
const list = () => {
  return (
    <SafeAreaView className='items-center justify-center'>
      <Text className='text-3xl font-pregular'>list</Text>
    </SafeAreaView>
  )
}
export default list