import { View, Text, ScrollView } from 'react-native'
import React,{ useState,useEffect } from 'react'
import { useLocalSearchParams } from 'expo-router';
import ProfileView from '@/components/ProfileView';
import { getProfileView } from '@/lib/api';

const profileSearch = () => {
  const [profile,setProfile] = useState(null);
  const query = useLocalSearchParams();
  const getProfile = async () => {
    const res = await getProfileView(query.search);
    setProfile(res);
  }
  useEffect(() => {
    getProfile();
  }, [])
  return (
    <View className='h-full relative'>
      <ScrollView className='flex-1' keyboardShouldPersistTaps='handled'>
        {
          profile? <ProfileView
            user={profile}
            isView={true}
          /> :
          <View>
            <Text className='text-3xl'>Not Found</Text>
          </View>
        }
      </ScrollView>
    </View>
  )
}

export default profileSearch