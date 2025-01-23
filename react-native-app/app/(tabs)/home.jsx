import { View, Text, TouchableOpacity, TouchableWithoutFeedback, Keyboard } from 'react-native'
import React from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import SearchInput from '@/components/SearchInput'
import { Ionicons } from '@expo/vector-icons'

const home = () => {

  return (
      <TouchableWithoutFeedback
        onPress={() => Keyboard.dismiss()}
      >
    <SafeAreaView className='h-full items-center bg-gray-50'>
      <View className='h-min-[65vh] w-[90%]'>
        <Text className='font-pmedium mt-5'>Hello, <Text className='font-pbold'>user</Text></Text>
        <Text className='mt-2 text-2xl font-psemibold text-primary'>Találj egy Jó lehetőséget</Text>
        <View className='flex-row items-center mt-4'>
          <SearchInput/>
          <TouchableOpacity
            className='w-14 h-14 bg-primary rounded-xl items-center justify-center ml-4'
          >
            <Ionicons name="filter-sharp" size={30} color="white" />
          </TouchableOpacity>
        </View>
        <View className='bg-white mt-6 border border-gray-100 rounded-xl px-2 justify-center'>
          <Text className='font-pbold text-lg'>Mid-level UX Designer</Text>
          <Text className='font-plight text-sm'>Budapest...</Text>
          <View className='flex-row items-center justify-between mt-3'>
            <Text className='font-pregular'>2024.02.10</Text>
            <Text>Max: 5fő</Text>
          </View>
        </View>
        <View className='bg-white mt-6 border border-gray-100 rounded-xl px-2 justify-center'>
          <Text className='font-pbold text-lg'>Mid-level UX Designer</Text>
          <Text className='font-plight text-sm'>Budapest...</Text>
          <View className='flex-row items-center justify-between mt-3'>
            <Text className='font-pregular'>2024.02.10</Text>
            <Text>Max: 5fő</Text>
          </View>
        </View>
      </View>
    </SafeAreaView>
      </TouchableWithoutFeedback>
  )
}

export default home