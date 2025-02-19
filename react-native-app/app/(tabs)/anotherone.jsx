import { View } from 'react-native'
import React from 'react'
import { useGlobalContext } from '@/context/GlobalProvider'

const anotherone = () => {
  const {jobs} = useGlobalContext();
  return (
    <View>
    </View>
  )
}

export default anotherone