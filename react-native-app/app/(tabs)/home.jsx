import { View, Text, TouchableOpacity, TouchableWithoutFeedback, Keyboard,FlatList, Modal, ScrollView,TextInput } from 'react-native'
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import React, { useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import SearchInput from '@/components/SearchInput'
import { AntDesign, Fontisto, Ionicons } from '@expo/vector-icons'
import images from '@/constants/images'
import { CreateProfilePic, updateSaved } from '@/lib/api'
import { useGlobalContext } from '@/context/GlobalProvider'
import { StatusBar } from 'expo-status-bar'
import { LinearGradient } from 'expo-linear-gradient'
import JobDisplay from '@/components/JobDisplay'
import ShowJob from '@/components/ShowJob'
import { router, usePathname } from 'expo-router';

const home = () => {
  const {user,jobs,setJobs} = useGlobalContext();
  const [preferences, setPreferences] = useState({
    location : "",
  })
  const [query,setQuery] = useState("");
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isFilterModalVisible,setIsFilterModalVisible] = useState(false);
  const [currentJob,setCurrentJob] = useState(null);
  const [readMore,setReadMore] = useState(false);
  const submit = async () => {
    try {
        await CreateProfilePic(user.username);
    }
    catch(error){
      console.log(error);
    }
  }
  const toggleModal = () => {
    setIsModalVisible(!isModalVisible);
  }
  const toggleFilterModal = () => {
    setIsFilterModalVisible(!isFilterModalVisible);
  } 
  const pathname = usePathname();
  const handleProfile = (username) => {
    toggleModal();
    if(pathname.startsWith("/profileSearch")) router.setParams({});
    else router.push(`/profileSearch/${username}`);
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
                className=''
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
      <TouchableWithoutFeedback
        onPress={() => Keyboard.dismiss()}
      >
    <SafeAreaView className='h-full items-center bg-gray-50'>
      <GestureHandlerRootView className='flex-1'>
      <StatusBar style='dark'/>
      <View className='h-min-[65vh] w-[90%]'>
        <FlatList
          data={jobs}
          keyExtractor={(item,index) => index.toString()}
          renderItem={renderItem}
          ListHeaderComponent={() => (
            <View>
              {/*console.log("rendering...\n")*/}
              <Text className='font-pmedium mt-5'>Szia, <Text className='font-pbold'>{user.name}!</Text></Text>
              <Text className='mt-2 text-2xl font-psemibold text-primary'>Találj egy Jó lehetőséget</Text>
            <View className='flex-row items-center mt-4'>
            <SearchInput
              initialQuery={query}
            />
            <TouchableOpacity
              className='w-14 h-14 bg-primary rounded-xl items-center justify-center ml-4'
              onPress={toggleFilterModal}
            >
              <Ionicons name="filter-sharp" size={30} color="white" />
            </TouchableOpacity>
          </View>
          </View>
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
          handleProfileToJobDisplay={(username) => handleProfile(username)}      
          toggleModal={() => toggleModal()}
          title="Jelentkezés"
        />
      </Modal>
      <Modal
        animationType='slide'  
        transparent={true}
        visible={isFilterModalVisible}
        onRequestClose={toggleFilterModal}
      >
        <ScrollView className='h-full'>
          <View className='items-center justify-center min-h-[98%]'>
            <LinearGradient
              colors={['#1a1a2e', '#16213e', '#0f3460']}
              start={{x:0, y:0.5}}
              end={{x:1, y:1}}
              className='w-[95%] h-full'
              style={{
                borderRadius: 30
              }}
            > 
              <Text className='text-white font-psemibold mt-8 text-center text-lg'>Állítsd be a preferenciáidat</Text>
              <View className='bg-[rgb(203,200,213)] h-14 w-[90%] self-center rounded-lg mt-4 flex-row items-center'>
                <Fontisto name="search" size={20} color="rgb(227,224,233)" className='ml-[5%]'/>
                <TextInput
                  placeholder='helyszín'
                  placeholderTextColor='#626262'
                  value={preferences.location}
                  onChangeText={(e) => setPreferences({...preferences, location:e})}
                  className='text-[rgb(227,224,233)] flex-1'
                />
              </View>
              <TouchableOpacity
                  onPress={toggleFilterModal}
                  className='absolute right-4 top-4 h-7 w-7 bg-[rgb(93,84,122)] opacity-70 rounded-3xl items-center justify-center'
              >
                <AntDesign name="close" size={18} color="white"/>
              </TouchableOpacity>
            </LinearGradient>
          </View>
        </ScrollView>
      </Modal>
    </GestureHandlerRootView>
    </SafeAreaView>
    </TouchableWithoutFeedback>
  )
}
export default home