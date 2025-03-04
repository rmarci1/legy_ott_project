import { View, Text, TouchableOpacity } from 'react-native'
import React from 'react'
import JobDisplay from './JobDisplay';

const RenderJob = ({item,toggleModal,handleReadMore,handleCurrentJob}) => {
  return (
    <View key={item}>
        <TouchableOpacity
          onPress={() => {
            let curr = item.description.length;
            if(curr > 100){
              handleReadMore(true);
            }
            handleCurrentJob(item);
            toggleModal();
          }}
          activeOpacity={0.5}
        > 
            <JobDisplay
               key={item}
               item={item}
               image={item.img}
               imageStyles="w-20 h-20 bg-orange-100"
               containerStyles="border border-primary mt-6"
            />
        </TouchableOpacity>
    </View>
  )
}

export default RenderJob