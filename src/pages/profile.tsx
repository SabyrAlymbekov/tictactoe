import { useContext, useState, ChangeEvent } from "react"
import { AuthContext } from "../context/AuthContext"
import { doc, setDoc } from "firebase/firestore";
import { auth, db, storage } from "../firebase";
import { User, signOut, updateProfile } from "firebase/auth";
import { ref, uploadBytesResumable, getDownloadURL, deleteObject } from "firebase/storage";
import imageCompression from 'browser-image-compression';
import "./profile.css"

interface confT {
    displayName?: string;
    photoURL?: string;
}

function Profile() {
    const { user, userData, setTrigger } = useContext(AuthContext);
    const [isLoading, setIsLoading] = useState<Boolean>(false);
    const [username, setUsername] = useState<string>(userData!.displayName as string);
    const docRef = doc(db, "users", user!.uid);
    const changeProfile = async (configs: confT) => {
        setIsLoading(true);
        await updateProfile(user as User, configs);
        const newObj = {
            ...userData,
            ...configs
        }
        await setDoc(docRef, newObj);
        setTrigger((lv) => !lv)
        setIsLoading(false);
    }
    const changeAvatar = async (file: ChangeEvent<HTMLInputElement>) => {
        if (file.target.files) {
            setIsLoading(true);
            const fileImg = file.target.files[0];
            const options = {
                maxSizeMB: 0.1,
                maxWidthOrHeight: 300
            }
            try {
                const compressedFile = await imageCompression(fileImg, options);
                const date = new Date().getTime();
                if (userData != null && userData.photoURL != "default" && userData.lastImgStorage != "none") {
                    const lastStorageRef = ref(storage, userData.lastImgStorage);
                    deleteObject(lastStorageRef)
                }
                const storageRef = ref(storage, `${username + date}`);
                await uploadBytesResumable(storageRef, compressedFile)
                await getDownloadURL(storageRef).then(async (downloadURL) => {
                    await updateProfile(user as User, {
                        photoURL: downloadURL,
                    });
                    const obj = {
                        ...userData,
                        photoURL: downloadURL,
                    }
                    if (userData != null && userData.photoURL != "default") {
                        obj.lastImgStorage = `${username + date}`;
                    }
                    await setDoc(docRef, obj);
                });
                setTrigger((lv) => !lv);
                setIsLoading(false);
            } catch (error) {
                throw new Error("File compression error" + error);
            }
        }
    }
    if (!isLoading) {
        let avatarURL = "https://api.dicebear.com/7.x/bottts-neutral/svg?seed=Sheba&backgroundType=gradientLinear";
        if (userData?.photoURL != "default") {
            avatarURL = userData?.photoURL as string;
        }

        return (
            <div className="profile">
                <div className="userData">
                    <div className="avatarIMG">
                        <img src={avatarURL} alt="avatar" className="avatar" />
                        <input type="file" accept="image/png, image/jpeg" onChange={(e: ChangeEvent<HTMLInputElement>) => {
                            changeAvatar(e);
                        }} className="changeAvatar" />
                    </div>
                    <div className="userInf">
                        <div className="username">
                            <input type="text" value={username} onChange={(e) => {
                                setUsername(e.target.value);
                            }} className="username-input" maxLength={20} />
                            <button type="button" onClick={() => {
                                if (username != userData?.displayName) {
                                    changeProfile({
                                        displayName: username
                                    });
                                }
                            }} className="change-username-button">Сменить</button>
                        </div>
                        <p>exp: {userData?.exp as number}</p>
                        <p>email: {userData?.email as string}</p>
                    </div>
                </div>
                <button className="signup-button" onClick={() => signOut(auth)}>Logout</button>
            </div>
        )
    } else {
        return (
            <div className="profile">
                <h1>Загрузка...</h1>
            </div>
        )
    }
}

export default Profile