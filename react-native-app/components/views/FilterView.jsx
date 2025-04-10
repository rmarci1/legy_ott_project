import { View, Text, TouchableOpacity, Alert } from 'react-native'
import React, { useState } from 'react'
import { LinearGradient } from 'expo-linear-gradient';
import { AntDesign, Fontisto } from '@expo/vector-icons';
import { TextInput } from 'react-native-gesture-handler';
import PreferenceButton from '../PreferenceButton';
import Formfield from '../inputFields/Formfield';
import CustomButton from '../CustomButton';
import { router, usePathname } from 'expo-router';

/**
 * A szűrő beállításait és keresési lehetőségeket tartalmazó komponens.
 * A felhasználó választhat helyet, dátumot és időintervallumot.
 * 
 * A `FilterView` komponenshez tartozó tulajdonságok.
 * @component
 * @property {Function} toggleFilterModal - A szűrő modal ablak megnyitásáért és bezárásáért felelős függvény.
 * @property {object} currPreferences - A kezdeti preferenciák, amelyeket a szűrőablak használ.
 * @property {Function} handleReload - A szűrés után újratöltést végző függvény.
 * @returns {JSX.Element} A szűrő beállító felületet megjelenítő komponens.
 */
const FilterView = ({toggleFilterModal, currPreferences, handleReload}) => {
    const [preferences, setPreferences] = useState(currPreferences || {
        location : "",
        date : "",
        datebetween: { start: null, end: null },
        betweenDay : " "
    })
    const [focused, setFocused] = useState("");
    const pathname = usePathname();
    /**
     * A szűrő beállítások érvényesítése és a megfelelő oldalra való navigálás.
     */
    const handlePreference = () => {
        if(!preferences.location && !preferences.date && !preferences.datebetween.start){
            Alert.alert("Hiba","Kérjük válassz egy feltételt!");
            return;
        }
        toggleFilterModal();
        if(pathname.startsWith("/preferenceSearch")) {
            router.setParams({data : JSON.stringify(preferences)});
            handleReload();
        }
        else router.push({ pathname: `/preferenceSearch/pref`, params : { data : JSON.stringify(preferences)}, });
    }
    const list = ["Budapest","Debrecen","Szeged","Győr","Veszprém"]
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
                        titles={list}
                        handlePress={(location) => setPreferences({...preferences, location : location})}
                        type="location"
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
                            setPreferences({...preferences, betweenDay: "", date: e, datebetween: { start:null, end:null }});
                        }}
                        value={preferences.date}
                    />
                    <View className='flex-row flex-wrap mt-4 gap-2 gap-y-4'>
                    <PreferenceButton
                        titles={["3 nap", "1 hét", "2 hét", "1 hónap"]}
                        givenDay={preferences.betweenDay}
                        handlePress={(day,title) => {
                            const endDate = new Date();
                            endDate.setDate(endDate.getDate() + day)
                            if(title){
                                setPreferences({...preferences,betweenDay: title, date: null, datebetween:{ start: new Date(), end: endDate}})
                            }
                            else{
                                setPreferences({...preferences, betweenDay: "", date:null, datebetween: { start : null, end: null }});
                            }
                        }}
                        type="date"
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