import { View, Text, ScrollView, TouchableOpacity, Modal, TouchableWithoutFeedback, Keyboard } from 'react-native'
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import React, {useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useGlobalContext } from '@/context/GlobalProvider';
import images from '@/constants/images';
import { router, usePathname, useRouter } from 'expo-router';
import ShowJob from '@/components/ShowJob';
import { AntDesign, Fontisto, Ionicons } from '@expo/vector-icons';
import { TextInput } from 'react-native-gesture-handler';
import { LinearGradient } from 'expo-linear-gradient';
import SearchInput from '@/components/SearchInput';
import { StatusBar } from 'expo-status-bar';
import EmptyState from '@/components/EmptyState';
import { FlashList } from "@shopify/flash-list";
import JobDisplay from '@/components/JobDisplay';
import CustomButton from '@/components/CustomButton';
import PreferenceButton from '@/components/PreferenceButton';
import Formfield from '@/components/Formfield';
import { Presentation } from 'lucide-react-native';
import FilterView from '@/components/FilterView';

const home = () => {
  const {user,jobs,setJobs} = useGlobalContext();
  const query = "";
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isFilterModalVisible,setIsFilterModalVisible] = useState(false);
  const [currentJob,setCurrentJob] = useState(null);
  const [readMore,setReadMore] = useState(false);
  const toggleModal = () => {
    setIsModalVisible(!isModalVisible);
  }
  const toggleFilterModal = () => {
    setIsFilterModalVisible(!isFilterModalVisible);
  } 
  const pathname = usePathname();
  const handleProfile = (username) => {
    toggleModal();
    router.push(`/profileSearch/${username}`);
  }
  const renderItem = ({item}) => (
    <View key={item}>
        <TouchableOpacity
          onPress={() => {
            let curr = item.description.length;
            if(curr > 100){
              setReadMore(true);
            }
            setCurrentJob(item);
            toggleModal();
          }}
          activeOpacity={0.5}
        > 
            <JobDisplay
               key={item}
               item={item}
               image={images.google}
               imageStyles="w-20 h-20 bg-orange-100"
               containerStyles="border border-primary mt-6"
            />
        </TouchableOpacity>
    </View>
  )
  return (
    <TouchableWithoutFeedback
      onPress={() => Keyboard.dismiss()}
    >
    <SafeAreaView className='h-full items-center justify-center'>
      <GestureHandlerRootView className='flex-1'>
      <StatusBar style='dark'/>
      <View className='w-[90%] min-h-[100vh] self-center'>
      <View>
          <Text className='font-pmedium mt-5'>Szia, <Text className='font-pbold'>{user.name}!</Text></Text>
              <Text className='mt-2 text-2xl font-psemibold text-primary'>Találj egy Jó lehetőséget</Text>
            <View className='flex-row items-center mt-4'>
            <SearchInput
              initialQuery={query}
            />
            <TouchableOpacity
              className='w-14 h-14 bg-primary rounded-xl items-center justify-center ml-4'
              onPress={toggleFilterModal}
            >
              <Ionicons name="filter-sharp" size={30} color="white" />
            </TouchableOpacity>
          </View>
      </View>
      <FlashList
        data={jobs}
        renderItem={renderItem}
        estimatedItemSize={121}
        ListFooterComponent={<View style={{height: 100}}/>}
        ListEmptyComponent={() => (
          <View className='flex-1 items-center justify-center'>
            <EmptyState
              title="Sajnáljuk nincs jelenleg"
              substitle="lehetőség"
            />
          </View>
        )}
        />
       <Modal
        animationType='slide'  
        transparent={true}
        visible={isModalVisible}
        onRequestClose={toggleModal}
      >
        <ShowJob
          currentJob={currentJob}
          readMore={readMore}
          handleProfile={(username) => handleProfile(username)}      
          toggleModal={() => toggleModal()}
          title="Jelentkezés"
        />
        <View className='w-full p-5 self-center bg-gray-50 relative flex-1'>
          <CustomButton
            title="Jelentkezés"
            handlePress={() => {}}
            textStyles="text-white"
            containerStyles="bg-primary w-[95%]"
          />
        </View>
      </Modal>
      <Modal
        animationType='slide'  
        transparent={true}
        visible={isFilterModalVisible}
        onRequestClose={toggleFilterModal}
      >
        <ScrollView className='h-full'>
          <FilterView
            toggleFilterModal={toggleFilterModal}
          />
        </ScrollView>
      </Modal>
      </View>
    </GestureHandlerRootView> 
    </SafeAreaView>
  </TouchableWithoutFeedback>
  )
}

export default home