import { Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../redux/userSlice";
import "../assets/styles/main.scss";

function Navbar() {
    const user = useSelector((state) => state.user.user);
    const dispatch = useDispatch();

    const handleLogout = () => {
        dispatch(logout());
    };

    return (
        <nav className="navbar">
            <Link to="/">🔥 MyApp</Link>
            <div className="nav-links">
                {user ? (
                    <>
                        <Link to="/chat">Чат</Link>
                        <Link to="/profile">Профіль</Link>
                        <button className="logout-btn" onClick={handleLogout}>Вийти</button>
                    </>
                ) : (
                    <>
                        <Link to="/login">Вхід</Link>
                        <Link to="/register">Реєстрація</Link>
                    </>
                )}
            </div>
        </nav>
    );
}

export default Navbar;
