import { DostavnaLinija, Izmena, Vozac, Vozilo } from "../types";

interface AktivnaVrednost {
  aktivnaVrednost: string | undefined;
  defaultVrednost: string | undefined;
  izvor: "danas" | string | "default";
}

export const getDefaultId = (
  linija: DostavnaLinija,
  target: "vozilo" | "vozac",
  smena?: 1|2
) => {
  if(target === "vozilo"){
    return linija.vozilo
  }else if(target === "vozac" && smena){
    return linija.smene[smena]
  }else{
    return ""
  }
};

interface getAktivnaVrednostProperty {
  linija: DostavnaLinija,
  target: "vozac" | "vozilo",
  vozilaMap?: Record<string, Vozilo>,
  vozaciMap?: Record<string, Vozac>,
  smena?: 1|2
}


//OVDE POSTOJI PROBLEM!!! MORAŠ NAPRAVITI U FIND FUNKCIJI KOD TRAŽENJA DANAS IZMENA I PERIOD IZMENA, DA LI SPOSTOJI I.SMENA, 
//Ako postoij to znači da se izmena odnosi na vozača. Možda je bolje promeniti u bazi umesto target: vozač | vozilo, da bude vozac1/vozac2/vozilo
export const getAktivnaVrednost = ({
  linija,
  target,
  vozilaMap,
  vozaciMap,
  smena
}: getAktivnaVrednostProperty): AktivnaVrednost => {

  const today = new Date().toISOString().split("T")[0];
  let danasIzmena:Izmena|undefined;
  let periodIzmena:Izmena|undefined;
  let defaultId:string;

  if(smena){
    danasIzmena = linija.izmene?.find(
    i =>
      i.smena === smena &&
      i.target === target &&
      i.tip === "danas" &&
      i.od <= today &&
      i.do >= today
  );

  periodIzmena = linija.izmene?.find(
    i =>
      i.smena === smena &&
      i.target === target &&
      i.tip === "period" &&
      i.od <= today &&
      i.do >= today
  );

  defaultId = getDefaultId(
    linija,
    target,
    smena
  );
} else{
    danasIzmena = linija.izmene?.find(
      i =>
        i.target === target &&
        i.tip === "danas" &&
        i.od <= today &&
        i.do >= today
    );

    periodIzmena = linija.izmene?.find(
      i =>
        i.target === target &&
        i.tip === "period" &&
        i.od <= today &&
        i.do >= today
    );

    defaultId = getDefaultId(
      linija,
      target
    );
  }



  const getNaziv = (id: string) => {
    if (target === "vozilo" && vozilaMap) {
        return vozilaMap[id]?.naziv || "";
    }else if(vozaciMap){
        const vozac = vozaciMap[id];
        return vozac
        ? `${vozac.prezime} ${vozac.ime}`
        : "";
    }
  };

  if (danasIzmena) {
    return {
      aktivnaVrednost: getNaziv(danasIzmena.vrednostId),
      defaultVrednost: getNaziv(defaultId),
      izvor: "danas"
    };
  }

  if (periodIzmena) {
    return {
      aktivnaVrednost: getNaziv(periodIzmena.vrednostId),
      defaultVrednost: getNaziv(defaultId),
      izvor: periodIzmena.do
    };
  }

  return {
    aktivnaVrednost: undefined,
    defaultVrednost: getNaziv(defaultId),
    izvor: "default"
  };
};


export const formatirajDanMesecTekst = (datum:string) => {
  if(datum === "danas") return datum;
  const date = new Date(datum);
  const dan = date.getDate().toString().padStart(2, '0');
  const mesec = date.toLocaleString('sr-Latn-RS', { month: 'short' }); // "jun"
  // ili 'long' za "jun"
  
  return `${dan}. ${mesec}`; // "05 jun"
};