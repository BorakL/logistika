import { useForm } from "react-hook-form";
import { Vozac } from "../types";
import { useData } from "../context/dataContext";
import { useState } from "react";
import ConfirmModal from "../components/confirmModal";

const Vozaci = () => {
    const {
        vozaci,
        deleteVozac,
        addVozac,
        loading
    } = useData()

    const[showMessage1, setShowMessage1] = useState(false)
    const[showMessage2, setShowMessage2] = useState(false)

    // const[vozaci, setVozaci] = useState<Vozac[]>([]);
    const vozacForm = useForm<{
        ime: string;
        prezime: string;
        nadimak?: string
    }>();

    const addVozacHandler = (data: {ime:string, prezime:string, nadimak?:string}) => {
        try{
            let error = false;
            vozaci.forEach(vozac => {
                if(vozac.ime===data.ime && vozac.prezime===data.prezime){
                    if(!vozac.nadimak && !data.nadimak){
                        setShowMessage1(true);
                        error = true;
                        return
                    }else if(vozac.nadimak===data.nadimak){
                        setShowMessage2(true)
                        error = true;
                        return
                    }
                    error = false;
                }
            })
            if(error){
                return;
            }
            addVozac(data.ime, data.prezime, data.nadimak)
            vozacForm.reset()
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

    if(loading){
        return <b>Loading...</b>
    } 

    return(
        <div className="container py-4">
            <div className="mb-5">
                <h2>Vozači</h2>
                <ul className="list-group mb-3">
                    {vozaci.map((vozac: Vozac) => 
                        <li 
                            className="list-group-item d-flex justify-content-between align-items-center" 
                            key={vozac.id}
                        >
                            <div className="me-3">
                                {vozac.ime} {vozac.prezime} {vozac.nadimak || ""}
                            </div>
                            <button 
                                className="btn btn-sm btn-outline-danger"
                                onClick={() => removeVozacHandler(vozac.id)}
                            >
                                <i className="bi bi-trash"></i> Obriši
                            </button>
                        </li>
                    )}
                </ul>
                <div className="card">
                    <form onSubmit={vozacForm.handleSubmit(addVozacHandler)}>
                        <div className="form-group">
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
                        <div className="form-group">
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
                        <div className="form-group">
                            <input 
                                type="text" 
                                className="form-control"
                                {...vozacForm.register('nadimak')}
                                placeholder="Nadimak (opciono)"    
                            />
                        </div>
                        <div className="col-12">
                            <button type="submit" className="btn btn-primary">
                                <i className="bi bi-plus-circle"></i> Dodaj vozača
                            </button>
                        </div>
                    </form>
                </div>
            </div>

        <ConfirmModal
          show={showMessage1}
          onClose={() => {
            setShowMessage1(false);
          }}
          inform={true}
          message="Vozač sa datim imenom i prezimenom postoji u bazi! Dodajte nadimak."
        />

        <ConfirmModal
          show={showMessage2}
          onClose={() => {
            setShowMessage2(false);
          }}
          inform={true}
          message="Vozač sa datim imenom, prezimenom i nadimkom postoji u bazi! Promenite nadimak."
        />

        </div>
    )
}

export default Vozaci;