import { getJobs, getUser} from "@/lib/api";
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
    useEffect(()=>{
        getUser()
        .then((res)=>{
            setIsLoading(true);
            if(res){
                setIsloggedIn(true);
                setUser(res.profile);
            }
            else{
                setIsloggedIn(false);
                setUser(null);
            }
        })
        .catch((error) => {
            console.log(error)
        })
        getJobs()
        .then((res) => {
            if(res){
                setJobs(res);
                setIsJobsIn(true);
            }
            else{
                setJobs(null);
                setIsJobsIn(false);
            }
        })
        .catch((error) => {
            console.log(error);
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
            }}
        >
            {children}
        </GlobalContext.Provider>
    )
}
export default GlobalProvider