import { Link } from "react-router-dom";


const Header = () => {
    return (
        <header className="hero-header">
            <nav className="floating-nav" >
                <Link className="nav-link" to="/">Home</Link>
                <Link className="nav-link" to="/dashboard">dashboard</Link>
                <Link className="nav-link" to="/charities">charities</Link>

                <span className="nav-badge">
                    <img src="/favicon.svg" width="20" height="20" alt="lifto" />
                </span>

                <Link className="nav-link" to="/admin">admin</Link>
                <Link className="nav-link" to="/login">login</Link>
                <Link className="nav-link" to="subscribe">subscribe</Link>
            </nav>
        </header>
    );
};

export default Header;
