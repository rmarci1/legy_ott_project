import { View,ScrollView} from 'react-native'
import React from 'react'
import { useGlobalContext } from '@/context/GlobalProvider'
import ProfileView from '@/components/ProfileView';

const profile = () => {
  const {user,setUser} = useGlobalContext();

  return (
      <View className='h-full relative'>
      <ScrollView className='flex-1' keyboardShouldPersistTaps="handled">
      {/*<StatusBar translucent backgroundColor='transparent'/>*/}
        <ProfileView
          viewed_user={user}
          isView={false}
        />
      </ScrollView>
      </View>
  )
}

export default profile