import { View, TouchableOpacity} from 'react-native'
import React from 'react'
import { AntDesign, Entypo, Feather, FontAwesome5, FontAwesome6, MaterialCommunityIcons } from '@expo/vector-icons'
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
            {
                name === "Message" && (
                    <MaterialCommunityIcons name="chat" size={30} color={color} />               
                )
            }

        </View>
    )
  }
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