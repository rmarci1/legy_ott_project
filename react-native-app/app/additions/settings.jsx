import { View, Text, ScrollView, Image, TouchableOpacity, ActivityIndicator, TouchableWithoutFeedback, Keyboard } from 'react-native'
import React, { useEffect, useState } from 'react'
import { useGlobalContext } from '@/context/GlobalProvider'
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { router } from 'expo-router';
import { AntDesign, Ionicons } from '@expo/vector-icons';
import SettingsField from '@/components/inputFields/SettingsField';
import { logout, updateProfile, UpdateProfilePic } from '@/lib/api';
import Toast from 'react-native-toast-message';
import ConvertType from '@/components/ConvertType';

const settings = () => {
  const {user,setUser,openPicker,setJobs,setIsJobsIn,setIsloggedIn,showToast,toastConfig} = useGlobalContext();
  const [form,setForm] = useState(user);
  const [update, setUpdate] = useState(false);
  const [updateDesc, setUpdateDesc] = useState(user?.description ? false : true);
  const [selection, setSelection] = useState({
      start: 0,
      end : 0
  });
  const [stashed, setStashed] = useState("");
  const [undoStates,setUndoStates] = useState([]);
  const [typingTimeout,setTypingTimeout] = useState(null);
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
      setUser((prev) => res);
      console.log("Változtatva");
      showToast("success","Sikeres szerkesztés");
    }
    catch(error){
      showToast("error","Hiba",error.message);
    }
  }
  const handleLogout = async () => {
    try{
      await logout();
      setUser(null);
      setJobs(null);
      setIsJobsIn(false);
      setIsloggedIn(false);
      router.replace('/(auth)/login');
    }
    catch(error){
      showToast("error","Hiba",error.message);
    }
  }
  return (
      <TouchableWithoutFeedback
          onPress={() => Keyboard.dismiss()}
      >
      <SafeAreaView className='flex-1'>
        <ScrollView className='flex-1' keyboardShouldPersistTaps="handled">
          <StatusBar style='light' backgroundColor='#1f2937'/>
          <View className='min-h-[100vh] w-full bg-gray-800'>
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
            
            <View className='items-center mt-8'>
                <SettingsField
                  title="Név"
                  value={form?.name}
                  handleChangeText={(e) => setForm({...form, name:e})}
                  handleUpdate={handleUpdate}
                  handleSelection={() => {}}
                  editable={true}
                  containerStyles="w-[70%]"
                />
                <SettingsField
                  containerStyles="mt-5 w-[70%]"
                  title="Felhasználónév"
                  value={form?.username}
                  handleUpdate={handleUpdate}
                  handleChangeText={(e) => setForm({...form, username:e})}
                  handleSelection={() => {}}
                  editable={true}
                />
                <SettingsField
                  containerStyles="mt-5 w-[70%]"
                  title="Email"
                  value={form?.email}
                  handleUpdate={handleUpdate}
                  handleSelection={() => {}}
                  handleChangeText={(e) => setForm({...form, email:e})}
                  editable={true}
                />
                <Text className='text-xl font-extrabold text-white mt-5 w-[70%]'>Leírás</Text>
                {updateDesc &&
                  <View className='w-[90%]'>
                    <View className='border-b border-gray-300 mt-4'/>
                    <ConvertType
                      selection={selection}
                      description={form?.description}
                      handleForm={(e) => setForm({...form, description : e})}
                      undoStates={undoStates}
                      handleSelection={(e) => setSelection(e)}
                      handleUndoStates={(e) => setSelection(e)}
                      stashed={stashed}
                      handleStash={(e) => setStashed(e)}
                      iconColor="white"
                    />
                    <View className='border-b border-gray-300 mt-4'/>
                  </View>
                } 
                <SettingsField
                  containerStyles="mb-6 w-[70%]"
                  value={!updateDesc ? 
                    form?.description?.substring(0,(form?.description?.length > 50 ? 50 : form?.description?.length))+(form?.description?.length > 50 && "...")
                    : form?.description}
                  handleChangeText={(e) => {
                    setForm({...form, description:e});
                    if(typingTimeout){
                      clearTimeout(typingTimeout);
                    }
                    const newTimeout = setTimeout(() => {
                      let temp = undoStates;
                      if(stashed) temp.push(stashed);
                      setStashed(e);
                      setUndoStates(temp);
                    }, 1000);
                    setTypingTimeout(newTimeout);
                  }}
                  handleSelection={(e) => setSelection(e)}
                  handleUpdate={handleUpdate}
                  multiline={true}
                  editable={updateDesc}
                  showArrow={true}
                  handleArrowPress={() => setUpdateDesc((prev) => !prev)}
                />
            </View>
          </View>
        </ScrollView>
        <Toast config={toastConfig}/>
      </SafeAreaView>
    </TouchableWithoutFeedback>
  )
}

export default settings