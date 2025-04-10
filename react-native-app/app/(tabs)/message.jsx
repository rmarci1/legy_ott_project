import { Image, RefreshControl, Text, TouchableOpacity, View } from 'react-native';
import React, { useEffect, useState } from 'react';
import { useGlobalContext } from '@/context/GlobalProvider';
import Toast from 'react-native-toast-message';
import { SafeAreaView } from 'react-native-safe-area-context';
import { FlashList } from '@shopify/flash-list';
import { getDifferentProfiles } from '@/lib/api';
import { router } from 'expo-router';
import { AntDesign } from '@expo/vector-icons';

/**
 * A képernyő, amely megjeleníti az utóbbi üzeneteket tartalmazó profilokat, és lehetővé teszi az üzenetek megtekintését.
 * 
 * @returns {JSX.Element} A profilok listáját és üzenetnézegetőt tartalmazó képernyő.
 */
const message = () => {
  const { toastConfig, showToast, user, setProfileForMessage,formatDate } = useGlobalContext();

  const [differentProfiles,setDifferentProfiles] = useState(null);
  const [isDifferentProfilesLoading,setIsDifferentProfilesLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // Effektus, ami betölti a különböző profilokat, amikor a komponens betöltődik
  useEffect(() => {
    /**
     * Az egyedi profilok lekérése az API-ból.
     */
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

  // Frissítés kezelése
  const onRefresh = () => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 1000);
  };
  /**
   * A profilra kattintva beállítja a profil üzenet megjelenítésére.
   * 
   * @param profile Az aktuális profil adatai
   */
  const handlePress = (profile) => {
    setProfileForMessage(profile);
    router.push("/additions/messageView");
  }
  /**
   * A profilok renderelése a FlashList segítségével.
   * 
   * @param {Object} item A listából származó egyedi profil elem
   * @returns {JSX.Element} A profil megjelenítésére szolgáló komponens
   */
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
      <FlashList
        data={differentProfiles}
        keyExtractor={(item,index) => index.toString()}
        renderItem={renderProfiles}
        estimatedItemSize={50}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      />
      <TouchableOpacity 
        className='absolute bottom-6 right-6'
        onPress={() => router.push('/additions/showProfiles')}
      >
         <View className='h-[68px] w-[68px] rounded-full bg-[#2F80ED] items-center justify-center'>
            <AntDesign name="message1" size={30} color="white" />
         </View>
      </TouchableOpacity>
      <Toast config={toastConfig} />
    </SafeAreaView>
  );
};

export default message;
