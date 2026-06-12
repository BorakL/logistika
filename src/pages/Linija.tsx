import { useNavigate, useParams } from "react-router";
import { useData } from "../context/dataContext";
import PromeneForm from "../components/promeneForm";
import { FaHospital } from "react-icons/fa";
import ZamenaKomponenta from "../components/zamenaKomponenta";


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
  const navigate = useNavigate();

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
              </div>
              <div className="card-body">
                <div className="mb-2">
                    <div><FaHospital/> {linija.klinike}</div>
                </div>
                <div className="mb-3">
                  <div className="mb-2">
                    <ZamenaKomponenta linija={linija} vozilaMap={vozilaMap}/>
                  </div>
                  <hr/>
                  <div>
                    <div>
                      <ZamenaKomponenta linija={linija} vozaciMap={vozaciMap} smena={1} />
                    </div>
                    <div>
                      <ZamenaKomponenta linija={linija} vozaciMap={vozaciMap} smena={2} />
                    </div>
                  </div>
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
                
                <div className="mt-3">
                      <button onClick={()=>navigate(`/izmene/${id}`) }>
                        Proveri izmene
                      </button>
                </div>
              
              </div>
            </div>
          </div>
      </div>
    </div>
  );
}
