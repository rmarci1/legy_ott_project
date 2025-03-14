import { Navigate, Outlet } from "react-router";
import { useAuth } from "../../context/AuthContext";

export default function AdminRoute(){
    const {user} = useAuth();
    console.log("admin: ",user);
    if (!user || !user.isAdmin) {
        return <Navigate to="/" replace/>;
    }
    
    return <Outlet />;
}