import { useEffect, useState } from "react";
import { FaRegTrashAlt } from "react-icons/fa";
import { FaTruck } from "react-icons/fa";
import { DostavnaLinija, Vozac } from "../types";
import { useConfirm } from "../context/confirmContext";
import { collection, deleteDoc, doc, DocumentData, getDocs, QueryDocumentSnapshot } from "firebase/firestore";
import { db } from "../firebase";


export default function ListaDostavnihTura() {
  const [dostavneLinije, setDostavneLinije] = useState<DostavnaLinija[]>([]);
  const [vozaci, setVozaci] = useState<Vozac[]>([])
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

      } catch (error) {
        console.error("Greška pri učitavanju podataka:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);


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

  const vozaciMap = Object.fromEntries(
    vozaci.map(v => [v.id, v])
  )


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
                  <div><b>{vozaciMap[linija.smene[0]]?.ime || ""} {vozaciMap[linija.smene[0]]?.prezime || ""}</b></div>
                  <div><b>{vozaciMap[linija.smene[1]]?.ime || ""} {vozaciMap[linija.smene[1]]?.prezime || ""}</b></div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
