import { View, Text, Image, ImageBackground } from 'react-native'
import React, { useEffect, useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useGlobalContext } from '@/context/GlobalProvider'
import images from '@/constants/images'

const profile = () => {
  const {user} = useGlobalContext();
  const [imageUri, setImageUri] = useState(null);

  /* useEffect(() => {
    const fetchProfile =  async () => {
      const filePath = `${RNFS.DocumentDirectoryPath}/${fileName}`;
      const reader = new FileReader();
      const response = await blob();
    }
    fetchProfile();
  },[])
  useEffect(() => {
  }, [imageUri]) */

  return (
    <SafeAreaView className='h-full'>
      <View className='w-full border items-center'>
          <Image
            source={images.test}
            resizeMode='contain'
            className='w-full aspect-[4/3]'
          />
      </View>
    </SafeAreaView>
  )
}

export default profile