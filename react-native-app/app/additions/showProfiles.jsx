import { View, Text, TouchableOpacity, Image, TextInput, ActivityIndicator } from 'react-native'
import React, { useEffect, useState } from 'react'
import { FlashList } from '@shopify/flash-list'
import { getAllProfiles } from '@/lib/api';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useGlobalContext } from '@/context/GlobalProvider';
import { router } from 'expo-router';
import { Feather } from '@expo/vector-icons';
import Toast from 'react-native-toast-message';

const showProfiles = () => {
    const { setProfileForMessage, showToast, toastConfig, } = useGlobalContext();
    const [profiles,setProfiles] = useState([]);
    const [filterProfiles,setFilterProfiles] = useState([]);
    const [isProfilesLoading,setIsProfilesLoading] = useState(false);
    const [search,setSearch] = useState("");
    useEffect(() => {
        const fetchProfiles = async () => {
            setIsProfilesLoading(true);
            await getAllProfiles()
            .then((res) => {
                if(res){
                    setProfiles(res);
                    setFilterProfiles(res);
                }
            })
            .catch((error) => {
                showToast("error","Hiba",error.message);
            })
            .finally(() => {
                setIsProfilesLoading(false);
            })
        }
        fetchProfiles();
    }, [])
    const handlePress = (profile) => {
        setProfileForMessage(profile);
        router.push("/additions/messageView");
    }
    const handleSearch = () => {
        const searchTerm = search.toLowerCase();
        const searchProfiles = profiles.filter((curr) => !curr.username.toLowerCase().contains(searchTerm) || !curr.name.toLowerCase().contains(searchTerm));
        setFilterProfiles(searchProfiles);
    }
    const renderProfiles = ({item}) => {
        return (
            <TouchableOpacity 
                  className="p-3 border-b border-gray-300 flex-row"
                  onPress={() => handlePress(item)}
            >
                <Image
                    source={{ uri: item?.profileImg }}
                    resizeMode="cover"
                    className="w-16 h-16 mt-1 rounded-full"
                />
                <View className='ml-4 justify-center'>
                    <Text className="text-xl color-[#1b1a57]">{item?.name.length > 25 ? item?.name.substring(0,25)+"..." : item?.name}</Text>
                    <Text className="color-[#1b1a57] font-plight">{item?.username.length > 25 ? item?.username.substring(0,25)+"..." : item?.username}</Text>
                </View>
            </TouchableOpacity>
        )
    }
    return (
        <SafeAreaView className='flex-1'>
            <View className='justify-center items-center mt-2 flex-row gap-4'>
                    <TextInput
                        className='border border-gray-200 rounded-full px-4 w-60'
                        placeholder='Keress rá valakire...'
                        value={search}
                        onChangeText={(e) => setSearch(e)}
                    />
                    <TouchableOpacity
                        onPress={() => handleSearch()}
                    >
                        <Feather name="search" size={24} color="black" />
                    </TouchableOpacity>
            </View>
            {isProfilesLoading ? <View className='min-h-[90vh] self-center justify-center items-center'><ActivityIndicator size={60}/></View> : 
            <View className='flex-1'>                  
                <FlashList
                    data={filterProfiles}
                    renderItem={renderProfiles}
                    estimatedItemSize={50}
                />
            </View>
        }
        <Toast config={toastConfig}/>
        </SafeAreaView>
    )
}

export default showProfiles