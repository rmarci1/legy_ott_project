import { View, Text, RefreshControl, ActivityIndicator, Image, TextInput, TouchableOpacity, Keyboard } from 'react-native'
import React, { useEffect, useRef, useState } from 'react'
import { createMessage, getMessages } from '@/lib/api';
import { useGlobalContext } from '@/context/GlobalProvider';
import { SafeAreaView } from 'react-native-safe-area-context';
import { io } from 'socket.io-client';
import { FlashList } from '@shopify/flash-list';
import { Feather, FontAwesome5 } from '@expo/vector-icons';

const messageView = () => {
    const {user, showToast, toastConfig, profileForMessage} = useGlobalContext();
    const [messages, setMessages] = useState([]);
    const [formMessage,setFormMessage] = useState("");
    const [isMessage,setIsMessage] = useState(true);
    const socket = io('http://192.168.10.89:3000', { transports: ['websocket'] });
    const [refreshing,setRefreshing] = useState(false);
    const flashListRef = useRef(null);
    useEffect(() => {
    const fetchMessage = async () => {
        await getMessages(user.id, profileForMessage.id)
        .then((res) => {
          if(res){
            setMessages(res);
            if(flashListRef?.current){
              flashListRef?.current.scrollToEnd({ animated: true });
            }
          }
        })
        .catch((error) => {
          showToast("error","Hiba",error.message);
        })
        .finally(() => {
          setIsMessage(false);
        })
    }
    setIsMessage(true);
    fetchMessage()
  }, []);
  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener("keyboardDidShow", () => {
      if (flashListRef?.current) {
        setTimeout(() => {
          flashListRef.current.scrollToEnd({ animated: true });
        }, 100); 
      }
    }) 
    return () => {
      keyboardDidShowListener.remove();
    };
  });
  useEffect(() => {
    socket.on('message', (message) => {
      setMessages((prev) => [...prev, message]);
    });

    return () => socket.disconnect();
  }, []);
  const onRefresh = () => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 1000);
  };
  const sendMessage = async () => {
    try{
      await socket.emit('message', { senderId: user.id, receiverId: profileForMessage?.id, content: formMessage });
      const res = await createMessage({senderId: user?.id, receiverId: profileForMessage?.id, content: formMessage});
      setMessages((prev) => [...prev, res]);
      flashListRef.current.scrollToEnd({ animated: true });

    }
    catch(error){
      showToast("error","Hiba",error.message);
    }
  };
  const renderItem = ({item}) => {
    return (
      <View className='mt-3'>
      {item.senderId === user.id ? (
        <View className='w-full flex-row justify-end'>
          <View className="bg-[#2F80ED] max-w-[60%] self-end px-4 py-2 rounded-s-md rounded-l-md mr-2">
            <Text className='text-white'>{item.content}</Text>
          </View>
         
        </View>
      ) : (
        <View className='w-full flex-row'>
          <View className='items-end justify-end mx-2'>
            <Image
              source={{ uri: user.profileImg }}
              resizeMode="cover"
              className="w-8 h-8 rounded-full"
            />
          </View>
          <View className="bg-gray-200 max-w-[60%] self-end px-4 py-2 rounded-s-md rounded-r-md">
            <Text>{item.content}</Text>
          </View>
        </View>
      )}
    </View>
    )
  }
  return (
    <SafeAreaView className='flex-1'>
      <View className='flex-1'>
        
      </View>
      <View className='flex-1'>
        {isMessage ? (
          <View className='flex-1 items-center justify-center'>
            <ActivityIndicator size={60}/>
          </View>
        ) : (
          <FlashList
            ref={flashListRef}
            data={messages}
            renderItem={renderItem}
            keyExtractor={(item, index) => index.toString()}
            estimatedItemSize={50}
            refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
            contentContainerStyle={{ paddingBottom: 80 }}
          />
        )}
      </View>

      <View className='absolute bottom-0 left-0 right-0 bg-white border-t border-gray-300 p-3'>
        <View className='w-[90%] self-center flex-row items-center'>
          <FontAwesome5 name="smile" size={30} color="gray" />     
          <TextInput
            className='flex-1 border-gray-50 ml-4 p-2 rounded-lg max-h-24'
            placeholder='Írj egy üzenetet...'
            value={formMessage}
            onChangeText={(e) => setFormMessage(e)}
            multiline
          />
          <TouchableOpacity 
            className='ml-2 h-12 w-12 rounded-full bg-[#2F80ED] items-center justify-center'
            onPress={sendMessage}
          >
            <Feather name="send" size={18} color="white" className='self-center rounded-full'/>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  )
}

export default messageView