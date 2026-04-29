import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";

const Vozila = () => {
    const[vozila, setVozila] = useState<string[]>([])
    const voziloForm = useForm<{
        tablice: string
    }>();
    
    useEffect(() => {
        const fetchVozila = async () => {
            try{
                //Fečujemo Vozila iz baze
                // if(transport){
                //     setVozila(transport.vozila);
                // }
            }catch(error){
                console.log("Problem sa učitavanjem podataka o transportu: ", error)
            }
        }
        fetchVozila();
    },[])

    const addVozilo = async (data: {tablice:string}) => {
        try{
            const updatedVozila = [...vozila, data.tablice];
            setVozila(updatedVozila);
            //Dodajemo vozilo u bazu
            voziloForm.reset();
        }catch(error){
            console.log("Problem prilikom dodavanja novog vozila: ", error)
        }
    }

    const removeVozilo = async(tablice:string) => {
        try{
            const updatedVozila = vozila.filter(v => v!==tablice);
            setVozila(updatedVozila);
            //Obriši vozača iz baze
            //Fečuj dostavne ture
            
            // U stejtu ture vidi da li ima neko sa tablicama koje se brišu i obriši to vozilo
            // if(ture.some(t => t.vozilo===tablice)){
            //     const updatedTure = ture.map((t) => {
            //         return t.vozilo===tablice ? {...t, vozilo:""} : t
            //     })
            //     await window.electronApp.writeJsonFile('dostavneTure.json', {...dostavneTure, ture: updatedTure});
            // }
        }catch(error){
            console.log("Greška prilikom brisanja vozila: ", error)
        }
    }


    return(
        <div className="container py-4">
            <div className="mb-5">
                <h2>Vozila</h2>
                <ul className="list-group mb-3">
                    {vozila.map((vozilo) => 
                        <li 
                            className="list-group-item d-flex justify-content-between align-items-center" 
                            key={vozilo}
                        >
                            <div className="me-3">{vozilo}</div>
                            <button 
                                className="btn btn-sm btn-outline-danger"
                                onClick={() => removeVozilo(vozilo)}
                            >
                                <i className="bi bi-trash"></i> Obriši
                            </button>
                        </li>
                    )}
                </ul>
                <div className="card">
                    <div className="card-body">
                        <form onSubmit={voziloForm.handleSubmit(addVozilo)}>
                            <div className="row g-2 align-items-center">
                                <div className="col">
                                    <input 
                                        type="text"
                                        className={`form-control ${voziloForm.formState.errors.tablice ? 'is-invalid' : ''}`} 
                                        {...voziloForm.register('tablice', {
                                            required:'Obavezno polje!', 
                                            validate: (value) => {
                                                const postoji = vozila.some(vozilo => vozilo === value);
                                                return !postoji || 'Vozilo sa ovom registracijom već postoji u bazi podataka!'
                                            }
                                        })} 
                                        placeholder="Registracija"
                                    />
                                    {voziloForm.formState.errors.tablice && (
                                        <div className="invalid-feedback">
                                            {voziloForm.formState.errors.tablice.message}
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