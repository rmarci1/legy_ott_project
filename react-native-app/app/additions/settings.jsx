import { View, Text, ScrollView, Image, TouchableOpacity, TextInput, ActivityIndicator } from 'react-native'
import React, { useState } from 'react'
import { useGlobalContext } from '@/context/GlobalProvider'
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { router } from 'expo-router';
import { AntDesign, Ionicons } from '@expo/vector-icons';
import { AwardIcon, Pencil } from 'lucide-react-native';
import SettingsField from '@/components/inputFields/SettingsField';
import { UpdateProfilePic } from '@/lib/api';

const settings = () => {
  const {user,setUser,openPicker} = useGlobalContext();
  const [form,setForm] = useState(user);
  const [update, setUpdate] = useState(false);
  
  const handleUpdate = async (image) => {
    setUpdate(true);
    await UpdateProfilePic(image);
    setUser({...user, profileImg : image});
    setUpdate(false);
  }
  return (
    <SafeAreaView className='flex-1'>
      <ScrollView className='flex-1'>
        <StatusBar style='light' backgroundColor='#1f2937'/>
        <View className='min-h-[100vh] bg-gray-800'>
          <View className='flex-row mt-6 items-center'>
            <TouchableOpacity
              onPress={() => {
                router.replace('/(tabs)/profile');
              }}
            >
              <AntDesign name="arrowleft" size={30} color="white" className='ml-5' />
            </TouchableOpacity>
            <Text className='text-3xl font-rbold text-white ml-4'>Beállítások</Text>
          </View>
          <View className='w-60 h-60 items-center justify-center self-center'>
          {!update?  <TouchableOpacity 
            onPress={() => openPicker((image) => handleUpdate(image))}
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
              />
              <SettingsField
                containerStyles="mt-5"
                title="Felhasználónév"
                value={form?.username}
                handleChangeText={(e) => setForm({...form, username:e})}
              />
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}

export default settings