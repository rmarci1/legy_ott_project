import { View,ScrollView} from 'react-native'
import React from 'react'
import { useGlobalContext } from '@/context/GlobalProvider'
import ProfileView from '@/components/ProfileView';

const profile = () => {
  const {user,setUser} = useGlobalContext();
  
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
          viewed_user={user}
          isView={false}
        />
      </ScrollView>
      </View>
  )
}

export default profile