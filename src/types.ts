export interface Vozac {
  id:string,
  ime: string,
  prezime: string,
  nadimak?: string
}

export interface Vozilo {
  id: string,
  naziv: string
}
export interface Smene {
  0?: string,
  1?: string
}

export interface DostavnaLinija {
  id: string;
  broj: string;
  klinike: string;
  vozilo: string,
  smene: {
    0: string;
    1: string
  },
  izmene: Izmena[]
}

export interface NovaLinijaFormValues {
  vozac1: string,
  vozac2: string,
  klinike: string,
  vozilo: string,
  broj: string,
  izmene: Izmena[]
}

export interface Izmena {
  tip: "stalno"|"danas"|"period",
  vrednostId: string,
  target: "vozac"|"vozilo",
  smena?: 0|1,
  od: string,
  do: string,
}

export interface PromeneFormProps {
  vozaci: Vozac[],
  vozila: Vozilo[],
  target: "vozac"|"vozilo",
  linijaId: string,
  smena?: 0|1|undefined,
  changeDostavnaLinijaVozac?: (id: string, vozacId:string, shift:0|1|undefined) => Promise<void>,
  changeDostavnaLinijaVozilo?: (id: string, voziloNaziv:string) => Promise<void>
}

export interface PromeneFormValues {
  tip: "stalno"|"danas"|"period",
  vrednostId: string
  od: string,
  do: string,
}