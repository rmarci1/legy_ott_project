import { Image, RefreshControl, Text, TextInput, TouchableOpacity, View } from 'react-native';
import React, { useEffect, useState } from 'react';
import { useGlobalContext } from '@/context/GlobalProvider';
import Toast from 'react-native-toast-message';
import { io } from 'socket.io-client';
import { SafeAreaView } from 'react-native-safe-area-context';
import { FlashList } from '@shopify/flash-list';
import CustomButton from '@/components/CustomButton';
import { createMessage, getDifferentProfiles, getMessages } from '@/lib/api';
import { router } from 'expo-router';

const AnotherOne = () => {
  const { toastConfig, showToast, user, setProfileForMessage,formatDate } = useGlobalContext();

  const [differentProfiles,setDifferentProfiles] = useState(null);
  const [isDifferentProfilesLoading,setIsDifferentProfilesLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [showMessages,setShowMessages] = useState(false);

  useEffect(() => {
    const fetchDifferentProfiles = async () => {
      setIsDifferentProfilesLoading(true);
      getDifferentProfiles(user.id)
      .then((res) => {
        if(res){
          setDifferentProfiles(res)
        }
      })
      .catch((error) => {
        showToast("error","Hiba",error.message);
      })
      .finally(() => {
        setIsDifferentProfilesLoading(false);
      })
    }
    fetchDifferentProfiles();
  }, [])
  const onRefresh = () => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 1000);
  };
  const handlePress = (profile) => {
    setProfileForMessage(profile);
    router.push("/additions/messageView");
  }
  const renderProfiles = ({ item }) => (
    <TouchableOpacity 
      className="p-3 border-b border-gray-300 flex-row"
      onPress={() => handlePress(item)}
    >
      <Image
        source={{ uri: item?.profileImg }}
        resizeMode="cover"
        className="w-16 h-16 mt-1 rounded-full"
      />
      <View className="ml-4 mt-1 flex-1">
        <View className="flex-row justify-between items-center">
          <Text className="text-xl color-[#1b1a57]">{item?.name.length > 25 ? item?.name.substring(0,25)+"..." : item?.name}</Text>
          <Text className="ml-auto">{formatDate(item?.lastMessageDate)}</Text>
        </View>
        <Text className="color-gray-500">{item?.lastMessage.length > 30 ? item?.lastMessage.substring(0,30)+"..." : item?.lastMessage}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView className="flex-1 p-4">
      <Text className='text-2xl font-rb color-slate-700'>Utóbbi üzeneteid</Text>
      {showMessages}
      <FlashList
        data={differentProfiles}
        keyExtractor={(item,index) => index.toString()}
        renderItem={renderProfiles}
        estimatedItemSize={50}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      />
      <Toast config={toastConfig} />
    </SafeAreaView>
  );
};

export default AnotherOne;
