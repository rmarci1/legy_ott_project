import { Message } from "@/Types/Message";

export default function ChatPanel({message, profilePic, isSender} : {message: Message, profilePic: string, isSender: boolean}){
    return (
        <div key={message.id} className={`flex flex-row my-2 ${isSender && "justify-end"}`}>
            {!isSender && <img src={profilePic} className="h-8 w-8 rounded-full self-end"/>}
            <div className={`${isSender ? "bg-[#2F80ED]" : "bg-white"} px-3 py-2 ml-1 rounded-lg shadow-md 
                max-w-[70%] w-fit break-words flex flex-row ${isSender && "text-white"}`}
            >   
                <p>{message.content}</p>
            </div>
        </div>
    )
}