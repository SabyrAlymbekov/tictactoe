import { useContext, useEffect, useState } from "react"
import GameCard from "../components/gameCard"
import { Link, useLocation, useNavigate } from "react-router-dom"
import { onValue, ref, remove } from "firebase/database"
import { database, db } from "../firebase"
import type { roomT, roomUserT } from "./newGame"
import Loading from "../components/loading"
import { updateDoc, doc } from "firebase/firestore"
import "./game.css"
import { AuthContext } from "../context/AuthContext"

interface roomsT {
    [roomName: string]: roomT
}

function GamePanel() {
    const roomRef = ref(database, "rooms/");
    const [rooms, setRooms] = useState<roomsT | null>(null);
    const [isLoading, setIsLoading] = useState<Boolean>(true);
    const navigate = useNavigate();
    const location = useLocation();
    const { setTrigger } = useContext(AuthContext);
    useEffect(() => {
        const unsub = onValue(roomRef, (snapshot) => {
            const data = snapshot.val();
            setRooms(data);
            setIsLoading(false);
        })
        return () => {
            unsub();
        }
    }, []);
    let roomsJSX = <div className="gamesSearching gameList">
        <h1>Тут пусто :/</h1>
    </div>;
    let playingRoomsJSX = <div className="gamesPlaying gameList">
        <h1>Тут пусто :/</h1>
    </div>;
    if (rooms != null) {
        const filtred1 = Object.keys(rooms).filter((e) => {
            return !(rooms[e].fuser != "null" && rooms[e].suser != "null");
        });
        const filtred2 = Object.keys(rooms).filter((e) => {
            return (rooms[e].fuser != "null" && rooms[e].suser != "null");
        })
        const time = new Date().getTime();
        filtred2.forEach((el) => {
            if ((time - rooms[el].started) / 1000 >= 275) {
                const user1: roomUserT | "null" = rooms[el].fuser
                if (user1 != "null") {
                    updateDoc(doc(db, "users", user1.uid), {
                        playing: "none"
                    })
                }
                const user2: roomUserT | "null" = rooms[el].suser
                if (user2 != "null") {
                    updateDoc(doc(db, "users", user2.uid), {
                        playing: "none"
                    })
                }
                remove(ref(database, `/rooms/${el}`));
            }
        })
        filtred1.forEach((el) => {
            if ((time - rooms[el].started) / 1000 >= 275) {
                const user1: roomUserT | "null" = rooms[el].fuser
                if (user1 != "null") {
                    updateDoc(doc(db, "users", user1.uid), {
                        playing: "none",
                    })
                }
                const user2: roomUserT | "null" = rooms[el].suser
                if (user2 != "null") {
                    updateDoc(doc(db, "users", user2.uid), {
                        playing: "none"
                    })
                }
                remove(ref(database, `/rooms/${el}`));
            }
        })
        roomsJSX = <div className="gamesSearching gameList">
            {filtred1.length > 0 && filtred1.map((e) => {
                return <Link key={e} to={`/room/${e}`}><GameCard photoURL={rooms[e].photoURL} gameName={rooms[e].gameName}></GameCard></Link>
            })}
            {filtred1.length == 0 && <h1>Тут пусто :/</h1>}
        </div>
        playingRoomsJSX = <div className="gamesPlaying gameList">
            {filtred2.length > 0 && filtred2.map((e) => {
                return <Link key={e} to={`/room/${e}`}><GameCard photoURL={rooms[e].photoURL} gameName={rooms[e].gameName}></GameCard></Link>
            })}
            {filtred2.length == 0 && <h1>Тут пусто :/</h1>}
        </div>
    }
    if (isLoading)
        return <Loading></Loading>
    return <div className="gamePanel">
        {location.state != null && <div className="modal-bg">
            <div className="modalWindow">
                <div className="bar">
                    <button className="close-window" onClick={() => {
                        history.replaceState(null, "");
                        location.state = null;
                        setTrigger(lv => !lv);
                    }}>✕</button>
                </div>
                <h1 className="window-info">{location.state.state}</h1>
            </div>
        </div>}
        <div className="gameTools">
            <Link to="/createNewGame" className="newGame center">
                Новая игра <span className="green">+</span>
            </Link>
            <a className="playButton" onClick={() => {
                if (rooms != null) {
                    const f1 = Object.keys(rooms).filter((e) => {
                        return !(rooms[e].fuser != "null" && rooms[e].suser != "null");
                    })
                    if (f1.length > 0) {
                        navigate(`/room/${f1[0]}`);
                    }
                }
            }}>Играть <span className="green2 center">▶</span></a>
        </div>
        <div className="games">
            <div className="headers">
                <div className="check1">
                    <input type="radio" id="search" name="game" className="gameRadio1" checked />
                    <label htmlFor="search">В поиске</label>
                </div>
                <div className="check2">
                    <input type="radio" id="play" name="game" className="gameRadio2" />
                    <label htmlFor="play">Играют</label>
                </div>
            </div>
            <div className="gamesList">
                {playingRoomsJSX}
                {roomsJSX}
            </div>
        </div>
        <div className="inGame">
        </div>
    </div>
}

export default GamePanel