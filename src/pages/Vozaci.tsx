import { useForm } from "react-hook-form";
import { Vozac } from "../types";
import { useData } from "../context/dataContext";

const Vozaci = () => {
    const {
        vozaci,
        deleteVozac,
        addVozac,
        loading
    } = useData()

    // const[vozaci, setVozaci] = useState<Vozac[]>([]);
    const vozacForm = useForm<{
        ime: string;
        prezime: string
    }>();

    const addVozacHandler = (data: {ime:string, prezime:string}) => {
        try{
            addVozac(data.ime, data.prezime)
        }catch(error){
            console.log(error)
        }
    }

    const removeVozacHandler = (id:string) => {
        try{
            deleteVozac(id)
        }catch(error){
            console.log(error)
        }
    }

    return(
        <div className="container py-4">
            <div className="mb-5">
                <h2>Vozači</h2>
                {loading ? <b>Loading...</b> : null}
                <ul className="list-group mb-3">
                    {vozaci.map((vozac: Vozac) => 
                        <li 
                            className="list-group-item d-flex justify-content-between align-items-center" 
                            key={vozac.id}
                        >
                            <div className="me-3">
                                {vozac.ime} {vozac.prezime}
                            </div>
                            <button 
                                className="btn btn-sm btn-outline-danger"
                                onClick={() => removeVozacHandler(vozac.id)}
                            >
                                <i className="bi bi-trash"></i> Obriši
                            </button>
                        </li>)}
                </ul>
                <div className="card">
                    <div className="card-body">
                        <form onSubmit={vozacForm.handleSubmit(addVozacHandler)}>
                            <div className="row g-3">
                                <div className="col-md-6">
                                    <input
                                        type="text" 
                                        className={`form-control ${vozacForm.formState.errors.ime ? 'is-invalid' : ''}`}
                                        {...vozacForm.register('ime', {required:'Obavezno polje!'})} 
                                        placeholder="Ime"
                                    />
                                    {vozacForm.formState.errors.ime && (
                                        <div className="invalid-feedback">
                                            {vozacForm.formState.errors.ime.message}
                                        </div>
                                    )}
                                </div>
                                <div className="col-md-6">
                                    <input 
                                        type="text"
                                        className={`form-control ${vozacForm.formState.errors.prezime ? 'is-invalid' : ''}`} 
                                        {...vozacForm.register('prezime', {required:'Obavezno polje!'})} 
                                        placeholder="Prezime"
                                    />
                                    {vozacForm.formState.errors.prezime && (
                                        <div className="invalid-feedback">
                                            {vozacForm.formState.errors.prezime.message}
                                        </div>
                                    )}
                                </div>
                                <div className="col-12">
                                    <button type="submit" className="btn btn-primary">
                                        <i className="bi bi-plus-circle"></i> Dodaj vozača
                                    </button>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Vozaci;