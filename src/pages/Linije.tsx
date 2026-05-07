import { useEffect, useState } from "react";
import { FaRegTrashAlt } from "react-icons/fa";
import { FaTruck } from "react-icons/fa";
import { DostavnaLinija, Vozac, Vozilo } from "../types";
import { useConfirm } from "../context/confirmContext";
import { collection, deleteDoc, doc, DocumentData, getDocs, QueryDocumentSnapshot } from "firebase/firestore";
import { db } from "../firebase";


export default function ListaDostavnihTura() {
  const [dostavneLinije, setDostavneLinije] = useState<DostavnaLinija[]>([]);
  const [vozaci, setVozaci] = useState<Vozac[]>([])
  const [vozila, setVozila] = useState<Vozilo[]>([])
  const [loading, setLoading] = useState(true);
  const {confirm} = useConfirm();

  useEffect(() => {
    const fetchData = async () => {
      try {
        //Vadimo dostavne linije
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

        //Fečujemo Vozače iz baze
        const snapshotVozaci = await getDocs(collection(db, "vozaci"))
        const vozaciData: Vozac[] = snapshotVozaci.docs.map(
            (doc: QueryDocumentSnapshot<DocumentData>) => ({
                id: doc.id,
                ...(doc.data() as Omit<Vozac, "id">)
            })
        )
        if(vozaciData){
          setVozaci(vozaciData)
        }

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
        await deleteDoc(doc(db, "linije", id))
        setDostavneLinije(prev => { 
          return [...prev.filter(t => t.id!==id)] 
        })
      }catch(error){
        console.log("Greška pri brisanju linije za razvoz: ", error)
      }
    }  
  })

  const vozaciMap = Object.fromEntries(
    vozaci.map(v => [v.id, v])
  )
  const vozilaMap = Object.fromEntries(
    vozila.map(v => [v.id, v])
  )

  if (loading ) return <p>Učitavanje...</p>

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
                  <div><b>{vozaciMap[linija.smene[0]]?.ime || ""} {vozaciMap[linija.smene[0]]?.prezime || ""}</b></div>
                  <div><b>{vozaciMap[linija.smene[1]]?.ime || ""} {vozaciMap[linija.smene[1]]?.prezime || ""}</b></div>
                </div>
                <div className="mb-2">
                  <div>Vozilo: {vozilaMap[linija.vozilo || ""]?.naziv}</div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
