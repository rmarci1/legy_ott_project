import { View, Text, Image } from 'react-native'
import React from 'react'
import { useGlobalContext } from '@/context/GlobalProvider'

const MessageState = ({ isSender, containerStyles, item }) => { 
    const { formatDate, user } = useGlobalContext();
    return (
      <View className={`w-full flex-row ${containerStyles} ${isSender && "justify-end"}`}>
        {!isSender && (
          <View className='items-end justify-end mx-2'>
            <Image
              source={{ uri: user.profileImg }}
              resizeMode="cover"
              className="w-8 h-8 rounded-full"
            />
          </View>
        )}
        
        <View className={`${isSender ? "bg-[#2F80ED] rounded-l-md mr-2" : "bg-gray-200 rounded-r-md"} max-w-[60%] self-end px-4 py-2 rounded-s-md`}>
          <Text className={`${isSender && "text-white"}`}>{item.content}</Text>
          <Text className="text-right text-sm">{formatDate(item.createdAt)}</Text>
        </View>
      </View>
    );
  }

export default MessageState