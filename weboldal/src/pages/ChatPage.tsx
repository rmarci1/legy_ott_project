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
/**
 * A `ChatPage` komponens a csevegőoldalt jeleníti meg, ahol a felhasználó cseveghet a különböző profilokkal.
 * Az oldalon különböző profilok kereshetők, és az üzenetek valós időben frissülnek a WebSocket segítségével.
 *
 * @returns {JSX.Element} A chat oldal, ahol a felhasználók üzeneteket küldhetnek és fogadhatnak.
 */
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

    /**
     * Az `useEffect` betölti a felhasználó profiljait és üzeneteit, amint a komponens renderelődik.
     * A profilok és üzenetek aszinkron lekérése után a megfelelő állapotok frissítésre kerülnek.
     */
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
              setIsMessageLoading(false);
            })
          }
          const fetchAllProfiles = () => {
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
            })
          }
          fetchDifferentProfiles();
          fetchAllProfiles();
        }    
    }, [isLoading])

    /**
     * A WebSocket inicializálása és az üzenetek kezelése.
     * Az üzenetek valós időben történő fogadása és a megfelelő állapot frissítése.
     */
    useEffect(() => {
      if (!isLoading && user?.id) {
        if (!socket.connected) {
          socket.connect();
        }
  
        socket.on("connect", () => {
          socket.emit("join", user.id);
        });
  
        const handleMessage = (message: ReceivedMessage) => {
          setMessages((prev) => [...prev, {...message, id: prev.length + 1}]);
        };
  
        socket.on("message", handleMessage);
  
        return () => {
          socket.off("message", handleMessage);
        };
      }
    }, [user?.id, isLoading]);

    /**
     * Az üzenet küldése a szerver felé, valamint a helyi állapot frissítése.
     *
     * @throws {Error} Ha hiba történik az üzenet küldésekor.
     */
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
          const messageDate = new Date();
          if (socket.connected) {
            socket.emit('message', messageData, (ack: any) => {
            });
          } else {
            console.error("Socket is not connected!");
          }
          const res = await createMessage({...messageData, senderId: parseInt(messageData.senderId), receiverId: parseInt(messageData.receiverId)});
          setMessages((prev) => [...prev, res]);
          const containsProfile = differentProfiles.some(profile => profile.username === profileForMessage.username)
          if(!containsProfile){
            setDifferentProfiles((prev => [...prev, {...profileForMessage, lastMessage: message, lastMessageDate: messageDate.toISOString()}]))
          }
          else{
            setDifferentProfiles((prev) => prev.map((curr) => curr.id == profileForMessage.id ? {...curr, lastMessage: message, lastMessageDate: messageDate.toISOString()} : curr))
          }
          setMessage("");
        } catch (error: any) {
          toast.error(error.message);
        }
      }
    }
    /**
     * Üzenetek betöltése az adott profilhoz.
     *
     * @param {Profile} profile Az adott profil, amelyhez az üzeneteket betöltjük.
     */
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
    /**
     * A keresési kifejezés alapján profilok szűrése.
     *
     * @param {string} term A keresési kifejezés, amely alapján a profilokat szűrjük.
     */
    const handleSearch = (term : string) => {
      const search = term.toLowerCase();
      const result = allProfiles.filter((curr) => (
        curr.name.toLowerCase().includes(search) || 
        curr.username.toLowerCase().includes(search)
      ))
      setAllFilteredProfiles(result);
      setSearchTerm(term);
    }

    /**
     * Az üzenetpanel automatikus görgetése az új üzenetekhez.
     */
    useEffect(() => {
      if (chatContainerRef.current) {
        chatContainerRef.current.scrollTo({
          top : chatContainerRef.current.scrollHeight,
          behavior: "smooth"
        })
      }
    }, [messages]);    
    return (
        <div className="h-screen w-screen flex flex-col md:flex-row overflow-hidden">
            <div className="w-full md:w-[30%] border-r md:ml-4 md:pr-4 p-4 overflow-y-auto max-h-[40vh] md:max-h-full">
              {!isDifferentProfilesLoading ?
                <div>
                  <div className="w-full flex items-center border border-gray-200 rounded-full p-2 bg-gray-100">
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
             profileForMessage? 
            <div className="w-full md:w-[70%] h-full flex flex-col">
              <div className="flex flex-row items-center justify-between border-b pb-4 px-3 mt-4 max-h-[10%]">
                  <div className="flex items-center gap-4">
                    <img
                      src={profileForMessage?.profileImg}
                      className="h-10 w-10 object-cover rounded-full"
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
                <div className="w-full md:w-[80%] flex flex-col">
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
                <div className="p-2 bg-white rounded-2xl border-t flex items-center max-w-full md:w-[70%] mx-auto mb-4">
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
            : 
            <div className="w-full md:w-[70%] h-full flex flex-col">

            </div> : <Loading/>
            }
            <ToastContainer
                autoClose={2000}
            />
        </div>
    )
}