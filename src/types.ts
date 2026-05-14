export interface Vozac {
  id:string,
  ime: string,
  prezime: string
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
  }
}

export interface NovaLinijaFormValues {
  vozac1: string,
  vozac2: string,
  klinike: string,
  vozilo: string,
  broj: string
}

export interface PromeneFormProps {
  vozaci: Vozac[],
  vozila: Vozilo[],
  target: "vozac1"|"vozac2"|"vozilo"
}

export interface PromeneFormValues {
  tip: string,
  vrednostId: string
  od: string,
  do: string,
}