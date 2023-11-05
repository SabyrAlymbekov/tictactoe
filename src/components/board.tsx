import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { roomT } from "../pages/newGame";
import { update, ref } from "firebase/database";
import { database } from "../firebase";

interface Props {
    roomD: roomT
}
interface TileProps {
    tileID: number,
    player: string,
    roomD: roomT
}
function Tile({ tileID, player, roomD } : TileProps) {
    const types = [" ", "✕", "〇"]
    return <div className={"tile tile" + roomD.board[tileID]} onClick={()=>{
        if (roomD.board[tileID] == 0 && ((roomD!.fuser != "null" && player == roomD.fuser.uid) ||(roomD!.suser != "null" && player == roomD!.suser!.uid))) {
            if (((roomD!.fuser != "null" && player == roomD.fuser.uid) && roomD.turn == "fuser") || ((roomD!.suser != "null" && player == roomD!.suser!.uid) && roomD.turn == "suser")) {
                if (roomD!.fuser != "null" && player == roomD.fuser.uid && roomD.x == "fuser") {
                    roomD.board[tileID] = 1;
                } else if (roomD!.suser != "null" && player == roomD.suser.uid && roomD.x == "suser") {
                    roomD.board[tileID] = 1;
                } else {
                    roomD.board[tileID] = 2;
                }
                update(ref(database, `rooms/${roomD.roomId}`), {
                    board: roomD.board,
                    turn: (roomD.turn == "fuser") ? "suser" : "fuser",
                    lastAction: (new Date()).getTime()
                });
            }
        }
    }}>{types[roomD.board[tileID]]}</div>
}

function Board({ roomD }: Props) {
    const { userData } = useContext( AuthContext );
    const boardJSX = <div className="GameBoard">
        {roomD.board.map((_e, index)=>{
            return <Tile key={index} tileID={index} roomD={roomD} player={userData!.uid}></Tile>
        })}
    </div>; 
    return boardJSX;
}
export default Board