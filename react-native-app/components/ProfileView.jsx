import { View, Text, Animated, TouchableOpacity, TextInput, Image } from 'react-native'
import React, { useRef, useState,useEffect } from 'react'
import CustomButton from './CustomButton'
import { AntDesign, Entypo, Feather } from '@expo/vector-icons'
import ConvertType from './ConvertType'
import { SafeAreaView } from 'react-native-safe-area-context'
import { router } from 'expo-router'
import { getAverageRating } from '@/lib/api'

const ProfileView = ({isView, user}) => {
  const [selection, setSelection] = useState({
      start: 0,
      end : 0
  });
  const [stashed, setStashed] = useState("");
  const [undoStates,setUndoStates] = useState([]);
  const [typingTimeout,setTypingTimeout] = useState(null);
  const [showMore,setshowMore] = useState(false);
  const [isExpand,setIsExpand] = useState(false); 
  const [editing,setEditing] = useState("");
  const [readMore,setReadMore] = useState();
  const [pressed, setPressed] = useState("");
  const [rating,setRating] = useState(0);
  useEffect(() => {
    if(user.description.length > 100){
      setReadMore(true);
    }
    getAverageRating(user.username).then((res) => {
      if(res){
        setRating(res);
      }
      else{
        setRating(0);
      }
    }).catch((error) => {
      throw new Error(error);
    })
  },[])
  const slideAnim = useState(new Animated.Value(400))[0];
  const imageSlide = useRef(new Animated.Value(0.3)).current;
  const toggleImage = () =>{
    if(isExpand){
      Animated.timing(imageSlide, {
        toValue: 0.3,
        duration: 800,
        useNativeDriver: false,
      }).start();
    }
    else{
      Animated.timing(imageSlide,{
        toValue: 0.6,
        duration: 800,
        useNativeDriver: false,
      }).start();
    }
    setIsExpand(!isExpand);
  }
  const toggleSlide = (curr) => {
    if (!pressed) {
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 800,
        useNativeDriver: true,
      }).start(() => {
        setPressed(curr);
      });
    } 
    else{
      if(curr != pressed){
          Animated.timing(slideAnim, {
            toValue: 400,
            duration: 800,
            useNativeDriver: true,
          }).start(() => {
            setPressed(curr)
            Animated.timing(slideAnim, {
              toValue: 0,
              duration: 800,
              useNativeDriver: true,
            }).start();
          })
      }
      else{
        Animated.timing(slideAnim, {
          toValue: 400,
          duration: 800,
          useNativeDriver: true,
        }).start(() => {
          setPressed("");
        });
      }
    }
  }
  const openPicker = async () => {
      let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: 'images',
            allowsEditing: true,
            aspect: [2,3],
            quality : 0.3,
          })
      if (!result.canceled) {
        console.log(result);
        setUser({...user, profileImg : result.assets[0].uri});
      }
  }
  return (
    <View>
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
                source={{uri : user.profileImg}}
                resizeMode='cover'
                className='w-full h-full'
              />
          </Animated.View>
        {!isView ? <TouchableOpacity
          onPress={openPicker}
          className='absolute top-[15%] right-4 flex-row border p-2 items-center'
        >
          <Feather name="upload" size={20} color="black" />
        </TouchableOpacity> : 
        <TouchableOpacity
          onPress={() => {
            router.push('/(tabs)/home');
          }}
          className='absolute top-[15%] left-6'
        >
          <Entypo name="chevron-thin-left" size={24} color="black" />
        </TouchableOpacity>
        }
        </TouchableOpacity>
          <View className={`w-full h-full bg-white items-center`}>
            <View className='w-[90%] mt-4'>
              <View className='flex-row justify-between'>
                <View className='w-[80%]'>
                  {
                    editing !== "name" ?<View className='flex-row'>
                    <Text className='font-pregular text-xl text-black'>{user.name}</Text>
                    {!isView && <TouchableOpacity onPress={() => setEditing("name")} className='font-pbold text-lg'>
                      <AntDesign name="edit" size={24} color="black" />
                    </TouchableOpacity> }
                  </View> : <View className='flex-row items-center'>
                  <TextInput
                      className='font-pregular flex-1 text-lg border rounded-xl'
                      value={user?.name || ""}
                      onChangeText={(e) => setUser((prevUser) => ({...prevUser, name: e}))}
                    />
                    <TouchableOpacity onPress={() => setEditing("")} className='font-pbold text-lg'>
                      <AntDesign name="edit" size={20} color="gray" />
                    </TouchableOpacity>
                  </View>
                  }
                  
                  { editing !== "username" ?
                  <View className='flex-row'>
                    <Text className='font-plight text-sm'>{user.username}</Text>
                    {!isView && <TouchableOpacity onPress={() => setEditing("username")} className='font-pbold text-lg'>
                        <AntDesign name="edit" size={16} color="gray" />
                    </TouchableOpacity>}
                  </View> : <View className='flex-row items-center'>
                    <TextInput
                      className='font-plight flex-1 text-sm underline border'
                      value={user?.username || ""}
                      onChangeText={(e) => setUser((prevUser) => ({...prevUser, username: e}))}
                    />
                    <TouchableOpacity onPress={() => setEditing("")} className='font-pbold text-lg'>
                      <AntDesign name="edit" size={20} color="green" />
                    </TouchableOpacity>
                  </View>
                  }
                </View>
                <Text className='font-pregular text-lg mt-2'><AntDesign name="star" size={16} color="orange" />{rating}</Text>
              </View>
              {
                editing !== "description" ? <View><Text className='mt-5 font-pmedium'>{(readMore && !showMore) && user?.description.substring(0,100)}
                {showMore && <Text>{user?.description}</Text>}
                </Text>
                {(!showMore && !isView) && <TouchableOpacity onPress={() => setEditing("description")} className='font-pbold text-lg'>
                  <AntDesign name="edit" size={24} color="black" />
                </TouchableOpacity>}
                {readMore && <TouchableOpacity
                  onPress={() => setshowMore(!showMore)}
                >
                  <Text className='font-pbold text-amber-600 underline'>{showMore? "Kevesebb" : "Olvass többet"}</Text>
                </TouchableOpacity>}
                </View> : 
                <View>
                  <View className='border-b border-gray-300 mt-4'/>
                    <ConvertType
                      selection={selection}
                      description={user?.leiras || ""}
                      handleForm={(e) =>setUser({...user,leiras: e})}
                      undoStates={undoStates}
                      handleSelection={(e) => setSelection(e)}
                      handleUndoStates={(e) => setSelection(e)}
                      stashed={stashed}
                      handleStash={(e) => setStashed(e)}
                    />     
                  <View className='border-b border-gray-300'/>
                  <TextInput
                    className='flex-1 font-pmedium'
                    value={user?.leiras || ""}
                    onChangeText={(e) => {
                      setUser((prevUser) => ({...prevUser, leiras : e}))
                      if(typingTimeout){
                        clearTimeout(typingTimeout);
                      }
                      const newTimeout = setTimeout(() => {
                        console.log("Auto-saving:",e)
                        let temp = undoStates;
                        if(stashed) temp.push(stashed);
                        setStashed(e);
                        setUndoStates(temp);
                      }, 1000);
                      setTypingTimeout(newTimeout);
                    }}
                    onSelectionChange={({ nativeEvent : {selection}}) => {
                      setSelection(selection);
                    }}
                    multiline
                  />
                  <CustomButton
                    handlePress={() => setEditing("")}
                    title="Módosítás"
                  />
                </View>
              }
              <View className='flex-row mt-4 justify-between'>
                  <TouchableOpacity
                    className='w-[45%] bg-primary rounded-xl h-[35px] items-center justify-center'
                    onPress={() => toggleSlide("onkentes")}
                  >
                    <Text className='text-white font-pregular'>Önkéntes</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => toggleSlide("hirdeto")}
                    className='w-[45%] bg-orange-400 rounded-xl h-[35px] items-center justify-center'
                  >
                    <Text className='text-white font-pregular'>Hirdető</Text>
                  </TouchableOpacity>
              </View>
              {
                true && <Animated.View
                  className={`${pressed == "onkentes" ? "bg-primary" : "bg-orange-400"} rounded-xl mt-4`}
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
    </View>
  )
}

export default ProfileView