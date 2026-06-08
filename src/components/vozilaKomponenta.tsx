import { DostavnaLinija, Vozilo } from "../types";
import { getAktivnaVrednost } from "../utilities/utilities";

interface VozilaKomponentaProps {
    linija: DostavnaLinija,
    vozilaMap: Record<string, Vozilo>
}

const VozilaKomponenta = ({linija, vozilaMap}: VozilaKomponentaProps) => {
    const { aktivnaVrednost, defaultVrednost } = getAktivnaVrednost({linija, target:"vozilo", vozilaMap});

    const voziloDisplay = aktivnaVrednost ? (
        <>{aktivnaVrednost?.toUpperCase()} - <span className="text-danger">zamena</span></>
    ) : (
        defaultVrednost?.toUpperCase()
    );

    return (
        <div>
        <strong>Vozilo: </strong> {voziloDisplay}
        <br/>
        </div>
    );
};

export default VozilaKomponenta