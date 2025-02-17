import { View, Text, ScrollView, TouchableOpacity, Alert, Image, TextInput, Modal } from 'react-native'
import React, { useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import Formfield from '@/components/Formfield'
import { Entypo, Feather} from '@expo/vector-icons'
import { router } from 'expo-router'
import * as ImagePicker from 'expo-image-picker';
import { CreateProfilePic } from '@/lib/api'
import { useGlobalContext } from '@/context/GlobalProvider'
import CustomButton from '@/components/CustomButton'
import ShowJob from '@/components/ShowJob'
import ConvertType from '@/components/ConvertType'

const create = () => {
  const {user} = useGlobalContext();
  const [readMore,setReadMore] = useState(false);
  const [typingTimeout, setTypingTimeout] = useState(null);
  const [stashed,setStashed] = useState("");
  const [form,setForm] = useState({
    name: "",
    max_attending : 1,
    date : new Date(),
    address : "",
    description : "",
    img : null,
    from : user.username
  })
  const [selection, setSelection] = useState({ start: 0, end: 0});
  const [isModalVisible,setIsModalVisible] = useState(false);
  const [undoStates, setUndoStates] = useState([""]);
  const toggleModal = () => {
    setIsModalVisible(!isModalVisible);
  }
  const handleConfirm = (selectedDate) => {
    setForm({...form,date : selectedDate});
  }
  const openPicker = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: 'images',
      allowsEditing: true,
      aspect: [2,3],
      quality : 0.3,
    })
    if (!result.canceled) {
      setForm({...form, img : result.assets[0].uri})  ;
    }
  }
  const submit = async () => {
    try{
        await CreateProfilePic(user.username,form.img);
    }
    catch(error){
      Alert.alert("Hiba",error.message)
    }
  }
  return (
    <SafeAreaView className='h-full'>
      <ScrollView keyboardShouldPersistTaps="handled">
        <View className='w-[90%] self-center justify-center min-h-[65vh]'>
          <View className='flex-row mt-10'>
            <TouchableOpacity
              onPress={() => {
                router.push('/(tabs)/home');
              }}
            >
              <Entypo name="chevron-thin-left" size={24} color="black" />
            </TouchableOpacity>
            <Text className='text-2xl font-pbold ml-2'>Hirdetés Készítése</Text>
          </View>
          <Text className='text-xl font-semibold mt-3 ml-2'>Cím</Text>
          <Formfield
            value={form.name}
            handleChangeText={(e) => setForm({...form, name: e})}
            otherStyles="mt-2"
          />
          <Text className='text-xl font-semibold mt-3 ml-2'>Nap</Text>
          <Formfield
            title="Cím"
            handleChangeText={handleConfirm}
            value={form.date}
            date={true}
            otherStyles="mt-2"
          />
          <View className='flex-row mt-4'>
              <View className='w-[20%]'>
                <Text className='text-xl font-psemibold'>
                  Max Fő
                </Text>
              </View> 
              <View className='w-[10%]'>
                  <Text></Text>
              </View>
              <View className='w-[70%]'>
                <Text className='text-xl font-psemibold'>Helyszín</Text>
              </View>
          </View>
          <View className='flex-row mt-4'>
              <View className='w-[20%]'>
                <Formfield
                  value={form.max_attending}
                  handleChangeText={(e) => setForm({...form, max_attending: e})}
                  keyboardType={true}
                  inputType={true}
                />
              </View> 
              <View className='w-[10%]'>

              </View>
              <View className='w-[70%]'>
                <Formfield
                  value={form.address}
                  handleChangeText={(e) => setForm({...form, address: e})}
                />
              </View>
          </View>
          <Text className='text-center font-psemibold text-xl mt-4'>Leírás</Text>
          <View className='border-b border-gray-300 mt-4'/>
              <ConvertType
                selection={selection}
                description={form.description}
                handleForm={(e) =>setForm({...form,description: e})}
                undoStates={undoStates}
                handleSelection={(e) => setSelection(e)}
                handleUndoStates={(e) => setSelection(e)}
                stashed={stashed}
                handleStash={(e) => setStashed(e)}
              />     
          <View className='border-b border-gray-300'/>
          <View className='bg-gray-500 h-[150px] rounded-xl mt-5 border-2'>
              <TextInput
                className='flex-1 text-white'
                value={form.description}
                onChangeText={(e) => {
                  setForm({...form,description : e})
                  if(typingTimeout){
                    clearTimeout(typingTimeout);
                  }
                  const newTimeout = setTimeout(() => {
                    let temp = undoStates;
                    if(stashed) temp.push(stashed);
                    setStashed(e);
                    setUndoStates(temp);
                  }, 1000);
                  setTypingTimeout(newTimeout);
                }}
                textAlignVertical='top'          
                onSelectionChange={({ nativeEvent : {selection}}) => {
                  setSelection(selection)
                }}
                multiline
              />
          </View>
          <TouchableOpacity
            onPress={openPicker}
            className='mt-6'
          > 
            {form.img? (
              <Image
                source={{uri : form.img}}
                resizeMode='cover'
                className='w-full h-64 rounded-2xl'
              />
            ) : (
              <View className="w-full h-16 px-4 bg-black-100 rounded-2xl border-2 border-black-200 flex justify-center items-center flex-row space-x-2">
                <Feather name="upload" size={16} color="black" />
                <Text className="text-sm text-black font-pmedium">
                  Válassz egy képet
                </Text>
              </View>
            )}
          </TouchableOpacity>
          {/*<TouchableOpacity
            className='w-10 h-10 bg-red-500'
            onPress={submit}
          >
            <Text>Gyere</Text>
          </TouchableOpacity>*/}
          <CustomButton
            handlePress={() => {
              if(form.description.length > 100){
                setReadMore(true);
              }
              toggleModal();
            }}
            title="Előnézet"
            containerStyles="bg-primary my-5"
            textStyles="text-white"
          />
        </View>
      </ScrollView>
      <Modal
        animationType='slide'
        transparent={true}
        visible={isModalVisible}
        onRequestClose={toggleModal}
      >
        <ShowJob
          currentJob={form}
          toggleModal={() => toggleModal()}
          readMore={readMore}
          title="Véglegesítés"
        />
      </Modal>
    </SafeAreaView>
  )
}

export default create