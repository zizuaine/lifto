import { Link, useLocation } from "react-router-dom";


const Header = () => {
    const location = useLocation();
    const userToken = localStorage.getItem("token");
    const isLightPage =
        location.pathname === "/login" ||
        location.pathname === "/signup" ||
        location.pathname === "/subscribe";

    return (
        <header className="hero-header">
            <nav className={isLightPage ? "floating-nav auth-nav" : "floating-nav"} >
                <Link className="nav-mark" to="/" aria-label="Lifto home">
                    <img src="/favicon.svg" width="20" height="20" alt="lifto" />
                </Link>
                <Link className="nav-link" to="/">Home</Link>
                {userToken ? <Link className="nav-link" to="/dashboard">dashboard</Link> : null}
                <Link className="nav-link" to="/charities">charities</Link>
                <Link className="nav-link" to="/admin">admin</Link>
                {!userToken ? <Link className="nav-link" to="/login">login</Link> : null}
                <Link className="nav-link" to="/subscribe">subscribe</Link>
            </nav>
        </header>
    );
};

export default Header;
