export interface Vozac {
  id:string,
  ime: string,
  prezime: string
}

export interface Vozaci {
  1?: Vozac,
  2?: Vozac
}

export interface DostavnaLinija {
  id: string;
  klinike: string;
  vozilo?: string,
  vozaci?: Vozaci
}