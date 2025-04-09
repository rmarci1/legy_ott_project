import React, { useEffect } from 'react'
import { SplashScreen, Stack } from 'expo-router'
import { useFonts } from 'expo-font';
import GlobalProvider from '@/context/GlobalProvider'

// A SplashScreen automatikus eltüntetése a betöltés után
SplashScreen.preventAutoHideAsync();

/**
 * A gyökér komponens, amely betölti a betűtípusokat és biztosítja a globális állapot kezelőt.
 * A képernyők kezelése a navigációs struktúrában történik.
 * 
 * - A betűtípusok betöltése után a SplashScreen elrejtésre kerül.
 * - A navigáció a `Stack` komponenssel történik, ahol különböző képernyők és azok beállításai találhatóak.
 * 
 * @returns {JSX.Element} - A gyökér komponenst tartalmazó JSX.
 */
const Rootlayout = () => {
   // Betűtípusok betöltése az Expo Font könyvtárból
  const [fontsLoaded,error] = useFonts({
    "Poppins-Black": require("../assets/fonts/Poppins-Black.ttf"),
    "Poppins-Bold": require("../assets/fonts/Poppins-Bold.ttf"),
    "Poppins-ExtraBold": require("../assets/fonts/Poppins-ExtraBold.ttf"),
    "Poppins-ExtraLight": require("../assets/fonts/Poppins-ExtraLight.ttf"),
    "Poppins-Light": require("../assets/fonts/Poppins-Light.ttf"),
    "Poppins-Medium": require("../assets/fonts/Poppins-Medium.ttf"),
    "Poppins-Regular": require("../assets/fonts/Poppins-Regular.ttf"),
    "Poppins-SemiBold": require("../assets/fonts/Poppins-SemiBold.ttf"),
    "Poppins-Thin": require("../assets/fonts/Poppins-Thin.ttf"),
    "Roboto-Black" : require("../assets/fonts/Roboto-Black.ttf"),
    "Roboto-Bold" : require("../assets/fonts/Roboto-Bold.ttf"),
    "Roboto-Light" : require("../assets/fonts/Roboto-Light.ttf"),
    "Roboto-Medium" : require("../assets/fonts/Roboto-Medium.ttf"),
    "Roboto-Regular" : require("../assets/fonts/Roboto-Regular.ttf"),
    "Roboto-Thin" : require("../assets/fonts/Roboto-Thin.ttf"),
  })
  // Betűtípusok betöltése után a SplashScreen eltűnik
  useEffect(() => {
    if (error) throw error
    if (fontsLoaded) SplashScreen.hideAsync();
  }, [fontsLoaded, error])

  // Ha a betűtípusok nem töltődtek be vagy hiba történt, nem jelenítjük meg a komponenst
  if (!fontsLoaded && !error) return null;
  return (
    <GlobalProvider>
      <Stack>
          <Stack.Screen name='index' options={{headerShown: false}} />
          <Stack.Screen name='(auth)' options={{headerShown: false}} />
          <Stack.Screen name='(tabs)' options={{headerShown: false}} />
          <Stack.Screen name='search/[query]' options={{headerShown: false}} />
          <Stack.Screen name='profileSearch/[search]' options={{headerShown: false}} />
          <Stack.Screen name='preferenceSearch/[pref]' options={{headerShown : false}}/>
          <Stack.Screen name='additions/settings' options={{ headerShown : false}} />
          <Stack.Screen name='additions/messageView' options={{ headerShown : false}} />
          <Stack.Screen name='additions/showProfiles' options={{ headerShown : false}} />
      </Stack>
    </GlobalProvider>
  )
}

export default Rootlayout