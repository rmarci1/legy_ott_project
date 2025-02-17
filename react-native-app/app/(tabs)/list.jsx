import { View, Text, StyleSheet, Image, TouchableOpacity, Alert, FlatList } from 'react-native'
import React, { useEffect, useState } from 'react'
import { SafeAreaView, useSafeAreaFrame } from 'react-native-safe-area-context'
import { useGlobalContext } from '@/context/GlobalProvider'
import { AntDesign, Entypo, FontAwesome } from '@expo/vector-icons'
import { getHistorys, getSaved, updateSaved } from '@/lib/api'
import JobDisplay from '@/components/JobDisplay'
import images from '@/constants/images'
const list = () => {
  const {user,jobs,setJobs,saved,setSaved} = useGlobalContext();
  const [filterJobs,setFilterJobs] = useState(null);
  const [currentJob,setCurrentJob] = useState(null);
  const [readMore,setReadMore] = useState(false);
  const [currentPage,setCurrentPage] = useState("saved");
  const [isModalVisible, setIsModalVisible] = useState(false);
  
  useEffect(() => {
    handleClick("saved");
  },[])

  const handleClick = async (title) => {
    try{
      const response = title === "saved" ? saved : await getHistorys(user.username);
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
      <View className='min-h-full'>
      <FlatList
        data={filterJobs}
        keyExtractor={(item,index) => index.toString()}
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
              className='w-[45%] flex-row justify-center items-center'
            >
              <Text className={`text-xl font-psemibold text-primary ${currentPage === "history" && "underline"}`}>Előzmények</Text>
              <FontAwesome name="history" size={24} color="#1F41BB" />
            </TouchableOpacity>
            <Text className='w-[10%] text-center text-xl'>|</Text>
            <TouchableOpacity
              onPress={() => handleClick("saved")}
              className='w-[45%] justify-center items-center flex-row'
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