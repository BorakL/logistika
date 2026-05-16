import { useForm } from "react-hook-form"
import { Izmena, PromeneFormProps, PromeneFormValues } from "../types";
import { useData } from "../context/dataContext";

const PromeneForm: React.FC<PromeneFormProps> = ({vozaci, vozila, target, linijaId, smena, changeDostavnaLinijaVozac, changeDostavnaLinijaVozilo}) => {
    const {register, handleSubmit, watch} = useForm<PromeneFormValues>({
        defaultValues: {
            tip: "stalno",
            vrednostId: "",
            od: "",
            do: ""
        }
    });
    const selectedTip = watch("tip");
    const{linije,updateLinija} = useData();

    const onSubmit = (promena: PromeneFormValues) => {
        if(promena.tip==="stalno" && promena.vrednostId){
            if(changeDostavnaLinijaVozac && target==="vozac" && smena){
                changeDostavnaLinijaVozac(linijaId, promena.vrednostId, smena)
            } else if(changeDostavnaLinijaVozilo && target==="vozilo"){
                changeDostavnaLinijaVozilo(linijaId, promena.vrednostId)
            }
        }else {
            const today = new Date().toISOString().split("T")[0];
            const odDate = promena.tip==="danas" ? today : promena.od;
            const doDate = promena.tip==="danas" ? today : promena.do;
            const linija = linije.find(l => l.id===linijaId)
            
            const activeIzmene = linija?.izmene.filter(izmena => izmena.do >= today) || []
            const izmena: Izmena = {
                tip: promena.tip, 
                vrednostId: promena.vrednostId,
                target,
                od: odDate,
                do: doDate,
                ...(target === "vozac" && {smena})
            }
            const updatedIzmene: Izmena[] = [...activeIzmene, izmena]  
            updateLinija(linijaId, {izmene: updatedIzmene})    
        }
    }

    return(
        <form onSubmit={handleSubmit(onSubmit)}>
            <div className="mb-2">
                <div className="form-check">
                    <input 
                        type="radio" 
                        value="stalno"
                        className="form-check-input"
                        id={`${target}-stalno`}
                        {...register("tip")}  
                    />
                    <label htmlFor={`${target}-stalno`} className="form-check-label">Za stalno</label>
                </div>
                <div className="form-check">
                    <input 
                        type="radio" 
                        value="danas"
                        className="form-check-input"
                        id={`${target}-danas`}
                        {...register("tip")}
                    />
                    <label htmlFor={`${target}-danas`} className="form-check-label">Za danas</label>
                </div>
                <div className="form-check">
                    <input 
                        type="radio" 
                        value="period"
                        className="form-check-input"
                        id={`${target}-period`}
                        {...register("tip")}
                    />
                    <label htmlFor={`${target}-period`} className="form-check-label">Za period</label>
                </div>
            </div>

            {selectedTip === "period" && (
            <div className="">
                <div className="col">
                    <label>Od</label>
                    <input
                        type="date"
                        className="form-control"
                        {...register("od")}
                    />
                </div>
                <div className="col">
                    <label>Do</label>
                    <input
                        type="date"
                        className="form-control"
                        {...register("do")}
                    />
                </div>
            </div>
            )}

            <div>
                <select 
                    className="form-select" 
                    {...register("vrednostId")}
                >
                    {
                        target === "vozilo" ?
                        <>
                            <option value="">Izaberi vozilo</option>
                            {vozila.map(vozilo => <option 
                                                    key={vozilo.id} 
                                                    value={vozilo.id}
                                                >
                                                    {vozilo.naziv}
                                                </option>
                                        )
                            }
                        </>
                    :
                        <>
                            <option value="">Izaberi vozača</option>
                            {vozaci.map(vozac => <option 
                                                    key={vozac.id} 
                                                    value={vozac.id}
                                                >
                                                    {vozac.prezime} {vozac.ime}
                                                </option>
                                        )
                            }
                        </>

                    }
                    
                </select>
            </div>

            <button type="submit">{target==="vozilo" ? "Izmeni vozilo" : "Izmeni vozača"}</button>
        </form>
    )
}

export default PromeneForm;