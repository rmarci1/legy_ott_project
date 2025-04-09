import { View, Text, Image } from 'react-native'
import React from 'react'
import images from '@/constants/images'

/**
 * Egy üres állapotot megjelenítő komponens, amely akkor hasznos, ha nincs elérhető adat.
 * 
 * @component
 * @param {Object} props - A komponenshez tartozó propok.
 * @param {string} props.title - A fő üzenet szövege.
 * @param {string} props.substitle - Az alárendelt üzenet szövege.
 * @returns {JSX.Element} Az üres állapotot megjelenítő komponens.
 */
const EmptyState = ({title,substitle}) => {
  return (
    <View className='w-full justify-center items-center flex'>

        <Image
            resizeMode='cover'
            source={images.empty}
            className='w-[500px] h-[400px]'
        />
        <View className='flex-row items-center'>
            <Text className='font-pregular text-3xl text-center'>{title}<Text className='text-primary'> {substitle}</Text></Text>
        </View>
    
    </View>
  )
}

export default EmptyState