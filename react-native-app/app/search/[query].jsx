import { View, Text, ScrollView, Modal, FlatList, TouchableOpacity } from 'react-native'
import React, {useState } from 'react'
import { router, useLocalSearchParams } from 'expo-router'
import { useGlobalContext } from '@/context/GlobalProvider';
import { SafeAreaView } from 'react-native-safe-area-context';
import JobDisplay from '@/components/JobDisplay';
import images from '@/constants/images';
import SearchInput from '@/components/SearchInput';
import { Entypo } from '@expo/vector-icons';
import ShowJob from '@/components/ShowJob';

const query = () => {
  const {user,queryReturn} = useGlobalContext();
  const [isModalVisible,setIsModalVisible] = useState(false);
  const [readMore,setReadMore] = useState(false);
  const [currentJob,setCurrentJob] = useState(null);
  const query = useLocalSearchParams();
  const toggleModal = () => {
    setIsModalVisible(!isModalVisible);
  }
  return (
    <SafeAreaView className='h-full items-center'>
      <View className='w-[90%]'>
        <FlatList
          data={queryReturn}
          keyExtractor={(item,index) => index.toString()}
          renderItem={({item}) => (
            <View className=''>
                <TouchableOpacity
                  onPress={() => {
                    let curr = item.description.length;
                    if(curr > 100){
                      setReadMore(true);
                    }
                    setCurrentJob(item);
                    toggleModal();
                  }}
                  activeOpacity={0.5}
                  className=''
              >
                <JobDisplay
                  item={item}
                  image={images.google}
                  imageStyles="w-20 h-20 bg-orange-100"
                  containerStyles="border border-primary mt-6"
                />
              </TouchableOpacity>
            </View>
          )}
          ListHeaderComponent={() => (
            <>
              <View className='flex mt-6 px-4'>
                <View className='flex-row items-center'>
                  <TouchableOpacity
                    onPress={() => {
                      router.push('/(tabs)/home');
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
            </>
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