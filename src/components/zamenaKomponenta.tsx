import { DostavnaLinija, Vozac, Vozilo } from "../types"
import { formatirajDanMesecTekst, getAktivnaVrednost } from "../utilities/utilities"

interface VozilaKomponentaProps {
    linija: DostavnaLinija,
    vozilaMap?: Record<string, Vozilo>,
    vozaciMap?: Record<string, Vozac>,
    smena?: 1 | 2
}
const ZamenaKomponenta = ({linija, vozilaMap, vozaciMap, smena}:VozilaKomponentaProps) => {

    
    return(
        vozilaMap ?
        <>
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
        </>
        :
        <>
            {smena} - <span>
                <b>
                {
                    getAktivnaVrednost({linija,target:"vozac",vozaciMap,smena}).aktivnaVrednost ? 
                    getAktivnaVrednost({linija,target:"vozac",vozaciMap,smena}).aktivnaVrednost?.toUpperCase() :
                    getAktivnaVrednost({linija,target:"vozac",vozaciMap,smena}).defaultVrednost?.toUpperCase()
                }
                </b>
            </span>
            {
                getAktivnaVrednost({linija,target:"vozac",vozaciMap,smena}).aktivnaVrednost ?
                <p>
                {`Zamena do ${formatirajDanMesecTekst(getAktivnaVrednost({linija,target:"vozac",vozaciMap,smena}).izvor)}`}
                <br/> 
                {`Redovni vozac: ${getAktivnaVrednost({linija,target:"vozac",vozaciMap,smena}).defaultVrednost?.toUpperCase()}`}
                </p>
                : null
            }
        </>
    )
}

export default ZamenaKomponenta