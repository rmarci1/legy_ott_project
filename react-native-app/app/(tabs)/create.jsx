import { View, Text, ScrollView, TouchableOpacity } from 'react-native'
import React, { useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import Formfield from '@/components/Formfield'
import { Entypo } from '@expo/vector-icons'
import { router } from 'expo-router'
import DateField from '@/components/DateField'
const create = () => {

  const [form,setForm] = useState({
    title: "",
    max : 1,
    date : new Date(),
    location : "",
    description : ""
  })
  const handleConfirm = (selectedDate) => {
    setForm({...form,date : selectedDate});
  }
  return (
    <SafeAreaView className='h-full'>
      <ScrollView className='flex-1'>
        <View className='w-[90%] self-center justify-center'>
          <View className='flex-row mt-10'>
            <TouchableOpacity
              onPress={() => {
                router.push('/(tabs)/home');
              }}
            >
              <Entypo name="chevron-thin-left" size={24} color="black" />
            </TouchableOpacity>
            <Text className='text-2xl font-pbold ml-2'>Hirdetés Készítése</Text>
          </View>
          <Text className='text-xl font-semibold mt-3 ml-2'>Cím</Text>
          <Formfield
            value={form.title}
            handleChangeText={(e) => setForm({...form, title:form.title})}
            otherStyles="mt-2"
          />
          <Text className='text-xl font-semibold mt-3 ml-2'>Nap</Text>
          <Formfield
            title="Cím"
            handleChangeText={handleConfirm}
            value={form.date}
            date={true}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}

export default create