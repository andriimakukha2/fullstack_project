import { useState } from "react";
import { useDispatch } from "react-redux";
import { setUser, setToken } from "../redux/userSlice";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import "../assets/styles/main.scss";

function Login() {
    const [formData, setFormData] = useState({
        email: "",
        password: "",
    });

    const [error, setError] = useState("");
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");

        try {
            const res = await axios.post("http://localhost:5001/api/auth/login", formData);
            dispatch(setUser(res.data.user));
            dispatch(setToken(res.data.token));
            navigate("/profile"); // Перенаправлення після логіну
        } catch (err) {
            setError(err.response?.data?.message || "Помилка входу");
        }
    };

    return (
        <div className="auth-container">
            <h2>Авторизація</h2>
            {error && <p className="error">{error}</p>}
            <form onSubmit={handleSubmit}>
                <input type="email" name="email" placeholder="Email" onChange={handleChange} required />
                <input type="password" name="password" placeholder="Пароль" onChange={handleChange} required />
                <button type="submit">Увійти</button>
            </form>
            <p className="switch-auth">
                Ще не маєте акаунта? <Link to="/register">Зареєструватися</Link>
            </p>
        </div>
    );
}

export default Login;
