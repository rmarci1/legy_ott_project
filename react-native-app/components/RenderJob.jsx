import { View, Text, TouchableOpacity } from 'react-native'
import React from 'react'
import JobDisplay from './views/JobDisplay';
import { useGlobalContext } from '@/context/GlobalProvider';

const RenderJob = ({item,toggleModal,handleReadMore,handleCurrentJob,created}) => {
  return (
    <View key={item}>
        <TouchableOpacity
          onPress={() => {
            let curr = item.description.length;
            if(curr > 150){
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
               imageStyles="w-20 h-20 bg-orange-100"
               containerStyles="border border-primary mt-6"
               created={created}
            />
        </TouchableOpacity>
    </View>
  )
}

export default RenderJob