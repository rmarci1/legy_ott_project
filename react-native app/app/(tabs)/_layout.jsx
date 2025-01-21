import { View, Text, Platform, TouchableOpacity} from 'react-native'
import React from 'react'
import { AntDesign, Entypo, Feather, FontAwesome5, FontAwesome6 } from '@expo/vector-icons'
import { router, Tabs } from 'expo-router'
import { StatusBar } from 'expo-status-bar'
const TabIcon = ({color,name,focused,containerStyles}) =>{
    return (
        <View className="items-center justify-center gap-2 w-12 h-12 absolute top-1/2">
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
            
            <Text className={`${focused? "font-psemibold": "font-pregular"} text-xs`} style={{color:color}}>
                  {name}
            </Text>
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
                    backgroundColor: '#161622',
                    borderTopWidth: 1,
                    borderTopColor: '#232522',
                    height: 80,
                    width: "90%",
                    borderRadius: 90,
                    alignSelf: 'center',
                    bottom: 15
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
                <View className="justify-center items-center bg-gray-800">
                    <View
                        className="w-14 h-14 bg-blue-500 absolute bottom-1/2 items-center justify-center"
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
        <StatusBar backgroundColor='#161622' style='light'/>
    </>
  )
}

export default _layout