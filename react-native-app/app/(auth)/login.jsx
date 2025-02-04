import { View, Text, SafeAreaView, TouchableOpacity, Image } from 'react-native'
import React, { useState } from 'react'
import Formfield from '@/components/Formfield'
import CustomButton from '@/components/CustomButton';
import images from '@/constants/images';
import { router } from 'expo-router';
import { blob, getUser, pflogin } from '@/lib/api';
import { useGlobalContext } from '@/context/GlobalProvider';

const login = () => {
  const {setIsLoading,setIsloggedIn,setUser} = useGlobalContext();
  const [form,setForm] = useState({
    email : '', 
    password : ''
  });
  const submit = async () => {
      await pflogin(form.email,form.password);
      await getUser().then((res)=>{
        setIsLoading(true);
        if(res){
            setIsloggedIn(true);
            setUser(res.profile);
        }
        else{
            setIsloggedIn(false);
            setUser(null);
        }
      })
      .catch((error) => {
        console.log(error)
        throw new Error(error.message);
      })
      .finally(() => {
        setIsLoading(false);
      })
      router.push('/(tabs)/home');
    }
  return (
    <SafeAreaView className='h-full'>
      <View className='w-full min-h-[85vh] flex-1 justify-center items-center'>
        <Text className='font-pbold color-primary text-3xl'>Bejelentkezés</Text>
        <Text className='font-psemibold text-xl mt-10'>Üdvözlünk jelentkezz be!</Text>
        <Formfield
          placeholder="Email/Felhasználónév"
          value={form.email}
          handleChangeText={(e) => setForm({...form, email : e})}
          otherStyles="w-[85%] mt-20" 
        />
        <Formfield
          placeholder="Jelszó"
          value={form.password}
          handleChangeText={(e) => setForm({...form, password : e})}
          otherStyles="w-[85%] mt-10"
        />
        <Text className='color-primary text-right w-[80%] mt-9 font-psemibold'>Elfejtetted a jelszavadat?</Text>
        <View className='w-[85%]'> 
          <CustomButton 
            title="Bejelentkezés"
            containerStyles="mt-10 bg-primary drop-shadow-lg"
            textStyles="text-white"
            handlePress={submit}
          />
        </View>
        <TouchableOpacity
          onPress={() => router.navigate('/(auth)/signup')}
        >
          <Text className='font-psemibold text-[#494949] mt-10'>Új fiók csinálása</Text>
        </TouchableOpacity>
        <Text className='text-primary font-psemibold mt-20'>--------- Vagy jelentkezz be ---------</Text>
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

export default login