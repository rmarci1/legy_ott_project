import { View, Text, ScrollView, TouchableOpacity, Modal } from 'react-native'
import React, { useEffect, useState } from 'react'
import { router, useLocalSearchParams, usePathname } from 'expo-router'
import { SafeAreaView } from 'react-native-safe-area-context';
import { useGlobalContext } from '@/context/GlobalProvider';
import { FlashList } from '@shopify/flash-list';
import JobDisplay from '@/components/JobDisplay';
import images from '@/constants/images';
import { Entypo, Ionicons } from '@expo/vector-icons';
import ShowJob from '@/components/ShowJob';
import CustomButton from '@/components/CustomButton';
import EmptyView from '@/components/EmptyView';

const pref = () => {
  const {jobs} = useGlobalContext();
  const [filterJobs, setFilterJobs] = useState(null);
  const [currentJob,setCurrentJob] = useState(null);
  const [readMore,setReadMore] = useState(false);
  const [isFilterModalVisible,setIsFilterModalVisible] = useState(false);
  const [isModalVisible,setIsModalVisible] = useState(false);
  const query = useLocalSearchParams();
  const [queryState,setQueryState] = useState(null);
  console.log(query);
  useEffect(() => {
    let parsedData = query ? JSON.parse(query.data) : null;
    setQueryState(parsedData);
    filteringJobs(parsedData);
  }, [])
  const pathname = usePathname();
  const handleProfile = (username) => {
    toggleModal();
    if(pathname.startsWith("/profileSearch")) router.setParams({username});
    else router.push(`/profileSearch/${username}`);
  }
  const filteringJobs = (query) => {
    console.log(query?.datebetween.end);
    const date = query?.date? new Date(query.date) : null;
    setFilterJobs(jobs.filter((curr) =>{
      const matchesDate = date ? curr.date.split('T')[0] === date.toISOString().split('T')[0] : true;
      const matchesLocation = query?.location ? query.location === curr.address : true;
      const matchesLocationBetween = query?.datebetween ? (query.datebetween.start <= curr.date) && (query.datebetween.end >= curr.date) : true
      return matchesDate && matchesLocation && matchesLocationBetween
    }
    ));
  }
  const toggleModal = () => {
    setIsModalVisible(!isModalVisible);
  }
  const toggleFilterModal = () => {
    setIsFilterModalVisible(!isFilterModalVisible);
  }
  const renderItem = ({item}) => (
    <View key={item}>
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
        > 
            <JobDisplay
               key={item}
               item={item}
               image={images.google}
               imageStyles="w-20 h-20 bg-orange-100"
               containerStyles="border border-primary mt-6"
            />
        </TouchableOpacity>
    </View>
  )
  return (
    <SafeAreaView className='h-full relative'>
      <ScrollView className='flex-1'>
        <View className='w-[90%] min-h-[100vh] self-center'>
        <FlashList
          data={filterJobs}
          keyExtractor={(item,index) => index.toString()}
          renderItem={renderItem}
          estimatedItemSize={50}
          ListHeaderComponent={() => (
            <View className='flex mt-6 px-4'>
              <View className='flex-row items-center justify-between'>
                <TouchableOpacity
                  onPress={() => {
                    router.replace('/(tabs)/home');
                  }}
                >
                  <Entypo name="chevron-thin-left" size={24} color="black" />
                </TouchableOpacity>
                <Text className='font-pbold text-primary text-2xl ml-3'>Keresési Találatok</Text>
                <TouchableOpacity
                  className='w-14 h-14 bg-primary rounded-xl items-center justify-center'
                  onPress={toggleFilterModal}
                >
                <Ionicons name="filter-sharp" size={30} color="white" />
              </TouchableOpacity>
             </View>
             <View className='w-full p-4 bg-slate-500 rounded-xl mt-4'>
              {queryState?.location && <Text className='font-plight text-lg text-white'> Helyszín: <Text className='text-blue-400 font-pbold'>{queryState?.location}</Text></Text>}
              {queryState?.date && <Text className='font-plight text-lg text-white mt-3'> Nap: <Text className='text-blue-400 font-pbold'>{new Date(queryState?.date).toISOString().split('T')[0]}</Text></Text>}
              {queryState?.datebetween?.start && <Text className='font-plight text-lg text-white mt-3'> Nap: <Text className='text-blue-400 font-pbold'>
                {new Date(queryState?.datebetween.start).toISOString().split('T')[0]} - {new Date(queryState?.datebetween.end).toISOString().split('T')[0]}</Text></Text>}
             </View>
            </View>
        )}
        ListEmptyComponent={() => (
            <EmptyView
              title="Sajnos nem találtunk ilyen lehetőséget"
            />
        )}
        />
        </View>
        <Modal
        animationType='slide'  
        transparent={true}
        visible={isModalVisible}
        onRequestClose={toggleModal}
      >
        <ShowJob
          currentJob={currentJob}
          readMore={readMore}
          handleProfile={(username) => handleProfile(username)}      
          toggleModal={() => toggleModal()}
          title="Jelentkezés"
        />
        <View className='w-full p-5 self-center bg-gray-50 relative flex-1'>
          <CustomButton
            title="Jelentkezés"
            handlePress={() => {}}
            textStyles="text-white"
            containerStyles="bg-primary w-[95%]"
          />
        </View>
      </Modal>
      </ScrollView>
    </SafeAreaView>
  )
}

export default pref