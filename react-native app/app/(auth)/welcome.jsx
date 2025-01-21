import { View, Text, SafeAreaView,Alert, Modal } from 'react-native'
import React, { useState } from 'react'
import Formfield from '@/components/Formfield'
import Swiper from 'react-native-swiper'
import CustomButton from '@/components/CustomButton'
import { useGlobalContext } from '@/context/GlobalProvider'
import AntDesign from '@expo/vector-icons/AntDesign';

const welcome = () => {
  const {formpart} = useGlobalContext();
  const [isSubmitting,setIsSubmitting] = useState(false);
  const [changed,setChanged] = useState(false);
  const [form,setForm] = useState({
    name: '',
    username: ''
  });
  const [finalName,setFinalName] = useState('');
  const [activeIndex, setActiveIndex] = useState(0);
  const [isModalVisible,setIsModalVisible] = useState(false);
  const toggleModal = () => {
    setIsModalVisible(!isModalVisible);
  }
  const checking = () => {
    if(!form.name || !form.username){
      Alert.alert("Hiba","Nem töltötted ki az összes mezőt");
      return;
    }
    let s = "";
    for (let index = 0; index < form.name.length; index++) {
      if(index < 1 || !(form.name[index] == ' ' && form.name[index-1] == ' ')){
        s += form.name[index]
      }
    }
    setFinalName(s);
    setIsModalVisible(true);
  }
  const submit = () => {

    try{
      setIsSubmitting(true);
      
    }
    catch(error){
      throw new Error();
    }
    finally{
      setIsSubmitting(false);
    }
  }
  return (
    <SafeAreaView className="h-full">
    <View className="min-h-[100vh] items-center justify-center">
      <View className='h-[30%]'>
      <Swiper
        className=""
        autoplay={false}
        loop={false}
        showsButtons={true}
        scrollEnabled={false}
        onIndexChanged={(index) => setActiveIndex(index)}
      >
        <View key={0} className="items-center justify-center flex-1">
          <Text className="text-3xl text-[#1F41BB] font-pregular mb-4">Mi a neved?</Text>
          <Formfield 
            placeholder="Teljes név" 
            otherStyles="w-[80%]" 
            handleChangeText={(e) =>
              { 
                  if(!changed) setForm({...form,name: e, username:e.toString().toLowerCase().replace(/ /g, ".")})
                  else{setForm({...form, name: e});}
              }}
          />
          <View className='h-[15%]'></View>
        </View>
        <View key={1} className="items-center justify-center flex-1">
          <Text className="text-2xl text-[#1F41BB] font-pregular mb-4 tex-center">Mi legyen a felhasználóneved?</Text>
          <Formfield 
            placeholder={form.username} 
            otherStyles="w-[80%]" 
            handleChangeText={(e) => {
              setForm({...form, username:e})
              if(!changed) setChanged(true)
              if(e.length == 0) 
              {
                setChanged(false);
                setForm({...form,username:form.name.toLowerCase().replace(/ /g, ".")})
              }
            }}
          />
          <View className='h-[10%]'></View>
        </View>
      </Swiper>
      </View>
      {
        activeIndex === 1 &&
        <View className='w-[85%]'>
          <CustomButton
            title="Tovább"
            textStyles="text-white"
            containerStyles="bg-[#1F41BB] mt-5"
            handlePress={checking}
          />
        </View>
      }
    </View>
    <View className='flex-1 justify-end items-center'>
      <Modal
        animationType='slide'
        transparent={true}
        visible={isModalVisible}
        onRequestClose={toggleModal}
      >
        <View className='h-[55%] bg-[#1F41BB] absolute bottom-0 w-full items-center'>
            <View className='w-20 h-20 bg-white rounded-full justify-center items-center mt-6'>
              <AntDesign name="check" size={30} color="lime" />
            </View>
            <Text className='text-3xl font-psemibold mt-8 text-white'>Ellenőrzés</Text>
          <View className='w-[80%] mt-4'>
            <Text className='text-xl font-pregular text-white my-4'>Név: <Text className='font-pbold'>{finalName}</Text></Text>
            <Text className='text-xl font-pregular text-white'>Felhasználónév: <Text className='font-pbold'>{form.username}</Text></Text>
          </View>
          <View className='w-[85%]'>
            <CustomButton
              title= "Tovább"
              textStyles="text-white"
              containerStyles="bg-[#0BCE83] mt-10"
              handlePress={submit}
            />
          </View>
          <View>
            <CustomButton
              title= "Vissza"
              textStyles="text-white"
              containerStyles="mt-6"
              handlePress={toggleModal}
            />
          </View>
        </View>
      </Modal>
    </View>
  </SafeAreaView>
  
  )
}

export default welcome