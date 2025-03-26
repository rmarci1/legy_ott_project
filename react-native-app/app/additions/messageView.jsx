import { View, Text, RefreshControl, ActivityIndicator, Image, TextInput, TouchableOpacity, Keyboard } from 'react-native'
import React, { useEffect, useRef, useState } from 'react'
import { createMessage, getMessages } from '@/lib/api';
import { useGlobalContext } from '@/context/GlobalProvider';
import { SafeAreaView } from 'react-native-safe-area-context';
import { io } from 'socket.io-client';
import { FlashList } from '@shopify/flash-list';
import { AntDesign, Entypo, Feather, FontAwesome, MaterialIcons } from '@expo/vector-icons';
import Toast from 'react-native-toast-message';
import MessageState from '@/components/views/MessageState';

const messageView = () => {
  const {user, showToast, toastConfig, profileForMessage, handleProfile} = useGlobalContext();
  const [messages, setMessages] = useState([]);
  const [formMessage,setFormMessage] = useState("");
  const [isMessage,setIsMessage] = useState(true);
  const socket = io('http://192.168.10.89:3000', { transports: ['websocket'] });
  const [refreshing,setRefreshing] = useState(false);
  const flashListRef = useRef(null);
  useEffect(() => {
    const fetchMessage = async () => {
        await socket.connect();
        await getMessages(user.id, profileForMessage.id)
        .then((res) => {
          if(res){
            setMessages(res);
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
      if (flashListRef?.current && messages.length > 0) {
        setTimeout(() => {
          flashListRef.current.scrollToEnd({ animated: true });
        }, 100); 
      }
    }) 
    return () => {
      keyboardDidShowListener.remove();
    };
  }, []);
  useEffect(() => {
    socket.emit('join', user.id);

    const handleMessage = (message) => {
        console.log("received message: ", message);
        setMessages((prev) => [...prev, message]);
    };

    socket.on('message', handleMessage);

    return () => {
        socket.off('message', handleMessage);
    };
}, [user.id]);
  useEffect(() => {
    if(flashListRef.current && messages.length > 0){
      setTimeout(() => {
        if (flashListRef.current && messages.length > 0) {
          flashListRef.current.scrollToEnd({ animated: true });
        }
      }, 100);
    }
  }, [messages]);
  const onRefresh = () => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 1000);
  };
  const sendMessage = async () => {
    if(!formMessage){
      showToast("error","Hiba","Írj be valamit...");
      return;
    }
    try{
      await socket.emit('message', { senderId: user.id, receiverId: profileForMessage?.id, content: formMessage, createdAt: new Date() });
      const res = await createMessage({senderId: user?.id, receiverId: profileForMessage?.id, content: formMessage});
      setMessages((prev) => [...prev, res]);
      setFormMessage("");
    }
    catch(error){
      showToast("error","Hiba",error.message);
    }
  };
  const renderItem = ({item}) => {
    return (
      <MessageState
        isSender={item.senderId === user.id }
        item={item}
        containerStyles="mt-3"
      />
    )
  }
  return (
    <SafeAreaView className='flex-1'>
      <View className='h-16 justify-center items-center'>
        <View className='w-[95%] flex-row items-center justify-between'>
          <View className='flex-row items-center'>
            <AntDesign name="arrowleft" size={24} color="gray" />
            <Image
              source={{ uri: user.profileImg }}
              resizeMode="cover"
              className="w-12 h-12 rounded-full mx-3"
            />
            <TouchableOpacity
              onPress={() => handleProfile(profileForMessage.username)}
            >
              <Text className='text-lg'>{profileForMessage.name}</Text>
            </TouchableOpacity>
          </View>
          <View className='flex-row items-center gap-6'>
            <MaterialIcons name="call" size={22} color="black" />
            <FontAwesome name="video-camera" size={22} color="black" />
            <Entypo name="dots-three-vertical" size={22} color="black" />
          </View>
        </View>
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
            ListEmptyComponent={() => (
              <View className='min-h-[80vh] self-center items-center justify-center'>
                  <Text className='text-center'>Még nincsenek üzeneteitek</Text>
                  <Text className='text-center'>Írj <Text className='text-blue-500'>valamit...</Text></Text>
              </View>
            )}
          />
        )}
      </View>

      <View className='absolute bottom-0 left-0 right-0 bg-white border-t border-gray-300 p-3'>
        <View className='w-[95%] self-center flex-row items-center'>
          <TouchableOpacity
          >
            <AntDesign name="plus" size={24} color="black"/>
          </TouchableOpacity>
          <TextInput
            className='flex-1 ml-4 p-2 rounded-3xl max-h-24 border border-gray-100'
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
      <Toast config={toastConfig}/>
    </SafeAreaView>
  )
}

export default messageView