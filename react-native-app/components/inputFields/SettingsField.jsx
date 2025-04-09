import { View, Text, TextInput, TouchableOpacity } from 'react-native'
import React, { useState } from 'react'
import { AntDesign, Ionicons } from '@expo/vector-icons'
/**
 * @typedef {Object} SelectionRange
 * @property {number} start - A kijelölés kezdete
 * @property {number} end - A kijelölés vége
*/

/**
 * @typedef {Object} SettingsFieldProps
 * @property {string} title - A mező címe.
 * @property {string} value - A TextInput aktuális értéke.
 * @property {(value: string) => void} handleChangeText - Callback a szöveg változására.
 * @property {string} containerStyles - Tailwind osztályok a külső konténerhez.
 * @property {boolean} multiline - Többsoros legyen-e az input.
 * @property {() => void} handleUpdate - Callback frissítés ikonra nyomáskor.
 * @property {boolean} editable - Engedélyezett-e a szerkesztés.
 * @property {boolean} showArrow - Megjelenjen-e a nyíl gomb.
 * @property {() => void} handleArrowPress - Callback nyíl gomb nyomására.
 * @property {(selection: SelectionRange) => void} handleSelection - Callback, ha a kurzor/kijelölés pozíciója változik.
 */

/**
 * Beállításokhoz tartozó újrafelhasználható beviteli mező.
 * @component
*
 * @param {SettingsFieldProps} props - A komponens propjai.
 */
const SettingsField = ({title, value, handleChangeText, containerStyles, multiline, handleUpdate, editable, showArrow, handleArrowPress, handleSelection}) => {
  const [arrowState,setArrowState] = useState(editable);
  return (
    <View className={`${containerStyles}`}>
        {title && <Text className='text-xl font-extrabold text-white'>{title}</Text>}
        <View className={`relative bg-gray-800 border-b-2 border-x border-white rounded-xl p-2 mt-4 ${!multiline && "h-[64px]"} ${showArrow && "min-h-28"}`}>
        <TextInput
            editable= {editable}
            value={value}
            onChangeText={(e) => handleChangeText(e)}
            className={`text-white text-lg ml-2 font-plight pr-10 flex-1`}
            onSelectionChange={({nativeEvent : {selection}}) => handleSelection(selection)}
            multiline={multiline}
        />
        {(!showArrow || arrowState) &&
          <TouchableOpacity
              onPress={handleUpdate}
              className='absolute bottom-6 right-2'
          >
              <Ionicons name="pencil" size={24} color="white" className='mr-1' />
          </TouchableOpacity>
        }

        { showArrow && 
          <TouchableOpacity
            className = {`absolute ${arrowState? "top-4" : "bottom-6"} right-4`}
            onPress = {() => {
              setArrowState((prev) => !prev);
              handleArrowPress();
            }}
          > 
            <AntDesign name={arrowState? "caretup" : "caretdown"} size={20} color="white" />
          </TouchableOpacity>
        }

        </View>
    </View>
  )
}

export default SettingsField