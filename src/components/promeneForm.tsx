import { useForm } from "react-hook-form"
import { PromeneFormProps, PromeneFormValues } from "../types";

const PromeneForm: React.FC<PromeneFormProps> = ({vozaci, vozila, target}) => {
    const {register, handleSubmit, watch} = useForm({
        defaultValues: {
            tip: "stalno",
            vrednostId: "",
            od: "",
            do: ""
        }
    });
    const selectedTip = watch("tip");

    const onSubmit = (promena: PromeneFormValues) => {
        console.log("promena: ", promena)
        console.log("target: ", target)
    }

    return(
        <form onSubmit={handleSubmit(onSubmit)}>
            <div className="mb-2">
                <div className="form-check">
                    <input 
                        type="radio" 
                        value="stalno"
                        className="form-check-input"
                        id="stalno"
                        {...register("tip")}  
                    />
                    <label htmlFor="stalno" className="form-check-label">Za stalno</label>
                </div>
                <div className="form-check">
                    <input 
                        type="radio" 
                        value="danas"
                        className="form-check-input"
                        id="danas"
                        {...register("tip")}
                    />
                    <label htmlFor="danas" className="form-check-label">Za danas</label>
                </div>
                <div className="form-check">
                    <input 
                        type="radio" 
                        value="period"
                        className="form-check-input"
                        id="period"
                        {...register("tip")}
                    />
                    <label htmlFor="period" className="form-check-label">Za period</label>
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
                                                    value={vozilo.naziv}
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