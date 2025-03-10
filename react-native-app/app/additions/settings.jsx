import { View, Text, ScrollView, Image, TouchableOpacity, ActivityIndicator, Alert } from 'react-native'
import React, { useEffect, useState } from 'react'
import { useGlobalContext } from '@/context/GlobalProvider'
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { router } from 'expo-router';
import { AntDesign, Ionicons } from '@expo/vector-icons';
import SettingsField from '@/components/inputFields/SettingsField';
import { logout, updateProfile, UpdateProfilePic } from '@/lib/api';
import Toast from 'react-native-toast-message';

const settings = () => {
  const {user,setUser,openPicker,setJobs,setIsJobsIn,setIsloggedIn,showToast,toastConfig} = useGlobalContext();
  const [form,setForm] = useState(user);
  const [update, setUpdate] = useState(false);
  const [updateDesc, setUpdateDesc] = useState(false);
  useEffect(() => {
    console.log(updateDesc);
  }, [updateDesc])
  const handleImageUpdate = async (image) => {
    try{
      setUpdate(true);
      await UpdateProfilePic(image);
      setUser({...user, profileImg : image});
      setUpdate(false);
    }
    catch(error){
      throw new Error("error","Hiba",error.message)
    }
  }
  const handleUpdate = async () => {
    const updatedField = Object.fromEntries(
      Object.entries(form).filter(([key,value]) => {
        return value !== user[key];
      })
    );
    if(Object.keys(updatedField).length === 0){
      showToast("error","Nincs változás","Változtass meg benne valamit");
      return;
    }
    try{
      const res = await updateProfile(updatedField);
      setUser(res);
    }
    catch(error){
      showToast("error","Hiba",error.message);
    }
    showToast("success","Sikeres szerkesztés");
  }
  const handleLogout = async () => {
    try{
      await logout();
      setUser();
      setJobs();
      setIsJobsIn(false);
      setIsloggedIn(false);
      router.replace('/(auth)/login');
    }
    catch(error){
      Alert.alert("Hiba",error.message);
    }
  }
  return (
    <SafeAreaView className='flex-1'>
      <ScrollView className='flex-1'>
        <StatusBar style='light' backgroundColor='#1f2937'/>
        <View className='min-h-[100vh] bg-gray-800'>
          <View className='flex-row mt-6 items-center justify-between'>
            <View className='flex-row'>
              <TouchableOpacity
                onPress={() => router.replace('/profile')}
              >
                <AntDesign name="arrowleft" size={30} color="white" className='ml-5' />
              </TouchableOpacity>
              <Text className='text-3xl font-rbold text-white ml-4'>Beállítások</Text>
            </View>
            <TouchableOpacity
              onPress={handleLogout}
              activeOpacity={0.8}
            >
              <Ionicons name="exit-outline" size={24} color="red" className='mr-4'/>
            </TouchableOpacity>
          </View>
          <View className='w-60 h-60 items-center justify-center self-center'>
          {!update?  <TouchableOpacity 
            onPress={() => openPicker((image) => handleImageUpdate(image))}
            className="rounded-full h-full w-full mt-8 self-center"
          >
            <Image
                source={{uri : user?.profileImg}}
                resizeMode='cover'
                className='h-full w-full mt-1 rounded-full'
            />
          </TouchableOpacity> 
          :
          <ActivityIndicator size="large" color="#ffffff" />}
          </View>
          
          <View className='w-[70%] self-center mt-8'>
              <SettingsField
                title="Név"
                value={form?.name}
                handleChangeText={(e) => setForm({...form, name:e})}
                handleUpdate={handleUpdate}
                editable={true}
              />
              <SettingsField
                containerStyles="mt-5"
                title="Felhasználónév"
                value={form?.username}
                handleChangeText={(e) => setForm({...form, username:e})}
                editable={true}
              />
              <SettingsField
                containerStyles="mt-5"
                title="Email"
                value={form?.email}
                handleChangeText={(e) => setForm({...form, email:e})}
                editable={true}
              />
              <SettingsField
                containerStyles="mt-5"
                title="Leírás"
                value={!updateDesc ? 
                  form?.description.substring(0,(form.description.length > 50 ? 50 : form.description.length))+(form.description.length > 50 && "...")
                  : form?.description}
                handleChangeText={(e) => setForm({...form, description:e})}
                multiline={true}
                editable={false}
                showArrow={true}
                handleArrowPress={() => setUpdateDesc((prev) => !prev)}
              />
          </View>
        </View>
      </ScrollView>
      <Toast config={toastConfig}/>
    </SafeAreaView>
  )
}

export default settings