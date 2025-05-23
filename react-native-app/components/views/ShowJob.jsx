import { View, Text, ScrollView, TouchableOpacity, Alert, ActivityIndicator } from 'react-native'
import React, { useEffect, useState } from 'react'
import { LinearGradient } from 'expo-linear-gradient'
import JobDisplay from './JobDisplay'
import { AntDesign } from '@expo/vector-icons'
import ConvertText from '../inputFields/ConvertText'
import { FlashList } from '@shopify/flash-list'
import { getReviews } from '@/lib/api'
import Rating from '../Rating'
import { useGlobalContext } from '@/context/GlobalProvider'
/**
 * A `ShowJob` komponens, amely a munkával kapcsolatos részleteket, leírást és értékeléseket jelenít meg.
 * 
 * @component
 * @param {Object} props - A komponenshez tartozó propok.
 * @param {Object} props.currentJob - A jelenlegi munka részleteit tartalmazó objektum.
 * @param {boolean} props.readMore - Jelző, amely megmondja, hogy a teljes leírás megjeleníthető-e.
 * @param {function} props.toggleModal - Funkció a modal ablakok ki- és bekapcsolására.
 * @param {function} props.handlingProfile - Funkció, amely a felhasználói profilok kezelésére szolgál.
 * @param {boolean} props.create - Jelző, hogy a munka létrehozási módban van-e.
 * @param {boolean} props.created - Jelző, hogy a munka már létre lett-e hozva.
 * @returns {JSX.Element} A `ShowJob` komponens.
 */
const ShowJob = ({currentJob,readMore,toggleModal, handlingProfile,create,created}) => {
  const {handleProfile} = useGlobalContext();
  const [whichButton,setWhichButton] = useState("description");
  const [showMore,setShowMore] = useState(false);
  const [isLoading,setIsLoading] = useState(false);
  const [ratings,setRatings] = useState(null);
  const [currJob,setCurrJob] = useState(currentJob);
  useEffect(() => {
    if(!create){
      getRatings();
    }
  }, [])
  /**
   * Az egyes értékelések renderelésére szolgáló függvény.
   * 
   * @param {Object} param - Az értékelés elemét tartalmazó paraméter.
   * @param {any} param.item - Az értékelés elemét tartalmazó objektum.
   * @returns {JSX.Element} A `Rating` komponens az értékeléshez.
   */
  const renderItem = ({item}) => (
    <Rating
      handleProfile={(username) => handleProfile(username, () => toggleModal())}
      item={item}
    />
  )
   /**
   * Az értékelések lekérésére szolgáló aszinkron függvény.
   * 
   * @returns {Promise<void>} Egy ígéret, amely akkor teljesül, amikor az értékelések lekérése befejeződik.
   */
  const getRatings = async () => {
    try{
      setIsLoading(true);
      const res = await getReviews(currJob.from);
      setRatings(res);
    }
    catch(error){
      Alert.alert("Hiba",error.message);
    }
    finally{
      setIsLoading(false);
    }
  }
  return (  
      <ScrollView className='h-[80%]'>
            <View className='items-center justify-center min-h-full'>
              <LinearGradient
                colors={['#1a1a2e', '#16213e', '#0f3460']}
                start={{x:0, y:0.5}}
                end={{x:1, y:1}}
                className='w-[95%] h-full'
                style= {{
                  borderRadius: 50
                }}
              >
                <View className="rounded-2xl">
                    <View>
                      <View className='mt-3 rounded-3xl px-2 justify-center items-center'>
                        <View className='w-[95%]'>
                          <JobDisplay
                            item={currJob}
                            handleJobProfile={(username) => handlingProfile(username)}
                            handleModal={(isLiked) => setCurrJob({...currJob, profiles: [{isApplied: false, saveForLater: isLiked}]})}
                            imageStyles="w-16 h-16 bg-white"
                            nameStyle="text-green-400 text-sm"
                            titleStyle="text-white"
                            dateStyle="text-white"
                            createing={create}
                            showJob={true}
                            created={created}
                          />
                        </View>
                        <View className='w-[90%]'>
                          <View className='h-16 mt-4 rounded-full bg-white opacity-60 items-center justify-center'>
                            <View className='flex-row justify-between items-center w-[95%]'>
                              <TouchableOpacity
                                onPress={() => setWhichButton("description")}
                                className={`justify-center items-center w-[50%] h-full rounded-3xl ${whichButton == "description" && "bg-white opacity-80"}`}
                              >
                                <Text className='text-white font-pregular'>Leírás</Text>
                              </TouchableOpacity>
                              {!create && <TouchableOpacity
                                onPress={() => setWhichButton("értékelés")}
                                className={`justify-center items-center w-[50%] h-full rounded-3xl ${whichButton == "értékelés" && "bg-white opacity-80"}`}
                              >
                                <Text className='text-white font-pregular'>Értékelés</Text>
                              </TouchableOpacity>}
                            </View>
                          </View>
                          {whichButton == "description" ? <View>
                            <Text className='font-pbold text-white text-lg mt-8'>Feladat Leírása</Text>
                              <Text className='text-white font-pregular mb-5 italic'>Helyszín: {currJob?.address}</Text>
                              <View>
                                <Text className='font-light text-white'>
                                  <ConvertText
                                    text={readMore? !showMore? currJob?.description.substring(0,100)+"..." : currJob?.description : currJob?.description}
                                  /> 
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
                            </View> : 
                                <FlashList
                                  data={ratings}
                                  renderItem={renderItem}
                                  keyExtractor={(item,index) => index.toString()}
                                  estimatedItemSize={10}
                                  ListEmptyComponent={() => (
                                    <View
                                      className='min-h-full items-center justify-center pt-[25%]'
                                    > 
                                    {isLoading? <ActivityIndicator size={60}/> : <View>
                                        <Text className='text-3xl text-white font-rlight text-center'>Nincs még értékelése ennek a felhasználónak</Text>
                                      </View>
                                    }
                                   </View>
                                  )}
                                />
                              }
                        </View>
                      </View>
                      <TouchableOpacity
                        onPress={toggleModal}
                        className='absolute right-4 top-4 h-10 w-10 bg-[#1a1a2e] opacity-95 rounded-3xl items-center justify-center'
                      >
                        <AntDesign name="close" size={20} color="white"/>
                      </TouchableOpacity>
                    </View>        
                </View>
                
              </LinearGradient>        
            </View>   
        </ScrollView>
  )
}

export default ShowJob