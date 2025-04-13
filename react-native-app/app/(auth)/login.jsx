import { View, Text, SafeAreaView, TouchableOpacity, Image } from 'react-native'
import React, { useEffect, useState } from 'react'
import Formfield from '@/components/inputFields/Formfield'
import CustomButton from '@/components/CustomButton';
import images from '@/constants/images';
import { router } from 'expo-router';
import { getJobs, getUser, pflogin } from '@/lib/api';
import { useGlobalContext } from '@/context/GlobalProvider';
import Toast from 'react-native-toast-message';

/**
 * Bejelentkezési képernyő, amely lehetővé teszi a felhasználó számára, hogy belépjen a rendszerbe a fiókjába.
 * 
 * A felhasználói adatokat tartalmazó űrlap elküldésére szolgál, valamint beállítja a felhasználó állapotát és lekéri a munkákat, ha szükséges.
 * 
 * @returns {JSX.Element} A bejelentkezési képernyő renderelése.
 */
const login = () => {
  const {setIsLoading,setIsloggedIn,setUser,isLoggedIn,user,isLoading,isJobsIn,setIsJobsIn,setJobs,showToast,toastConfig} = useGlobalContext();

  // Effektus, amely navigál a főoldalra, ha a felhasználó be van jelentkezve.
  useEffect(() => {
    if(isLoggedIn && !isLoading && isJobsIn && user) router.push('/(tabs)/home');
  },[isLoggedIn,user,isJobsIn,isLoading])
  const [form,setForm] = useState({
    email : '', 
    password : ''
  });
  
  // Bejelentkezés és a felhasználói adatok lekérése
  const submit = async () => {
      await pflogin(form.email,form.password).then(() => {
          setIsLoading(true);
          getUser()
          .then((result)=>{
            if(result){
                setIsloggedIn(true);
                setUser(result);
                getJobs()
                .then((jobs) => {
                if(jobs){
                  setJobs(jobs);
                  setIsJobsIn(true);
                }
                else{
                  setJobs(null);
                  setIsJobsIn(false);
                }
              });
            }
            else{
                setIsloggedIn(false);
                setUser(null);
            }
          })
          .catch((error) => {
            showToast("error","Hiba",error.message);
          })
          .finally(() => {
            setIsLoading(false);
          })}
    )
    .catch((error) => {
      showToast("error","Hiba",error.message);
    });
    }
  return (
    <SafeAreaView className='h-full'>
      <View className='w-full min-h-[85vh] flex-1 justify-center items-center'>
        <Text className='font-pbold color-primary text-3xl'>Bejelentkezés</Text>
        <Text className='font-psemibold text-xl mt-10'>Üdvözlünk jelentkezz be!</Text>
        <Formfield
          placeholder="Email"
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
      <Toast config={toastConfig}/>
    </SafeAreaView>
  )
}

export default login