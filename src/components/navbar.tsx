import { Link } from "react-router";

const NavBar = () => {
    return(
        <nav className="navbar navbar-expand-lg navbar-light bg-light">
            <a className="navbar-brand">Logistika</a>
            <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarNavAltMarkup" aria-controls="navbarNavAltMarkup" aria-expanded="false" aria-label="Toggle navigation">
                <span className="navbar-toggler-icon"></span>
            </button>
            <div className="collapse navbar-collapse" id="navbarNavAltMarkup">
                <div className="navbar-nav">
                    <Link to="/linije" className="nav-item nav-link">Linije</Link>
                    <Link to="/vozaci" className="nav-item nav-link">Vozaci</Link>
                    <Link to="/vozila" className="nav-item nav-link">Vozila</Link>
                    <Link to="/adminPanel" className="nav-item nav-link">Admin Panel</Link>
                </div>
            </div>
        </nav>
    )
}

export default NavBar;