import { useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { database } from "../firebase";
import { ref, push, set } from "firebase/database";
import { type messageT } from "../pages/chat";

function ChatInput() {
    const { userData } = useContext(AuthContext)
    const chatRef = ref(database, `chat`);
    const newMessRef = push(chatRef);
    const [message, setMessage] = useState<string>("");
    return <div className="type">
        <input type="text" className="messType" value={message} onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
            setMessage(e.target.value);
        }} maxLength={500} /><button className="messSend" disabled={userData == null} onClick={() => {
            if (userData != null && message.replace(/\s/g, '').length != 0 && message.length < 500 && message.length != 0) {
                const newMess: messageT = {
                    photoURL: userData.photoURL,
                    username: userData.displayName,
                    message,
                    from: userData.uid
                }
                set(newMessRef, newMess);
                setMessage("");
            }
        }}>отправить</button>
    </div>
}

export default ChatInput