import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { db } from "../firebase";
import { addDoc, collection, deleteDoc, doc, getDocs } from "firebase/firestore";
import { Vozilo } from "../types";

const Vozila = () => {
    const[vozila, setVozila] = useState<Vozilo[]>([])
    const voziloForm = useForm<{
        naziv: string
    }>();
    
    useEffect(() => {
        const fetchVozila = async () => {
            try{
                //Fečujemo Vozila iz baze
                const snapshot = await getDocs(collection(db, "vozila"));
                const vozilaData = snapshot.docs.map(doc => {
                    const data = doc.data()
                    return {
                        id: doc.id,
                        naziv: data.naziv
                    } as Vozilo
                })
                if(vozilaData){
                    setVozila(vozilaData)
                }
            }catch(error){
                console.log("Problem sa učitavanjem podataka o transportu: ", error)
            }
        }
        fetchVozila();
    },[])

    const addVozilo = async (data: {naziv:string}) => {
        try{
            //Dodajemo vozilo u bazu
            await addDoc(collection(db, "vozila"), {
                naziv: data.naziv
            })
            const novoVozilo: Vozilo = {
                id: Date.now().toString(),
                naziv: data.naziv
            }
            if(vozila.some(v => v.naziv===novoVozilo.naziv)){
                throw Error("Vozilo sa ovom registracijom već postoji u bazi")
                return;
            }
            const updatedVozila = [...vozila, novoVozilo];
            setVozila(updatedVozila);
            voziloForm.reset();
        }catch(error){
            console.log("Problem prilikom dodavanja novog vozila: ", error)
        }
    }
    

    const removeVozilo = async(id:string) => {
        try{
            //Obriši vozilo iz baze
            await deleteDoc(doc(db, "vozilo", id))
            const updatedVozila = vozila.filter(v => v.id===id);
            setVozila(updatedVozila);
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
                            key={vozilo.id}
                        >
                            <div className="me-3">{vozilo.naziv}</div>
                            <button 
                                className="btn btn-sm btn-outline-danger"
                                onClick={() => removeVozilo(vozilo.id)}
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