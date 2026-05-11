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