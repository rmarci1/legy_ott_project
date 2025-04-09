import { View, Text, TouchableOpacity } from 'react-native'
import React from 'react'
import { AntDesign } from '@expo/vector-icons'

/**
 * Az időintervallumokhoz kapcsolódó napok számának visszaadása.
 * 
 * @param {string} title - Az intervallum neve (pl. "3 nap", "1 hét", stb.)
 * @returns {number | null} - A napok száma, vagy `null`, ha nem található.
 */
const getDays = (title) => {
    if(title === "3 nap"){
      return 3;
    }
    else if(title === "1 hét"){
      return 7;
    }
    else if(title === "2 hét"){
      return 14;
    }
    else if(title === "1 hónap"){
      return 31;
    }
    else{
      return null;
    }
}
/**
 * Az egyes gombok renderelését végző függvény.
 * 
 * @param {string} item - Az adott gomb címkéje.
 * @param {number} index - Az elem indexe.
 * @param {boolean} isFocused - A gomb kiemelése (ha kiválasztott).
 * @param {function} handlePress - A gombra kattintás eseménye.
 * @param {string} type - A típus, hogy helyet (location) vagy napokat (days) kezelünk.
 * @returns {JSX.Element} - A renderelt gomb.
 */

const renderItem = (item,index,isFocused,handlePress,type) => {
  return (
  <TouchableOpacity
    key={index}
    className={`bg-[#292929] border-2 ${isFocused? 'border-primary' : 'border-[#292929]'} justify-center px-4 py-3 h-14 rounded-lg self-start`}
    onPress={() => type === "location" ? handlePress(item) : handlePress(getDays(item),item)}
  > 
    {item === "X" ? <AntDesign name="close" size={24} color="white" /> : <Text className='text-white text-lg font-pmedium'>{item}</Text>}
  </TouchableOpacity>
  )
}

/**
 * A preferenciák gombjait megjelenítő komponens.
 * 
 * @param {Array<string>} titles - A megjelenítendő gombok címkéi.
 * @param {function} handlePress - A gombra kattintás eseménye.
 * @param {string} givenDay - A kiválasztott nap intervallum.
 * @param {string} type - A típus, amely meghatározza, hogy helyet vagy napokat kezelünk.
 * @returns {JSX.Element} - A preferenciák gombjait tartalmazó komponens.
 */

const PreferenceButton = ({titles,handlePress, givenDay, type}) => {
  return (
    <View className='flex-row flex-wrap w-[85%] mt-5 self-center gap-2 gap-y-4'>
        {titles?.map((item, index) => renderItem(item, index, givenDay? item===givenDay : false, handlePress, type))}
    </View>
  )
}

export default PreferenceButton