import ChatProfile from "@/components/cards/ChatProfile";
import { useAuth } from "@/context/AuthContext";
import { createMessage, getDifferentProfiles, getMessages } from "@/lib/api";
import { ChatProfiles } from "@/Types/ChatProfiles";
import { Message } from "@/Types/Message";
import { useEffect, useRef, useState } from "react";
import { IoIosSearch, IoMdSend } from "react-icons/io";
import { toast, ToastContainer } from "react-toastify";
import { HiDotsVertical } from "react-icons/hi";
import { IoCall } from "react-icons/io5";
import { FaVideo } from "react-icons/fa";
import ChatPanel from "@/components/cards/ChatPanel";
import socket from "@/lib/socket"; 
import { ReceivedMessage } from "@/Types/ReceivedMessage";
export default function ChatPage(){
    const {user, isLoading} = useAuth();
    const [differentProfiles,setDifferentProfiles] = useState<ChatProfiles[]>([]);
    const [profileForMessage,setProfileForMessage] = useState<ChatProfiles | null>(null);
    const [isDifferentProfilesLoading,setIsDifferentProfilesLoading] = useState<boolean>(true);
    const [isMessageLoading,setIsMessageLoading] = useState<boolean>(true);
    const [messages, setMessages] = useState<Message[]>([]);
    const [searchTerm, setSearchTerm] = useState<string>("");
    const [message,setMessage] = useState<string>("");
    const chatContainerRef = useRef<HTMLDivElement>(null);
    useEffect(() => {
        if(!isLoading){
          const fetchDifferentProfiles = async () => {
            setIsDifferentProfilesLoading(true);
            getDifferentProfiles(user!.id)
            .then((res) => {
              if(res){
                setDifferentProfiles(res);
                const fetchMessage = async () => {
                  setIsMessageLoading(true);
                  if(res.length > 0){
                      setProfileForMessage(res[0]);
                      await getMessages(user!.id, res[0].id)
                      .then((res) => {
                        if(res){
                          setMessages(res);
                        }
                      })
                      .catch((error) => {
                        toast.error(error.message);
                      })
                      .finally(() => {
                        setIsMessageLoading(false);
                      })
                  }
                }
                fetchMessage();
              }
            })
            .catch((error) => {
              toast.error(error.message, { className: "bg-red-400 text-white"})
            })
            .finally(() => {
              setIsDifferentProfilesLoading(false);
            })
          }
          fetchDifferentProfiles();
        }    
    }, [isLoading])
    useEffect(() => {
      if (!isLoading && user?.id) {
        if (!socket.connected) {
          socket.connect();
        }
  
        socket.on("connect", () => {
          console.log("Socket connected!");
          socket.emit("join", user.id);
        });
  
        const handleMessage = (message: ReceivedMessage) => {
          console.log("Received message:", message);
          setMessages((prev) => [...prev, {...message, id: prev.length + 1}]);
        };
  
        socket.on("message", handleMessage);
  
        return () => {
          socket.off("message", handleMessage);
        };
      }
    }, [user?.id, isLoading]);
    const handleSendMessage = async () => {
      if (!message.trim()) {
        toast.error("Írj be valamit...");
        return;
      }
      
      if (user?.id && profileForMessage?.id) {
        try {
          const messageData = {
            senderId: user.id.toString(),
            receiverId: profileForMessage.id.toString(),
            content: message,
          };
          if (socket.connected) {
            console.log("happen");
            socket.emit('message', messageData, (ack: any) => {
              console.log("Server ACK:", ack);
            });
          } else {
            console.error("Socket is not connected!");
          }
          const res = await createMessage({...messageData, senderId: parseInt(messageData.senderId), receiverId: parseInt(messageData.receiverId)});
    
          setMessages((prev) => [...prev, res]);
          setMessage("");
        } catch (error: any) {
          toast.error(error.message);
        }
      }
    }
    useEffect(() => {
      if (chatContainerRef.current) {
        chatContainerRef.current.scrollTo({
          top : chatContainerRef.current.scrollHeight,
          behavior: "smooth"
        })
      }
    }, [messages]);    
    return (
        <div className="h-screen w-screen flex flex-row">
            <div className="w-[30%] ml-4 border-r pr-4">
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
                  differentProfiles.map((curr) => <ChatProfile key={curr.id} profile={curr}/>)
                }
            </div>
            <div className="w-[70%] h-full flex flex-col mx-auto">
              <div className="flex flex-row items-center justify-between border-b pb-4 px-3 mt-4 max-h-[10%]">
                <div className="flex items-center gap-4">
                  <img
                    src={profileForMessage?.profileImg}
                    className="h-10 w-10 rounded-full"
                  />
                  <div>
                    <p className="font-light">{profileForMessage?.name}</p>
                    <p className="text-sm">@{profileForMessage?.username}</p>
                  </div>
                </div>

                <div className="flex items-center gap-6">
                  <FaVideo size={24} color="gray" />
                  <IoCall size={24} color="gray" />
                  <HiDotsVertical size={24} color="gray" />
                </div>
              </div> 

              <div
                ref={chatContainerRef} 
                className="flex-1 overflow-y-auto bg-gray-200 px-4 py-2 flex flex-col items-center"
              >
                <div className="w-[80%] flex flex-col">
                  {messages.map((message, index) => (
                    <ChatPanel 
                      key={index} 
                      message={message} 
                      profilePic={profileForMessage?.profileImg || ""} 
                      isSender={message.senderId === user?.id} 
                    />
                  ))}
                </div>
              </div>
              <div className="w-full bg-gray-200">
                <div className="p-1 bg-white rounded-2xl border-t flex items-center w-[70%] mx-auto mb-4">
                  <input
                    type="text"
                    placeholder="Írj egy üzenetet..."
                    className="flex-1 border rounded-full px-4 py-2 focus:outline-none"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        if (e.shiftKey) {
                          e.preventDefault();
                          setMessage((prev) => prev + "\n");
                          console.log(message);
                        } else {
                          e.preventDefault();
                          handleSendMessage();
                        }
                      }
                    }}
                  />
                  <button 
                    className="px-4 rounded-lg"
                    onClick={handleSendMessage}
                  >
                    <IoMdSend color={message? "#2F80ED" : "gray "} size={28}/>
                  </button>
                </div>
              </div>
            </div>
            <ToastContainer
                autoClose={2000}
            />
        </div>
    )
}