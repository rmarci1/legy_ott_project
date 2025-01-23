import { StyleSheet, TextInput, TouchableOpacity,View } from 'react-native';
import React, { useRef, useState } from 'react';
import { AntDesign, Entypo } from '@expo/vector-icons';

const Formfield = ({ title, otherStyles, value, placeholder, handleChangeText }) => {
  const [showPassword, setShowPassword] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  
  return (
    <View className={`space-y-2 ${otherStyles}`}>
      <View
        className={`border-2 w-full h-[64px] px-4 bg-[#F1F4FF] rounded-3xl items-center ${
          isFocused ? 'border-[#546ECC]' : 'border-gray-200'
        } flex-row`}
      >
        <TextInput
          className="flex-1 text-black"
          value={value}
          placeholder={placeholder}
          placeholderTextColor="#626262"
          onChangeText={handleChangeText}
          secureTextEntry={(placeholder === 'Jelszó' || placeholder === 'Jelszó megerősítése') && !showPassword}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
        />


        {(placeholder === 'Jelszó' || placeholder === 'Jelszó megerősítése') && (
          <TouchableOpacity onPress={() => setShowPassword(!showPassword)} className="ml-2">
            {!showPassword ? (
              <AntDesign name="eyeo" size={22} color="gray" />
            ) : (
              <Entypo name="eye-with-line" size={22} color="gray" />
            )}
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

export default Formfield;
