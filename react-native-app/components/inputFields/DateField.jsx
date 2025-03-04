import { View, Text, TouchableOpacity } from 'react-native'
import React, { useState } from 'react'
import DateTimePicker from 'react-native-modal-datetime-picker'
import Feather from '@expo/vector-icons/Feather';
const DateField = ({title,handleConfirm,date}) => {
    const [showDatePicker, setShowDatePicker] = useState(false)
    return (
        <View className='ml-5 mt-4'>
            <Text className='text-gray-300 text-2xl font-psemibold mb-2 ml-2 text-center'>{title}</Text>

            <View>
                <View className='w-full border-2 border-purple-400 bg-black-100 h-14 flex-row justify-between items-center'>
                    <Text className='text-gray-300 font-pmedium text-xl ml-3'>{date.toISOString().split('T')[0]}</Text>
                    <TouchableOpacity
                        onPress={() => setShowDatePicker(true)}
                    >
                        <Feather name="calendar" size={24} color="white" className='mr-3'/>
                    </TouchableOpacity>
                </View>
            </View>
            <DateTimePicker
                    isVisible={showDatePicker}
                    mode="date"
                    onConfirm={(selectedDate) => {
                        setShowDatePicker(false);
                        handleConfirm(selectedDate);                
                    }}
                    onCancel={() => setShowDatePicker(false)}
                />
        </View>
    )
}

export default DateField