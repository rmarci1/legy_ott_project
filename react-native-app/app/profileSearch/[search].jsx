import { View, Text, ScrollView, TouchableOpacity, Alert, Modal, ActivityIndicator } from 'react-native'
import React,{ useState,useEffect } from 'react'
import { useLocalSearchParams } from 'expo-router';
import ProfileView from '@/components/ProfileView';
import { getProfileView } from '@/lib/api';
import { AntDesign } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import EmptyView from '@/components/EmptyView';

const profileSearch = () => {
  const [profile,setProfile] = useState(null);
  const [isModalVisible,setIsModalVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const query = useLocalSearchParams();

  const toggleModal = () => {
    setIsModalVisible(!isModalVisible)
  }
  const getProfile = async () => {
    try {
      setIsLoading(true);
      const res = await getProfileView(query.search);
      setProfile(res);
    }
    catch(error){
      Alert.alert(error.message);
    }
    finally{
      setIsLoading(false);
    }
  }
  useEffect(() => {
    getProfile();
  }, [])
  return (
    <View className='h-full relative'>
      <ScrollView className='flex-1' keyboardShouldPersistTaps='handled'>
        {
          profile? <ProfileView
            handleModal={() => toggleModal()}
            viewed_user={profile}
            isView={true}
          /> :
          <View
            className='min-h-full items-center justify-center'
          > 
            {isLoading? <ActivityIndicator size={60}/> :  <EmptyView
              close={true}
              title="Nem találtunk ilyen profilt!"
            />}
          </View>
        }
      </ScrollView>
      <Modal
        animationType='slide'
        transparent= {true}
        visible = {isModalVisible}
        onRequestClose={toggleModal}
      > 
      <ScrollView className='h-full'>
        <View className='items-center justify-center min-h-full'>
          <LinearGradient
            colors={['#451e01', '#d97706', '#cf8d5d']}
            start={{x:0, y:0.5}}
            end={{x:1, y:1}}
            className='w-[95%] h-full'
            style={{
              borderRadius: 30
            }}
          > 
          <View className='w-[90%] self-center'>
            <TouchableOpacity
              onPress={toggleModal}
              className='absolute right-0 top-4 h-7 w-7 bg-[rgb(93,84,122)] opacity-70 rounded-3xl items-center justify-center'
            >
              <AntDesign name="close" size={18} color="white"/>
            </TouchableOpacity>
            <Text className='text-3xl font-pbold text-white mt-8 text-center'>Értékelések</Text>
          </View>
          </LinearGradient>
        </View> 
      </ScrollView>
      </Modal>
    </View>
  )
}

export default profileSearch