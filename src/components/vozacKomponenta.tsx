import { DostavnaLinija, Vozac } from "../types";
import { getAktivnaVrednost } from "../utilities/utilities";

interface VozaciKomponentaProps {
    linija: DostavnaLinija,
    target: "vozac",
    smena: 1|2,
    vozaciMap: Record<string, Vozac>,
    detailed?: boolean
}

const VozacKomponenta = ({linija, target, vozaciMap, detailed, smena}: VozaciKomponentaProps) => {
    const { aktivnaVrednost, defaultVrednost, izvor } = getAktivnaVrednost({linija, target, vozaciMap, smena});
    console.log("defaultVrednost", defaultVrednost)
    console.log("aktivnaVrednost", aktivnaVrednost)
    const vozacDisplay = aktivnaVrednost ? (
        <>{aktivnaVrednost?.toUpperCase()} - <span className="text-danger">zamena</span></>
    ) : (
        defaultVrednost?.toUpperCase()
    );

    return (
        <>
        {
            !detailed ?
            <div>
                <strong>Vozac ${smena}: </strong> {vozacDisplay}
                <br/>
            </div>
            :
            aktivnaVrednost ? (
                <div className="mb-2">
                    <strong>Vozac ${smena}: </strong> {aktivnaVrednost?.toUpperCase()}
                    <p>Zamena do {izvor}</p>
                    <p>Redovan vozač - {defaultVrednost?.toUpperCase()}</p>
                </div>
            ) : (
                <div>
                    {defaultVrednost?.toUpperCase()}
                </div>
            )
        }
    </>
    );
};

export default VozacKomponenta