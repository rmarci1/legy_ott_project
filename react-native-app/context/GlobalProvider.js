import { attending, getJobs, getSaved, getUser} from "@/lib/api";
import { router } from "expo-router";
import { createContext, useContext, useEffect, useState} from "react"
import { Alert } from "react-native";
import * as ImagePicker from 'expo-image-picker';
import Toast, { BaseToast } from "react-native-toast-message";
import { io } from "socket.io-client";
const GlobalContext = createContext()
export const useGlobalContext = () => useContext(GlobalContext)

const GlobalProvider = ({children}) => {
    
    const [formPart,setFormPart] = useState(null);  
    const [isLoggedIn,setIsloggedIn] = useState(null);
    const [user,setUser] = useState(null);
    const [isLoading,setIsLoading] = useState(false);
    const [jobs,setJobs] = useState(null);
    const [isJobsIn,setIsJobsIn] = useState(false);
    const [queryReturn,setQueryReturn] = useState(null);
    const [query, setQuery] = useState(null);
    const [profileForMessage,setProfileForMessage] = useState(null);
    useEffect(() => {
        getUser()
        .then((result)=>{
            if(result){
                setIsloggedIn(true);
                setUser(result);
                getJobs()
                .then((jobs) => {
                    if(jobs){
                        setJobs(jobs);
                        setIsJobsIn(true);
                    }
                    else{
                        setJobs(null);
                        setIsJobsIn(false);
                    }
                });
                const socket = io('http://192.168.10.89:3000', { transports: ['websocket'] });
                socket.emit('join', user.id);
            }
            else{
                setIsloggedIn(false);
                setUser(null);
                setJobs(null);
                setIsJobsIn(false);
            }
        })
        .catch((error) => {
            throw new Error(error.message);
        })
        .finally(() => {
            setIsLoading(false);
        })
    }, [])

    const handleSubmit = async (update,jobId) => {
        try{    
            await attending(jobId,update);
            setJobs((prevJobs) => prevJobs.filter((job) => job.id !== jobId));
        }
        catch(error){
            Alert.alert(error.message);
        }
    }
    const handleProfile = (username, toggleModal) => {
        if(toggleModal) toggleModal();
        router.push(`/profileSearch/${username}`);
    }
    const openPicker = async (handleChange) => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: 'images',
            allowsEditing: true,
            aspect: [2,3],
            quality : 0.3,
            })
        if (!result.canceled) {
        handleChange(result.assets[0].uri);
        }
    } 
    const showToast = (type,text,text2) => {
        Toast.show({
            type: "custom_toast",   
            text1: text,
            text2: text2,
            props: { type },         
        })
    }
    const toastConfig = {
        custom_toast: ({text1,text2, props}) => (
            <BaseToast
                style={{
                    borderLeftColor: props?.type == "error" ? "red" : "lime",
                    height: 60 + 20*((text2?.length? text2.length - 1 : 1)/47)
                }}
                contentContainerStyle={{
                    flexWrap: "wrap",               
                }}
                text1Style={{
                    color: "black",
                    fontSize: 16,
                }}
                text2Style={{
                    fontSize: 12,
                }}
                text1={text1}
                text2={text2}
                text2NumberOfLines={0}

            />
        )
    }
    const formatDate = (date) => {
        const currDate = new Date();
        currDate.setDate(currDate.getDate() - 1)
        if(new Date(date) > currDate){
          return date.split('T')[1].split(':').splice(0,2).join(':');
        }
        else {
          return date.split('T')[0].split('-').splice(1).join('-');
        }
    }
    return (
        <GlobalContext.Provider
            value = {{
                formPart,
                setFormPart,
                isLoggedIn,
                setIsloggedIn,
                user,
                setUser,
                isLoading,
                setIsLoading,
                jobs,
                setJobs,
                isJobsIn,
                setIsJobsIn,
                queryReturn,
                setQueryReturn,
                handleSubmit,
                handleProfile,
                query,
                setQuery,
                openPicker,
                showToast,
                toastConfig,
                profileForMessage,
                setProfileForMessage,
                formatDate
            }}
        >
            {children}
        </GlobalContext.Provider>
    )
}
export default GlobalProvider