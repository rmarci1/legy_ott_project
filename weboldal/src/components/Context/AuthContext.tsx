import {createContext, ReactNode, useContext, useEffect, useState} from "react";
import {User} from "../../Types/User";
import {Job} from "../../Types/Job.ts";
import {
    attend,
    getAdvertised,
    getAllJobs,
    getAvailableJobs,
    getProfile,
    getSelectedJobs,
    getUser,
    saveForLater
} from "../../api.ts";
import {Advertiser} from "../../Types/Advertiser.ts";

interface AuthContextType {
    user: User | null,
    jobs: Job[],
    allJobs: Job[],
    selectedJobs: Job[],
    ads: Job[],
    advertiser: Advertiser | null,
    isLoading: boolean,
    setIsLoading: (value: boolean)=> void,
    kijelentkezes: () => void,
    bejelentkezes: (newUser: User) => void,
    profilKepUpdate: (url: string, user: User) => void,
    setSave: (job: Job, user: User ,value: boolean) => void,
    attendJob: (id: number, username: string, value: boolean) => void,
    getAll: () => void,
    getAdvertiserProfile: (username: string) => void,
    checkUser: () => void
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
    const [allJobs, setAllJobs] = useState<Job[]>([]);
    const [selectedJobs, setSelectedJobs] = useState<Job[]>([])
    const [ads, setAds] = useState<Job[]>([])
    const [advertiser, setAdvertiser] = useState<Advertiser | null>(null);
    const [jobs, setJobs] = useState<Job[]>([])

    useEffect(() => {
    }, []);

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
            id: newUser.id,
            name: newUser.name,
            username: newUser.username,
            email: newUser.email,
            password: newUser.password,
            bejelentkezett: true,
            profileImg: newUser.profileImg
        });

        await resetJobs(newUser.username);
        setIsLoading(false)
    }

    const checkUser = async () => {
        setIsLoading(true)
        try{
            const user = await getUser().then((res) => { return res.profile })
            console.log(user)
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

    const resetJobs = async (username: string) => {
        setIsLoading(true)
        setJobs(await getAvailableJobs(username));
        await userSelectedJobs(username)
        await userAdvertisedJobs(username);
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
        setUser({
            ...user,
            profileImg: url
        })
        setIsLoading(false)
    }
    const setSave = async (job: Job, user: User ,value: boolean) => {
        setIsLoading(true)
        await saveForLater(job.id, user.id, user.username, value);

        await resetJobs(user.username);
        setIsLoading(false)
    }

    const attendJob = async (id: number, username: string, value: boolean) => {
        setIsLoading(true)
        await attend(id, username, value);

        await resetJobs(username)
        setIsLoading(false)
    }

    const userSelectedJobs = async (username: string) => {
        setIsLoading(true)
        setSelectedJobs(await getSelectedJobs(username).then((res) => {
            return res
        }))
        setIsLoading(false)
    }

    const userAdvertisedJobs = async (username: string) => {
        setIsLoading(true);
        setAds(await getAdvertised(username));
        setIsLoading(false);
    }

    const getAdvertiserProfile = async (username: string) =>{
        setIsLoading(true)
        setAdvertiser(await getProfile(username));
        setIsLoading(false)
    }

    return (
        <AuthContext.Provider
            value = {{
                user,
                jobs,
                allJobs,
                advertiser,
                isLoading,
                selectedJobs,
                ads,
                setIsLoading,
                kijelentkezes,
                bejelentkezes,
                checkUser,
                profilKepUpdate,
                setSave,
                attendJob,
                getAll,
                getAdvertiserProfile
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
