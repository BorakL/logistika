import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Vozac } from "../types";
import { QueryDocumentSnapshot, DocumentData } from "firebase/firestore";
import {
  collection,
  getDocs,
  addDoc,
  deleteDoc,
  doc
} from "firebase/firestore"

import { db } from "../firebase"

const Vozaci = () => {
    const[vozaci, setVozaci] = useState<Vozac[]>([]);
    const vozacForm = useForm<{
        ime: string;
        prezime: string
    }>();
    
    useEffect(() => {
        const fetchVozaci = async () => {
            try{
                //Fečujemo Vozače iz baze
                const snapshot = await getDocs(collection(db, "vozaci"))
                const vozaciData: Vozac[] = snapshot.docs.map(
                    (doc: QueryDocumentSnapshot<DocumentData>) => ({
                        id: doc.id,
                        ...(doc.data() as Omit<Vozac, "id">)
                    })
                )
                if(vozaciData){
                    setVozaci(vozaciData)
                }
            }catch(error){
                console.log("Problem sa učitavanjem podataka o transportu: ", error)
            }
        }
        fetchVozaci();
    },[])

    const addVozac = async(data: {ime:string, prezime:string}) => {
        try{
            //Dodajemo vozaca u bazu
            await addDoc(collection(db, "vozaci"), {
                ime: data.ime,
                prezime: data.prezime
            })
            const noviVozac: Vozac = {
                id: Date.now().toString(),
                ime: data.ime,
                prezime: data.prezime
            }
            const updatedVozaci = [...vozaci, noviVozac];
            setVozaci(updatedVozaci);
            vozacForm.reset();
        }catch(error){
            console.log("Problem prilikom dodavanja novog vozaca: ", error)
        }
    }

    const removeVozac = async (id: string) => {
        try {
            // Brišemo vozača iz baze
            await deleteDoc(doc(db, "vozaci", id))
            const updatedVozaci = vozaci.filter(v => v.id !== id);
            setVozaci(updatedVozaci);
        } catch (error) {
            console.log("Greška prilikom brisanja vozača: ", error);
            alert("Došlo je do greške prilikom brisanja vozača.");
        }
    };

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
                                {vozac.ime} {vozac.prezime}
                            </div>
                            <button 
                                className="btn btn-sm btn-outline-danger"
                                onClick={() => removeVozac(vozac.id)}
                            >
                                <i className="bi bi-trash"></i> Obriši
                            </button>
                        </li>)}
                </ul>
                <div className="card">
                    <div className="card-body">
                        <form onSubmit={vozacForm.handleSubmit(addVozac)}>
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