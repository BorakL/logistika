import { createContext, useContext, useEffect, useState } from "react";
import { DostavnaLinija, Vozac, Vozilo } from "../types";
import { addDoc, collection, deleteDoc, doc, getDocs, updateDoc } from "firebase/firestore";
import { db } from "../firebase";

interface DataContextType {
    vozaci: Vozac[],
    vozila: Vozilo[],
    linije: DostavnaLinija[],
    loading: boolean,
    addVozilo: (naziv:string)=>void,
    addVozac: (ime:string, prezime:string, nadimak?:string)=>void,
    addLinija: (data:DostavnaLinija)=>void,
    deleteVozilo: (id:string)=>void,
    deleteVozac: (id:string)=>void,
    deleteLinija: (id:string)=>void,
    updateLinija: (id:string, data:Partial<DostavnaLinija>)=>void    
}

const DataContext = createContext<DataContextType | null>(null)

export const DataProvider = ({ children }: { children: React.ReactNode }) => {
    const [vozila, setVozila] = useState<Vozilo[]>([]);
    const [vozaci, setVozaci] = useState<Vozac[]>([]);
    const [linije, setLinije] = useState<DostavnaLinija[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async()=> {
            //Fečujemo podatke iz baze
            try{
                // VOZAČI
                const vozaciSnapshot = await getDocs(collection(db, "vozaci"))
                const vozaciData: Vozac[] = vozaciSnapshot.docs.map(doc => {
                    const data = doc.data()
                    return {
                        id: doc.id,
                        ime: data.ime,
                        prezime: data.prezime
                    }
                })
                setVozaci(vozaciData)
                
                // VOZILA
                const vozilaSnapshot = await getDocs(collection(db, "vozila"));
                const vozilaData: Vozilo[] = vozilaSnapshot.docs.map(doc => {
                    const data = doc.data()
                    return {
                        id: doc.id,
                        naziv: data.naziv
                    }
                })
                setVozila(vozilaData);

                // LINIJE
                const linijeSnapshot = await getDocs(collection(db, "linije"));
                const linijeData: DostavnaLinija[] = linijeSnapshot.docs.map(doc => {
                    const data = doc.data();
                    return {
                        id: doc.id,
                        broj: data.broj,
                        klinike: data.klinike,
                        vozilo: data.vozilo,
                        smene: data.smene,
                        izmene: []
                    }
                })
                setLinije(linijeData);

            } catch(error){
                console.log("Greška pri učitavanju podataka: ", error)
            } finally {
                setLoading(false)
            }
        }
        fetchData()
    },[])


    ////////////// FUNKCIJE ZA DODAVANJE U BAZU /////////////////
    
    // VOZILO
    const addVozilo = async (naziv:string) => {
        try{
            const docRef = await addDoc(
                collection(db, "vozila"),
                {naziv}
            )
            const novoVozilo: Vozilo = {
                id: docRef.id,
                naziv
            }
            setVozila(prev => [...prev, novoVozilo])
        }catch(error){
            console.log("Greška prilikom dodavanja novog vozila: ",error)
        }
    }

    // VOZAC
    const addVozac = async (ime: string, prezime: string, nadimak?: string) => {
        try{
            const docRef = await addDoc(
                collection(db, "vozaci"),
                {ime, prezime, nadimak: nadimak || ""}
            )
            const noviVozac: Vozac = {
                id: docRef.id,
                ime,
                prezime,
                nadimak: nadimak || ""
            }
            setVozaci(prev => [...prev, noviVozac])
        }catch(error){
            console.log("Greška prilikom dodavanja novog vozača: ",error)
        }
    }

    // LINIJA
    const addLinija = async (data: DostavnaLinija) => {
        try{
            const docRef = await addDoc(
                collection(db, "linije"),
                {...data}
            )
            const novaLinija: DostavnaLinija = {
                ...data,
                id: docRef.id,
            }
            setLinije(prev => [...prev, novaLinija])
        }catch(error){
            console.log("Greška prilikom dodavanja nove linije: ", error)
        }
    }

    /////////////////// FUNKCIJE ZA BRISANJE //////////////////

    // VOZILO
    const deleteVozilo = async (id:string) => {
        try{
            await deleteDoc(doc(db, "vozila", id))
            setVozila(prev => prev.filter(v => v.id !== id))
        }catch(error){
            console.log("Greška prilikom brisanja nove linije: ",error)
        }
    }

    // VOZAC
    const deleteVozac = async (id:string) => {
        try{
            await deleteDoc(doc(db,"vozaci",id))
            setVozaci(prev => prev.filter(v => v.id !== id))
        }catch(error){
            console.log("Greška prilikom brisanja vozača: ",error)
        }
    }

    // LINIJA
    const deleteLinija = async (id:string) => {
        try{
            await deleteDoc(doc(db,"linije",id))
            setLinije(prev => prev.filter(l => l.id !== id))
        }catch(error){
            console.log("Greška prilikom brisanja linije: ",error)
        }
    }

    //////////////////// UPDATE-uj LINIJU //////////////////////
    const updateLinija = async (id: string, updates: Partial<DostavnaLinija>) => {
        try{
            // Firestore update
            await updateDoc(
                doc(db, "linije", id),
                updates
            )
            // Local state update
            setLinije(prev => prev.map(linija => {
                if(linija.id===id){
                    return {
                        ...linija,
                        ...updates
                    }
                }
                return linija
            }))
        }catch(error){
            console.log("Greška pri update-ovanju linije: ",error)
        }
    }


    return(
        <DataContext.Provider
            value={{
                vozaci,
                vozila,
                linije,

                loading,
                
                deleteVozilo,
                deleteVozac,
                deleteLinija,
                addVozilo,
                addVozac,
                addLinija,
                updateLinija
            }}
        >
            {children}
        </DataContext.Provider>
    )
}

export const useData = () => {
  const context = useContext(DataContext)

  if (!context) {
    throw new Error(
      "useData mora biti unutar DataProvider"
    )
  }

  return context
}