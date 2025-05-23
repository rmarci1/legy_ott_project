import { Message } from "@/Types/Message";

/**
 * `ChatPanel` komponens, amely egy üzenetet jelenít meg a csevegőpanelen.
 * Az üzenet a küldőtől (sender) vagy a másik féltől (receiver) függően különböző stílusokkal jelenik meg.
 * A küldő üzenete más háttérszínnel, míg a fogadó üzenete más színnel jelenik meg.
 *
 * @component
 *
 * @param {Object} props - A komponens paraméterei
 * @param {Message} props.message - Az üzenet objektum
 * @param {string} props.profilePic - A profilkép URL-je
 * @param {boolean} props.isSender - True, ha a felhasználó küldte az üzenetet, false, ha másik fél
 */
export default function ChatPanel({message, profilePic, isSender} : {message: Message, profilePic: string, isSender: boolean}){
    return (
        <div key={message.id} className={`flex flex-row my-2 ${isSender && "justify-end"}`}>
            {!isSender && <img src={profilePic} className="h-8 w-8 rounded-full object-cover self-end"/>}
            <div className={`${isSender ? "bg-[#2F80ED]" : "bg-white"} px-3 py-2 ml-1 rounded-lg shadow-md 
                max-w-[70%] w-fit break-words flex flex-row ${isSender && "text-white"}`}
            >   
                <p>{message.content}</p>
            </div>
        </div>
    )
}