import { View, Text, ScrollView, TouchableOpacity, Alert, Image, TextInput, TouchableWithoutFeedback, Keyboard } from 'react-native'
import React, { useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import Formfield from '@/components/Formfield'
import { Entypo, Feather } from '@expo/vector-icons'
import { router } from 'expo-router'
import * as DocumentPicker from "expo-document-picker";
import * as ImagePicker from 'expo-image-picker';
import * as FileSystem from 'expo-file-system'
import { CreateProfilePic } from '@/lib/api'
import { useGlobalContext } from '@/context/GlobalProvider'

const create = () => {
  const {user} = useGlobalContext();
  const [form,setForm] = useState({
    title: "",
    max : 1,
    date : new Date(),
    location : "",
    description : "",
    image : null
  })
  const [selection, setSelection] = useState({ start: 0, end: 0});
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
      console.log("happen");
      setForm({...form, image : result.assets[0].uri})  ;
    }
  }
  const submit = async () => {
    try{
        const base64 = await FileSystem.readAsStringAsync(form.image, {encoding: 'base64'});
        await CreateProfilePic(user.username,base64);
    }
    catch(error){
      Alert.alert("Hiba",error.message)
    }
  }
  return (
    <SafeAreaView className='h-full'>
      <ScrollView className=''>
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
            value={form.title}
            handleChangeText={(e) => setForm({...form, title:form.title})}
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
                  value={form.max}
                  handleChangeText={(e) => setForm({...form, max: e})}
                  keyboardType={true}
                  inputType={true}
                />
              </View> 
              <View className='w-[10%]'>

              </View>
              <View className='w-[70%]'>
                <Formfield
                  value={form.location}
                  handleChangeText={(e) => setForm({...form, location: e})}
                />
              </View>
          </View>
          <Text className='text-center font-psemibold text-xl mt-4'>Leírás</Text>
          <View className='border-b border-gray-300'/>
          <View className='flex-row my-4'>        
              <TouchableOpacity
                onPress={() =>{
                  const selected = selection.start !== selection.end
                  let str = form.description;
                  let convert = "";
                  if(selected){
                    convert = (selection.start != 0  ? str.substring(0,selection.start) : "") + "**" + str.slice(selection.start,selection.end) +
                    "**" + (selection.end != form.description.length - 1 ? str.slice(selection.end) : "");
                  }
                  else{
                    convert = "**" + form.description + "**"
                  }
                  console.log((selection.start != 0  ? str.substring(0,selection.start) : "") + "**" + str.slice(selection.start,selection.end)+ "**");
                  setForm({...form, description: convert})
                  }
                }
              >
                  <Feather name="bold" size={24} color="black" />
              </TouchableOpacity>
              <TouchableOpacity>
                  <Text></Text>
              </TouchableOpacity>
              <TouchableOpacity>
                  <Text></Text>
              </TouchableOpacity>
          </View>
          <View className='border-b border-gray-300'/>
          <View className='h-[30%] bg-gray-500 rounded-xl mt-4 border-2'>
            <TouchableWithoutFeedback
              onPress={Keyboard.dismiss}
            >
              <TextInput
                className='flex-1 text-white'
                value={form.description}
                onChangeText={(e) => setForm({...form,description : e})}
                textAlignVertical='top'
                
                onSelectionChange={({ nativeEvent : {selection}}) => setSelection(selection)}
                multiline
              />
            </TouchableWithoutFeedback>
          </View>
          <TouchableOpacity
            onPress={openPicker}
            className='mt-6'
          > 
            {form.image? (
              <Image
                source={{uri : form.image}}
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
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}

export default create