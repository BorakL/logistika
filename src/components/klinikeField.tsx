import { useForm } from "react-hook-form";
import { FaRegTrashAlt } from "react-icons/fa";
import { useData } from "../context/dataContext";
import { DostavnaLinija } from "../types";
import { useConfirm } from "../context/confirmContext";



const KlinikeField = ({linija}: {linija:DostavnaLinija}) => {
    const{updateLinija, deleteLinija} = useData();
    const{confirm} = useConfirm();

    const {register, handleSubmit, formState:{isDirty}} = useForm<{klinike:string}>({
        defaultValues:{klinike:linija.klinike}
    })
    const onSubmit = (data: { klinike: string}) => {
        console.log("test on submit", data.klinike)
        updateLinija(linija.id, {klinike: data.klinike})
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

    return(
        <div className="">
            <form onSubmit={handleSubmit(onSubmit)}>
                <div className="input-group mb-3">
                    <div className="input-group-prepand">
                        <span className="input-group-text py-3">Linija {linija.broj}</span>
                    </div>
                    <input 
                        type="text" 
                        className="form-control"  
                        {...register("klinike")} 
                    />
                    <button 
                        className="ml-2" 
                        type="submit" 
                        disabled={!isDirty}
                    >
                        Izmeni
                    </button> 
                    <button 
                        className="ml-2 px-3 btn btn-sm btn-outline-danger"
                        onClick={()=>removeDostavnaLinijaHandler(`Da li ste sigurni da želite da obrišete dostavnu liniju ${linija.broj}?`, linija.id)}
                    > 
                        <FaRegTrashAlt/>
                    </button>
                </div>
            </form>
        </div>
    )
}

export default KlinikeField;