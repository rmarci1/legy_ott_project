import { View, Text, Image,TouchableOpacity,  ScrollView, Animated, TextInput} from 'react-native'
import React, { useEffect, useRef, useState } from 'react'
import { useGlobalContext } from '@/context/GlobalProvider'
import { AntDesign, Feather } from '@expo/vector-icons'
import * as ImagePicker from 'expo-image-picker';
import Formfield from '@/components/Formfield';
import CustomButton from '@/components/CustomButton';
import ConvertType from '@/components/ConvertType';
import ProfileView from '@/components/ProfileView';

const profile = () => {
  const {user,setUser} = useGlobalContext();
  useEffect(() => {
    setUser({...user, leiras: "Egy vidám és kíváncsi ember vagyok, aki mindig keresi az új kihívásokat és élményeket. \n" +
      "Szeretek kreatívan gondolkodni, új dolgokat tanulni, és persze jókat nevetni.\n\n"+
      "Ha épp nem valami izgalmas projektbe mélyedek, akkor valószínűleg egy jó könyvvel"+
      "töltöm az időmet. Ha épp nem valami izgalmas projektbe mélyedek, akkor valószínűleg egy jó könyvvel, zenével vagy egy csésze kávéval találkozol velem.\nImádok utazni, felfedezni új helyeket, és megismerni más kultúrákat."+
      "Mindig nyitott vagyok egy jó beszélgetésre, szóval ha van egy jó sztorid vagy egy érdekes ötleted, oszd meg velem!"
    });
  }, []);
  
 /* const [imageUri, setImageUri] = useState(null);
  const fetchProfile = async () => {
    try{
      const response = await GetProfilePic();
      const imageUrl = URL.createObjectURL(response);
      setImageUri(imageUrl);
    }
    catch(error){
      throw new Error(error);
    }
  }*/
  return (
      <View className='h-full relative'>
      <ScrollView className='flex-1' keyboardShouldPersistTaps="handled">
      {/*<StatusBar translucent backgroundColor='transparent'/>*/}
        <ProfileView
          user={user}
          isView={false}
        />
      </ScrollView>
      </View>
  )
}

export default profile