import { View, Text, TouchableOpacity, Image, TouchableWithoutFeedback, Animated, Easing } from 'react-native'
import React, { useRef } from 'react'
import { Heart } from "lucide-react-native";
import { updateSaved } from '@/lib/api';
import { useGlobalContext } from '@/context/GlobalProvider';
/**
 * A munkalehetőség adatainak megjelenítése és a kedvenc mentésére szolgáló komponens.
 * Lehetővé teszi a felhasználók számára, hogy megnézzenek egy munkalehetőséget, megmentsék, és a profiljára navigáljanak.
 * 
 */

/**
 * A `JobDisplay` komponenshez tartozó tulajdonságok.
 * @component
 * @property {string} containerStyles - A külső konténer stílusa.
 * @property {object} item - A megjelenítendő munkalehetőség adatai.
 * @property {string} imageStyles - A képre vonatkozó stílusok.
 * @property {string} nameStyle - A név megjelenítésének stílusa.
 * @property {string} titleStyle - A cím stílusa.
 * @property {string} dateStyle - A dátum stílusa.
 * @property {Function} handleJobProfile - A munkalehetőség profiljára való navigálás kezelése.
 * @property {boolean} createing - Ha a komponens éppen létrehozás alatt van.
 * @property {Function} handleSave - A mentés kezelése.
 * @property {Function} handleModal - A modal ablak kezelése.
 * @property {boolean} showJob - A munkalehetőség megjelenítésének engedélyezése.
 * @property {boolean} created - Ha a munkalehetőség már létrejött.
 * 
 * @returns {JSX.Element} A munkalehetőség megjelenítő komponens.
 */
const JobDisplay = ({containerStyles,item,imageStyles,nameStyle,titleStyle,dateStyle,handleJobProfile, createing, handleSave, handleModal, showJob, created}) => {
  const {setJobs,user}= useGlobalContext();
  const animatedValue = useRef(new Animated.Value(0.5)).current;
  const handleClick = async () => {
    // Animáció: szív megnyomása
     Animated.sequence([
       Animated.timing(animatedValue, {
         toValue: 1,
         duration: 300,
         easing: Easing.ease,
         useNativeDriver: false,
       }),
       Animated.timing(animatedValue, {
         toValue: 0.5,
         duration: 350,
         easing: Easing.ease,
         useNativeDriver: false,
       })
     ]).start();
     await update(item.profiles? !item.profiles[0]?.saveForLater : true);
    }
    const update = async (isLiked) => {
        // A mentett állapot frissítése
        await updateSaved(isLiked,item.id);
        setJobs((prevJobs) => prevJobs.map((job) => job.id !== item.id ? job : {...job, profiles: [{isApplied: false, saveForLater: isLiked}]}));
        if(handleSave) handleSave(isLiked);
        handleModal(isLiked);
    }
  return (
        <View className={`rounded-3xl px-2 justify-center ${containerStyles}`}>
          <View className='flex-row mt-2'>
            <View className={`rounded-full items-center justify-center ${imageStyles}`}>
                <Image
                    source={{uri : item?.img}}
                    resizeMode='cover'
                    className='w-14 h-14 mt-1 rounded-full'
                />
            </View>
            <View className='ml-2 w-[75%]'>
                <View className='flex-row justify-between'>
                  <TouchableOpacity
                    disabled={item?.from === user?.username || !showJob}
                    onPress={() => handleJobProfile(item.from)}
                    activeOpacity={0.7}
                  >
                    <Text className={`font-pregular ${nameStyle}`}>{item?.from.length>20 && !showJob ? item.from?.substring(0,20)+"...": item?.from}</Text>
                  </TouchableOpacity>
                  {(!createing && !created) && <TouchableWithoutFeedback
                    onPress={handleClick}
                  >
                  <Animated.View style={{
                    transform: [{
                      scale: animatedValue.interpolate({
                        inputRange: [0.5, 1],
                        outputRange: [1, 1.5],
                      })
                    }]
                  }} pointerEvents="box-none">
                    <Heart size={22} color={item.profiles && item.profiles[0]?.saveForLater ? "red" : "gray"} fill={item.profiles && item.profiles[0]?.saveForLater ? "red" : "none"} className='h-full'/>
                  </Animated.View>
                  </TouchableWithoutFeedback>}
                </View>
                <Text className={`font-pbold text-lg ${titleStyle}`}>{item?.name}</Text>
                <Text className={`font-pregula text-base ${dateStyle}`}><Text className='text-blue-400'>
                  {typeof item?.date === 'object' ? item?.date.toISOString().split('T')[0] : item?.date.split('T')[0]}</Text> × {item?.current_attending} / {item?.max_attending} fő
                </Text>
            </View>
        </View>
    </View>
  )
}
export default JobDisplay