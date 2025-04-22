import { Link } from "react-router-dom";

export default function Home() {
    return (
        <div>
            <h1>Welcome to the Home Page</h1>
            <Link to="/login">Google</Link>
        </div>
    );
}