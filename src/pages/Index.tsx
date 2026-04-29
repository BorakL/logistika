import { Link } from "react-router";

const Index = () => {
    return(
        <div>
            <h1>Logistika</h1>
            <nav>
                <Link to="/">Index</Link>
                <Link to="/linije">Linije</Link>
                <Link to="/vozaci">Vozaci</Link>
                <Link to="/vozila">Vozila</Link>
            </nav>
        </div>
    )
}

export default Index;