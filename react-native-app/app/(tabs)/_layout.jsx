import { View } from 'react-native'
import React from 'react'
import { AntDesign, Entypo, Feather, FontAwesome5, FontAwesome6, MaterialCommunityIcons } from '@expo/vector-icons'
import { Tabs } from 'expo-router'
import { StatusBar } from 'expo-status-bar'
/**
 * Tab ikonok komponensének props típusai
 * @typedef {Object} TabIconProps
 * @property {string} color Az ikon színe
 * @property {string} name Az ikon neve (tab neve alapján)
 * @property {boolean} focused Meghatározza, hogy a tab aktív-e
 * @property {string} [containerStyles] Opcionális stílusok, amelyeket hozzáadhatunk az ikonhoz
 */

/**
 * Tab ikon komponens.
 * Az ikonokat a tab neve alapján jeleníti meg, és a színük az aktív tab színéhez igazodik.
 * 
 * @param {TabIconProps} props A komponens bemeneti paraméterei
 * @returns {JSX.Element} Az ikonokat tartalmazó JSX elem
 */
const TabIcon = ({color,name,focused,containerStyles}) =>{
    return (
        <View className="items-center justify-center gap-2 w-12 h-12 relative top-1/3">
            {
              name === "Home" && (
                <Entypo name="home" size={26} color={color} />
              )
            }
            {
              name === "Anot" && (
                <FontAwesome6 name="shop" size={26} color={color} />
              )
            }
            {
              name === "Profile" && (
                <Feather name="user" size={26} color={color} />
              )
            }
            {
              name === "List" && (
                <FontAwesome5 name="tasks" size={26} color={color} />
              )
            }
            {
                name === "Message" && (
                    <MaterialCommunityIcons name="chat" size={30} color={color} />               
                )
            }
        </View>
    )
}
/**
 * A fő layout, amely tartalmazza a tab bar-t és az egyes képernyőket.
 * A tab bar egyedi ikonjai és stílusa van.
 * 
 * @returns {JSX.Element} Az alkalmazás fő layout-ja
 */
const _layout = () => {
  return (
    <>  
    <StatusBar style='dark'/>
        <Tabs
            screenOptions={{
                tabBarShowLabel: false,
                tabBarActiveTintColor : '#60a5f6',
                tabBarInactiveTintColor: 'white',
                tabBarStyle: {
                    backgroundColor: '#1e1b4b',
                    height: 60,
                    width: "90%",
                    borderRadius: 90,
                    alignSelf: 'center',
                    marginBottom: 25,
                    alignItems:'center'
                }
            }}
        >
        <Tabs.Screen
        name='home'
        options={{
            title : 'Home',
            headerShown : false,
            tabBarIcon: ({color,focused}) => (
                <TabIcon
                    color={color}
                    name="Home"
                    focused={focused}
                />
            ),
        }}
        />
        <Tabs.Screen
        name='list'
        options={{
            title : 'List',
            headerShown : false,
            tabBarIcon: ({color,focused}) => (
                <TabIcon
                    color={color}
                    name="List"
                    focused={focused}
                />
            ),
        }}
        />
        <Tabs.Screen
        name='create'
        options={{
            title : 'Create',
            headerShown : false,
            tabBarIcon: () => (
                <View className="justify-center items-center">
                    <View
                        className="w-16 h-16 bg-red-500 relative top-1/4 items-center justify-center"
                        style={{
                        transform: [{ rotate: '45deg' }],
                        }}
                    >   
                        <View style={{transform: [{rotate: '-45deg'}]}}>
                            <AntDesign name="plus" size={30} color="white" />
                        </View>
                    </View>
                </View>
            ),
        }}
        />
        <Tabs.Screen
        name='message'
        options={{
            title : 'Message',
            headerShown : false,
            tabBarIcon: ({color,focused}) => (
                <TabIcon
                    color={color}
                    name="Message"
                    focused={focused}
                />
            ),
        }}
        />
        <Tabs.Screen
        name='profile'
        options={{
            title : 'Profile',
            headerShown : false,
            tabBarIcon: ({color,focused}) => (
                <TabIcon
                    color={color}
                    name="Profile"
                    focused={focused}
                />
            ),
        }}
        />
        </Tabs>
    </>
  )
}

export default _layout