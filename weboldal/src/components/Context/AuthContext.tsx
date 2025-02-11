import { createContext, ReactNode, useContext, useState } from "react";
import { User } from "../../Types/User";

interface AuthContextType {
    user: User | null,
    kijelentkezes: () => void,
    bejelentkezes: (newUser: User) => void
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

    const bejelentkezes = (newUser: User) =>{
        setUser({name: newUser.name, username: newUser.username, email: newUser.email, password: newUser.password, bejelentkezett: true});
    }

    const kijelentkezes = () =>{

    }

    return (
        <AuthContext.Provider
            value = {{
                user,
                kijelentkezes,
                bejelentkezes
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
