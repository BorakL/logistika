export interface Vozac {
  id:string,
  ime: string,
  prezime: string
}
export interface Smene {
  1: Vozac,
  2: Vozac
}

export interface DostavnaLinija {
  id: string;
  broj: string;
  klinike: string;
  vozilo?: string,
  smene: Smene
}