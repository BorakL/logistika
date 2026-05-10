import { useForm } from "react-hook-form";
import { useData } from "../context/dataContext";

const Vozila = () => {
    const{
        vozila,
        loading,
        addVozilo,
        deleteVozilo
    } = useData();

    const voziloForm = useForm<{
        naziv: string
    }>();

    const addVoziloHandler = async (data: {naziv:string}) => {
        try{
            addVozilo(data.naziv)
        }catch(error){
            console.log(error)
        }
    }
    

    const removeVoziloHandler = async(id:string) => {
        try{
            deleteVozilo(id)
        }catch(error){
            console.log(error)
        }
    }

    return(
        <div className="container py-4">
            <div className="mb-5">
                <h2>Vozila</h2>
                {loading ? <b>Loading...</b> : null}
                <ul className="list-group mb-3">
                    {vozila.map((vozilo) => 
                        <li 
                            className="list-group-item d-flex justify-content-between align-items-center" 
                            key={vozilo.id}
                        >
                            <div className="me-3">{vozilo.naziv}</div>
                            <button 
                                className="btn btn-sm btn-outline-danger"
                                onClick={() => removeVoziloHandler(vozilo.id)}
                            >
                                <i className="bi bi-trash"></i> Obriši
                            </button>
                        </li>
                    )}
                </ul>
                <div className="card">
                    <div className="card-body">
                        <form onSubmit={voziloForm.handleSubmit(addVoziloHandler)}>
                            <div className="row g-2 align-items-center">
                                <div className="col">
                                    <input 
                                        type="text"
                                        className={`form-control ${voziloForm.formState.errors.naziv ? 'is-invalid' : ''}`} 
                                        {...voziloForm.register('naziv', {
                                            required:'Obavezno polje!', 
                                            validate: (value) => {
                                                const postoji = vozila.some(vozilo => vozilo.id === value);
                                                return !postoji || 'Vozilo sa ovom registracijom već postoji u bazi podataka!'
                                            }
                                        })} 
                                        placeholder="Registracija"
                                    />
                                    {voziloForm.formState.errors.naziv && (
                                        <div className="invalid-feedback">
                                            {voziloForm.formState.errors.naziv.message}
                                        </div>
                                    )}
                                </div>
                                <div className="col-auto">
                                    <button type="submit" className="btn btn-primary">
                                        <i className="bi bi-plus-circle"></i> Dodaj vozilo
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

export default Vozila;