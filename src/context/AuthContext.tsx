import { User, onAuthStateChanged } from "firebase/auth";
import { ReactNode, createContext, useEffect, useState, Dispatch, SetStateAction} from "react";
import { doc, getDoc } from "firebase/firestore";
import { auth, db } from "../firebase";
import Loading from "../components/loading";

export interface userDataT {
    uid: string,
    displayName: string,
    email: string,
    exp: number,
    photoURL: string,
    playing: string,
    lastImgStorage: string,
}
export interface ContextT {
    user: User | null,
    userData: userDataT | null,
    setTrigger: Dispatch<SetStateAction<Boolean>>
}
interface Props {
    children?: ReactNode
}

export const AuthContext = createContext<ContextT>({
    user: null,
    userData: null,
    setTrigger: ()=>{}
});

export const AuthContextProvider = ({ children }: Props) => {
    const [user, setUser] = useState<User | null>(null);
    const [userData, setUserData] = useState<userDataT | null>(null);
    const [isload, setLoad] = useState<Boolean>(true);
    const [trigger, setTrigger] = useState<Boolean>(true);
    useEffect(() => {
        const unsub = onAuthStateChanged(auth, async (user: User | null)=>{
            setUser(user);
            if (user != null) {
                const docRef = doc(db, "users", user!.uid);
                const userD = await getDoc(docRef);
                const userD2 = userD.data();
                setUserData(userD2 as userDataT);
            }
            setLoad(false);
        })
        return () => {
            unsub();
        }
    }, [trigger])
    return <AuthContext.Provider value={{
        user,
        userData,
        setTrigger
    }}>
        {isload ? 
            <Loading></Loading>
        : children}
    </AuthContext.Provider>
}

