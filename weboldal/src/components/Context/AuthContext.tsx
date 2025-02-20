import { createContext, ReactNode, useContext, useState } from "react";
import { User } from "../../Types/User";
import {Job} from "../../Types/Job.ts";
import {attend, getAvailableJobs, saveForLater} from "../../api.ts";

interface AuthContextType {
    user: User | null,
    jobs: Job[],
    kijelentkezes: () => void,
    bejelentkezes: (newUser: User) => void,
    profilKepUpdate: (url: string, user: User) => void,
    setSave: (job: Job, user: User ,value: boolean) => void,
    attendJob: (id: number, username: string, value: boolean) => void
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
    const [jobs, setJobs] = useState<Job[]>([])

    const bejelentkezes = async (newUser: User) =>{
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
    }

    const resetJobs = async (username: string) => {
        setJobs(await getAvailableJobs(username));
    }

    const kijelentkezes = () =>{
        setUser(null);
    }

    const profilKepUpdate = (url: string, user: User) =>{
        setUser({
            ...user,
            profileImg: url
        })
    }
    const setSave = async (job: Job, user: User ,value: boolean) => {
        await saveForLater(job.id, user.id, user.username, value);

        await resetJobs(user.username);
    }

    const attendJob = async (id: number, username: string, value: boolean) => {
        await attend(id, username, value);

        await resetJobs(username)
    }

    return (
        <AuthContext.Provider
            value = {{
                user,
                jobs,
                kijelentkezes,
                bejelentkezes,
                profilKepUpdate,
                setSave,
                attendJob
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
