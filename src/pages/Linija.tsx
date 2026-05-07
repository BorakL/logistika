import { useEffect, useState } from "react";
import { FaRegTrashAlt } from "react-icons/fa";
import { FaTruck } from "react-icons/fa";
import { DostavnaLinija, Smene, Vozac, Vozilo } from "../types";
import { useConfirm } from "../context/confirmContext";
import { addDoc, collection, deleteDoc, doc, DocumentData, getDocs, QueryDocumentSnapshot } from "firebase/firestore";
import { db } from "../firebase";


export default function ListaDostavnihTura() {
  const [dostavneLinije, setDostavneLinije] = useState<DostavnaLinija[]>([]);
  const [vozaci, setVozaci] = useState<Vozac[]>([]);
  const [vozila, setVozila] = useState<Vozilo[]>([])
  const [loading, setLoading] = useState(true);
  const {confirm} = useConfirm();

  useEffect(() => {
    const fetchData = async () => {
      try {
        //Vadimo dostavne linije, vozila i vozače iz baze

        const snapshotVozila = await getDocs(collection(db, "vozila"));
        const vozilaData = snapshotVozila.docs.map(doc => {
            const data = doc.data()
            return {
                id: doc.id,
                naziv: data.naziv
            } as Vozilo
        })
        if(vozilaData){
          setVozila(vozilaData)
        }
        
        const snapshotVozaci = await getDocs(collection(db, "vozaci"))
        const vozaciData: Vozac[] = snapshotVozaci.docs.map(
            (doc: QueryDocumentSnapshot<DocumentData>) => ({
                id: doc.id,
                ...(doc.data() as Omit<Vozac, "id">)
            })
        )
        if(vozaciData){
          const sortedVozaci = vozaciData.sort((a:Vozac, b:Vozac) => a.prezime.localeCompare(b.prezime))
            setVozaci(sortedVozaci)
        }

        const snapshotLinije = await getDocs(collection(db, "linije"))
        const linijeData: DostavnaLinija[] = snapshotLinije.docs.map(
          (doc: QueryDocumentSnapshot<DocumentData>) => ({
            id: doc.id,
            ...(doc.data() as Omit<DostavnaLinija, "id">)
          })
        )
        if(linijeData){
          setDostavneLinije(linijeData)
        }

      } catch (error) {
        console.error("Greška pri učitavanju podataka:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

const removeDostavnaLinijaHandler = async (message:string, id:string) => 
  confirm({
    message: message,
    onConfirm: async() => {
      try{
        //Obriši dostavnu liniju u bazi
        await deleteDoc(doc(db, "linija", id))
        setDostavneLinije(prev => { 
          return [...prev.filter(t => t.id!==id)] 
        })
      }catch(error){
        console.log("Greška pri brisanju linije za razvoz: ", error)
      }
    }  
  })

  // const addDostavnaLinijaHandler = async (data: {broj:string, klinike:string, vozilo:string, smene:Smene}) => {
  //   try{
  //     //Dodajemo novu dostavnu liniju u bazu
  //     await addDoc(collection(db, "linije"), {
  //         broj: data.broj,
  //         klinike: data.klinike,
  //         vozilo: data.vozilo,
  //         smene: data.smene
  //     })
  //     const novaDostavnaLinija: DostavnaLinija = {
  //       id: Date.now().toString(),
  //       broj: data.broj,
  //       klinike: data.klinike,
  //       vozilo: data.vozilo,
  //       smene: data.smene
  //     }
  //     const updatedDostavneLinije = [...dostavneLinije, novaDostavnaLinija];
  //     setDostavneLinije(updatedDostavneLinije);
  //   }catch(error){
  //     console.log("Greška pri dodavanju ture: ", error)
  //   }
  // }

  // const changeDostavnaLinijaVozilo = async (linijaId:string, newVozilo:string) => {
  //   try{
  //   //   await window.electronApp.zameniVoziloSaProverom(turaId, newVozilo);
  //   //
  //     setDostavneLinije(prev => {
  //       if (!prev) return prev;
        
  //       const updatedLinija = prev.map(linija => {
  //         if (linija.id === linijaId) {
  //           return {
  //             ...linija,
  //             vozilo: newVozilo
  //           };
  //         }
  //         return linija;
  //       });
  //       return updatedLinija;
  //     });
  //   } catch(error){
  //     console.log("Greška prilikom promene vozila: ", error)
  //   }
  // }

  // const changeDostavnaLinijaVozac = async (linijaId: string, vozacId:string, shift:1|2) => {
  //   try{
  //       //Izvrši promenu u bazi
  //       const modifiedTure: DostavnaLinija[] = dostavneLinije.map((linija:DostavnaLinija) => {
  //       if(linija.id===linijaId && linija.smene[shift].id !== vozacId ){
  //         const vozac = vozaci.find(v => v.id===vozacId)
  //         if(vozac){
  //           return {...linija, smene: {...linija.smene, [shift]: vozac.id}}
  //         }
  //       }
  //       return linija;
  //     });
  //     if(modifiedTure){
  //       setDostavneLinije(prev => {
  //         if (!prev) return prev;
  //         return modifiedTure
  //       })
  //     }
  //   }catch(error){
  //     console.log("Problem prilikom promene vozača: ", error)
  //   }
  // }

  const getVozaci = (linija: DostavnaLinija):Vozac[] => {
    if(linija && linija.smene){
      return Object.values(linija.smene)
    }
    return [];
  }


  if (loading || !dostavneLinije) return <p>Učitavanje...</p>

  return (
    <div className="container py-4">
      <h2 className="mb-4">Linije za razvoz</h2>

      <div className="row">
        {dostavneLinije.map((linija) => (
          <div key={linija.id} className="col-md-6 mb-4">
            <div className="card shadow-sm">
              <div className="card-header d-flex justify-content-between align-items-center">
                <h5 className="mb-0">{linija.id} <FaTruck/></h5>
                <div>
                  <button 
                    className="btn btn-sm btn-danger"
                    title="Obriši liniju za razvoz"
                    onClick={()=>removeDostavnaLinijaHandler("Da li ste sigurni da želite da obrišete ovu liniju za razvoz?", linija.id)}>
                      <FaRegTrashAlt/>
                  </button>
                </div>
              </div>
              <div className="card-body">
                <div className="mb-2">
                    <div>Klinike: {linija.klinike}</div>
                </div>
                <div className="mb-2">
                  <div><b>{linija.vozilo}</b></div>
                  <div><b>{getVozaci(linija)?.[0]?.ime || ""} {getVozaci(linija)?.[0]?.prezime || ""}</b></div>
                  <div><b>{getVozaci(linija)?.[1]?.ime || ""} {getVozaci(linija)?.[1]?.prezime || ""}</b></div>
                </div>
                {/* <div className="mb-2">
                  <select className="form-select" onChange={(e)=>changeDostavnaLinijaVozac(linija.id,e.target.value,1)}>
                    <option>Vozač 1</option>
                    {vozaci.map(vozac => <option 
                                            key={vozac.id} 
                                            value={vozac.id}
                                        >
                                            {vozac.prezime} {vozac.ime}
                                        </option>
                                )
                    }
                  </select>
                </div> */}
                {/* <div className="mb-2">
                  <select className="form-select" onChange={(e)=>changeDostavnaLinijaVozac(linija.id,e.target.value,2)}>
                    <option>Vozač 2</option>
                    {vozaci.map(vozac => <option 
                                            key={vozac.id} 
                                            value={vozac.id}
                                            >
                                                {vozac.prezime} {vozac.ime}
                                        </option>
                                )
                    }
                  </select>
                </div> */}
                {/* <div className="mb-2">
                  <select className="form-select" onChange={(e)=>changeDostavnaLinijaVozilo(linija.id,e.target.value)}>
                    <option>Vozilo</option>
                    {vozila.map(vozilo => <option 
                                            key={vozilo.id} 
                                            value={vozilo.naziv}
                                            >
                                              {vozilo.naziv}
                                            </option>
                    )}
                  </select> 
                </div> */}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* <div className="mt-5">
        <div>
          <button className="btn btn-primary m-3" onClick={addDostavnaLinijaHandler}>
            Dodaj novu liniju za razvoz
          </button>
        </div>
      </div> */}
    </div>
  );
}
