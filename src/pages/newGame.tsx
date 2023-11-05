import React, { useContext, useState } from "react"
import { database, db } from "../firebase"
import { doc, setDoc } from "firebase/firestore";
import { ref, set } from "firebase/database"
import { AuthContext } from "../context/AuthContext";
import { Navigate, useNavigate } from "react-router-dom";
import Loading from "../components/loading";
import "./newGame.css"

export interface roomUserT {
    uid: string,
    username: string,
    photoURL: string,
}

export interface roomT {
    roomId: string,
    gameName: string,
    photoURL: string,
    fuser: roomUserT | "null",
    suser: roomUserT | "null",
    board: number[],
    turn: "fuser" | "suser" | "wait",
    lastAction: number,
    started: number, 
    x: "fuser" | "suser"
}

function CreateGame() {
    const { user, userData } = useContext(AuthContext);
    const [gameName, setGameName] = useState<string>("");
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const navigate = useNavigate();
    const handleSubmit = async () => {
        setIsLoading(true);
        const ct = (new Date()).getTime();
        const roomD: roomT = {
            roomId: user!.uid,
            gameName,
            photoURL: user!.photoURL as string,
            fuser: {
                uid: user!.uid,
                username: user!.displayName as string,
                photoURL: user!.photoURL as string,
            },
            suser: "null",
            board: [0,0,0,0,0,0,0,0,0],
            turn: "wait",
            lastAction: ct,
            started: ct,
            x: ct%2 == 0 ? "fuser" : "suser",
        }
        await set(ref(database, 'rooms/' + user!.uid), roomD)
        await setDoc(doc(db, "users", user!.uid), {
            ...userData,
            playing: user!.uid
        });
        navigate(`/room/${user!.uid}`);
    }
    if (isLoading) return  <Loading></Loading>
    let avatarURL = "https://api.dicebear.com/7.x/bottts-neutral/svg?seed=Sheba&backgroundType=gradientLinear";
    if (userData!.photoURL != "default") {
        avatarURL = userData!.photoURL as string;
    }
    if (userData?.playing == "none") {
        return <div className="createGame">
             <img src={avatarURL} alt="Image" className="createGame-img" />
            <input type="text" className="createGame-input" placeholder="Название игры" value={gameName} onChange={(e: React.ChangeEvent<HTMLInputElement>)=>{
                setGameName(e.target.value);
            }} maxLength={20}/>
            <button className="createGame-button" onClick={()=>{
                handleSubmit();
            }}>Создать игру</button>
        </div>
    } else {
        return <Navigate to={'/room/'+userData!.playing}></Navigate>
    }
}

export default CreateGame