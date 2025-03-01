import { getJobs, getSaved, getToken, getUser} from "@/lib/api";
import {createContext, useContext, useEffect, useState} from "react"

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
    const [historys,setHistorys] = useState(null);
    const [saved, setSaved] = useState(null);
    const [isSavedIn, setIsSavedIn] = useState(false);
    const [token,setToken] = useState(null);

    useEffect(() => {
        getUser()
        .then((result)=>{
            console.log(result);
            if(result){
                setIsloggedIn(true);
                setUser(result);
                getJobs(result.username)
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
            console.log(error)
        })
        .finally(() => {
            setIsLoading(false);
        })
    }, [])
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
                historys,
                setHistorys,
                token,
                setToken,
                saved,
                setSaved,
                isSavedIn,
                setIsSavedIn
            }}
        >
            {children}
        </GlobalContext.Provider>
    )
}
export default GlobalProvider