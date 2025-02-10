import { View, Text, SafeAreaView, TouchableOpacity, Image, Alert,Animated, Easing } from 'react-native'

import React, { useEffect, useMemo, useRef, useState } from 'react'
import Formfield from '@/components/Formfield'
import CustomButton from '@/components/CustomButton';
import images from '@/constants/images';
import { router } from 'expo-router';
import { useGlobalContext } from '@/context/GlobalProvider';
import { registerpart1 } from '@/lib/api';

const signup = () => {
  const {formpart,setFormPart} = useGlobalContext();

  const [form,setForm] = useState({
    email : '',
    password : '',
    confirmPassword : ''
  });
  const [currentProblem,setCurrentProblem] = useState("");
  const [isSubmitting,setIsSubmitting] = useState(false);
  const [message,setMessage] = useState('');
  const [progress,setProgress] = useState(0);
  const getActiveColor = (type) => {
    if (type === "Erős") return "#3FBB60"
    else if (type === "Közepes") return "#FE804D"
    else return "#FF0054";
  }
  const handlePassword = (passwordValue) => {
    let strengthChecks = {
      length : 0,
      hasUpperCase: false,
      hasLowerCase: false,
      hasDigit: false,
      hasSpecialChar: false
    }
    strengthChecks.length = passwordValue.length >= 8 ? true : false;
    strengthChecks.hasUpperCase = /[A-Z]+/.test(passwordValue);
    strengthChecks.hasLowerCase = /[a-z]+/.test(passwordValue);
    strengthChecks.hasDigit = /[0-9]+/.test(passwordValue);
    strengthChecks.hasSpecialChar= /[^A-Za-z0-9]+/.test(passwordValue);
  
    let verifiedList = Object.values(strengthChecks).filter((value) => value)
    let strength =
      verifiedList.length === 5 ? "Erős"
      : verifiedList.length >= 3 ? "Közepes" : "Gyenge";
    setCurrentProblem(strengthChecks.length? "Minimum 8 hosszúságúnak kell lennie a jelszónak" : strengthChecks.hasUpperCase? "Kell lennie 1 nagybetűnek a jelszóban" : 
      strengthChecks.hasLowerCase? "Kell lennie 1 kisbetűnek a jelszóban" : strengthChecks.hasDigit? "Kell lennie 1 számnak a jelszóban" : strengthChecks.hasSpecialCha? 
      "Kell lennie egy speciális karakternek a jelszóban pl(%/@)" : ""
    );
    setProgress(verifiedList.length);
    setMessage(strength);
    setForm({...form, password : passwordValue})
  }
  const submit = async () => {
    try{
      await registerpart1(form.email,form.password,form.confirmPassword);
      if(progress != 5){
        console.log(currentProblem);
        Alert.alert("Hiba", currentProblem);
        return;
      }
      
      setIsSubmitting(true);
      setFormPart(form);
      console.log("asd")
      router.push('/welcome');
    }
    catch(error){
      Alert.alert("Hiba",error.message);
    }
    finally{
      setIsSubmitting(false);
    }
  }
  const animatedValue = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    Animated.timing(animatedValue, {
      toValue: progress / 5,
      duration: 500,
      easing: Easing.ease,
      useNativeDriver: false,
    }).start();
  }, [progress]);

  const animatedStyle = useMemo(() => {
    return {
      width: animatedValue.interpolate({
        inputRange: [0, 1],
        outputRange: ['0%', '100%'],
      }),
      backgroundColor: getActiveColor(message)
    };
  }, [animatedValue,message]);
  return (
    <SafeAreaView className='h-full'>
      <View className='w-full min-h-[85vh] flex-1 justify-center items-center'>
        <Text className='font-pbold color-primary text-3xl mt-8'>Regisztráció</Text>
        <Text className='font-pmedium text-xl mt-4 text-center w-[85%]'>Csinálj egy fiókot hogy felvedeszd az új lehetőségeidet!</Text>
        <Formfield
          placeholder="Email"
          value={form.email}
          handleChangeText={(e) => setForm({...form, email : e})}
          otherStyles="w-[85%] mt-14"
        />
        <Formfield
          placeholder="Jelszó"
          value={form.password}
          handleChangeText={(e) => {handlePassword(e)}}
          otherStyles="w-[85%] mt-10"
        />
        <View className='w-[80%] h-[0.25rem] rounded-md relative overflow-hidden bg-[#fbfbfb]'>
          <Animated.View style={animatedStyle} className={`h-full w-[80%]`}>

          </Animated.View>
        </View>
        {form.password.length !==0 && 
          <Text className='mt-3 font-psemibold' style={{color:getActiveColor(message)}}>A jelszód {message}</Text>
        }
        <Formfield
          placeholder="Jelszó megerősítése"
          value={form.confirmPassword}
          handleChangeText={(e) => setForm({...form, confirmPassword : e})}
          otherStyles="w-[85%] mt-10"
        />
        <View className='w-[85%]'> 
          <CustomButton 
            title="Regisztráció"
            containerStyles="mt-10 bg-primary drop-shadow-lg"
            textStyles="text-white"
            handlePress={submit}
          />
        </View>
         <TouchableOpacity
          onPress={() => router.navigate('/(auth)/login')}
        >
          <Text className='font-psemibold text-[#494949] mt-10'>Már van fiókom</Text>
        </TouchableOpacity>
        <Text className='text-primary font-psemibold mt-20'>----------- Vagy folytasd -----------</Text>
        <TouchableOpacity
          className='flex-row items-center justify-center mt-8 bg-gray-200 h-[56px] w-[85%] rounded-2xl'
        > 
          <Image
            source={images.google}
          />
          <Text className='text-lg font-rmedium ml-2'>Google</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  )
}

export default signup