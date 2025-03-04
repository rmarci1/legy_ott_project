import { View, TextInput, TouchableOpacity, Alert } from 'react-native'
import React, { useState } from 'react'
import { router, usePathname } from 'expo-router'
import { AntDesign } from '@expo/vector-icons';
import { FilterJobsByName } from '@/lib/api';
import { useGlobalContext } from '@/context/GlobalProvider';

const SearchInput = ({initialQuery}) => {
  const {user,setQueryReturn} = useGlobalContext();
  const [query,setQuery] = useState(initialQuery || "")
  const [isFocused,setIsFocused] = useState(false);
  const pathname = usePathname();
  return (
    <View className={`flex flex-row items-center space-x-4 w-[80%] h-16 px-4 bg-black-100 rounded-2xl border-2 ${isFocused?
        'border-[#546ECC]' : 'border-gray-200'
    }`}>
        <TextInput
            className='text-base mt-0.5 text-black flex-1 font-pregular'
            value={query}
            placeholder='Keress egy lehetőséget'
            placeholderTextColor="#626262"
            onChangeText={(e) => setQuery(e)}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
        />
        <TouchableOpacity
            onPress={async () => {
                if (query === ""){
                    return Alert.alert("Nincs Keresés","Valamit Írj be hogy megtaláljuk neked a legjobb lehetőségeket!")
                }
                const res = await FilterJobsByName(query,user.username);
                setQueryReturn(res);
                if(pathname.startsWith('/search')) router.setParams({res});
                router.push(`/search/${query}`)
            }}
        >
            <AntDesign name="search1" size={24} color="black" />
        </TouchableOpacity>
    </View>
  )
}

export default SearchInput