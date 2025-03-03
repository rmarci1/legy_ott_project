import { View, Text, Animated, TouchableOpacity, TextInput, Image, Modal, Alert } from 'react-native'
import React, { useRef, useState,useEffect } from 'react'
import CustomButton from './CustomButton'
import { AntDesign, Entypo, Feather, FontAwesome, Ionicons } from '@expo/vector-icons'
import ConvertType from './ConvertType'
import * as ImagePicker from 'expo-image-picker';
import { router } from 'expo-router'
import { createReview, getAverageRating, getCanReview, updateProfile } from '@/lib/api'
import { useGlobalContext } from '@/context/GlobalProvider'
import ConvertText from './ConvertText'

const ProfileView = ({isView, viewed_user, handleModal}) => {
  const {user, setUser} = useGlobalContext();
  const [selection, setSelection] = useState({
      start: 0,
      end : 0
  });
  const [reviewForm,setReviewForm] = useState({
    rating : 0,
    desc : ""
  })
  const [stashed, setStashed] = useState("");
  const [undoStates,setUndoStates] = useState([]);
  const [typingTimeout,setTypingTimeout] = useState(null);
  const [showMore,setshowMore] = useState(false);
  const [isExpand,setIsExpand] = useState(false); 
  const [editing,setEditing] = useState("");
  const [animating,setAnimating] = useState(false);
  const [readMore,setReadMore] = useState(false);
  const [pressed, setPressed] = useState("");
  const [rating, setRating] = useState(0);
  const [isModalVisible,setIsModalVisible] = useState(false);
  const [editingState,setEditingState] = useState("");
  const [canProfileReview, setCanProfileReview] = useState(false);
  
  useEffect(() => {
    if(viewed_user.description.length > 50){
      setReadMore(true);
    }
    getAverageRating(viewed_user.username).then((res) => {
      if(res){
        setRating(res);
      }
      else{
        setRating(0);
      }
    }).catch((error) => {
      throw new Error(error);
    })
    canReview()
    .catch((error) => {
      Alert.alert("Hiba",error);
    });
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
    setAnimating(true);
    if (!pressed) {
      setPressed(curr);
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 800,
        useNativeDriver: true,
      }).start(() => setAnimating(false));
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
            }).start(() => setAnimating(false));
          })
      }
      else{
        Animated.timing(slideAnim, {
          toValue: 400,
          duration: 800,
          useNativeDriver: true,
        }).start(() => {
          setAnimating(false);
          setPressed("");
        });
      }
    }
  }
  const toggleModal = () => {
    setIsModalVisible(!isModalVisible);
  }
  const canReview = async () => {
    try{
      console.log("happen")
      const res = await getCanReview(viewed_user);
      setCanProfileReview(res);
    }
    catch(error){
      console.log(error);
      throw new Error(error.message);
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
        setUser({...viewed_user, profileImg : result.assets[0].uri});
      }
  }
  const reviewSubmit = async () => {
    await createReview({reviewed_un : viewed_user.username, reviewer_un: user.username, desc: reviewForm.desc, review: reviewForm.rating},viewed_user.username);
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
                source={{uri : viewed_user?.profileImg}}
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
            router.replace('/(tabs)/home');
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
                    <Text className='font-pregular text-xl text-black'>{viewed_user.name}</Text>
                    {!isView && <TouchableOpacity onPress={() => {                    
                          setEditing("name");
                          setEditingState(viewed_user?.name);
                        }} 
                        className='font-pbold text-lg'
                      >
                      <AntDesign name="edit" size={24} color="black" />
                    </TouchableOpacity> }
                  </View> : <View className='flex-row items-center'>
                  <TextInput
                      className='font-pregular flex-1 text-lg border rounded-xl'
                      value={viewed_user?.name || ""}
                      onChangeText={(e) => setUser((prevUser) => ({...prevUser, name: e}))}
                    />
                    <TouchableOpacity onPress={() => {
                        if(editingState !== viewed_user?.name){
                          updateProfile(viewed_user.name,"name");
                        };
                        setEditingState("");
                        setEditing("");
                      }} className='font-pbold text-lg'>
                      <AntDesign name="edit" size={20} color="gray" />
                    </TouchableOpacity>
                  </View>
                  }
                  
                  { editing !== "username" ?
                  <View className='flex-row'>
                    <Text className='font-plight text-sm'>{viewed_user.username}</Text>
                    {!isView && <TouchableOpacity onPress={() => {
                      setEditing("username");
                      setEditingState(viewed_user?.username);
                      }} className='font-pbold text-lg'>
                        <AntDesign name="edit" size={16} color="gray" />
                    </TouchableOpacity>}
                  </View> : <View className='flex-row items-center'>
                    <TextInput
                      className='font-plight flex-1 text-sm underline border'
                      value={viewed_user?.username || ""}
                      onChangeText={(e) => setUser((prevUser) => ({...prevUser, username: e}))}
                    />
                    <TouchableOpacity onPress={() => {
                        if(editingState!==viewed_user?.username){
                          updateProfile(viewed_user?.username,"username");
                        }
                        setEditing("");
                        setEditingState("");
                      }} 
                      className='font-pbold text-lg'>
                      <AntDesign name="edit" size={20} color="green" />
                    </TouchableOpacity>
                  </View>
                  }
                </View>
                {rating >= 1 && 
                <View className='items-center justify-center'>
                  <TouchableOpacity
                    onPress={handleModal}
                    activeOpacity={0.8}
                  >
                    <Text className='font-pregular text-lg mt-2'>
                    <AntDesign name="star" size={16} color="orange" />{rating.toFixed(2)}</Text>
                    </TouchableOpacity>
                    {
                      canProfileReview &&  <TouchableOpacity
                        onPress={toggleModal}
                        activeOpacity={0.4}
                        className='rounded-xl flex-row items-center'
                      >
                        <Text className='font-plight mt-2 text-primary'>Értékelés</Text>
                        <Ionicons name="create" size={24} color="black" className='ml-1' />
                      </TouchableOpacity>
                    }
                </View>
                  }
              </View>
              {
                editing !== "description" ? <View>
                <ConvertText
                  text={((readMore && !showMore)) ? viewed_user?.description.substring(0,100)+"..." : viewed_user?.description}
                />
                {(!isView) && <TouchableOpacity onPress={() => {
                    setEditing("description");
                    setEditingState(viewed_user?.description);
                    }} 
                    className='font-pbold text-lg'
                  >
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
                      description={viewed_user?.description || ""}
                      handleForm={(e) =>setUser({...viewed_user, description: e})}
                      undoStates={undoStates}
                      handleSelection={(e) => setSelection(e)}
                      handleUndoStates={(e) => setSelection(e)}
                      stashed={stashed}
                      handleStash={(e) => setStashed(e)}
                    />     
                  <View className='border-b border-gray-300'/>
                  <TextInput
                    className='flex-1 font-pmedium mt-5'
                    value={viewed_user?.description || ""}
                    onChangeText={(e) => {
                      setUser((prevUser) => ({...prevUser, description : e}))
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
                    handlePress={() => {
                      if(editingState !== viewed_user?.description){
                        updateProfile(viewed_user?.description,"description");
                      }
                      setEditing("");
                      setEditingState("");
                    }}
                    title="Módosítás"
                  />
                </View>
              }
              <View className='flex-row mt-4 justify-between'>
                  <TouchableOpacity
                    disabled={animating}
                    className='w-[45%] bg-primary rounded-xl h-[35px] items-center justify-center'
                    onPress={() => toggleSlide("onkentes")}
                  >
                    <Text className='text-white font-pregular'>Önkéntes</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    disabled={animating}
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
          <View className='flex-1 justify-end items-center'>
            <Modal
              animationType='slide'
              transparent={true}
              visible={isModalVisible}
              onRequestClose={toggleModal}
            >
              <View className='min-h-[40vh] bg-white absolute bottom-0 w-full rounded-t-2xl'>
                <View className='w-[85%] self-center'>
                  <TouchableOpacity
                    onPress={toggleModal}
                    className=''
                  >
                    <Text className='text-xl font-pmedium text-center mt-4'>Írd meg az értékelésedet</Text>
                  </TouchableOpacity>
                  <View className='flex-row self-center items-center justify-center gap-x-2 my-4'>
                      <TouchableOpacity
                        onPress={() => setReviewForm({...reviewForm, rating: 1})}
                      >
                        <FontAwesome name="star" size={56} color="#FFD02B"/>
                      </TouchableOpacity>
                      <TouchableOpacity
                        onPress={() => setReviewForm({...reviewForm, rating : 2})}
                      >
                        <FontAwesome name="star" size={56} color={reviewForm.rating >= 2 ? "#FFD02B" : "gray"} className='mx-1' />
                      </TouchableOpacity>
                      <TouchableOpacity
                        onPress={() => setReviewForm({...reviewForm, rating : 3 })}
                      >
                        <FontAwesome name="star" size={56} color={reviewForm.rating >= 3 ? "#FFD02B" : "gray"} />
                      </TouchableOpacity>
                      <TouchableOpacity
                        onPress={() => setReviewForm({...reviewForm, rating : 4 })}
                      >
                        <FontAwesome name="star" size={56} color={reviewForm.rating >= 4 ? "#FFD02B" : "gray"} className='mx-1' />
                      </TouchableOpacity>
                      <TouchableOpacity
                        onPress={() =>setReviewForm({...reviewForm, rating : 5 })}
                      >
                        <FontAwesome name="star" size={56} color={reviewForm.rating >= 5? "#FFD02B" : "gray"} />
                      </TouchableOpacity>
                  </View>
                  <View className='h-[100px] rounded-xl border border-[#E5F0EA]'>
                    <TextInput
                      className='font-rmedium'
                      placeholder='Írd meg az értékelésedet'
                      onChangeText={(e) => {
                        setReviewForm({...reviewForm, desc: e})
                      }}
                      multiline
                    />
                  </View>
                  <CustomButton
                    handlePress={reviewSubmit}
                    containerStyles="bg-black mt-8"
                    textStyles="text-white"
                    title="Értékelés elkészítése"
                  />
                </View>
              </View>
            </Modal>
          </View>
    </View>
  )
}

export default ProfileView