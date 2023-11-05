import { Link, useNavigate } from "react-router-dom"
import { signInWithEmailAndPassword } from "firebase/auth";
import { useState } from "react";
import { auth } from "../firebase";
import "./login.css"

function Login() {
  const [err, setErr] = useState(false);
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigate("/")
    } catch (err) {
      setErr(true);
    }
  };
  return (
    <div className="login">
      <h1 className="login-text">Войти</h1>
      <form onSubmit={handleSubmit} className="login-form">
          <input required type="email" placeholder="почта" onChange={(e: React.ChangeEvent<HTMLInputElement>)=>{
              setEmail(e.target.value);
          }}/>
          <input required type="password" placeholder="пароль" onChange={(e: React.ChangeEvent<HTMLInputElement>)=>{
              setPassword(e.target.value);
          }}/>
          <button type="submit" className="login-button">Отправить</button>
          {err && <span>Что то пошло не так</span>}
        </form>
        <p className="login-text-sub">
          Нет аккаунта? <Link to="/signup">Зарегистрироваться</Link>
        </p>
    </div>
  )
}

export default Login