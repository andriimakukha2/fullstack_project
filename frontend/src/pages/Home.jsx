import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import "../assets/styles/main.scss";
function Home() {
    const user = useSelector((state) => state.user.user);

    return (
        <div className="home-container">
            <h1>Ласкаво просимо до MyApp! 🚀</h1>
            {user ? (
                <p>Привіт, {user.username}! Перейдіть у <Link to="/profile">профіль</Link> або перегляньте новини.</p>
            ) : (
                <p>Будь ласка, <Link to="/login">увійдіть</Link> або <Link to="/register">зареєструйтесь</Link>.</p>
            )}
        </div>
    );
}

export default Home;
