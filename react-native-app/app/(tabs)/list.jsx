import { View, Text, StyleSheet, Image } from 'react-native'
import React from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useGlobalContext } from '@/context/GlobalProvider'
const list = () => {
  const {user} = useGlobalContext();
  return (
    <SafeAreaView className='items-center justify-center'>
      <Image
        source={{uri : user.profileImg}}
      />
    </SafeAreaView>
  )
}
export default list