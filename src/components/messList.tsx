import { type messageT } from "../pages/chat"
import Message from "../components/message";
import { useRef, useEffect, useContext } from "react";
import { AuthContext } from "../context/AuthContext";

interface props {
    chat: messageT[]
}
function MessageList({ chat }: props) {
    const ref = useRef<HTMLDivElement>(null);
    const { userData } = useContext(AuthContext)
    useEffect(() => {
      if (chat.length) {
        ref.current?.scrollIntoView({
          behavior: "smooth",
          block: "end",
        });
      }
    }, [chat.length]);
    return <div className="messages">
        {chat.map((el) => {
            return <Message key={`${new Date().getTime()}${Math.random() * 100000}`} messageD={el} user={(userData != null) ? userData.uid : "none"}></Message>
        })}
        <div ref={ref} />
    </div>
}
export default MessageList