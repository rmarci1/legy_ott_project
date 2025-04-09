import { View, Text, TouchableOpacity } from 'react-native'
import React, { useEffect, useState } from 'react'
import { FontAwesome } from '@expo/vector-icons';
import { useGlobalContext } from '@/context/GlobalProvider';

/**
 * Az értékelések megjelenítésére szolgáló komponens.
 * 
 * @param {Object} item - Az értékelés adatai (pl. reviewer_un, review, desc).
 * @param {function} handleProfile - Függvény, amely a felhasználói profilra navigál.
 * @returns {JSX.Element} - Az értékelést tartalmazó UI komponens.
 */
const Rating = ({item,handleProfile}) => {
  const {user} = useGlobalContext();
  const [showMoreRating,setShowMoreRating] = useState(false);
  const [readMoreRating,setReadMoreRating] = useState(false);

  // Ellenőrizzük, hogy a leírás hosszú-e, és beállítjuk a 'readMoreRating' értékét.
  useEffect(() => {
    if(item.desc?.length > 100){
        setReadMoreRating(true);  // Ha a leírás hosszabb, mint 100 karakter, akkor engedélyezzük a bővítést
    }
  })
  return (
    <View key={item} className='mt-5 w-[90%] self-center'>
      <View className='flex-row justify-between items-center'>
      <TouchableOpacity
        disabled={user.username === item.reviewer_un}
        className='w-[70%]'
        onPress={() => handleProfile(item.reviewer_un)}
      >
        <Text className='text-blue-400 font-plight text-lg'>{item.reviewer_un}</Text>
      </TouchableOpacity>
      <View className='flex-row w-[30%]'>
        <FontAwesome name="star" size={18} color={item.review>=1 ? "aqua" : "white"} />
        <FontAwesome name="star" size={18} color={item.review>=2 ? "aqua" : "white"} className='mx-1' />
        <FontAwesome name="star" size={18} color={item.review>=3 ? "aqua" : "white"} />
        <FontAwesome name="star" size={18} color={item.review>=4 ? "aqua" : "white"} className='mx-1' />
        <FontAwesome name="star" size={18} color={item.review==5 ? "aqua" : "white"} />
      </View>
      </View><TouchableOpacity
        disabled={!readMoreRating}
        onPress={() =>setShowMoreRating(!showMoreRating)}
        activeOpacity={0.5}
      >
        <Text className='text-white font-pmedium mt-4'>{(readMoreRating && !showMoreRating)? item.desc.substring(0,50)+"..." : item.desc}</Text>
      </TouchableOpacity>
    </View>
  )
}

export default Rating