import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import "../assets/styles/main.scss";

function Profile() {
    const user = useSelector((state) => state.user.user);
    const navigate = useNavigate();

    if (!user) {
        navigate("/login");
        return null;
    }

    return (
        <div className="profile-container">
            <h1>Профіль</h1>
            <div className="profile-info">
                <p><strong>Ім'я:</strong> {user.username}</p>
                <p><strong>Email:</strong> {user.email}</p>
                <p><strong>Роль:</strong> {user.role}</p>
            </div>
        </div>
    );
}

export default Profile;
