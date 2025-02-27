import { View, Text, TouchableOpacity, Alert, FlatList } from 'react-native'
import React, { useEffect, useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useGlobalContext } from '@/context/GlobalProvider'
import { Entypo, FontAwesome, Fontisto } from '@expo/vector-icons'
import { getApplied, getHistorys } from '@/lib/api'
import JobDisplay from '@/components/JobDisplay'
import images from '@/constants/images'
import { FlashList } from '@shopify/flash-list'

const list = () => {
  const {user,jobs,setJobs,saved,setSaved} = useGlobalContext();
  const [filterJobs,setFilterJobs] = useState(saved);
  const [currentJob,setCurrentJob] = useState(null);
  const [readMore,setReadMore] = useState(false);
  const [currentPage,setCurrentPage] = useState("saved");
  const [isModalVisible, setIsModalVisible] = useState(false);
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
      return saved;
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
      console.log("res: ",response)
      setCurrentPage(title);
      setFilterJobs(response);
    }
    catch(error){
      Alert.alert("Hiba",error.message);
    }
  }
  const toggleModal = () => {
    setIsModalVisible(!isModalVisible);
  }
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
          <View>
            
          </View>
        )}
      />
      </View>
    </SafeAreaView>
  )
}
export default list