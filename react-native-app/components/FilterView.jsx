import { View, Text, TouchableOpacity, Alert } from 'react-native'
import React, { useState } from 'react'
import { LinearGradient } from 'expo-linear-gradient';
import { AntDesign, Fontisto } from '@expo/vector-icons';
import { TextInput } from 'react-native-gesture-handler';
import PreferenceButton from './PreferenceButton';
import Formfield from './Formfield';
import CustomButton from './CustomButton';
import { router, usePathname } from 'expo-router';

const FilterView = ({toggleFilterModal}) => {
    const [preferences, setPreferences] = useState({
        location : "",
        date : "",
        datebetween: { start: null, end: null }
    })
    const [focused, setFocused] = useState("");
    const [currentButtonFocused,setCurrentButtonFocused] = useState("");
    const handlePreference = () => {
        if(!preferences.location && !preferences.date && !preferences.datebetween.start){
            Alert.alert("Hiba","Kérjük válassz egy feltételt!");
            return;
        }
        toggleFilterModal();
        router.push({ pathname: `/preferenceSearch/pref`, params : { data : JSON.stringify(preferences)}, });
    }
    return (
        <View className='items-center justify-center min-h-[98%]'>
                <LinearGradient
                colors={['#1a1a2e', '#16213e', '#0f3460']}
                start={{x:0, y:0.5}}
                end={{x:1, y:1}}
                className='w-[95%] h-full'
                style={{
                    borderRadius: 30
                }}
                > 
                <Text className='text-white font-psemibold mt-8 text-center text-lg'>Állítsd be a preferenciáidat</Text>
                <View className={`bg-[#292929] h-14 w-[90%] self-center rounded-lg mt-4 flex-row items-center border ${focused == "helyszín" ? "border-primary" : "border-[#292929]"}`}>
                    <Fontisto name="search" size={20} color="rgb(227,224,233)" className='ml-[5%]'/>
                    <TextInput
                    placeholder='helyszín'
                    placeholderTextColor='#626262'
                    value={preferences.location}
                    onChangeText={(e) => setPreferences({...preferences, location:e})}
                    onFocus={() => setFocused("helyszín")}
                    onBlur={() => setFocused("")}
                    className='text-[rgb(227,224,233)] flex-1'
                    />
                </View>
                <View className='flex-row flex-wrap w-[85%] mt-5 self-center gap-2 gap-y-4'>
                    <PreferenceButton
                    title="Budapest"
                    handlePress={() => setPreferences({...preferences, location : "Budapest"})}
                    />
                    <PreferenceButton
                    title="Debrecen"
                    handlePress={() => setPreferences({...preferences, location : "Debrecen"})}
                    />
                    <PreferenceButton
                    title="Szeged"
                    handlePress={() => setPreferences({...preferences, location : "Szeged"})}
                    />
                    <PreferenceButton
                    title="Győr"
                    handlePress={() => setPreferences({...preferences, location : "Győr"})}
                    />
                    <PreferenceButton
                    title="Veszprém"
                    handlePress={() => setPreferences({...preferences, location : "Veszprém"})}
                    />
                </View>
                <View className='w-[90%] self-center'>
                    <Text className='text-white font-psemibold mt-8 text-lg'>Dátum</Text>
                    <Formfield
                    otherStyles="mt-3"
                    bgcolor="bg-[#292929]"
                    bordercolor="border-white"
                    dateColor="white"
                    date={true}
                    dateTextStyles="text-white"
                    handleChangeText={(e) => {
                        setPreferences({...preferences, date: e, datebetween: { start:null, end:null }});
                        setCurrentButtonFocused("");
                    }}
                    value={preferences.date}
                    />
                    <View className='flex-row flex-wrap mt-4 gap-2 gap-y-4'>
                    <PreferenceButton
                        title="Következő 3 nap"
                        isFocused={currentButtonFocused === "3 nap"}
                        handlePress={() => {
                        const endDate = new Date();
                        endDate.setDate(endDate.getDate() + 3)
                        setPreferences({...preferences, date: null, datebetween:{ start: new Date(), end: endDate}})
                        setCurrentButtonFocused("3 nap");
                        }}
                    />
                    <PreferenceButton
                        title="1 hét"
                        isFocused={currentButtonFocused === "1 hét"}
                        handlePress={() => {
                        const endDate = new Date();
                        endDate.setDate(endDate.getDate() + 7)
                        setPreferences({...preferences, date:null, datebetween:{ start: new Date(), end: endDate}})
                        setCurrentButtonFocused("1 hét");
                        }}
                    />
                    <PreferenceButton
                        title="2 hét"
                        isFocused={currentButtonFocused === "2 hét"}
                        handlePress={() => {
                        const endDate = new Date();
                        endDate.setDate(endDate.getDate() + 14)
                        setPreferences({...preferences,date:null,datebetween:{ start: new Date(), end: endDate}})
                        setCurrentButtonFocused("2 hét");
                        }}
                    />
                    <PreferenceButton
                        title="1 hónap"
                        isFocused={currentButtonFocused === "1 hónap"}
                        handlePress={() => {
                        const endDate = new Date();
                        endDate.setDate(endDate.getDate() + 31);
                        setPreferences({...preferences,date:null,datebetween:{ start: new Date(), end: endDate}});
                        setCurrentButtonFocused("1 hónap");
                        }}
                    />
                    <PreferenceButton
                        title="X"
                        handlePress={() => {
                        setPreferences({...preferences, date:null, datebetween: { start : null, end: null }});
                        setCurrentButtonFocused("");
                        }}
                    />
                    </View>
                </View>
                <TouchableOpacity
                    onPress={toggleFilterModal}
                    className='absolute right-4 top-4 h-7 w-7 bg-[#292929] opacity-70 rounded-3xl items-center justify-center'
                >
                    <AntDesign name="close" size={18} color="white"/>
                </TouchableOpacity>
                <View
                    className='w-full self-center relative flex-1 justify-end p-5'
                >
                    <CustomButton
                    handlePress={handlePreference}
                    containerStyles="bg-[#38E078]"
                    title="Keresés"
                    />
                </View>
                </LinearGradient>
            </View>
    )
}

export default FilterView