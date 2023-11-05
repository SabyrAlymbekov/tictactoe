import { useState, useEffect } from "react";
import { database } from "../firebase";
import { ref, get, onChildAdded } from "firebase/database";
import MessageList from "../components/messList";
import ChatInput from "../components/chatInput";
import Loading from "../components/loading";
import "./chat.css"

export interface messageT {
    photoURL: string, // user photoURL
    username: string, // username
    message: string, // message
    from: string, // uid user
}
export interface ChatT {
    [messName: string] : messageT
}

function Chat() {
    const chatRef = ref(database, `chat`);
    const [chat, setChat] = useState<messageT[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    useEffect(() => {
        const getChat = async () => {
            const data = await get(chatRef);
            const dataF: ChatT = data.val();
            setChat(Object.values(dataF));
            setIsLoading(false);
        }
        getChat()
    }, []);
    useEffect(()=>{
        const unsub = onChildAdded(chatRef, (data) => {
            setChat(prevChat => [...prevChat, data.val()]);
        });
        return () => {
            unsub()
        }
    }, []);
    if (isLoading) 
        return <Loading></Loading>
    return <div className="chat">
        <MessageList chat={chat}></MessageList>
        <ChatInput></ChatInput>
    </div>
}
export default Chat;