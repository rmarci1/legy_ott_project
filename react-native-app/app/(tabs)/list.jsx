import { View, Text, TouchableOpacity, Alert, Modal, RefreshControl } from 'react-native'
import React, { useEffect, useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useGlobalContext } from '@/context/GlobalProvider'
import { Entypo, FontAwesome, Fontisto } from '@expo/vector-icons'
import { getApplied, getHistorys, getSaved } from '@/lib/api'
import JobDisplay from '@/components/JobDisplay'
import images from '@/constants/images'
import { FlashList } from '@shopify/flash-list'
import EmptyState from '@/components/EmptyState'
import CustomButton from '@/components/CustomButton'
import ShowJob from '@/components/ShowJob'
import { router } from 'expo-router'

const list = () => {
  const {saved,handleSubmit} = useGlobalContext();
  const [filterJobs,setFilterJobs] = useState([]);
  const [currentJob,setCurrentJob] = useState(null);
  const [readMore,setReadMore] = useState(false);
  const [currentPage,setCurrentPage] = useState("saved");
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [refreshing,setRefreshing] = useState(false);
  useEffect(() => {
    handleClick(currentPage);
  },[])
  useEffect(() => {
    if(currentPage==="saved"){
      setFilterJobs(saved);
    }
  }, [saved])
  const pageStatus = async (title) => {
    if(title === "saved"){
      return await getSaved();
    }
    else if(title === "history"){
      return await getHistorys();
    }
    else {
      return await getApplied();
    }
  }
  const handleClick = async (title) => {
    try{
      const response = await pageStatus(title);
      setCurrentPage(title);
      setFilterJobs(response);
    }
    catch(error){
      Alert.alert("Hiba",error.message);
    }
  }
  const toggleModal = () => {
    setIsModalVisible((prev) => !prev);
  }
  const handleProfile = (username) => {
      toggleModal();
      router.push(`/profileSearch/${username}`);
  }
  const onRefresh = async () => {
    setRefreshing(true);
    await handleClick(currentPage);
    setRefreshing(false);
  }
  const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));
  return (
    <SafeAreaView className=''>
      <View className={`min-h-full`}>
      <FlashList
        data={filterJobs}
        keyExtractor={(item,index) => index.toString()}
        estimatedItemSize={40}
        renderItem={({item}) => (
          <View className='w-[90%] self-center'>
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
                  handleSave={async (isLiked) => {
                    if(!isLiked){
                      await sleep(600);
                    }
                    handleClick(currentPage);
                  }}
                />
              </TouchableOpacity>
          </View>
        )}
        ListHeaderComponent={() => (
          <View className='flex-row justify-between mt-5'>
            <TouchableOpacity
              onPress={() => handleClick("history")}
              className='w-[30%] flex-row justify-center items-center'
            >
              <Text className={`text-xl font-psemibold text-primary ${currentPage === "history" && "underline"}`}>Előzmény</Text>
              <FontAwesome name="history" size={24} color="#1F41BB" />
            </TouchableOpacity>
            <Text className='text-center text-xl'>|</Text>
            <TouchableOpacity
              onPress={() => handleClick("current")}
              className='w-[30%] justify-center items-center flex-row'
            >
              <Text className={`text-xl color-green-400 font-psemibold ${currentPage === "current" && "underline"}`}>Jelenleg</Text>
              <Fontisto name="radio-btn-active" size={24} color="#4ade80" />
            </TouchableOpacity>
            <Text className='text-center text-xl'>|</Text>
            <TouchableOpacity
              onPress={() => handleClick("saved")}
              className='w-[30%] justify-center items-center flex-row'
            >
              <Text className={`text-xl color-red-400 font-psemibold ${currentPage === "saved" && "underline"}`}>Elmentett</Text>
              <Entypo name="save" size={24} color="#f87171" />
            </TouchableOpacity>
          </View>
        )}
        ListEmptyComponent={() => (
          <EmptyState
            title="Nem találtunk lehetőségeket"
          />
        )}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh}/>
        }
      />
      <Modal
        animationType='slide'
        transparent={true}
        visible={isModalVisible}
        onRequestClose={toggleModal}
      >
        <ShowJob
          currentJob={currentJob}
          readMore={readMore}
          handleProfile={(username) => handleProfile(username, () => toggleModal)}      
          toggleModal={() => toggleModal()}      
        />
        {
          currentPage !== "history" && <View className='w-full p-5 self-center bg-gray-50 relative flex-1'>
            <CustomButton
              title={currentJob?.profiles[0].isApplied ? "Lemondás" : "Jelentkezés"}
              handlePress={async () => {
                setIsModalVisible(false);
                await handleSubmit(!currentJob?.profiles[0].isApplied, currentJob?.id);
                handleClick(currentPage);
              }}
              textStyles="text-white"
              containerStyles={`${currentJob?.profiles[0].isApplied ? "bg-red-500" : "bg-primary"} w-[95%]`}
            />
          </View>
        }
      </Modal>
      </View>
    </SafeAreaView>
  )
}
export default list