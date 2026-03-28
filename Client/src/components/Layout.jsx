import { Outlet } from "react-router-dom";
import Header from "./Header"

const Layout = () => {
    return (
        <main className="app-body">
            <section className="hero-frame">
                <div className="hero-card">
                    <Header />
                    <Outlet />
                </div>
            </section>
        </main>
    )
}

export default Layout;
