import { useNavigate } from "react-router";
import KlinikeField from "../components/klinikeField";
import { useData } from "../context/dataContext";
import { DostavnaLinija } from "../types";

const AdminPanel = () => {
    const{linije} = useData();
    const navigate = useNavigate();
    return(
        <div className="container py-4">
            <h2>Admin Panel</h2>
            <div>
                {linije.map((l:DostavnaLinija) => <KlinikeField key={l.id} linija={l} />)}
            </div>
            <div className="mt-4">
                <button onClick={() => navigate("/novaLinija")} className="btn btn-primary">Dodaj novu liniju</button>
            </div>
        </div>
    )
}

export default AdminPanel;