import { Navigate, Outlet } from "react-router";
import { useAuth } from "../../context/AuthContext";
import {useCallback, useEffect, useState} from "react";

/**
 * Az adminisztrátori hozzáférést ellenőrző komponens.
 * A komponens biztosítja, hogy csak adminisztrátorok férhessenek hozzá az adminisztrátori útvonalakhoz.
 *
 * Ha a felhasználó nincs bejelentkezve, vagy nem rendelkezik admin jogosultsággal,
 * akkor a rendszer átirányítja őt a főoldalra.
 *
 * A komponens a `checkUser` függvény segítségével ellenőrzi a felhasználói adatokat és azok jogosultságait.
 *
 * @component
 */
export default function AdminRoute(){
    const {user, checkUser} = useAuth();
    const [loading, setLoading] = useState(true);

    const memoizedCheckUser = useCallback(checkUser, []);

    /**
     * A komponens betöltésekor megnézi a felhasználó bejelentkezési státuszát
     * */
    useEffect(() => {
        const fetchUser = async () => {
            await checkUser();
            setLoading(false);
        };
        fetchUser();
    }, [memoizedCheckUser]);

    /**
     * Ha a felhasználó adatai még töltődnek, a komponens betöltési animációt mutat.
     *
     * @returns {JSX.Element} A betöltési animációt megjelenítő elem.
     */
    if (loading) {
        return <div className="flex justify-center w-dvw md:items-center align-center">
            <div className="animate-spin  rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-500"></div>
        </div>
    }
    /**
     * Ha a felhasználó nem adminisztrátor vagy nem bejelentkezett, átirányítja őt a főoldalra.
     *
     * @returns {JSX.Element} A felhasználót átirányító `Navigate` komponens.
     */
    if (!user || !user.isAdmin) {
        return <Navigate to="/" replace/>;
    }

    return <Outlet/>;
}