import { View,ScrollView, Modal, TouchableOpacity, Text} from 'react-native'
import React, { useEffect, useState } from 'react'
import { useGlobalContext } from '@/context/GlobalProvider'
import ProfileView from '@/components/views/ProfileView';
import { AntDesign } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { FlashList } from '@shopify/flash-list';
import { getReviews } from '@/lib/api';
import Rating from '@/components/Rating';
import Toast from 'react-native-toast-message';

/**
 * A felhasználó profilja, amely az értékeléseket és más fontos információkat jelenít meg.
 * 
 * @returns {JSX.Element} A profil megjelenítése és az értékelések modál megjelenítése.
 */
const profile = () => {
  const {user,setUser,showToast,toastConfig} = useGlobalContext();
  const [isModalVisible,setIsModalVisible] = useState(false);
  const [ratings, setRatings] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  // Az értékelések lekérése, amikor a komponens betöltődik
  useEffect(() => {
    getRatings();
  }, [])
  /**
    * Az értékelések lekérése a háttérben.
    */
  const getRatings = async () => {
    try{
      setIsLoading(true);
      const res = await getReviews(user.username);
      setRatings(res);
    }
    catch(error){
      showToast("error","Hiba",error.message);
    }
    finally{
      setIsLoading(false);
    }
  }
  /**
   * A listából egy egyedi értékelés renderelése.
   * 
   * @param {Object} item Az egyes értékelés adatai
   * @returns {JSX.Element} A Renderelt értékelés komponens
   */
  const renderItem = ({item}) => (
    <Rating
      handleProfile={(username) => handleProfile(username)}
      item={item}
    />
  )
  /**
   * A modális ablak megjelenítésének és elrejtésének vezérlése.
   */
  const toggleModal = () => {
    setIsModalVisible((prev) => !prev);
  }
  return (
      <View className='h-full relative'>
        <ScrollView className='flex-1' keyboardShouldPersistTaps="handled">
        {/*<StatusBar translucent backgroundColor='transparent'/>*/}
          <ProfileView
            viewed_user={user}
            isView={false}
            handleModal={() => toggleModal()}
          />
        </ScrollView>
        <Modal
          animationType='slide'
          transparent={true}
          visible={isModalVisible}
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
                  <FlashList
                    data={ratings}
                    keyExtractor={(item,index) => index.toString()}
                    renderItem={renderItem}
                    estimatedItemSize={5}
                  />
                </View>
              </LinearGradient>
            </View> 
          </ScrollView>
        </Modal>
        <Toast config={toastConfig}/>
      </View>
  )
}

export default profile