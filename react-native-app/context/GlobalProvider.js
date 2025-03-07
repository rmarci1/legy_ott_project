import { attending, getJobs, getSaved, getToken, getUser} from "@/lib/api";
import { router } from "expo-router";
import {createContext, useContext, useEffect, useState} from "react"
import { Alert } from "react-native";

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
    const [saved, setSaved] = useState(null);
    const [isSavedIn, setIsSavedIn] = useState(false);
    const [forwardTo, setForwardTo] = useState(null);
    const [query, setQuery] = useState(null);
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
                getSaved(result.username)
                .then((save) => {
                    if(save){
                        setSaved(save);
                        setIsSavedIn(true);
                    }
                    else{
                        setSaved(null);
                        setIsSavedIn(true);
                    }
                })
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
        toggleModal();
        router.push(`/profileSearch/${username}`);
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
                saved,
                setSaved,
                isSavedIn,
                setIsSavedIn,
                forwardTo,
                setForwardTo,
                handleSubmit,
                handleProfile,
                query,
                setQuery,
            }}
        >
            {children}
        </GlobalContext.Provider>
    )
}
export default GlobalProvider