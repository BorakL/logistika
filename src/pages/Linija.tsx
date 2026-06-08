import { useParams } from "react-router";
import { useData } from "../context/dataContext";
import PromeneForm from "../components/promeneForm";
import { FaHospital } from "react-icons/fa";
import { formatirajDanMesecTekst, getAktivnaVrednost } from "../utilities/utilities";


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
                    <span className="tablice">
                    {
                      getAktivnaVrednost({linija,target:"vozilo",vozilaMap}).aktivnaVrednost ? 
                      getAktivnaVrednost({linija,target:"vozilo",vozilaMap}).aktivnaVrednost?.toUpperCase() :
                      getAktivnaVrednost({linija,target:"vozilo",vozilaMap}).defaultVrednost?.toUpperCase()
                    }
                    </span>
                    {
                      getAktivnaVrednost({linija,target:"vozilo",vozilaMap}).aktivnaVrednost ?
                      <p>
                        {`Zamena do ${formatirajDanMesecTekst(getAktivnaVrednost({linija,target:"vozilo",vozilaMap}).izvor)}`}
                        <br/> 
                        {`Redovno vozilo: ${getAktivnaVrednost({linija,target:"vozilo",vozilaMap}).defaultVrednost?.toUpperCase()}`}
                      </p>
                      : null
                    }
                  </div>
                  <div>
                    <div>
                      1. {
                        getAktivnaVrednost({linija,target:"vozac",vozaciMap,smena:1}).aktivnaVrednost ?
                        getAktivnaVrednost({linija,target:"vozac",vozaciMap,smena:1}).aktivnaVrednost?.toUpperCase() :
                        getAktivnaVrednost({linija,target:"vozac",vozaciMap,smena:1}).defaultVrednost?.toUpperCase()
                      }
                      {
                      getAktivnaVrednost({linija,target:"vozac",vozaciMap,smena:1}).aktivnaVrednost ?
                      <p>
                        {`Zamena do ${formatirajDanMesecTekst(getAktivnaVrednost({linija,target:"vozac",vozaciMap,smena:1}).izvor)}`}
                        <br/> 
                        {`Redovno vozi: ${getAktivnaVrednost({linija,target:"vozac",vozaciMap,smena:1}).defaultVrednost?.toUpperCase()}`}
                      </p>
                      : null
                    }
                    </div>
                    <div>
                      2. {
                          getAktivnaVrednost({linija,target:"vozac",vozaciMap,smena:2}).aktivnaVrednost ?
                          getAktivnaVrednost({linija,target:"vozac",vozaciMap,smena:2}).aktivnaVrednost?.toUpperCase() :
                          getAktivnaVrednost({linija,target:"vozac",vozaciMap,smena:2}).defaultVrednost?.toUpperCase()
                        }
                        {
                        getAktivnaVrednost({linija,target:"vozac",vozaciMap,smena:2}).aktivnaVrednost ?
                        <p>
                          {`Zamena do ${formatirajDanMesecTekst(getAktivnaVrednost({linija,target:"vozac",vozaciMap,smena:2}).izvor)}`}
                          <br/> 
                          {`Redovno vozi: ${getAktivnaVrednost({linija,target:"vozac",vozaciMap,smena:2}).defaultVrednost?.toUpperCase()}`}
                        </p>
                        : null
                      }
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

              </div>
            </div>
          </div>
      </div>
    </div>
  );
}
