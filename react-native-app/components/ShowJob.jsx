import { View, Text, ScrollView, TouchableOpacity } from 'react-native'
import React from 'react'
import { LinearGradient } from 'expo-linear-gradient'
import JobDisplay from './JobDisplay'
import { AntDesign } from '@expo/vector-icons'
import images from '@/constants/images'
import CustomButton from './CustomButton'
import ConvertText from './ConvertText'

const ShowJob = ({currentJob,showMore,whichButton,readMore,toggleModal,handleWhichButton, handlePress, title, handleShowMore}) => {
  return (
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
                            date={new Date(currentJob?.date).toISOString().split('T')[0]}
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
                                onPress={() => handleWhichButton("leírás")}
                                className={`justify-center items-center w-[33%] h-full rounded-3xl ${whichButton == "leírás" && "bg-white opacity-80"}`}
                              >
                                <Text className='text-white font-pregular'>Leírás</Text>
                              </TouchableOpacity>
                              <TouchableOpacity
                                onPress={() => handleWhichButton("áttekintés")}
                                className={`justify-center items-center w-[33%] h-full rounded-3xl ${whichButton == "áttekintés" && "bg-white opacity-80"}`}
                              >
                                <Text className='text-white font-pregular'>Teszt</Text>
                              </TouchableOpacity>
                              <TouchableOpacity
                                onPress={() => handleWhichButton("értékelés")}
                                className={`justify-center items-center w-[33%] h-full rounded-3xl ${whichButton == "értékelés" && "bg-white opacity-80"}`}
                              >
                                <Text className='text-white font-pregular'>Értékelés</Text>
                              </TouchableOpacity>
                            </View>
                          </View>
                          <View className='my-8'>
                            <Text className='font-pbold text-white text-lg'>Feladat Leírása</Text>
                          </View>
                          <View>
                            <Text className='font-light text-white'>
                              <ConvertText
                                text={readMore? !showMore? currentJob?.description.substring(0,100)+"..." : currentJob?.description : currentJob?.description}
                              /> 
                            </Text>      
                            {readMore && (
                              <TouchableOpacity
                                onPress={handleShowMore}
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
                      title={title}
                      handlePress={handlePress}
                      textStyles="text-white"
                      containerStyles="bg-primary w-[95%]"
                    />
                  </View>
                </View> 
              </LinearGradient>        
            </View>   
        </ScrollView>
  )
}

export default ShowJob