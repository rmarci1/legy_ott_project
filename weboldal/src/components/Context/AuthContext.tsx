import { createContext, ReactNode, useContext, useState } from "react";
import { User } from "../../Types/User";
import {Job} from "../../Types/Job.ts";
import {getAvailableJobs} from "../../api.ts";

interface AuthContextType {
    user: User | null,
    jobs: Job[],
    kijelentkezes: () => void,
    bejelentkezes: (newUser: User) => void,
    profilKepUpdate: (url: string, user: User) => void
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
            name: newUser.name,
            username: newUser.username,
            email: newUser.email,
            password: newUser.password,
            bejelentkezett: true,
            profileImg: newUser.profileImg
        });

        setJobs(await getAvailableJobs(newUser.username))
    }

    const kijelentkezes = () =>{
        setUser(null);
    }

    const profilKepUpdate = (url: string, user: User) =>{
        setUser({
            name: user.name,
            username: user.username,
            email: user.email,
            password: user.password,
            bejelentkezett: true,
            profileImg: url
        })
    }

    return (
        <AuthContext.Provider
            value = {{
                user,
                jobs,
                kijelentkezes,
                bejelentkezes,
                profilKepUpdate
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
