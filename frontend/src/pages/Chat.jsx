import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { io } from "socket.io-client";
import "../assets/styles/main.scss";

const socket = io("http://localhost:5001"); // Підключення до сервера WebSocket

function Chat() {
    const user = useSelector((state) => state.user.user);
    const [message, setMessage] = useState("");
    const [messages, setMessages] = useState([]);

    useEffect(() => {
        socket.on("receiveMessage", (newMessage) => {
            setMessages((prev) => [...prev, newMessage]);
        });

        return () => {
            socket.off("receiveMessage");
        };
    }, []);

    const sendMessage = () => {
        if (message.trim()) {
            const newMessage = { sender: user.username, text: message };
            socket.emit("sendMessage", newMessage);
            setMessages((prev) => [...prev, newMessage]);
            setMessage("");
        }
    };

    return (
        <div className="chat-container">
            <div className="chat-box">
                <div className="chat-header">
                    <h2>Чат</h2>
                </div>
                <div className="chat-messages">
                    {messages.map((msg, index) => (
                        <div key={index} className={`message ${msg.sender === user.username ? "own" : ""}`}>
                            <span className="sender">{msg.sender}</span>
                            <p>{msg.text}</p>
                        </div>
                    ))}
                </div>
                <div className="chat-input">
                    <input
                        type="text"
                        placeholder="Напишіть повідомлення..."
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && sendMessage()}
                    />
                    <button onClick={sendMessage}>📩</button>
                </div>
            </div>
        </div>
    );
}

export default Chat;
