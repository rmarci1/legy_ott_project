import { Text, TouchableOpacity, View } from 'react-native'
import React from 'react'
import { useGlobalContext } from '@/context/GlobalProvider'
import Toast, { BaseToast } from 'react-native-toast-message';
import { SafeAreaView } from 'react-native-safe-area-context';

const anotherone = () => {
  const showToast = (text) => {
      Toast.show({
        type: "success",   
        text1: text,
        text1Style:{
          fontSize: 16
        }
      })
  }
  const toastConfig = {
    custom_toast: (props) => (
      <BaseToast
        {...props}
        style={{ borderLeftColor: "lime"}}
        contentContainerStyle={{ backgroundColor: "black" }}
        text1Style={{ color: "white", fontWeight: "bold" }}
      />
    ),
  };
  return (
    <SafeAreaView>
      <TouchableOpacity
        onPress={() => showToast("Sikeres feltöltés")}
      >
        <Text>Press me</Text>
      </TouchableOpacity>
      <Toast config={toastConfig}/>
    </SafeAreaView>
  )
}

export default anotherone