import { useData } from "../context/dataContext";

export default function ListaDostavnihTura() {

  const {
    linije,
    vozaci,
    vozila,
    loading
  } = useData();


  const vozaciMap = Object.fromEntries(
    vozaci.map(v => [v.id, v])
  )
  const vozilaMap = Object.fromEntries(
    vozila.map(v => [v.id, v])
  )

  if (loading ) return <p>Učitavanje...</p>

  return (
    <div className="container py-4">
      <h2 className="mb-4">Linije za razvoz</h2>

      <div className="row">
        {linije.map((linija) => (
          <div key={linija.id} className="col-md-6 mb-4">
            <div className="card shadow-sm">
              <div className="card-body">
                <div className="mb-2">
                    <div>Klinike: {linija.klinike}</div>
                </div>
                <div className="mb-2">
                  <div><b>{linija.vozilo}</b></div>
                  <div><b>{vozaciMap[linija.smene[0]]?.ime || ""} {vozaciMap[linija.smene[0]]?.prezime || ""}</b></div>
                  <div><b>{vozaciMap[linija.smene[1]]?.ime || ""} {vozaciMap[linija.smene[1]]?.prezime || ""}</b></div>
                </div>
                <div className="mb-2">
                  <div>Vozilo: {vozilaMap[linija.vozilo || ""]?.naziv}</div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
