import { Navigate, Outlet } from "react-router";
import { useAuth } from "../../context/AuthContext";
import {useCallback, useEffect, useState} from "react";

export default function AdminRoute(){
    const {user, checkUser} = useAuth();
    const [loading, setLoading] = useState(true);

    const memoizedCheckUser = useCallback(checkUser, []);

    useEffect(() => {
        const fetchUser = async () => {
            await checkUser();
            setLoading(false);
        };
        fetchUser();
    }, [memoizedCheckUser]);

    if (loading) {
        return <div className="flex justify-center w-dvw md:items-center align-center">
            <div className="animate-spin  rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-500"></div>
        </div>
    }

    if (!user || !user.isAdmin) {
        return <Navigate to="/" replace/>;
    }

    return <Outlet/>;
}