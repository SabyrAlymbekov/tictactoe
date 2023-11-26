import { Outlet, NavLink } from "react-router-dom"
import instagram from "../assets/Instagram-logo.png"
import telega from "../assets/telegramm-logo.png"
import { AuthContext } from "../context/AuthContext"
import { useContext } from "react"

function Layout() {
  const { userData } = useContext(AuthContext);
  let avatarURL = "https://api.dicebear.com/7.x/bottts-neutral/svg?seed=Sheba&backgroundType=gradientLinear";
  if (userData?.photoURL != "default" && userData)
        avatarURL = userData?.photoURL as string;
  return <main>
    <header>
        <h1 className="profile-text" >TicTacToe</h1>
        <nav>
          <NavLink to="/" className="menu-buttons">
            Играть
          </NavLink>
          <NavLink to="/rules" className="menu-buttons">
            Правила
          </NavLink>
          <NavLink to="/buymeacoffe" className="menu-buttons">
            Поддержать
          </NavLink>
          <NavLink to="/chat" className="menu-buttons">
            Чат
          </NavLink>
        </nav>
        <NavLink to={userData != null ? "/profile" : "/login"} className="profile-icon-link">
            {userData != null ? <img src={avatarURL} alt="" className="profile-icon"/> : "войти"}
        </NavLink>
        <div className="hamburger-menu">
          <input type="checkbox" className="hamburger-checkbox" name="scales" />
          <span className="hamburger-menu-stick"></span>
          <span className="hamburger-menu-stick"></span>
          <span className="hamburger-menu-stick"></span>
          <div className="board">
            <NavLink to="/" className="menu-buttons">
              Играть
            </NavLink>
            <NavLink to="/rules" className="menu-buttons">
              Правила
            </NavLink>
            <NavLink to="/buymeacoffe" className="menu-buttons">
              Поддержать
            </NavLink>
            {/* <NavLink to="/rating" className="menu-buttons">
              Рейтинг
            </NavLink> */}
            <NavLink to="/chat" className="menu-buttons">
              Чат
            </NavLink>
          <NavLink to="/profile" className="hamnav-icon-link">
              <img src={avatarURL} alt="" className="profile-icon"/>
          </NavLink>
          </div>
        </div>
    </header>
    <div className="content">
      <Outlet />
    </div>
    <footer>
        <h1 className="footer-text">Sabyr</h1>
        <div className="footer-links">
          <a href="https://t.me/EtaOlprogaProstoImba">
            <img src={telega} alt="telega" className="footer-img"/>
          </a>
          <a href="https://www.instagram.com/">
            <img src={instagram} alt="insta" className="footer-img"/>
          </a>
        </div>
    </footer>
  </main>
}

export default Layout
