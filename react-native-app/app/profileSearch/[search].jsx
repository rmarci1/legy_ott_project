import { View, Text, ScrollView } from 'react-native'
import React from 'react'
import { useLocalSearchParams } from 'expo-router';
import ProfileView from '@/components/ProfileView';
import { getProfileView } from '@/lib/api';

const profileSearch = () => {
  const query = useLocalSearchParams();
  console.log(query);
  const getProfile = async () => {
    return await getProfileView(query.search);
  }
  return (
    <View className='h-full relative'>
      <ScrollView className='flex-1' keyboardShouldPersistTaps='handled'>
        <ProfileView
          user={getProfile()}
          isView={true}
        />
      </ScrollView>
    </View>
  )
}

export default profileSearch