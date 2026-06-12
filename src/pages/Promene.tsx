import { useParams } from "react-router";
import { useData } from "../context/dataContext";
import { useEffect, useState } from "react";
import { DostavnaLinija, Izmena } from "../types";
import { formatirajDanMesecTekst } from "../utilities/utilities";
import { useConfirm } from "../context/confirmContext";

const Izmene = () => {
    const {id} = useParams();
    const {linije} = useData();
    const [izmene, setIzmene] = useState<Izmena[]>([])
    const [linija, setLinija] = useState<DostavnaLinija>()
    const {confirm} = useConfirm();
    const {updateLinija} = useData()

    const removeIzmenaHandler = async(index: number) => {
    try{
        confirm({
            message: `Da li ste sigurni da želite da obrišete ovu izmenu?`,
            onConfirm: async() => {
                try{
                    const newIzmene = [...izmene];
                    newIzmene.splice(index, 1);
                    setIzmene(newIzmene);
                    if(id){
                        updateLinija(id.toString(),{izmene:newIzmene})
                    }
                }catch(error){
                    console.log(error)
                }
            }
        })
    }catch(error){
        console.log(error)
    }
}

    useEffect(()=>{
        if(linije && linije.length>0){
            const linija = linije.find(l => l.id===id);
            if(linija){
                setLinija(linija)
                if(linija.izmene && linija.izmene.length>0){
                    console.log("linija.izmene", linija.izmene)
                    setIzmene(linija.izmene)  
                }
            }
        }
    },[linije])
    
    return (

        <div className="container py-4">
            <div className="mb-5">
                <h2>Izmene na liniji {linija?.broj}</h2>
                <ul className="list-group mb-3">
                {izmene.map((izmena,index) => 
                    <li key={id} className="list-group-item d-flex justify-content-between align-items-center" >
                        Izmena {izmena.target==="vozac" ? "vozača" : "vozila"} od {formatirajDanMesecTekst(izmena.od)} do {formatirajDanMesecTekst(izmena.do)}
                        <button 
                            className="btn btn-sm btn-outline-danger"
                            onClick={() => removeIzmenaHandler(index)}
                        >
                            <i className="bi bi-trash"></i> Obriši
                        </button>
                    </li>
                )}
                </ul>
                {izmene.length===0 && "Nema izmena"}
            </div>
        </div>
    )
}

export default Izmene;