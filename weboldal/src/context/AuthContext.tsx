import {createContext, ReactNode, useContext, useEffect, useState} from "react";
import {User} from "../Types/User.ts";
import {Job} from "../Types/Job.ts";
import {
    attend, deleteJob,
    getAllJobs,
    getAvailableJobs, getSavedForLater,
    getUser,
    saveForLater
} from "../lib/api.ts";
import { io } from "socket.io-client";

interface AuthContextType {
    user: User | null,
    jobs: Job[],
    allJobs: Job[],
    savedJobs: Job[],
    isLoading: boolean,
    indexForConvert : number,
    setIsLoading: (value: boolean)=> void,
    kijelentkezes: () => void,
    bejelentkezes: (newUser: User) => void,
    setSave: (job: Job ,value: boolean) => void,
    attendJob: (id: number, value: boolean) => void,
    deleteJobById: (id: number) => void,
    getAll: () => void,
    checkUser: () => void,
    isListUser: (list: (Job | User)[]) => Promise<boolean>,
    isUser: (list: Job | User) => Promise<boolean>,
    setIndexForConvert: (index : number) => void,
    formatDate: (date: string) => string,
    highlightText : (text: string, searchTerm: string) => React.JSX.Element,
}
interface AuthContextTypeProps {
    children : ReactNode;
}
export const useGlobalContext = () => {
    const context = useContext(AuthContext);
    return context;
}
const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({children} : AuthContextTypeProps) => {
    const [user, setUser] = useState<User | null>(null);
    const [indexForConvert,setIndexForConvert] = useState<number>(0);
    const [isLoading, setIsLoading] = useState(true);
    const [allJobs, setAllJobs] = useState<Job[]>([]);
    const [savedJobs, setSavedJobs] = useState<Job[]>([]);
    const [jobs, setJobs] = useState<Job[]>([])
    useEffect(() => {
        setIsLoading(true);
        getUser()
        .then((result) => {
            if(result && result.profile){
                setUser(result.profile);
                getAllJobs()
                .then((jobs) => {
                    if(jobs){
                        setJobs(jobs);
                    }
                });
            }
        })
        .catch((error) => {
            throw new Error(error.message);
        })
        .finally(() => {
            setIsLoading(false);
        })
    },[])
    const getAll = () => {
        setIsLoading(true)
        getAllJobs()
            .then((res) =>{
                setAllJobs(res);
            });
        setIsLoading(false)
    }

    const bejelentkezes = async (newUser: User) =>{
        setIsLoading(true)
        setUser({
            ...newUser
        });
        await resetJobs();
        setIsLoading(false)
    }

    const checkUser = async () => {
        setIsLoading(true)
        try{
            const user = await getUser().then((res) => { return res.profile })
            if (!user){
                alert("Nincs bejelentkezve");
            }
            await bejelentkezes(user);
            setIsLoading(false)
        }
        catch {
            kijelentkezes()
            setIsLoading(false)
        }
    }

    const resetJobs = async () => {
        setIsLoading(true)
        setJobs(await getAvailableJobs());
        await userSavedJobs();
        await userArchivedJobs();
        await userArchivedAds();
        setIsLoading(false)
    }

    const kijelentkezes = () =>{
        setIsLoading(true)
        setUser(null);
        getAll()
        setIsLoading(false)
    }
    const setSave = async (job: Job ,value: boolean) => {
        setIsLoading(true)
        await saveForLater(job.id, value);

        await resetJobs();
        setIsLoading(false)
    }

    const attendJob = async (id: number, value: boolean) => {
        setIsLoading(true)
        await attend(id, value);

        await resetJobs()
        setIsLoading(false)
    }

    const userSavedJobs = async () => {
        setIsLoading(true);
        setSavedJobs(await getSavedForLater());
        setIsLoading(false);
    }

    const userArchivedJobs = async () => {
        setIsLoading(true);

        setIsLoading(false);
    }

    const userArchivedAds = async () => {
        setIsLoading(true);

        setIsLoading(false);
    }
    const isListUser = async (list: (User | Job)[]) : Promise<boolean> => {
        return Array.isArray(list) && list.every(item => 'name' in item && 'username' in item);
    }
    const isUser = async (item: User | Job) : Promise<boolean> => {
        return 'name' in item && 'username' in item;
    }

    const deleteJobById = async (id: number) => {
        await deleteJob(id);
        await resetJobs();
    }

    const formatDate = (date : string) : string => {
        const currDate = new Date();
        currDate.setDate(currDate.getDate() - 1)
        if(new Date(date) > currDate){
          return date.split('T')[1].split(':').splice(0,2).join(':');
        }
        else {
          return date.split('T')[0].split('-').splice(1).join('-');
        }
    }

    const highlightText = (text : string, searchTerm: string) : React.JSX.Element => {
        let elements = [];
        let dontHighlight = "";
        let buffer = "";
        let matchIndex = 0;
        for (let index = 0; index < text.length; index++) {
            if(text[index].toLowerCase() === searchTerm[matchIndex]){
                buffer += text[index];
                matchIndex++;
                if(matchIndex === searchTerm.length){
                    if(dontHighlight)elements.push(<span key={elements.length}>{dontHighlight}</span>);
                    elements.push(<span key={elements.length} className="text-green-600">{buffer}</span>);
                    buffer = "";
                    matchIndex = 0;
                    dontHighlight = "";
                }
            }
            else{
                if(buffer){
                    elements.push(<span key={elements.length}>{dontHighlight}</span>);
                    elements.push(<span key={elements.length}>{buffer}</span>);
                    dontHighlight = "";
                    buffer = "";
                    matchIndex = 0;
                }
                dontHighlight+=text[index];
            }
        }
        if (dontHighlight){
            elements.push(<span key={elements.length}>{dontHighlight}</span>)
        }
        if (buffer) {
            elements.push(<span key={elements.length}>{buffer}</span>);
        }
        return <span>{elements}</span>;
    }
    return (
        <AuthContext.Provider
            value = {{
                user,
                jobs,
                allJobs,
                isLoading,
                savedJobs,
                indexForConvert,
                setIsLoading,
                kijelentkezes,
                bejelentkezes,
                checkUser,
                setSave,
                attendJob,
                deleteJobById,
                getAll,
                isListUser,
                isUser,
                setIndexForConvert,
                formatDate,
                highlightText,
            }}
        >
            {children}
        </AuthContext.Provider>
            )
}

export const useAuth = (): AuthContextType =>{
    const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within a AuthProvider");
  }
  return context;
}
