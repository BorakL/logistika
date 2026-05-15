import { FaRegTrashAlt } from "react-icons/fa";
import { useConfirm } from "../context/confirmContext";
import { useParams } from "react-router";
import { useData } from "../context/dataContext";
import PromeneForm from "../components/promeneForm";


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


  const changeDostavnaLinijaVozac = async (id: string, vozacId:string, shift:0|1|undefined):Promise<void>  => {
    try{
      if(shift){
        updateLinija(id, {smene: {...linija.smene, [shift]:vozacId}})
      }
    }catch(error){
      console.log(error)
    }
  }

  const changeDostavnaLinijaVozilo = async (id: string, voziloNaziv:string):Promise<void> => {
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
      <h2 className="mb-4">Linija {linija.broj}</h2>

      <div className="row">
          <div key={linija.id} className="col-md-12 mb-4">
            <div className="card shadow-sm">
              <div className="card-header d-flex justify-content-between align-items-center">
                {/* <h5 className="mb-0">{linija.broj} <FaTruck/></h5> */}
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
                  <div><b>{vozilaMap[linija.vozilo]?.naziv}</b></div>
                  <div><b>{vozaciMap[linija.smene[0]]?.ime || ""} {vozaciMap[linija.smene[0]]?.prezime || ""}</b></div>
                  <div><b>{vozaciMap[linija.smene[1]]?.ime || ""} {vozaciMap[linija.smene[1]]?.prezime || ""}</b></div>
                </div>
                

                
              <h5>Izmene</h5>
              <div className="mb-4">
                <p>Promeni vozača prve smene: </p>
                <PromeneForm 
                  vozaci={vozaci} 
                  vozila={vozila} 
                  target="vozac" 
                  linijaId={linija.id}
                  smena={0}
                  changeDostavnaLinijaVozac={changeDostavnaLinijaVozac} 
                />
              </div>
              <div className="mb-4">
                <p>Promeni vozača druge smene: </p>
                <PromeneForm 
                  vozaci={vozaci} 
                  vozila={vozila} 
                  target="vozac" 
                  linijaId={linija.id}
                  smena={1}
                  changeDostavnaLinijaVozac={changeDostavnaLinijaVozac}
                />
              </div>
              <div className="mb-4">
                <p>Promeni vozilo: </p>
                <PromeneForm 
                  vozaci={vozaci} 
                  vozila={vozila} 
                  target="vozilo" 
                  linijaId={linija.id}
                  changeDostavnaLinijaVozilo={changeDostavnaLinijaVozilo}
                />
              </div>

              </div>
            </div>
          </div>
      </div>
    </div>
  );
}
