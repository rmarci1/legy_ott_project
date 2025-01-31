import { View, Text, Image, ImageBackground, TouchableOpacity, ScrollView, StatusBar, Modal, Animated, Easing, Dimensions } from 'react-native'
import React, { useEffect, useRef, useState } from 'react'
import { SafeAreaView, useSafeAreaFrame } from 'react-native-safe-area-context'
import { useGlobalContext } from '@/context/GlobalProvider'
import images from '@/constants/images'
import { GetProfilePic } from '@/lib/api'
import { AntDesign } from '@expo/vector-icons'

const profile = () => {
  const {user} = useGlobalContext();
  const [visible, setVisible] = useState(false);
  const [showMore,setshowMore] = useState(false);
  const [isExpand,setIsExpand] = useState(false); 

  const windowHeight = Dimensions.get('window').height
  const [maradektext,setMaradekText] = useState("töltöm az időmet. Ha épp nem valami izgalmas projektbe mélyedek, akkor valószínűleg egy jó könyvvel, zenével vagy egy csésze kávéval találkozol velem.\nImádok utazni, felfedezni új helyeket, és megismerni más kultúrákat."+
  "Mindig nyitott vagyok egy jó beszélgetésre, szóval ha van egy jó sztorid vagy egy érdekes ötleted, oszd meg velem!")
 /* const [imageUri, setImageUri] = useState(null);
  const fetchProfile = async () => {
    try{
      const response = await GetProfilePic();
      const imageUrl = URL.createObjectURL(response);
      setImageUri(imageUrl);
    }
    catch(error){
      throw new Error(error);
    }
  }*/
  const slideAnim = useState(new Animated.Value(300))[0];
  const imageSlide = useRef(new Animated.Value(0.25)).current;

  const toggleImage = () =>{
    if(!isExpand){
      Animated.timing(imageSlide, {
        toValue: 0.3,
        duration: 800,
        useNativeDriver: false,
      }).start();
    }
    else{
      Animated.timing(imageSlide,{
        toValue: 0.5,
        duration: 800,
        useNativeDriver: false,
      }).start();
    }
    setIsExpand(!isExpand);
  }
  const toggleSlide = () => {
    if (visible) {
      Animated.timing(slideAnim, {
        toValue: 300,
        duration: 800,
        useNativeDriver: true,
      }).start();
    } else {
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 800,
        useNativeDriver: true,
      }).start();
    }
    setVisible(!visible);
  }
  return (
    <View className='h-full relative'>
    <ScrollView className='flex-1 border'>
      <StatusBar translucent backgroundColor='transparent' barStyle="light-content"/>
        <TouchableOpacity
          onPress={toggleImage}
          activeOpacity={0.9}
        >
          <Animated.View className={`w-full overflow-hidden`} style={{
              height: imageSlide.interpolate({
                inputRange: [0,1],
                outputRange: [0,1000]
              }), 
            }}>
              <Image
                source={images.test}
                resizeMode='cover'
                className='w-full'
              />
          </Animated.View>
        </TouchableOpacity>
          <View className={`w-full h-full bg-white items-center`}>
            <View className='w-[90%] mt-4'>
              <View className='flex-row justify-between'>
                <View>
                  <Text className='font-pregular text-xl text-black'>{user.name}</Text>
                  <Text className='font-plight text-sm'>{user.username}</Text>
                </View>
                <Text className='font-pregular text-lg mt-2'><AntDesign name="star" size={16} color="orange" />4</Text>
              </View>
              <Text className='mt-5 font-pmedium'>{user?.leiras}Egy vidám és kíváncsi ember vagyok, aki mindig keresi az új kihívásokat és élményeket. {'\n'}
                Szeretek kreatívan gondolkodni, új dolgokat tanulni, és persze jókat nevetni.{'\n\n'}
                Ha épp nem valami izgalmas projektbe mélyedek, akkor valószínűleg egy jó könyvvel  asdasdasdad
                {showMore && <Text>{maradektext}</Text>}
              </Text>
              <TouchableOpacity
                  onPress={() => setshowMore(!showMore)}
                >
                  <Text className='font-pbold text-amber-600 underline'>{showMore? "Kevesebb" : "Olvass többet"}</Text>
              </TouchableOpacity>
              <View className='flex-row mt-4 justify-between'>
                  <TouchableOpacity
                    className='w-[45%] bg-primary rounded-xl h-[35px] items-center justify-center'
                    onPress={() => toggleSlide()}
                  >
                    <Text className='text-white font-pregular'>Önkéntes</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    className='w-[45%] bg-orange-400 rounded-xl h-[35px] items-center justify-center'
                  >
                    <Text className='text-white font-pregular'>Hirdető</Text>
                  </TouchableOpacity>
              </View>
              {
                visible && <Animated.View
                  className=" bg-primary rounded-xl mt-4"
                  style={{
                    transform: [{ translateY : slideAnim}]
                  }}
                >
                  <Text className='text-3xl'>asdasdasd</Text>
                  <Text className='text-3xl'>asdasdasd</Text>
                  <Text className='text-3xl'>asdasdasd</Text>
                  <Text className='text-3xl'>asdasdasd</Text>
                  <Text className='text-3xl'>asdasdasd</Text>

                </Animated.View>
              }
            </View>
          </View>
      </ScrollView>
      </View>
  )
}

export default profile