import { Navigate, useNavigate, useParams } from "react-router-dom"
import { doc, updateDoc, getDoc } from "firebase/firestore";
import { db, database } from "../firebase";
import { useState, useEffect, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { onValue, ref, update, remove } from "firebase/database";
import { type roomT } from "./newGame";
import Board from "../components/board";
import { checkWin } from "../components/checkWin";
import Loading from "../components/loading";
import "./room.css"

function Room() {
    const { roomId } = useParams();
    const { userData } = useContext(AuthContext);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const roomRef = ref(database, `rooms/${roomId}`);
    const [time, setTime] = useState<number>(0);
    const [roomD, setRoomD] = useState<roomT | null>(null);
    const [la, setla] = useState<number>(0)
    const navigate = useNavigate();
    useEffect(() => {
        const unsub = onValue(roomRef, (snapshot) => {
            const data: roomT | null = snapshot.val();
            setRoomD(data);
            if (data != null) {
                setla(data.lastAction);
            }
            setIsLoading(false);
        })
        return () => {
            unsub();
        }
    }, []);
    useEffect(() => {
        const interval = setInterval(() => {
            if (la != 0 && !isLoading && roomD!.turn != "wait") {
                const curr_time = new Date().getTime();
                setTime(Math.floor((curr_time - roomD!.lastAction) / 1000));
            }
        }, 1000);
        return () => {
            clearInterval(interval);
        }
    }, [roomD])
    if (isLoading) {
        return <Loading></Loading>
    }
    if (roomD == null) {
        return <Navigate to="/"></Navigate>
    }
    if (roomD!.fuser != "null" && roomD.fuser.uid != userData!.uid && (roomD.suser == "null") && roomD.turn == "wait") {
        update(ref(database, `rooms/${roomId}/suser`), {
            uid: userData!.uid,
            photoURL: userData!.photoURL,
            username: userData!.displayName
        });
        updateDoc(doc(db, "users", userData!.uid), {
            playing: roomD.roomId
        })
    }
    if (roomD.suser != "null" && roomD.turn == "wait") {
        update(roomRef, {
            turn: roomD.started % 2 == 0 ? "fuser" : "suser",
            x: roomD.started % 2 == 0 ? "fuser" : "suser",
            lastAction: (new Date()).getTime(),
            started: (new Date()).getTime(),
        });
    }
    if (checkWin(roomD.board) != 0) {
        let wh = checkWin(roomD.board);
        let exp = 0;
        let state = {
            state: "draw"
        }
        if (roomD.x == "fuser") {
            if (roomD!.fuser != "null" && roomD.fuser.uid == userData!.uid) {
                if (wh == 1) {
                    state = {
                        state: "Ты победил! +5exp"
                    }
                    exp = 5;
                } else if (wh == 2) {
                    state = {
                        state: "Ты проиграл! -3exp"
                    }
                    exp = -3;
                } else {
                    state = {
                        state: "Ничья! +3exp"
                    }
                    exp = 3;
                }
            } else if (roomD!.suser != "null" && roomD!.suser!.uid == userData!.uid) {
                if (wh == 1) {
                    state = {
                        state: "Ты проиграл! -3exp"
                    }
                    exp = -3;
                } else if (wh == 2) {
                    state = {
                        state: "Ты победил! +5exp"
                    }
                    exp = 5;
                } else {
                    state = {
                        state: "Ничья! +3exp"
                    }
                    exp = 3;
                }
            }
        } else {
            if (roomD!.fuser != "null" && roomD.fuser.uid == userData!.uid) {
                if (wh == 2) {
                    state = {
                        state: "Ты победил! +5exp"
                    }
                    exp = 5;
                } else if (wh == 1) {
                    state = {
                        state: "Ты проиграл! -3exp"
                    }
                    exp = -3;
                } else {
                    state = {
                        state: "Ничья! +3exp"
                    }
                    exp = 3;
                }
            } else if (roomD!.suser != "null" && roomD!.suser!.uid == userData!.uid) {
                if (wh == 2) {
                    state = {
                        state: "Ты проиграл! -3exp"
                    }
                    exp = -3;
                } else if (wh == 1) {
                    state = {
                        state: "Ты победил! +5exp"
                    }
                    exp = 5;
                } else {
                    state = {
                        state: "Ничья! +3exp"
                    }
                    exp = 3;
                }
            }
        }
        const fin = async () => {
            // user can dissconnect
            try {
                await updateDoc(doc(db, "users", userData!.uid), {
                    exp: userData!.exp + exp,
                    playing: "none"
                })
            } catch (error) {

            }
            await remove(roomRef);
        }
        fin();
        navigate('/', { state, replace: true })
    }
    if (time >= 30 && roomD.turn != "wait") {
        let state = {
            state: ""
        }
        if (roomD.turn == "fuser") {
            if (roomD.fuser != "null" && userData!.uid == roomD.fuser.uid) {
                state = {
                    state: "Ты проиграл! -10exp"
                }
                const fin = async () => {
                    await updateDoc(doc(db, "users", userData!.uid), {
                        exp: userData!.exp - 5,
                        playing: "none"
                    })
                    await remove(roomRef);
                }
                fin();
                navigate('/', { state, replace: true })
            } else if (roomD.suser != "null" && userData!.uid == roomD.suser.uid) {
                state = {
                    state: "Ты победил! +3exp"
                }
                const fin = async () => {
                    try {
                        await updateDoc(doc(db, "users", userData!.uid), {
                            exp: userData!.exp + 3,
                            playing: "none"
                        })
                        if (roomD.fuser != "null") {
                            const userA = await getDoc(doc(db, "users", roomD.fuser!.uid));
                            const userad = userA.data();
                            await updateDoc(doc(db, "users", roomD.fuser!.uid), {
                                exp: userad!.exp - 5,
                                playing: "none"
                            })
                        }
                    } catch (e) {

                    }
                    await remove(roomRef);
                }
                fin();
                navigate('/', { state, replace: true })
            }
        } else {
            if (roomD.suser != "null" && userData!.uid == roomD.suser.uid) {
                state = {
                    state: "Ты проиграл! -10exp"
                }
                const fin = async () => {
                    await updateDoc(doc(db, "users", userData!.uid), {
                        exp: userData!.exp - 5,
                        playing: "none"
                    })
                    await remove(roomRef);
                }
                fin();
                return <Navigate to="/"></Navigate>
            } else if (roomD.fuser != "null" && userData!.uid == roomD.fuser.uid) {
                state = {
                    state: "Ты победил! +3exp"
                }
                const fin = async () => {
                    await updateDoc(doc(db, "users", userData!.uid), {
                        exp: userData!.exp + 3,
                        playing: "none"
                    })
                    if (roomD.suser != "null") {
                        const userA = await getDoc(doc(db, "users", roomD.suser!.uid));
                        const userad = userA.data();
                        await updateDoc(doc(db, "users", roomD.suser!.uid), {
                            exp: userad!.exp - 5,
                            playing: "none"
                        })
                    }
                    await remove(roomRef);
                }
                fin();
                return <Navigate to="/"></Navigate>
            }
        }
    }
    return <div className="room">
        {
            roomD.turn != "wait" && <div className="gameplay">
                <div className="players">
                    <div className="fuser">
                        <h1>{roomD!.fuser != "null" && roomD.fuser.username}</h1>
                        <img src={(roomD!.fuser != "null" && roomD.fuser.photoURL != "default") ? roomD.fuser.photoURL : "https://api.dicebear.com/7.x/bottts-neutral/svg?seed=Sheba&backgroundType=gradientLinear"} alt="" />
                    </div>
                    <div className="fuser">
                        <h1>{roomD!.suser != "null" && roomD.suser!.username}</h1>
                        <img src={(roomD!.suser != "null" && roomD.suser.photoURL != "default") ? roomD.suser!.photoURL : "https://api.dicebear.com/7.x/bottts-neutral/svg?seed=Sheba&backgroundType=gradientLinear"} alt="" />
                    </div>
                </div>
                <div className="gameinfo">
                    <h1>{time}</h1>
                    <h1>{((roomD!.fuser != "null" && roomD.turn == "fuser" && roomD.fuser.uid == userData!.uid) || (roomD!.suser != "null" && roomD.turn == "suser" && roomD!.suser!.uid == userData!.uid)) ? "Твой ход!" : "Не твой ход!"}</h1>
                </div>
                <Board roomD={roomD}></Board>
            </div>
        }
        {roomD.turn == "wait" && <div><h1>Ждем бота...</h1><button className="exit" onClick={async () => {
            await updateDoc(doc(db, "users", userData!.uid), {
                exp: userData!.exp + 3,
                playing: "none"
            });
            await remove(roomRef);
        }}>Выйти</button></div>}
    </div>
}
export default Room