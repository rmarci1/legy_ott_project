import { useAuth } from "@/context/AuthContext";
import { ChatProfiles } from "@/Types/ChatProfiles";

export default function ChatProfile({profile} : {profile : ChatProfiles}){
    const {formatDate} = useAuth();
    return (
        <div key={profile.id} className="flex flex-row mt-4 hover:bg-gray-100 rounded-xl p-1">
            <img src={profile.profileImg} className="h-14 w-14 rounded-full"/>
            <div className="ml-2 py-1 w-full">
                <div className="flex flex-row justify-between w-full">
                    <p className="font-bold">{profile.name}</p>
                    <p>{formatDate(profile.created)}</p>
                </div>
                <p className="text-sm">{profile.lastMessage.length > 30 ? profile.lastMessage.substring(0,30) + "..." : profile.lastMessage}</p>
            </div>
        </div>
    )
}