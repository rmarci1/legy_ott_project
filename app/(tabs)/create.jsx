import { View, Text } from 'react-native'
import React from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'

const create = () => {
  return (
    <SafeAreaView className='justify-center items-center h-full'>
        <Text>Create</Text>
    </SafeAreaView>
  )
}

export default create