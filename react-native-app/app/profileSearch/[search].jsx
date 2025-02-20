import { View, Text, ScrollView, SafeAreaView, Image, TouchableOpacity, Alert, Modal } from 'react-native'
import React,{ useState,useEffect } from 'react'
import { router, useLocalSearchParams } from 'expo-router';
import ProfileView from '@/components/ProfileView';
import { getProfileView } from '@/lib/api';
import images from '@/constants/images';
import { AntDesign, Entypo } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

const profileSearch = () => {
  const [profile,setProfile] = useState(null);
  const [isModalVisible,setIsModalVisible] = useState(false);
  const query = useLocalSearchParams();

  const toggleModal = () => {
    setIsModalVisible(!isModalVisible)
  }
  const getProfile = async () => {
    try {
      const res = await getProfileView(query.search);
      setProfile(res);
    }
    catch(error){
      Alert.alert(error.message);
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
            user={profile}
            isView={true}
          /> :
          <View className='min-h-full items-center justify-center '>
            <View className='absolute top-[5%] left-5'>
              <TouchableOpacity
                  onPress={() => {
                      router.push('/(tabs)/home');
                    }}
                  >
                <Entypo name="chevron-thin-left" size={30} color="black" />
              </TouchableOpacity>
            </View>
            <Text className='font-rbold text-3xl text-center text-primary'>Nem találtunk ilyen profilt!</Text>
            <Image
              resizeMode='contain'
              source={images.search}
              className='w-[75%] h-[30%]'
            />
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
            colors={['#1a1a2e', '#d97706', '#78350f']}
            start={{x:0, y:0.5}}
            end={{x:1, y:1}}
            className='w-[95%] h-full'
            style={{
              borderRadius: 30
            }}
          > 
            <TouchableOpacity
              onPress={toggleModal}
              className='absolute right-4 top-4 h-7 w-7 bg-[rgb(93,84,122)] opacity-70 rounded-3xl items-center justify-center'
            >
              <AntDesign name="close" size={18} color="white"/>
            </TouchableOpacity>
          </LinearGradient>
        </View> 
      </ScrollView>
      </Modal>
    </View>
  )
}

export default profileSearch