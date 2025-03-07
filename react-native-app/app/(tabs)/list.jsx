import { View, TouchableOpacity, Alert, Modal, RefreshControl, Text } from 'react-native'
import React, { useEffect, useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useGlobalContext } from '@/context/GlobalProvider'
import { Entypo, FontAwesome, Fontisto, MaterialIcons } from '@expo/vector-icons'
import { getApplied, getCreated, getHistorys, getSaved } from '@/lib/api'
import { FlashList } from '@shopify/flash-list'
import EmptyState from '@/components/EmptyState'
import CustomButton from '@/components/CustomButton'
import ShowJob from '@/components/views/ShowJob'
import RenderJob from '@/components/RenderJob'
import { router } from 'expo-router'

const list = () => {
  const {handleSubmit,handleProfile,user,setQuery} = useGlobalContext();
  const [filterJobs,setFilterJobs] = useState([]);
  const [currentJob,setCurrentJob] = useState(null);
  const [readMore,setReadMore] = useState(false);
  const [currentPage,setCurrentPage] = useState("saved");
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [refreshing,setRefreshing] = useState(false);
  if(!user){
    router.replace('/home');
  }
  useEffect(() => {
    handleClick(currentPage);
  },[])
  const pageStatus = async (title) => {
    if(title === "saved"){
      return await getSaved();
    }
    else if(title === "history"){
      return await getHistorys();
    }
    else if(title === "created"){
      return getCreated();
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
  const onRefresh = async () => {
    setRefreshing(true);
    await handleClick(currentPage);
    setRefreshing(false);
  }
  const TabIcon = ({handlePress, icon}) => (
    <TouchableOpacity
      onPress={handlePress}
      className='justify-center items-center flex-row'
    >
      {icon}
    </TouchableOpacity>
  )
  return (
    <SafeAreaView>
      <View className="min-h-full w-[90%] self-center">
      <FlashList
        data={filterJobs}
        keyExtractor={(item,index) => index.toString()}
        estimatedItemSize={40}
        renderItem={({item}) => 
          <RenderJob
            item={item}
            toggleModal={() => toggleModal()}
            handleCurrentJob={(job) => setCurrentJob(job)}
            handleReadMore={(readMore) => setReadMore(readMore)}
            created={currentPage === "created"}
          />
        }
        ListHeaderComponent={() => (
          <View>
            <View className='flex-row justify-between mt-5 rounded-3xl bg-slate-100 w-[85%] h-16 self-center px-6'>
              <TabIcon
                handlePress={() => handleClick("history")}
                icon={<FontAwesome name="history" size={30} color={currentPage === "history" ? "aqua" : "gray"}/>}
              />
              <TabIcon
                handlePress={() => handleClick("created")}
                icon={<MaterialIcons name="published-with-changes" size={30} color={currentPage === "created" ? "aqua" : "gray"} />}
              />
              <TabIcon
                handlePress={() => handleClick("current")}
                icon={<Fontisto name="radio-btn-active" size={26} color={currentPage === "current" ? "aqua" : "gray"} />}
              />
              <TabIcon
                handlePress={() => handleClick("saved")}
                icon={<Entypo name="save" size={30} color={currentPage === "saved" ? "aqua" : "gray"} />}
              />
            </View>
            <View className='mt-5'>
              <Text className='text-center text-3xl text-indigo-950'>{currentPage === "saved" ? "Elmentett hírdetések" : currentPage === "current" ? 
              "Jelentkezett hírdetések" : currentPage === "history" ? "Előzmények" : "Készített hírdetések"}
              </Text>
            </View>
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
          created={currentPage === "created"}
          create={false}
        />
        {
          (currentPage !== "history" && currentPage !== "created") && <View className='w-full p-5 self-center bg-gray-50 relative flex-1'>
            <CustomButton
              title={currentJob?.profiles && currentJob?.profiles[0].isApplied ? "Lemondás" : "Jelentkezés"}
              handlePress={async () => {
                toggleModal();
                await handleSubmit(!currentJob?.profiles[0].isApplied, currentJob?.id);
                handleClick(currentPage);
              }}
              textStyles="text-white"
              containerStyles={`${currentJob?.profiles && currentJob?.profiles[0].isApplied ? "bg-red-500" : "bg-primary"} w-[95%]`}
            />
          </View>
        }
        {currentPage === "created" && <View className='w-full p-5 self-center bg-gray-50 relative flex-1'>
            <CustomButton
              title="Szerkesztés"
              handlePress={() => {
                toggleModal();
                setQuery(currentJob);
                router.replace("/create");
              }}
              textStyles="text-white"
              containerStyles={`bg-teal-400 w-[95%]`}
            />
          </View>}
      </Modal>
      </View>
    </SafeAreaView>
  )
}
export default list