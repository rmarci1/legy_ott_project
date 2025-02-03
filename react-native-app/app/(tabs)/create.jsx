import { View, Text } from 'react-native'
import React, { useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import Formfield from '@/components/Formfield'

const create = () => {

  const [form,setForm] = useState({
    title: "",
    max : 1,
    when : new Date(),
    location : "",
    description : ""
  })

  return (
    <SafeAreaView className='justify-center items-center h-full'>
      <Text></Text>
        <Formfield
          title="Cím"
          value={form.title}
          handleChangeText={(e) => setForm({...form, title:form.title})}
          otherStyles="mt-5"
        />
    </SafeAreaView>
  )
}

export default create