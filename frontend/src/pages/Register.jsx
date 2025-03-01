import { useState } from "react";
import { useDispatch } from "react-redux";
import { setUser, setToken } from "../redux/userSlice";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "../assets/styles/main.scss";

function Register() {
    const [formData, setFormData] = useState({
        username: "",
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
            const res = await axios.post("http://localhost:5001/api/auth/register", formData);
            dispatch(setUser(res.data.user));
            dispatch(setToken(res.data.token));
            navigate("/");
        } catch (err) {
            setError(err.response?.data?.message || "Помилка реєстрації");
        }
    };

    return (
        <div className="auth-container">
            <h2>Реєстрація</h2>
            <form onSubmit={handleSubmit}>
                <input type="text" name="username" placeholder="Логін" onChange={handleChange} required />
                <input type="email" name="email" placeholder="Email" onChange={handleChange} required />
                <input type="password" name="password" placeholder="Пароль" onChange={handleChange} required />
                <button type="submit">Зареєструватися</button>
            </form>
            {error && <p className="error">{error}</p>}
        </div>
    );
}

export default Register;
