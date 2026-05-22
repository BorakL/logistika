import { Link } from "react-router";
import { useData } from "../context/dataContext";
import { useEffect, useState } from "react";

export default function ListaDostavnihTura() {

  const {
    linije,
    vozaci,
    vozila,
    loading
  } = useData();

  const [manjakVozaca, setManjakVozaca] = useState<string[]>([]);
  const [manjakVozila, setManjakVoila] = useState<string[]>([]);
  const [ukupnaFaljenja, setUkupnaFaljenja] = useState<string[]>([]);

  const vozaciMap = Object.fromEntries(
    vozaci.map(v => [v.id, v])
  )
  const vozilaMap = Object.fromEntries(
    vozila.map(v => [v.id, v])
  )

  const proveriLiniju = (linija:string) => {
    return ukupnaFaljenja.some(f => f==linija)
  }

  useEffect(()=>{
    const vozaciFale:string[] = [];
    const vozilaFale:string[] = [];
    linije.forEach(linija => {
      if(!vozaciMap[linija.smene[1]] || !vozaciMap[linija.smene[2]]){
        vozaciFale.push(linija.broj)
      };
      if(!vozilaMap[linija.vozilo]){
        vozilaFale.push(linija.broj)
      }
    })
    setManjakVozaca(vozaciFale)
    setManjakVoila(vozilaFale)
  },[linije])

  useEffect(()=>{
     const faljenja:string[] = [...manjakVozaca, ...manjakVozila];
    setUkupnaFaljenja(faljenja)
  },[manjakVozaca,manjakVozila])

  if (loading ) return <p>Učitavanje...</p>

  return (
    <div className="container mt-4">
      <h2 className="mb-4">Linije za razvoz</h2>
      <div>
        
          {manjakVozaca.length>0 &&
          <div className="alert alert-danger" role="alert">
            {`Na sledećim linijama fale vozači: ${manjakVozaca.join(", ")}`}
          </div>}
        
          {manjakVozila.length>0 &&
          <div className="alert alert-danger" role="alert">
            {`Na sledećim linijama fale vozila: ${manjakVozaca.join(", ")}`}
          </div>}
        
      </div>
      <div className="row">
        {linije.map((linija) => (
          <div key={linija.id} className="col mb-4 kartica-linija">
            <Link to={`/linije/${linija.id}`} >
              <div className={ proveriLiniju(linija.broj) ? "text-danger" : "" }> 
                <h5>Linija {linija.broj}</h5>
                <div>
                  <strong>Klinike:</strong> {linija.klinike}<br/>
                  <strong>Vozilo:</strong> {vozilaMap[linija.vozilo || ""]?.naziv.toUpperCase()}<br/>
                  <strong>Vozač 1:</strong> {vozaciMap[linija.smene[1]]?.ime || ""} {vozaciMap[linija.smene[1]]?.prezime || ""}<br/>
                  <strong>Vozač 2:</strong> {vozaciMap[linija.smene[2]]?.ime || ""} {vozaciMap[linija.smene[2]]?.prezime || ""}
                </div> 
              </div>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}
