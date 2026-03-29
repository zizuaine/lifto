import { Link, useLocation, useNavigate } from "react-router-dom";


const Header = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const userToken = localStorage.getItem("token");
    const adminToken = localStorage.getItem("adminToken");
    const isLightPage =
        location.pathname === "/login" ||
        location.pathname === "/signup" ||
        location.pathname === "/subscribe";

    const handleUserLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        navigate("/login");
    };

    const handleAdminLogout = () => {
        localStorage.removeItem("adminToken");
        localStorage.removeItem("adminUser");
        navigate("/admin");
    };

    return (
        <header className="hero-header">
            <nav className={isLightPage ? "floating-nav auth-nav" : "floating-nav"} >
                <Link className="nav-link" to="/">Home</Link>
                {userToken ? <Link className="nav-link" to="/dashboard">dashboard</Link> : null}
                <Link className="nav-link" to="/charities">charities</Link>

                <span className="nav-badge">
                    <img src="/favicon.svg" width="20" height="20" alt="lifto" />
                </span>

                <Link className="nav-link" to="/admin">admin</Link>
                {userToken ? (
                    <button className="nav-link nav-button" onClick={handleUserLogout}>logout</button>
                ) : (
                    <Link className="nav-link" to="/login">login</Link>
                )}
                {adminToken ? (
                    <button className="nav-link nav-button" onClick={handleAdminLogout}>admin logout</button>
                ) : null}
                <Link className="nav-link" to="/subscribe">subscribe</Link>
            </nav>
        </header>
    );
};

export default Header;
