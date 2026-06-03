import { DostavnaLinija, Vozac, Vozilo } from "../types";

interface AktivnaVrednost {
  aktivnaVrednost: string | undefined;
  defaultVrednost: string | undefined;
  izvor: "danas" | string | "default";
}

export const getDefaultId = (
  linija: DostavnaLinija,
  target: "vozilo" | "vozac1" | "vozac2"
) => {
  switch (target) {
    case "vozilo":
      return linija.vozilo;

    case "vozac1":
      return linija.smene[1];

    case "vozac2":
      return linija.smene[2];

    default:
      return "";
  }
};

export const getAktivnaVrednost = (
  linija: DostavnaLinija,
  target: "vozac1" | "vozac2" | "vozilo",
  vozilaMap?: Record<string, Vozilo>,
  vozaciMap?: Record<string, Vozac>
): AktivnaVrednost => {
    console.log("linijaaaa",linija)

  const today = new Date().toISOString().split("T")[0];

  const danasIzmena = linija.izmene?.find(
    i =>
      i.target === target &&
      i.tip === "danas" &&
      i.od <= today &&
      i.do >= today
  );

  const periodIzmena = linija.izmene?.find(
    i =>
      i.target === target &&
      i.tip === "period" &&
      i.od <= today &&
      i.do >= today
  );

  const defaultId = getDefaultId(
    linija,
    target
);

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