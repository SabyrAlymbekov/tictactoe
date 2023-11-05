import { useState } from "react";
import { Link, useNavigate } from "react-router-dom"
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { auth, db } from "../firebase";
import { doc, setDoc } from "firebase/firestore";
import "./signup.css"

function Signup() {
  const [username, setUsername] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [err, setErr] = useState<Boolean>(false);
  const navigate = useNavigate();
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      console.log(username);
      
      const res = await createUserWithEmailAndPassword(auth, email, password);
      await updateProfile(res.user, {
        displayName: username,
        photoURL: "default"
      })
      await setDoc(doc(db, "users", res.user.uid), {
        uid: res.user.uid,
        displayName: username,
        photoURL: "default",
        email,
        stats: [],
        exp: 0,
        playing: "none",
        lastImgStorage: "none"
      });
      navigate('/');
    } catch(e) {
      setErr(true);
    }
  }
  return (
    <div className="signup">
      <h1 className="signup-text">Зарегистрироваться</h1>
      <form onSubmit={handleSubmit} className="signup-form">
          <input required type="text" placeholder="никнейм" value={username} onChange={(e: React.ChangeEvent<HTMLInputElement>)=>{
              setUsername(e.target.value);
          }} maxLength={20} />
          <input required type="email" placeholder="почта" value={email} onChange={(e: React.ChangeEvent<HTMLInputElement>)=>{
              setEmail(e.target.value);
          }} />
          <input required type="password" placeholder="пароль" value={password} onChange={(e: React.ChangeEvent<HTMLInputElement>)=>{
              setPassword(e.target.value);
          }} />
          <button type="submit" className="signup-button">Отправить</button>
          {err && <span>Что то пошло не так</span>}
        </form>
        <p className="signup-text-sub">
          Уже есть аккаунт? <Link to="/login">Войти</Link>
        </p>
    </div>
  )
}

export default Signup