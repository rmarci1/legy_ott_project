import { View, Text, TouchableOpacity, TouchableWithoutFeedback, Keyboard, Image, FlatList, Modal } from 'react-native'
import React, { useEffect, useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import SearchInput from '@/components/SearchInput'
import { AntDesign, Ionicons } from '@expo/vector-icons'
import images from '@/constants/images'
import { blob, getUser, updateProfile } from '@/lib/api'
import { useGlobalContext } from '@/context/GlobalProvider'
import { StatusBar } from 'expo-status-bar'
import { LinearGradient } from 'expo-linear-gradient'
import JobDisplay from '@/components/JobDisplay'
const home = () => {
  const {user} = useGlobalContext();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [whichButton,setWhichButton] = useState("");
  const submit = async () => {
    try {
        await getUser();
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
          renderItem={() =>{

          }}
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
        <TouchableOpacity
          onPress={toggleModal}
          activeOpacity={0.5}
        >
          <JobDisplay
            name="Gipsz Jakab"
            title="Visual Designer"
            date="2024.02.10"
            limit={5}
            image={images.google}
            imageStyles="w-20 h-20 bg-orange-100"
            containerStyles="border border-primary mt-6"
          />
        </TouchableOpacity>

      </View>
      <Modal
        animationType='slide'
        transparent={true}
        visible={isModalVisible}
        onRequestClose={toggleModal}
      >
        <View className='items-center justify-center'>
          <LinearGradient
            colors={['#1a1a2e', '#16213e', '#0f3460']}
            start={{x:0, y:0.5}}
            end={{x:1, y:1}}
            className='w-[95%] h-[98%] opacity-95'
          >
          <View className="rounded-2xl">
              <View>
                <View className='mt-3 border rounded-3xl px-2 justify-center items-center'>
                  <View className='flex-row mt-2 w-[95%]'>
                    <View className='w-16 h-16 rounded-full items-center justify-center bg-white'>
                      <Image
                        source={images.google}
                        resizeMode='cover'
                        className='w-10 h-10 rounded-full'
                      />
                    </View>
                    <View className='ml-2'>
                      <Text className='font-pregular text-green-400 text-sm'>Gipsz Jakab</Text>
                      <Text className='font-pbold text-lg text-white'>Visual Designer</Text>
                        <Text className='font-light text-sm text-white'>2024.02.10 × Max: 5fő</Text>
                    </View>
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
                          <Text className='text-white font-pregular'>Leírás</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                          onPress={() => setWhichButton("értékelés")}
                          className={`justify-center items-center w-[33%] h-full rounded-3xl ${whichButton == "értékelés" && "bg-white opacity-80"}`}
                        >
                          <Text className='text-white font-pregular'>Leírás</Text>
                        </TouchableOpacity>
                      </View>
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
          </LinearGradient>
        </View>      
      </Modal>
    </SafeAreaView>
    </TouchableWithoutFeedback>
  )
}

export default home