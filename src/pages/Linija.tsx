import { useParams } from "react-router";
import { useData } from "../context/dataContext";
import PromeneForm from "../components/promeneForm";
import { FaHospital } from "react-icons/fa";


export default function Linija() {
  // const {confirm} = useConfirm();
  const {id} = useParams(); 
  const {
    linije,
    vozaci,
    vozila,
    loading,
    updateLinija
  } = useData();

  const linija = linije.find(l => l.id===id);

// const removeDostavnaLinijaHandler = async (message:string, id:string) => 
//   confirm({
//     message: message,
//     onConfirm: async() => {
//       try{
//         //Obriši dostavnu liniju u bazi
//         deleteLinija(id)
//       }catch(error){
//         console.log(error)
//       }
//     }  
//   })

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


  const changeDostavnaLinijaVozac = async (id: string, vozacId:string, shift:1|2|undefined):Promise<void>  => {
    try{
      if(shift && linija){
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

  if(loading) {
    return <p>Loading...</p>
  }

  if(!linija){
    return <p>Linija nije pronađena</p>
  }

  return (
    <div className="container py-4">
      <div className="row">
          <div key={linija.id} className="col-md-12 mb-4">
            <div className="card p-0">
              <div className="card-header" >
                <h4>Linija {linija.broj}</h4>
                {/* <div>
                  <button 
                    className="btn btn-sm btn-danger"
                    title="Obriši liniju za razvoz"
                    onClick={()=>removeDostavnaLinijaHandler("Da li ste sigurni da želite da obrišete ovu liniju za razvoz?", linija.id)}>
                      <FaRegTrashAlt/>
                  </button>
                </div> */}
              </div>
              <div className="card-body">
                <div className="mb-2">
                    <div><FaHospital/> {linija.klinike}</div>
                </div>
                <div className="mb-3">
                  <div className="mb-2"><span className="tablice">{vozilaMap[linija.vozilo]?.naziv.toUpperCase()}</span></div>
                  <div>1 - <b>{vozaciMap[linija.smene[1]]?.ime || ""} {vozaciMap[linija.smene[1]]?.prezime || ""}</b></div>
                  <div>2 - <b>{vozaciMap[linija.smene[2]]?.ime || ""} {vozaciMap[linija.smene[2]]?.prezime || ""}</b></div>
                </div>

                <div className="mb-2 card p-2">
                  <div className="p-2">
                    <a
                      href="#collapseVozilo" 
                      data-toggle="collapse" 
                      role="button" 
                      aria-expanded="false" 
                      aria-controls="collapseVozilo"
                    >
                      Vozilo - promena
                    </a>
                  </div>
                  <div className="collapse" id="collapseVozilo">
                    <PromeneForm 
                      vozaci={vozaci} 
                      vozila={vozila} 
                      target="vozilo" 
                      linijaId={linija.id}
                      changeDostavnaLinijaVozilo={changeDostavnaLinijaVozilo}
                    />
                  </div>
                </div>
                
                <div className="mb-2 card p-2">
                  <div className="p-2">
                    <a
                      href="#collapseVozac1" 
                      data-toggle="collapse" 
                      role="button" 
                      aria-expanded="false" 
                      aria-controls="collapseVozac1"
                    >
                      1. Smena - promena
                    </a>
                  </div>
                  <div className="collapse" id="collapseVozac1">
                    <PromeneForm 
                      vozaci={vozaci} 
                      vozila={vozila} 
                      target="vozac" 
                      linijaId={linija.id}
                      smena={1}
                      changeDostavnaLinijaVozac={changeDostavnaLinijaVozac}
                    />
                  </div>                  
                </div>              

                <div className="mb-2 card p-2">
                  <div className="p-2">
                    <a
                      href="#collapseVozac2" 
                      data-toggle="collapse" 
                      role="button" 
                      aria-expanded="false" 
                      aria-controls="collapseVozac2"
                    >
                      2. Smena - promena
                    </a>
                  </div>
                  <div className="collapse" id="collapseVozac2">
                    <PromeneForm 
                      vozaci={vozaci} 
                      vozila={vozila} 
                      target="vozac" 
                      linijaId={linija.id}
                      smena={2}
                      changeDostavnaLinijaVozac={changeDostavnaLinijaVozac}
                    />
                  </div>
                </div>

              </div>
            </div>
          </div>
      </div>
    </div>
  );
}
