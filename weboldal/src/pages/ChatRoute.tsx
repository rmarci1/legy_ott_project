import { Navigate } from "react-router";
import {useCallback, useEffect, useState} from "react";
import { useAuth } from "@/context/AuthContext";
import ChatPage from "./ChatPage";


/**
 * A `ChatRoute` egy olyan route komponens, amely biztosítja, hogy a felhasználó be legyen jelentkezve a `ChatPage` megjelenítése előtt.
 * Ha a felhasználó nincs bejelentkezve, akkor átirányítja őt a kezdőlapra.
 *
 * @returns {JSX.Element} A komponens vagy a `ChatPage`-et rendereli, vagy a felhasználót átirányítja a kezdőlapra.
 */
export default function ChatRoute(){
    const {user, checkUser} = useAuth();
    const [loading, setLoading] = useState(true);

    /**
     * A `memoizedCheckUser` a `checkUser` függvényt memoizálja, hogy elkerüljük a felesleges újrahívásokat.
     *
     * @returns {Promise<void>} Nincs visszatérési értéke, de a bejelentkezett felhasználót ellenőrzi.
     */
    const memoizedCheckUser = useCallback(checkUser, []);

    /**
     * Az effektus, amely a komponens első renderelésekor ellenőrzi a felhasználót.
     * Ha a felhasználó nincs bejelentkezve, akkor az állapot `loading`-ot `false`-ra állítja.
     */
    useEffect(() => {
        const fetchUser = async () => {
            await checkUser();
            setLoading(false);
        };
        fetchUser();
    }, [memoizedCheckUser]);

    /**
     * Ha a komponens még tölt, megjelenít egy töltő spinner-t.
     *
     * @returns {JSX.Element} A betöltés állapotát jelzi egy animált kör formájában.
     */
    if (loading) {
        return <div className="flex justify-center w-dvw md:items-center align-center">
            <div className="animate-spin  rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-500"></div>
        </div>
    }

    /**
     * Ha a felhasználó nincs bejelentkezve, átirányítja őt a kezdőlapra.
     *
     * @returns {JSX.Element} Ha a felhasználó nincs bejelentkezve, akkor a `Navigate` komponens segítségével átirányítja őt.
     */
    if (!user) {
        return <Navigate to="/" replace/>;
    }

    /**
     * Ha a felhasználó be van jelentkezve, akkor rendereli a `ChatPage`-et.
     *
     * @returns {JSX.Element} A `ChatPage` komponenst rendereli.
     */
    return <ChatPage/>;
}