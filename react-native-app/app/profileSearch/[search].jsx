import { View, Text, ScrollView, TouchableOpacity, Alert, Modal, ActivityIndicator } from 'react-native'
import React,{ useState,useEffect } from 'react'
import { useLocalSearchParams } from 'expo-router';
import ProfileView from '@/components/views/ProfileView';
import { getProfileView } from '@/lib/api';
import { AntDesign } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import EmptyView from '@/components/views/EmptyView';
import { useGlobalContext } from '@/context/GlobalProvider';
import Toast from 'react-native-toast-message';

/**
 * A keresett profil megjelenítése és értékelések kezelése.
 * A komponens lekéri a keresett felhasználói profilt, és ha nem található, egy üzenetet jelenít meg.
 * 
 * - A profil adatokat egy `ProfileView` komponens jeleníti meg.
 * - Ha a profil nem található, akkor az `EmptyView` jelenik meg.
 * - A felhasználók értékelhetik a profilt egy modál ablakban.
 * 
 * @returns {JSX.Element} A profil keresési és megjelenítési képernyője.
 */
const profileSearch = () => {
  const {showToast,toastConfig} = useGlobalContext();
  const [profile,setProfile] = useState(null);
  const [isModalVisible,setIsModalVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const query = useLocalSearchParams();

   /**
   * A modál ablak megjelenítését és eltüntetését váltja.
   */
  const toggleModal = () => {
    setIsModalVisible(!isModalVisible)
  }
   /**
   * A keresett profil adatainak lekérése az API-ból.
   * Ha hiba történik, akkor egy hibát jelenít meg.
   */
  useEffect(() => {
    getProfile();
  }, []);
  const getProfile = async () => {
    try {
      setIsLoading(true);
      const res = await getProfileView(query.search);
      setProfile(res);
    }
    catch(error){
      showToast("error","Hiba",error.message);
    }
    finally{
      setIsLoading(false);
    }
  }
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
      <Toast config={toastConfig}/>
    </View>
  )
}

export default profileSearch