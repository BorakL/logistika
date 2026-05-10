import { FaRegTrashAlt } from "react-icons/fa";
import { FaTruck } from "react-icons/fa";
import { useConfirm } from "../context/confirmContext";
import { useParams } from "react-router";
import { useData } from "../context/dataContext";


export default function Linija() {
  const {confirm} = useConfirm();
  const {id} = useParams(); 
  const {
    linije,
    vozaci,
    vozila,
    loading,
    deleteLinija,
    updateLinija
  } = useData();

  const linija = linije.find(l => l.id===id);
  if(!linija){
    return <p>Linija nije pronađena</p>
  }

  if(loading) {
    return <p>Loading...</p>
  }

const removeDostavnaLinijaHandler = async (message:string, id:string) => 
  confirm({
    message: message,
    onConfirm: async() => {
      try{
        //Obriši dostavnu liniju u bazi
        deleteLinija(id)
      }catch(error){
        console.log(error)
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


  const changeDostavnaLinijaVozac = async (id: string, vozacId:string, shift:1|2) => {
    try{
      updateLinija(id, {smene: {...linija.smene, [shift]:vozacId}})
    }catch(error){
      console.log(error)
    }
  }

  const changeDostavnaLinijaVozilo = async (id: string, voziloNaziv:string) => {
  try{
    updateLinija(id, {vozilo: voziloNaziv})
  }catch(error){
    console.log(error)
  }
}

  const vozaciMap = Object.fromEntries(
    vozaci.map(v => [v.id, v])
  )
  const vozilaMap = Object.fromEntries(
    vozila.map(v => [v.id, v])
  )

  return (
    <div className="container py-4">
      <h2 className="mb-4">Linija za razvoz</h2>

      <div className="row">
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
                <div className="mb-2">
                  <select className="form-select" onChange={(e)=>changeDostavnaLinijaVozac(linija.id, e.target.value, 1)}>
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
                </div>
                <div className="mb-2">
                  <select className="form-select" onChange={(e)=>changeDostavnaLinijaVozac(linija.id, e.target.value, 2)}>
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
                </div>
                <div className="mb-2">
                  <select className="form-select" onChange={(e)=>changeDostavnaLinijaVozilo(linija.id, e.target.value)}>
                    <option>Vozilo</option>
                    {vozila.map(vozilo => <option 
                                            key={vozilo.id} 
                                            value={vozilo.naziv}
                                            >
                                              {vozilo.naziv}
                                            </option>
                    )}
                  </select> 
                </div>
              </div>
            </div>
          </div>
      </div>
    </div>
  );
}
