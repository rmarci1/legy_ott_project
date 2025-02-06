import { View, Text, TouchableOpacity, TouchableWithoutFeedback, Keyboard, Image, FlatList, Modal, ScrollView, StyleSheet, ImageBackground } from 'react-native'
import React, { useEffect, useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import SearchInput from '@/components/SearchInput'
import { AntDesign, Ionicons } from '@expo/vector-icons'
import images from '@/constants/images'
import {CreateProfilePic, GetProfilePic, getUser} from '@/lib/api'
import { useGlobalContext } from '@/context/GlobalProvider'
import { StatusBar } from 'expo-status-bar'
import { LinearGradient } from 'expo-linear-gradient'
import JobDisplay from '@/components/JobDisplay'
import CustomButton from '@/components/CustomButton'
import { BlurView } from "@react-native-community/blur";
const home = () => {
  const {user,jobs} = useGlobalContext();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [whichButton,setWhichButton] = useState("leírás");
  const [currentJob,setCurrentJob] = useState(null);
  const [readMore,setReadMore] = useState(false);
  const [showMore,setShowMore] = useState(false);
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

  return (
      <TouchableWithoutFeedback
        onPress={() => Keyboard.dismiss()}
      >
    <SafeAreaView className='h-full items-center bg-gray-50'>
      <StatusBar style='dark'/>
      <View className='h-min-[65vh] w-[90%]'>
        <FlatList
          data={jobs}
          keyExtractor={(item,index) => index.toString()}
          renderItem={({item}) => (
            <View>
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
                  name="Gipsz Jakab"
                  title={item.name}
                  date={item.date.split('T')[0]}
                  limit={item.max_attending}
                  image={images.google}
                  imageStyles="w-20 h-20 bg-orange-100"
                  containerStyles="border border-primary mt-6"
                />
              </TouchableOpacity>
            </View>
          )}
          ListHeaderComponent={() => (
            <View>
              <Text className='font-pmedium mt-5'>Szia, <Text className='font-pbold'>{user.name}</Text></Text>
              <Text className='mt-2 text-2xl font-psemibold text-primary'>Találj egy Jó lehetőséget</Text>
            <View className='flex-row items-center mt-4'>
            <SearchInput/>
            <TouchableOpacity
              className='w-14 h-14 bg-primary rounded-xl items-center justify-center ml-4'
              onPress={submit}
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
        <ScrollView className='h-full'>
            <View className='items-center justify-center min-h-[98%]'>
              <LinearGradient
                colors={['#1a1a2e', '#16213e', '#0f3460']}
                start={{x:0, y:0.5}}
                end={{x:1, y:1}}
                className='w-[95%] h-full'
              >
                <View className="rounded-2xl">
                    <View>
                      <View className='mt-3 rounded-3xl px-2 justify-center items-center'>
                        <View className='w-[95%]'>
                          <JobDisplay
                            name="Gipsz Jakab"
                            title={currentJob?.name}
                            date={currentJob?.date.split('T')[0]}
                            limit={currentJob?.max_attending}
                            image={images.google}
                            imageStyles="w-16 h-16 bg-white"
                            nameStyle="text-green-400 text-sm"
                            titleStyle="text-white"
                            dateStyle="text-white"
                          />
                        </View>
                        <View className='w-[90%]'>
                          <View className='h-16 mt-4 rounded-full bg-white opacity-60 items-center justify-center'>
                            <View className='flex-row justify-between items-center w-[95%]'>
                              <TouchableOpacity
                                onPress={() => setWhichButton("leírás")}
                                className={`justify-center items-center w-[33%] h-full rounded-3xl ${whichButton == "leírás" && "bg-white opacity-80"}`}
                              >
                                <Text className='text-white font-pregular'>Leírás</Text>
                              </TouchableOpacity>
                              <TouchableOpacity
                                onPress={() => setWhichButton("áttekintés")}
                                className={`justify-center items-center w-[33%] h-full rounded-3xl ${whichButton == "áttekintés" && "bg-white opacity-80"}`}
                              >
                                <Text className='text-white font-pregular'>Teszt</Text>
                              </TouchableOpacity>
                              <TouchableOpacity
                                onPress={() => setWhichButton("értékelés")}
                                className={`justify-center items-center w-[33%] h-full rounded-3xl ${whichButton == "értékelés" && "bg-white opacity-80"}`}
                              >
                                <Text className='text-white font-pregular'>Értékelés</Text>
                              </TouchableOpacity>
                            </View>
                          </View>
                          <View className='my-8'>
                            <Text className='font-white font-pbold text-white'>Feladat Leírása</Text>
                          </View>
                          <View>
                            <Text className='font-white font-light text-white'>
                              {!showMore? currentJob?.description.substring(0,100)+"..." : currentJob?.description}
                            </Text>      
                            {readMore && (
                              <TouchableOpacity
                                onPress={() => setShowMore(!showMore)}
                                className=' border-white'
                              >
                                <Text className='font-pbold text-orange-400'>{showMore? "Kevesebb" : "Olvass többet"}</Text>
                            </TouchableOpacity>
                            )}                
                          </View>
                        </View>
                      </View>
                      <TouchableOpacity
                        onPress={toggleModal}
                        className='absolute right-4 top-4 h-10 w-10 bg-[#1a1a2e] opacity-95 rounded-3xl items-center justify-center'
                      >
                        <AntDesign name="close" size={20} color="white" className='' />
                      </TouchableOpacity>
                    </View>        
                </View>
                <View className='relative flex-1 justify-end'>
                  <View className='w-full p-5 self-center bg-gray-50'>
                    <CustomButton
                      title="Jelentkezés"
                      textStyles="text-white"
                      containerStyles="bg-primary w-[95%]"
                      />
                  </View>
                </View> 
              </LinearGradient>        
            </View>   
        </ScrollView>
      </Modal>
    </SafeAreaView>
    </TouchableWithoutFeedback>
  )
}
const styles = StyleSheet.create({
  overlay:{
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.5)"
  }
})
export default home