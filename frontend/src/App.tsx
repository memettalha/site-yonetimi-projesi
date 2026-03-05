import { useEffect, useState } from "react";

interface Daire{
  id:number;
  daire_no:number;
  blok:string;
  sakin_adi:string;
  borc:number;
  telefon:string;
}

function App() {

  const [daireler,setDaireler] = useState<Daire[]>([]);
  const [mesaj,setMesaj] = useState<string>("Backendden cevap bekleniyor...");
  const [yukleniyor,setYukleniyor] = useState<boolean>(true);

  useEffect(() => {
    //Backend adresimize istek atıyoruz
    fetch('http://localhost:5000/')
    .then((res) => res.text())
    .then((data:string) => {
      setMesaj(data);
      setYukleniyor(false);
    })
    .catch((err:Error) => {
      console.error("Bağlantı hatası:", err);
      setMesaj("Backend'e bağlanırken bir hata oluştu.");
      setYukleniyor(false);
    });
    fetch('http://localhost:5000/daireler')
    .then((res) => res.json())
    .then((data:Daire[]) => {
      setDaireler(data);
      setYukleniyor(false);
    }).catch((err:Error) => {
      console.error("Daireler alınırken hata:", err);
      setYukleniyor(false);
    })
  },[])

return (
    <div style={{ 
      fontFamily: 'Arial, sans-serif', 
      display: 'flex', 
      flexDirection: 'column', 
      alignItems: 'center', 
      marginTop: '100px' 
    }}>
      <h1>Site Yönetimi Paneli</h1>
      <div style={{ 
        padding: '20px', 
        border: '1px solid #ddd', 
        borderRadius: '8px',
        backgroundColor: '#f9f9f9' 
      }}>
        {yukleniyor ? (
          <p>Yükleniyor...</p>
        ) : (
          <p>Durum: <strong>{mesaj}</strong></p>
        )}
      </div>
      {!yukleniyor && daireler.length > 0 && (
        <table border={1} style={{ width: '80%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead>
            <tr style= {{backgroundColor :'#eee'}}>
              <th>Blok</th>
              <th>Daire No</th>
              <th>Sakin Adı</th>
              <th>Borc</th>
              <th>Telefon</th>
            </tr>
          </thead>
          <tbody>
            {daireler.map((daire) => (
              <tr key={daire.id}>
                <td>{daire.blok}</td>
                <td>{daire.daire_no}</td>
                <td>{daire.sakin_adi}</td>
                <td style={{ color: daire.borc > 0 ? 'red' : 'green' }}>{daire.borc} TL</td>                <td>{daire.telefon}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
      
    </div>
  );
}

export default App;