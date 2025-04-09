import { View, TouchableOpacity } from 'react-native'
import React from 'react'
import JobDisplay from './views/JobDisplay';

/**
 * Renderel egy adott munkát, amelyre kattintva a felhasználó részletes információkat kaphat.
 * 
 * @param {Object} item - A munka adatai (pl. description, title, etc.).
 * @param {function} toggleModal - A modal állapotát váltja (nyitja/zárja).
 * @param {function} handleReadMore - Beállítja, hogy a felhasználó el akarja-e olvasni a teljes leírást.
 * @param {function} handleCurrentJob - A kiválasztott munkát elmenti.
 * @param {boolean} created - Egy prop, ami jelzi, hogy a munka már létrejött-e.
 * 
 * @returns {JSX.Element} - A munka megjelenítését végző UI elem.
 */
const RenderJob = ({item,toggleModal,handleReadMore,handleCurrentJob,created}) => {
  return (
    <View key={item}>
        <TouchableOpacity
          onPress={() => {
            let curr = item.description.length;
            if (curr > 150) {
              handleReadMore(true);  // Ha a leírás túl hosszú, engedélyezzük a "Többet olvasni" funkciót
            }
            handleCurrentJob(item);  // A jelenlegi munkát elmentjük
            toggleModal();  // Megnyitjuk a modalt
          }}
          activeOpacity={0.5}
        > 
            <JobDisplay
               key={item}
               item={item}
               imageStyles="w-20 h-20 bg-orange-100"
               containerStyles="border border-primary mt-6"
               created={created}
            />
        </TouchableOpacity>
    </View>
  )
}

export default RenderJob