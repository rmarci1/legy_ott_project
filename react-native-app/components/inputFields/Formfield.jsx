import { StyleSheet, Text, TextInput, TouchableOpacity,View } from 'react-native';
import React, { useRef, useState } from 'react';
import { AntDesign, Entypo, Feather } from '@expo/vector-icons';
import DateTimePicker from 'react-native-modal-datetime-picker';
/**
 * @typedef {Object} FormfieldProps
 * @property {string} title - A mező címe (jelenleg nincs használatban a UI-ban, de propként átadható).
 * @property {string} [otherStyles] - Egyedi tailwind stílusok a mezőhöz.
 * @property {string | Date} value - Az input aktuális értéke vagy kiválasztott dátum.
 * @property {string} placeholder - A placeholder szöveg.
 * @property {(val: string | Date) => void} handleChangeText - Callback az érték változására.
 * @property {boolean} [date] - Ha igaz, a mező egy dátumválasztó lesz.
 * @property {boolean} [keyboardType] - Ha igaz, numerikus billentyűzetet használ.
 * @property {boolean} [inputType] - Ha igaz, numerikus input módot használ.
 * @property {boolean} [multiline] - Többsoros input legyen-e.
 * @property {string} [bgcolor] - Tailwind színosztály a háttérszínhez.
 * @property {string} [bordercolor] - Tailwind színosztály a szegélyszínhez.
 * @property {string} [dateTextStyles] - Tailwind szövegstílusok a dátum szövegéhez.
 * @property {string} [dateColor] - A naptár ikon színe.
 */

/**
 * Újrafelhasználható bemeneti mező komponens.
 * Lehet hagyományos `TextInput`, jelszómező vagy dátumválasztó is.
 *
 * @component
 * @param {FormfieldProps} props - A `Formfield` komponens propjai.
 */
const Formfield = ({ title, otherStyles, value, placeholder, handleChangeText, date, keyboardType, inputType, multiline, bgcolor,bordercolor, dateTextStyles, dateColor}) => {
  const [showPassword, setShowPassword] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const [showDatePicker,setShowDatePicker] = useState(false)
  return (
    <View className={`space-y-2 ${otherStyles}`}>
      <View
        className={`border-2 w-full h-[64px] px-4 ${bgcolor? bgcolor : "bg-[#F1F4FF]"} rounded-3xl items-center ${
          isFocused ? 'border-[#546ECC]' : bordercolor? bordercolor  :'border-gray-200'
        } flex-row ${date && 'justify-between'}`}
      >
        {!date && <TextInput
          className="flex-1 text-black"
          keyboardType={keyboardType ? "numeric" : "keyboard"}
          inputMode={inputType? "numeric" : "text"}
          value={value}
          placeholder={placeholder}
          placeholderTextColor="#626262"
          onChangeText={handleChangeText}
          secureTextEntry={(placeholder === 'Jelszó' || placeholder === 'Jelszó megerősítése') && !showPassword}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          multiline={multiline? true : false}
        />}
        {(placeholder === 'Jelszó' || placeholder === 'Jelszó megerősítése') && (
          <TouchableOpacity onPress={() => setShowPassword(!showPassword)} className="ml-2">
            {!showPassword ? (
              <AntDesign name="eyeo" size={22} color="gray" />
            ) : (
              <Entypo name="eye-with-line" size={22} color="gray" />
            )}
          </TouchableOpacity>
        )}
        {date && <View className="flex-row">
          <Text className={`text-xl font-pmedium flex-1 ${dateTextStyles}`}>{value? value.toISOString().split('T')[0]:""}</Text>
          <TouchableOpacity
            onPress={() => setShowDatePicker(true)}
          >
            <Feather name="calendar" size={24} color={dateColor? dateColor : "black"} className='mr-3 text-right'/>
          </TouchableOpacity>  
          <DateTimePicker
            isVisible={showDatePicker}
            mode="date"
            onConfirm={(selectedDate) => {
              setShowDatePicker(false);
              handleChangeText(new Date(selectedDate));                
            }}
            onCancel={() => setShowDatePicker(false)}
          />
        </View>}
      </View>
    </View>
  );
};

export default Formfield;
