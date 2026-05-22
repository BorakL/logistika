import { useForm } from "react-hook-form";
import { useData } from "../context/dataContext";
import { useNavigate } from "react-router-dom";
import ConfirmModal from "../components/confirmModal";
import { useState } from "react";
import { useConfirm } from "../context/confirmContext";

const Vozila = () => {
    const{
        vozila,
        linije,
        loading,
        addVozilo,
        deleteVozilo
    } = useData();

    const[showMessage,setShowMessage] = useState(false);
    const navigate = useNavigate();
    const {confirm} = useConfirm();

    const voziloForm = useForm<{
        naziv: string
    }>();

    const addVoziloHandler = async (data: {naziv:string}) => {
        try{
            if(vozila.some(v => v.naziv===data.naziv)){
                setShowMessage(true)
                return;
            }
            addVozilo(data.naziv)
            voziloForm.reset();
        }catch(error){
            console.log(error)
        }
    }
    

    const removeVoziloHandler = async(id: string, naziv: string) => {
        try{
            confirm({
                message: `Da li ste sigurni da želite da obrišete vozilo ${naziv.toUpperCase()}?`,
                onConfirm: async() => {
                    try{
                        // Prvo proveri da li se koristi
                        const koristiSeULinijama = linije.some(l => l.vozilo === id);
                        
                        // Obriši vozilo
                        await deleteVozilo(id);  // Dodaj await ako je deleteVozilo async
                        
                        // Tek nakon brisanja, navigiraj ako treba
                        if(koristiSeULinijama){
                            navigate('/linije', { replace: true });
                            // Opciono: dodaj mali timeout
                            // setTimeout(() => navigate('/linije'), 100);
                        }
                    }catch(error){
                        console.log(error)
                    }
                }
            })
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
                            <div className="me-3">{vozilo.naziv.toUpperCase()}</div>
                            <button 
                                className="btn btn-sm btn-outline-danger"
                                onClick={() => removeVoziloHandler(vozilo.id, vozilo.naziv)}
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
            <ConfirmModal
                show={showMessage}
                onClose={() => {
                    setShowMessage(false);
                }}
                inform={true}
                message="Vozilo sa navedenom registracijom već postoji u bazi"
            />
        </div>
    )
}

export default Vozila;