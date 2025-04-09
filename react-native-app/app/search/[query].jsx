import { View, Text, Modal, TouchableOpacity } from 'react-native'
import React, {useState } from 'react'
import { router, useLocalSearchParams } from 'expo-router'
import { useGlobalContext } from '@/context/GlobalProvider';
import { SafeAreaView } from 'react-native-safe-area-context';
import SearchInput from '@/components/inputFields/SearchInput';
import { Entypo } from '@expo/vector-icons';
import ShowJob from '@/components/views/ShowJob';
import { FlashList } from '@shopify/flash-list';
import RenderJob from '@/components/RenderJob';

/**
 * A keresési találatok képernyője, amely megjeleníti a felhasználó által keresett munkahelyeket.
 * A találatok listáját egy `FlashList` komponens rendereli, amely lehetővé teszi a gyors listázást.
 * 
 * - A `SearchInput` komponens segítségével új keresést indíthatunk.
 * - Minden találat egy-egy `RenderJob` komponenssel kerül megjelenítésre.
 * - A felhasználók rákattinthatnak egy találatra, hogy többet tudjanak meg róla.
 * - A `ShowJob` komponens egy modálban jeleníti meg a részletes információkat.
 * 
 * @returns {JSX.Element} A keresési találatok képernyője.
 */
const query = () => {
  const { queryReturn } = useGlobalContext();
  const [isModalVisible,setIsModalVisible] = useState(false);
  const [readMore,setReadMore] = useState(false);
  const [currentJob,setCurrentJob] = useState(null);
  const query = useLocalSearchParams();

  /**
   * A modál ablak megjelenítését és eltüntetését váltja.
   */
  const toggleModal = () => {
    setIsModalVisible(!isModalVisible);
  }
  /**
   * A `RenderJob` komponens használatával jeleníti meg a találatok listáját.
   * 
   * @param {Object} item - A munkahelyet reprezentáló objektum.
   * @returns {JSX.Element} A találat renderelése.
   */
  const renderItem = ({item}) => (
    <RenderJob
      item={item}
      toggleModal={() => toggleModal}
      handleCurrentJob={(job) => setCurrentJob(job)}
      handleReadMore={(readMore) => setReadMore(readMore)}
    />
  )
  return (
    <SafeAreaView className='h-full items-center justify-center'>
      <View className='w-[90%] flex-1'>
        <FlashList
          data={queryReturn}
          keyExtractor={(item,index) => index.toString()}
          renderItem={renderItem}
          estimatedItemSize={10}
          ListHeaderComponent={() => (
              <View className='mt-6 px-4'>
                <View className='flex-row items-center'>
                  <TouchableOpacity
                    onPress={() => {
                      router.replace('/(tabs)/home');
                    }}
                  >
                    <Entypo name="chevron-thin-left" size={24} color="black" />
                  </TouchableOpacity>
                  <Text className='font-pbold text-primary text-2xl ml-3'>Keresési Találatok</Text>
                </View>

                <View className="mt-6 mb-8">
                  <SearchInput initialQuery={query.query}/>
                </View>
              </View>
          )}
        />
      </View>
      <Modal
          animationType = 'slide'
          transparent = {true}
          visible = {isModalVisible}
          onRequestClose={toggleModal}
      >
        <ShowJob
          currentJob={currentJob}
          readMore={readMore}
          toggleModal={() => toggleModal()}
          title="Jelentkezés"
        />
      </Modal>
    </SafeAreaView>
  )
}

export default query