import { View, Text, Platform, TouchableOpacity} from 'react-native'
import React from 'react'
import { AntDesign, Entypo, Feather, FontAwesome5, FontAwesome6 } from '@expo/vector-icons'
import { router, Tabs } from 'expo-router'
import { StatusBar } from 'expo-status-bar'
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
            

        </View>
    )
  }
const _layout = () => {
  return (
    <>  
        <Tabs
            screenOptions={{
                tabBarShowLabel: false,
                tabBarActiveTintColor : '#60a5f6',
                tabBarInactiveTintColor: 'white',
                tabBarStyle: {
                    backgroundColor: '#1e1b4b',
                    borderTopWidth: 1,
                    borderTopColor: '#232522',
                    height: 60,
                    width: "90%",
                    borderRadius: 90,
                    alignSelf: 'center',
                    bottom: 25
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
        name='anotherone'
        options={{
            title : 'Anot',
            headerShown : false,
            tabBarIcon: ({color,focused}) => (
                <TabIcon
                    color={color}
                    name="Anot"
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
                        <TouchableOpacity
                            onPress={() => router.push('/(tabs)/create')}
                        >
                        <View style={{transform: [{rotate: '-45deg'}]}}>
                            <AntDesign name="plus" size={30} color="white" />
                        </View>
                        </TouchableOpacity>
                    </View>
                </View>
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
        <StatusBar style='dark'/>
    </>
  )
}

export default _layout