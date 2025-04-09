import { Text, TouchableOpacity } from 'react-native'
import React from 'react'

/**
 * Egy testreszabott gomb, amely a nyomásra reagál és opcionálisan letiltható.
 * 
 * @component
 * @param {Object} props - A komponenshez tartozó propok.
 * @param {Function} props.handlePress - A gombnyomás eseménykezelője.
 * @param {string} props.title - A gomb szövege.
 * @param {string} props.containerStyles - Az egyedi stílus a gomb tartalmazó elemére.
 * @param {string} props.textStyles - Az egyedi stílus a gomb szövegére.
 * @param {boolean} props.isLoading - Jelző, hogy a gomb töltés állapotban van-e, amely megváltoztatja a gomb kinézetét.
 * @returns {JSX.Element} A `CustomButton` komponens.
 */
const CustomButton = ({handlePress,title,containerStyles,textStyles,isLoading}) => {
  return (
    <TouchableOpacity
        onPress={handlePress}
        activeOpacity={0.7}
        className={`${containerStyles} rounded-3xl min-h-[60px] w-full justify-center items-center ${isLoading ? 'opacity-50' : ''}`}
        disabled={isLoading}
    >
        <Text className={`text-xl font-bold ${textStyles}`}>{title}</Text>
    </TouchableOpacity>
  )
}

export default CustomButton