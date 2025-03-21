import {createContext, ReactNode, useContext, useEffect, useState} from "react";
import {User} from "../Types/User.ts";
import {Job} from "../Types/Job.ts";
import {
    attend, deleteJob,
    getAdvertised,
    getAllJobs, getArchivedAds, getArchivedJobs,
    getAvailableJobs, getAverageRating,
    getProfile, getSavedForLater,
    getSelectedJobs,
    getUser,
    saveForLater
} from "../lib/api.ts";
import {Advertiser} from "../Types/Advertiser.ts";

interface AuthContextType {
    user: User | null,
    jobs: Job[],
    allJobs: Job[],
    selectedJobs: Job[],
    ads: Job[],
    savedJobs: Job[],
    archivedJobs: Job[],
    archivedAds: Job[],
    advertiser: Advertiser | null,
    isLoading: boolean,
    isProfilePicChanged: boolean,
    setIsLoading: (value: boolean)=> void,
    kijelentkezes: () => void,
    bejelentkezes: (newUser: User) => void,
    profilKepUpdate: (url: string, user: User) => void,
    setSave: (job: Job ,value: boolean) => void,
    attendJob: (id: number, value: boolean) => void,
    deleteJobById: (id: number) => void,
    getAll: () => void,
    getAdvertiserProfile: (username: string) => void,
    checkUser: () => void,
    isListUser: (list: (Job | User)[]) => Promise<boolean>,
    isUser: (list: Job | User) => Promise<boolean>,
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
    const [isLoading, setIsLoading] = useState(true);
    const [isProfilePicChanged, setIsProfilePicChanged] = useState(false);
    const [allJobs, setAllJobs] = useState<Job[]>([]);
    const [selectedJobs, setSelectedJobs] = useState<Job[]>([])
    const [ads, setAds] = useState<Job[]>([])
    const [savedJobs, setSavedJobs] = useState<Job[]>([]);
    const [archivedJobs, setArchivedJobs] = useState<Job[]>([])
    const [archivedAds, setArchivedAds] = useState<Job[]>([]);
    const [advertiser, setAdvertiser] = useState<Advertiser | null>(null);
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
                })
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
        await userSelectedJobs()
        await userAdvertisedJobs();
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

    const profilKepUpdate = (url: string, user: User) =>{
        setIsLoading(true)
        setIsProfilePicChanged(false);
        setUser({
            ...user,
            profileImg: url
        })
        setIsProfilePicChanged(true);
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

    const userSelectedJobs = async () => {
        setIsLoading(true)
        setSelectedJobs(await getSelectedJobs().then((res) => {
            return res
        }))
        setIsLoading(false)
    }

    const userAdvertisedJobs = async () => {
        setIsLoading(true);
        setAds(await getAdvertised());
        setIsLoading(false);
    }

    const userSavedJobs = async () => {
        setIsLoading(true);
        setSavedJobs(await getSavedForLater());
        setIsLoading(false);
    }

    const userArchivedJobs = async () => {
        setIsLoading(true);
        setArchivedJobs(await getArchivedJobs());
        setIsLoading(false);
    }

    const userArchivedAds = async () => {
        setIsLoading(true);
        setArchivedAds(await getArchivedAds());
        setIsLoading(false);
    }

    const getAdvertiserProfile = async (username: string) =>{
        setIsLoading(true)
        setAdvertiser({
            ...(await getProfile(username)),
            averageRating: await getAverageRating(username).then((res) => {
                return res._avg.review;
            })
        });
        setIsLoading(false)
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


    return (
        <AuthContext.Provider
            value = {{
                user,
                jobs,
                allJobs,
                advertiser,
                isLoading,
                isProfilePicChanged,
                selectedJobs,
                ads,
                savedJobs,
                archivedJobs,
                archivedAds,
                setIsLoading,
                kijelentkezes,
                bejelentkezes,
                checkUser,
                profilKepUpdate,
                setSave,
                attendJob,
                deleteJobById,
                getAll,
                getAdvertiserProfile,
                isListUser,
                isUser
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
