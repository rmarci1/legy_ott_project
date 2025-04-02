import { useAuth } from "@/context/AuthContext";
import { Profile } from "@/Types/Profile";

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