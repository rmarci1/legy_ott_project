import { View, Text, SafeAreaView, TouchableOpacity, Image, Alert } from 'react-native'
import React, { useState } from 'react'
import Formfield from '@/components/Formfield'
import CustomButton from '@/components/CustomButton';
import images from '@/constants/images';
import { router } from 'expo-router';
import { useGlobalContext } from '@/context/GlobalProvider';
import {createUser} from '@/lib/appwrite'
const signup = () => {
  const {setFormPart} = useGlobalContext();

  const [form,setForm] = useState({
    email : '',
    password : '',
    confirmPassword : ''
  });
  const [isSubmitting,setIsSubmitting] = useState(false);

  const submit = () => {
    if(!form.email || !form.password || !form.password){
      Alert.alert("Hiba","Nem töltötted ki az összes adatot")
      return;
    }
    if(form.password !== form.confirmPassword){
      Alert.alert("Hiba","A jelszók nem egyeznek meg")
      return;
    }
    try{
      setIsSubmitting(true);
      setFormPart(form);
      router.push('/welcome');
    }
    catch(error){
      throw new Error(error)
    }
    finally{
      setIsSubmitting(false);
    }
  }
  return (
    <SafeAreaView className='h-full'>
      <View className='w-full min-h-[85vh] flex-1 justify-center items-center'>
        <Text className='font-pbold color-[#1F41BB] text-3xl mt-8'>Regisztráció</Text>
        <Text className='font-pmedium text-xl mt-4 text-center w-[85%]'>Csinálj egy fiókot hogy felvedeszd az új lehetőségeidet!</Text>
        <Formfield
          placeholder="Email"
          value={form.email}
          handleChangeText={(e) => setForm({...form, email : e})}
          otherStyles="w-[85%] mt-14"
        />
        <Formfield
          placeholder="Jelszó"
          value={form.password}
          handleChangeText={(e) => setForm({...form, password : e})}
          otherStyles="w-[85%] mt-10"
        />
        <Formfield
          placeholder="Jelszó megerősítése"
          value={form.confirmPassword}
          handleChangeText={(e) => setForm({...form, confirmPassword : e})}
          otherStyles="w-[85%] mt-10"
        />
        <View className='w-[85%]'> 
          <CustomButton 
            title="Regisztráció"
            containerStyles="mt-10 bg-[#1F41BB] drop-shadow-lg"
            textStyles="text-white"
            handlePress={submit}
          />
        </View>
         <TouchableOpacity
          onPress={() => router.navigate('/(auth)/login')}
        >
          <Text className='font-psemibold text-[#494949] mt-10'>Már van fiókom</Text>
        </TouchableOpacity>
        <Text className='text-[#1F41BB] font-psemibold mt-20'>----------- Vagy folytasd -----------</Text>
        <TouchableOpacity
          className='flex-row items-center justify-center mt-8 bg-gray-200 h-[56px] w-[85%] rounded-2xl'
        > 
          <Image
            source={images.google}
          />
          <Text className='text-lg font-rmedium ml-2'>Google</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  )
}

export default signup