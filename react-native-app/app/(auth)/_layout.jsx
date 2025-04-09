import React from 'react'
import { Stack } from 'expo-router'
import { StatusBar } from 'expo-status-bar'
/**
 * Az alkalmazás navigációs layoutja, amely a képernyők közötti navigációt kezeli.
 * 
 * @returns {JSX.Element} A navigációs stack és a státusz sáv renderelése.
 */
const _layout = () => {
  return (
    <>
        <Stack>
            <Stack.Screen name='welcome' options={{ headerShown:false }} />
            <Stack.Screen name='login' options={{ headerShown:false }} />
            <Stack.Screen name='signup' options={{ headerShown:false }} />       
        </Stack>
        <StatusBar style='dark'></StatusBar>
    </>
  )
}

export default _layout