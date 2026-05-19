import { useData } from "../context/dataContext";
import { useForm } from "react-hook-form";
import { NovaLinijaFormValues } from "../types";
import ConfirmModal from "../components/confirmModal";
import { useState } from "react";



export default function NovaLinija() {
    const[showMessage, setShowMessage] = useState(false);
    const {
        vozaci,
        vozila,
        addLinija
    } = useData();

  const {register, handleSubmit, reset, formState: {errors}} = useForm<NovaLinijaFormValues>()

  const onSubmit = async(novaLinija: NovaLinijaFormValues) => {
    try{
        const data = {
            id: "",
            klinike: novaLinija.klinike || "",
            broj: novaLinija.broj || "",
            vozilo: novaLinija.vozilo || "",
            smene: {
                1: novaLinija.vozac1 || "",
                2: novaLinija.vozac2 || ""
            },
            izmene: []
        }
        addLinija(data)
        reset();
        setShowMessage(true);
    }catch(error){
        console.log("Problem priliko dodavanja nove linije: ", error)
    }
  }

  return (
    <div className="container py-4">
      <h2 className="mb-4">Nova linija</h2>

      <div className="row">
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="col-md-12 mb-4">
                <div className="card shadow-sm">
                    <div className="card-body">
                        <div className="mb-2">
                            <input type="text" id="broj" {...register("broj", {required: "Navedite broj dostavne linije!"})} placeholder="Broj linije"/>
                            {errors.broj && <div>{errors.broj.message}</div> }
                        </div>
                        <div className="mb-2">
                            <input type="text" id="klinike" {...register("klinike")} placeholder="Klinike"/>
                        </div>
                        <div className="mb-2">
                            <select 
                                className="form-select" 
                                {...register("vozac1", {required:"Odaberite vozača 1!"})}
                            >
                                <option value="" defaultValue="prvaSmena" disabled>Prva smena</option>
                                {vozaci.map(vozac => <option 
                                                        key={vozac.id} 
                                                        value={vozac.id}
                                                    >
                                                        {vozac.prezime} {vozac.ime}
                                                    </option>
                                            )
                                }
                            </select>
                            {errors.vozac1 && <div>{errors.vozac1.message}</div>}
                        </div>
                        <div className="mb-2">
                            <select 
                                className="form-select" 
                                {...register("vozac2", {required:"Odaberite vozača 2!"})}
                            >
                                <option value="" disabled>Druga smena</option>
                                {vozaci.map(vozac => <option 
                                                        key={vozac.id} 
                                                        value={vozac.id}
                                                    >
                                                        {vozac.prezime} {vozac.ime}
                                                    </option>
                                            )
                                }
                            </select>
                            {errors.vozac2 && <div>{errors.vozac2.message}</div>}
                        </div>
                        <div className="mb-2">
                            <select 
                                className="form-select"
                                {...register("vozilo", {required: "Odaberite vozilo!"})}
                            >
                                <option value="" disabled >Vozilo</option>
                                {vozila.map(vozilo => <option 
                                                            key={vozilo.id} 
                                                            value={vozilo.id}
                                                        >
                                                            {vozilo.naziv}
                                                        </option>
                                )}
                            </select>
                            {errors.vozilo && <div>{errors.vozilo.message}</div> }
                        </div>
                    </div>
                </div>
            </div>
            <button type="submit">
                Sačuvaj
            </button>
          </form>
      </div>

        <ConfirmModal
          show={showMessage}
          onClose={() => {
            setShowMessage(false);
          }}
          inform={true}
          message="Nova dostavna linija je uspešno kreirana"
        />

    </div>
  );
}
