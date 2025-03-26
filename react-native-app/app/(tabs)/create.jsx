import { View, Text, ScrollView, TouchableOpacity, Alert, Image, TextInput, Modal } from 'react-native'
import React, { useCallback, useEffect, useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import Formfield from '@/components/inputFields/Formfield'
import { Entypo, Feather} from '@expo/vector-icons'
import { router, useFocusEffect } from 'expo-router'
import { createJob, deleteJob, updateJob } from '@/lib/api'
import { useGlobalContext } from '@/context/GlobalProvider'
import CustomButton from '@/components/CustomButton'
import ShowJob from '@/components/views/ShowJob'
import ConvertType from '@/components/ConvertType'
import Toast from "react-native-toast-message";
const create = () => {
  const {user, query, setQuery, openPicker, showToast,toastConfig} = useGlobalContext();
  const [readMore,setReadMore] = useState(false);
  const [typingTimeout, setTypingTimeout] = useState(null);
  const [stashed,setStashed] = useState("");
  const [form,setForm] = useState({
    name: "",
    max_attending : "1",
    date : new Date(),
    address : "",
    description : "",
    img : null,
    from : user?.username,
    current_attending: 0
  })
  const [selection, setSelection] = useState({ start: 0, end: 0});
  const [isModalVisible,setIsModalVisible] = useState(false);
  const [undoStates, setUndoStates] = useState([""]);
  const [unsavedChanges,setUnsavedChanges] = useState(false);

  useFocusEffect(
    useCallback(() => {
      return () => {
        if (unsavedChanges && !isModalVisible) {
          Alert.alert(
            "Elvéted a változtatásokat?",
            "Vannak nem mentett változtatásaid, biztosan el akarsz menni?",
            [
              { text: "Vissza", 
                style: "cancel", 
                onPress: () => {
                  router.push('/create');    
                } 
              },
              {
                text: "Elvet",
                style: "destructive",
                onPress: () => {
                  defaultSet();
                  setUnsavedChanges(false);
                }
              },
            ]
          );
        }
      }
    }, [unsavedChanges])
  );
  
  useEffect(() => {
    if(query) {
      setForm({...query, date : new Date(query.date), max_attending: query.max_attending, current_attending: parseInt(query.current_attending)});
      setUnsavedChanges(true);
    }
  }, [query])
  const defaultSet = () => {
    setForm({name: "", max_attending: "1", date : new Date(), address : "",
      description : "", img : null, from : user.username, current_attending: 0});
    setQuery(null);
  }
  const toggleModal = () => {
    setIsModalVisible((prev) => !prev);
  }
  const handleConfirm = (selectedDate) => {
    handleChanges();
    setForm({...form,date : selectedDate});
  }
  const handleImage = async (image) => {
    setForm({...form, img : image});
  }
  const submit = async () => {
    try{
      await createJob(form);
      await defaultSet();
      toggleModal();
      showToast("success","Sikeres Létrehozás");
    }
    catch(error){
      showToast("error","Hiba",error.message)
    }
  }
  const handleDelete = async () => {
    try{
      Alert.alert("Törlés","Biztos vagy benne?", [
        {text : "Vissza", style: "cancel"},
        {text : "Törlés", style: "destructive",
          onPress: async () => {
            await deleteJob(query?.id,query?.from);
            defaultSet();
          }
        }
      ])
    }
    catch(error){
      showToast("error","Hiba", error.message);
    }
  }
  const handleUpdate = async () => {
    try{
      const updatedFields = Object.fromEntries(
        Object.entries(form).filter(([key,value]) => {
          if(key === "date"){
            return new Date(value).toISOString() !== new Date(query[key]).toISOString()
          }
          
          return value !== query[key];
        })
      );
      if(Object.keys(updatedFields).length === 0){
        showToast("error","Nincs változás","Változtass meg benne valamit");
        return;
      }
      await updateJob(query?.id,updatedFields,query?.from);
      showToast("success","Sikeres szerkesztés");
      toggleModal();
    }
    catch(error){
      showToast("error","Hiba", error.message);
    }
  }
  const handleChanges = () =>{
    if(!unsavedChanges){
      setUnsavedChanges(true);
    }
  }
  return (
    <SafeAreaView className='h-full'>
      <ScrollView keyboardShouldPersistTaps="handled">
        <View className='w-[90%] self-center justify-center min-h-[65vh]'>
          <View className='flex-row mt-10'>
            <TouchableOpacity
              onPress={() => {
                router.replace('/(tabs)/home');
              }}
            >
              <Entypo name="chevron-thin-left" size={24} color="black" />
            </TouchableOpacity>
            <Text className='text-2xl font-pbold ml-2'>Hirdetés Készítése</Text>
          </View>
          <Text className='text-xl font-semibold mt-3 ml-2'>Cím</Text>
          <Formfield
            value={form.name}
            handleChangeText={(e) => {
              handleChanges();
              setForm({...form, name: e});
            }}
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
                  handleChangeText={(e) => {
                    setForm({...form, max_attending: e})
                    handleChanges();
                  }}
                  keyboardType={true}
                  inputType={true}
                />
              </View> 
              <View className='w-[10%]'>

              </View>
              <View className='w-[70%]'>
                <Formfield
                  value={form.address}
                  handleChangeText={(e) => {
                    setForm({...form, address: e});
                    handleChanges();
                  }}
                />
              </View>
          </View>
          <Text className='text-center font-psemibold text-xl mt-4'>Leírás</Text>
          <View className='border-b border-gray-300 mt-4'/>
              <ConvertType
                selection={selection}
                description={form.description}
                handleForm={(e) => {
                  setForm({...form,description: e});
                  handleChanges();
                }}
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
                  handleChanges();
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
            onPress={() => openPicker((image) => {
              handleImage(image);
              handleChanges();
            })}
            className='mt-6'
          > 
            {form.img? (
              <Image
                source={{uri: form.img}}
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
          {query && <CustomButton
            title="Törlés"
            handlePress={handleDelete}
            textStyles="text-white"
            containerStyles="bg-red-400 w-[95%] rounded-full mb-5"
          />
        }
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
          create={true}
        />
        <View className='w-full p-5 self-center bg-gray-50 relative flex-1'>
          <CustomButton
            title={query ? "Szerkesztés" : "Véglegesítése"}
            handlePress={query? handleUpdate : submit}
            textStyles="text-white"
            containerStyles={`${query ? "bg-teal-400" : "bg-primary"} w-[95%] rounded-full`}
          />
        </View>
        <Toast config={toastConfig}/>
      </Modal>
      <Toast config={toastConfig}/>
    </SafeAreaView>
  )
}

export default create