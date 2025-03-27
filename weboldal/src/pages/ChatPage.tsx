import ChatProfile from "@/components/cards/ChatProfile";
import { useAuth } from "@/context/AuthContext";
import { getDifferentProfiles } from "@/lib/api";
import { ChatProfiles } from "@/Types/ChatProfiles";
import { useEffect, useState } from "react";
import { IoIosSearch } from "react-icons/io";
import { toast, ToastContainer } from "react-toastify";
import { io } from 'socket.io-client';

export default function ChatPage(){
    const {user, isLoading} = useAuth();
    const [differentProfiles,setDifferentProfiles] = useState<ChatProfiles[]>([]);
    const [isDifferentProfilesLoading,setIsDifferentProfilesLoading] = useState<boolean>(true);
    const [isMessageLoading,setIsMessageLoading] = useState<boolean>(true);
    const [messages, setMessage] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const socket = io('http://192.168.10.89:3000', { transports: ['websocket'] });

    useEffect(() => {
        if(!isLoading){
          const fetchDifferentProfiles = async () => {
            setIsDifferentProfilesLoading(true);
            getDifferentProfiles(user!.id)
            .then((res) => {
              if(res){
                setDifferentProfiles(res);
                const fetchMessage = async () => {
                  if(res.length > 0){
                      await socket.connect();
                      await getMessages(user.id, profileForMessage.id)
                      .then((res) => {
                        if(res){
                          setMessages(res);
                        }
                      })
                      .catch((error) => {
                        showToast("error","Hiba",error.message);
                      })
                      .finally(() => {
                        setIsMessage(false);
                      })
                  }
                }
                fetchMessage();
              }
            })
            .catch((error) => {
              toast.error(error.message, { className: "bg-yellow-300 text-white"})
            })
            .finally(() => {
              setIsDifferentProfilesLoading(false);
            })
          }
          fetchDifferentProfiles();
        }    
    }, [isLoading])
    return (
        <div className="h-screen w-screen flex-row">
            <div className="w-[25%] ml-4">
                <div className="w-full flex flex-row border border-gray-200 rounded-full p-2 mt-4 bg-gray-100">
                  <IoIosSearch size={24} className="ml-1 mr-4"/>
                  <input
                    className="flex flex-1 bg-gray-100"
                    placeholder="Keresés"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                {
                  differentProfiles.map((curr) => <ChatProfile profile={curr}/>)
                }
            </div>
            <div className="w-[75%]">
                <div className="flex flex-row">
                  <img className="h-14 w-14 rounded-full"/>
                </div>
            </div>
            <ToastContainer
                autoClose={2000}
            />
        </div>
    )
}