import { messageT } from "../pages/chat"
import { LazyLoadImage } from 'react-lazy-load-image-component';

interface props {
    messageD: messageT,
    user: string,
}
function Message({ messageD, user } : props) {
    const {photoURL, username, message, from} = messageD
    let avatarURL = "https://api.dicebear.com/7.x/bottts-neutral/svg?seed=Sheba&backgroundType=gradientLinear";
    if (photoURL != "default")
          avatarURL = photoURL;
    return <div className={"mess " + ((from == user) ? "mine" : "")}>
        {/* <img src={avatarURL} alt="avatar" className="messAvatar"/> */}
        <LazyLoadImage src={avatarURL} alt="avatar" className="messAvatar" />
        <div className="messInf">
            <h1 className="messName">{username}</h1>
            <div className="messText">{message}</div>
        </div>
    </div>
}
export default Message