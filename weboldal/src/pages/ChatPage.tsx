import ChatProfile from "@/components/cards/ChatProfile";
import { useAuth } from "@/context/AuthContext";
import { createMessage, getAllProfiles, getDifferentProfiles, getMessages } from "@/lib/api";
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
import Loading from "@/components/Loading";
import { Profile } from "@/Types/Profile";
import SearchProfile from "@/components/cards/SearchProfile";
export default function ChatPage(){
    const {user, isLoading} = useAuth();
    const [differentProfiles,setDifferentProfiles] = useState<ChatProfiles[]>([]);
    const [profileForMessage,setProfileForMessage] = useState<Profile | null>(null);
    const [isDifferentProfilesLoading,setIsDifferentProfilesLoading] = useState<boolean>(true);
    const [isMessageLoading,setIsMessageLoading] = useState<boolean>(true);
    const [messages, setMessages] = useState<Message[]>([]);
    const [searchTerm, setSearchTerm] = useState<string>("");
    const [message,setMessage] = useState<string>("");
    const chatContainerRef = useRef<HTMLDivElement>(null);
    const [isSearchFocused, setIsSearchFocused] = useState(false);
    const [allProfiles, setAllProfiles] = useState<Profile[]>([]);
    const [allFilteredProfiles, setAllFilteredProfiles] = useState<Profile[]>([]);
    const [isAllProfilesLoading,setIsAllProfilesLoading] = useState(true);
    useEffect(() => {
        if(!isLoading){
          const fetchDifferentProfiles = async () => {
            setIsDifferentProfilesLoading(true);
            getDifferentProfiles(user!.id)
            .then((res) => {
              if(res){
                setDifferentProfiles(res);
                if(res.length>0){
                  loadMessages({id: res[0].id, name: res[0].name, username: res[0].username, profileImg: res[0].profileImg});
                }
              }
            })
            .catch((error) => {
              toast.error(error.message, { className: "bg-red-400 text-white"})
            })
            .finally(() => {
              setIsDifferentProfilesLoading(false);
            })
          }
          const fetchAllProfiles = () => {
            setIsAllProfilesLoading(true);
            getAllProfiles()
            .then((res) => {
              if(res){
                setAllProfiles(res);
                setAllFilteredProfiles(res);
              }
            })
            .catch((error) => {
              toast.error(error.message);
            })
            .finally(() => {
              setIsAllProfilesLoading(false);
            })
          }
          fetchDifferentProfiles();
          fetchAllProfiles();
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
    const loadMessages = async (profile : Profile) => {
      setIsMessageLoading(true);
      setProfileForMessage(profile);
      await getMessages(user!.id, profile.id)
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
    const handleSearch = (term : string) => {
      const search = term.toLowerCase();
      const result = allProfiles.filter((curr) => (
        curr.name.toLowerCase().includes(search) || 
        curr.username.toLowerCase().includes(search)
      ))
      setAllFilteredProfiles(result);
      setSearchTerm(term);
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
              {!isDifferentProfilesLoading ?
                <div>
                  <div className="w-full flex flex-row border border-gray-200 rounded-full p-2 mt-4 bg-gray-100">
                    <IoIosSearch size={24} className="ml-1 mr-4"/>
                    <input
                      className="flex flex-1 bg-gray-100"
                      placeholder="Keresés"
                      value={searchTerm}
                      onChange={(e) => {
                        e.preventDefault();
                        handleSearch(e.target.value);
                      }}
                      onFocus={() => setIsSearchFocused(true)}
                      onBlur={() => setIsSearchFocused(false)}
                    />
                  </div>
                  <div>
                  {
                    isSearchFocused ?
                    allFilteredProfiles.map((curr) => {
                      if(curr.username !== user?.username){
                        return <SearchProfile 
                          key={curr.id} 
                          profile={curr} 
                          searchTerm={searchTerm} 
                          handlePress={(profile) => loadMessages(profile)}
                         />
                      }
                    }) : 
                    differentProfiles.map((curr) => 
                      <ChatProfile 
                        key={curr.id} 
                        profile={curr}
                        handlePress={(profile) => loadMessages(profile)}
                      />)
                  }
                  </div>
                </div> : <Loading/> }
            </div>
            {!isDifferentProfilesLoading && !isMessageLoading ?
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
                  {messages.length > 0? messages.map((message, index) => (
                    <ChatPanel 
                      key={index} 
                      message={message} 
                      profilePic={profileForMessage?.profileImg || ""} 
                      isSender={message.senderId === user?.id} 
                    />
                  )) 
                  : 
                  <div className="place-content-center justify-items-center min-h-[75vh] w-full border">
                    <p className="text-center text-lg">Még nem volt beszélgetésetek írj <span className="text-blue-500">valamit...</span></p>  
                  </div>}
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
            </div> : <Loading/>
            }
            <ToastContainer
                autoClose={2000}
            />
        </div>
    )
}