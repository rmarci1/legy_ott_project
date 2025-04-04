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

/**
 * AuthContext típusa, amely tartalmazza a felhasználóval és munkákkal kapcsolatos adatokat,
 * valamint az ezekhez kapcsolódó műveleteket.
 */
interface AuthContextType {
    user: User | null, // A bejelentkezett felhasználó adatai
    jobs: Job[], // Az elérhető munkák
    allJobs: Job[], // Az összes munka
    savedJobs: Job[], // A felhasználó által későbbre mentett munkák
    isLoading: boolean, // A betöltés állapota
    indexForConvert: number, // Az index, amelyet a konvertáláshoz használunk
    setIsLoading: (value: boolean) => void, // Betöltés állapotának beállítása
    kijelentkezes: () => void, // Kijelentkezés a rendszerből
    bejelentkezes: (newUser: User) => void, // Bejelentkezés egy új felhasználóval
    setSave: (job: Job, value: boolean) => void, // Munka mentése vagy eltávolítása
    attendJob: (id: number, value: boolean) => void, // Munka elérhetőségének beállítása
    deleteJobById: (id: number) => void, // Munka törlése
    getAll: () => void, // Az összes munka lekérése
    checkUser: () => void, // A felhasználó ellenőrzése
    isListUser: (list: (Job | User)[]) => Promise<boolean>, // Ellenőrzi, hogy a lista felhasználókat vagy munkákat tartalmaz
    isUser: (list: Job | User) => Promise<boolean>, // Ellenőrzi, hogy az elem felhasználó-e
    setIndexForConvert: (index: number) => void, // Index beállítása konvertáláshoz
    formatDate: (date: string) => string, // Dátum formázása
    highlightText: (text: string, searchTerm: string) => React.JSX.Element, // Szöveg kiemelése keresett kifejezés alapján
}
interface AuthContextTypeProps {
    children : ReactNode;
}
export const useGlobalContext = () => {
    const context = useContext(AuthContext);
    return context;
}
const AuthContext = createContext<AuthContextType | undefined>(undefined);

/**
 * AuthContext típust meghatározó komponens, amely a felhasználó adatokat és munkákat kezel.
 *
 * @param {ReactNode} children - Az alkomponensek, amelyek az AuthContext-et használják.
 * @returns {JSX.Element} - Az AuthContext Provider komponens.
 */
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

    /**
     * Az összes munka lekérése és frissítése.
     */
    const getAll = () => {
        setIsLoading(true)
        getAllJobs()
            .then((res) =>{
                setAllJobs(res);
            });
        setIsLoading(false)
    }
    /**
     * Bejelentkezés egy új felhasználóval.
     *
     * @param {User} newUser - A bejelentkezett felhasználó adatai.
     */
    const bejelentkezes = async (newUser: User) =>{
        setIsLoading(true)
        setUser({
            ...newUser
        });
        await resetJobs();
        setIsLoading(false)
    }
    /**
     * Ellenőrzi, hogy a felhasználó be van-e jelentkezve.
     */
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

    /**
     * A felhasználó munkáinak és mentett hirdetéseinek frissítése.
     */
    const resetJobs = async () => {
        setIsLoading(true)
        setJobs(await getAvailableJobs());
        await userSavedJobs();
        await userArchivedJobs();
        await userArchivedAds();
        setIsLoading(false)
    }

    /**
     * Kijelentkezés a rendszerből.
     */
    const kijelentkezes = () =>{
        setIsLoading(true)
        setUser(null);
        getAll()
        setIsLoading(false)
    }
    /**
     * Mentés vagy eltávolítás a 'későbbre elmentett' listából.
     *
     * @param {Job} job - A munka adatai.
     * @param {boolean} value - A mentés állapota (true: mentés, false: eltávolítás).
     */
    const setSave = async (job: Job ,value: boolean) => {
        setIsLoading(true)
        await saveForLater(job.id, value);

        await resetJobs();
        setIsLoading(false)
    }

    /**
     * A felhasználó által kiválasztott munka elérhetőségének módosítása.
     *
     * @param {number} id - A munka azonosítója.
     * @param {boolean} value - Az új elérhetőség állapota.
     */
    const attendJob = async (id: number, value: boolean) => {
        setIsLoading(true)
        await attend(id, value);

        await resetJobs()
        setIsLoading(false)
    }

    /**
     * A felhasználó mentett munkáinak lekérése.
     */
    const userSavedJobs = async () => {
        setIsLoading(true);
        setSavedJobs(await getSavedForLater());
        setIsLoading(false);
    }

    /**
     * A felhasználó archivált munkáinak lekérése.
     */
    const userArchivedJobs = async () => {
        setIsLoading(true);

        setIsLoading(false);
    }

    /**
     * A felhasználó archivált hírdetéseinek lekérése.
     */
    const userArchivedAds = async () => {
        setIsLoading(true);

        setIsLoading(false);
    }

    /**
     * Ellenőrzi, hogy egy lista felhasználókat vagy munkákat tartalmaz-e.
     *
     * @param {Array} list - A lista, amely felhasználókat vagy munkákat tartalmaz.
     * @returns {Promise<boolean>} - Igaz, ha a lista csak felhasználókat vagy munkákat tartalmaz, hamis egyébként.
     */
    const isListUser = async (list: (User | Job)[]) : Promise<boolean> => {
        return Array.isArray(list) && list.every(item => 'name' in item && 'username' in item);
    }

    /**
     * Ellenőrzi, hogy az adott elem felhasználó-e.
     *
     * @param {User | Job} item - Az elem, amelyet ellenőrizni kell.
     * @returns {Promise<boolean>} - Igaz, ha a megadott elem felhasználó.
     */
    const isUser = async (item: User | Job) : Promise<boolean> => {
        return 'name' in item && 'username' in item;
    }

    /**
     * Munka törlése az azonosító alapján.
     *
     * @param {number} id - A munka azonosítója.
     */
    const deleteJobById = async (id: number) => {
        await deleteJob(id);
        await resetJobs();
    }

    /**
     * A dátum formázása.
     *
     * @param {string} date - A dátum, amelyet formázni kell.
     * @returns {string} - A formázott dátum.
     */
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

    /**
     * A szöveg kiemelése egy keresett kifejezés alapján.
     *
     * @param {string} text - A szöveg, amelyben keresünk.
     * @param {string} searchTerm - A keresett kifejezés.
     * @returns {React.JSX.Element} - A kiemelt szöveg JSX eleme.
     */
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
