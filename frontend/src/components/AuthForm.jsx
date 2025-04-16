import api from "../api";
import {useState} from "react";
import {useNavigate} from "react-router-dom";
import { ACCESS_TOKEN, REFRESH_TOKEN } from "../token";

const AuthForm = ({route, method}) => 
{
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);
    const navigate = useNavigate();

    const handleSubmit = async (event) => {
        event.preventDefault();
        setLoading(true);
        setError(null);
        setSuccess(null);

        try {
            const res = await api.post(route, {username, password});

            if (method === 'login')
            {
                localStorage.SetItem(ACCESS_TOKEN, res.data.access);
                localStorage.setItem(REFRESH_TOKEN, res.data.refresh);
                navigate("/");
                window.location.reload();
            } else {
                setSuccess("Registration successful. Please login.");
                setTimeout(() => {
                    navigate("/login");
                }, 2000)
            }
        }
        catch (error) {
            console.error(error);
            if (error.response) {
                if (error.response.status == 401) {
                    setError("Invalid credentials");
                } else if (error.response.status == 400) {
                    setError("Username already exists");
                } else {
                    setError("Something went wrong. Please try again");
                }
            } else if (error.request) {
                setError("Network error. Please check your internet connection.");
            } else {
                setError("Something went wrong. Please try again");
            }
        }   finally {
            setLoading(false);
        }
    };

    const handleGoogleLogin = () => {
        window.location.href = "http://localhost:8000/accounts/google";
    }

}