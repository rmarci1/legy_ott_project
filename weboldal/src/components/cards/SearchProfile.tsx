import { useAuth } from "@/context/AuthContext";
import { Profile } from "@/Types/Profile";

/**
 * `SearchProfile` komponens, amely egy keresési eredményként megjeleníti egy felhasználó profilját.
 * A profil adatainak kiemelése és kattintásra történő feldolgozása történik.
 *
 * @component
 *
 * @param {Object} props - A komponens paraméterei
 * @param {Profile} props.profile - A felhasználó profil adatai, amelyeket meg szeretnénk jeleníteni
 * @param {string} props.searchTerm - A keresési kifejezés, amelyet a szöveg kiemelésére használunk
 * @param {Function} props.handlePress - Funkció, amely a profilra történő kattintás esetén hívódik meg
 */
export default function SearchProfile({profile,searchTerm, handlePress} : {profile : Profile, searchTerm: string, handlePress : (profile : Profile) => void}){
    const { highlightText } = useAuth();
    return (
        <button 
            onMouseDown={(e) => {
                e.preventDefault();
                handlePress(profile)
            }} 
            className="flex flex-row mt-4 hover:bg-gray-200 rounded-xl p-1 text-left border-red-500 w-full"
        >
            <img src={profile.profileImg} className="h-14 w-14 rounded-full"/>
            <div className="ml-2 py-1 w-full">
                <p className="font-bold">{highlightText(profile.name,searchTerm)}</p>
                <p className="text-sm">{highlightText("@"+profile.username,searchTerm)}</p>
            </div>
        </button>
    )
}