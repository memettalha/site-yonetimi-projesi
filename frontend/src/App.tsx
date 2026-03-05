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

  //Yeni kişi eklemek için
  const[yeniKisi,  setYeniKişi] = useState<Daire>({
    id:0,
    daire_no:0,
    blok:"",
    sakin_adi:"",
    borc:0,
    telefon:"",
  })

  //Kaydet butonunu çalıştırma
  const kaydet = async(e:React.BaseSyntheticEvent) => {
    e.preventDefault();
    console.log("TAMAMDIR: Butona basıldı ve fonksiyon çalıştı!"); // <--- Bunu ekle
    console.log("Yeni kişi:", yeniKisi);
    try{
      const response = await fetch('http://localhost:5000/daireler', {
        method:'POST',
        headers:{
          'Content-Type':'application/json'
        },
        body: JSON.stringify(yeniKisi)
      })
      console.log("Backend cevap verdi mi?:", response.ok); // Konsolda true mu yazıyor bak
      if(response.ok){
        const data = await response.json() 
        console.log("Veritabanından gelen yanıt:", data);
        alert("Kişi başarıyla kaydedildi!");
        //Kayıt sonrası formu temizle
        setYeniKişi({
          id:0,
          daire_no:0,
          blok:"",
          sakin_adi:"",
          borc:0,
          telefon:"",
        });
        //Daireleri güncelle
        const updatedResponse = await fetch('http://localhost:5000/daireler');
        const updatedDaireler = await updatedResponse.json();
        setDaireler(updatedDaireler);             
      }
    }catch(error){
    console.error("Kayıt sırasında hata",error)
  }  
  }
  
//Sil fonksiyonu
const sil = async(id:number) => {
  if(window.confirm("Bu kaydı silmek istediğinize emin misiniz")){
    try {
      const response = await fetch(`http://localhost:5000/daireler/${id}`,{
        method:'DELETE',
      })
      if(response.ok){
        // Ekranı güncelle: Silinen ID hariç diğerlerini filtrele
        setDaireler(daireler.filter(d=> d.id !==id)
        )
      }
    } catch (error) {
      console.log("Silme hatası",error)
    }
  }
    
}

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
      <div>
        <input type="text" placeholder="Blok adı" value={yeniKisi.blok} onChange = {(e) => setYeniKişi({...yeniKisi, blok:e.target.value})}/>
        <input type="number" placeholder="Daire No"value={yeniKisi.daire_no} onChange = {(e) => setYeniKişi({...yeniKisi, daire_no:Number(e.target.value)})}/>
        <input type="text" placeholder="Sakin Adı" value={yeniKisi.sakin_adi} onChange={(e) => setYeniKişi({...yeniKisi, sakin_adi:e.target.value})}/>
        <input type="number" placeholder="Borc" value={yeniKisi.borc} onChange={(e) => setYeniKişi({...yeniKisi, borc:Number(e.target.value)})}/>
        <input type="text" placeholder="Telefon" value={yeniKisi.telefon} onChange={(e) => setYeniKişi({...yeniKisi, telefon:e.target.value})}/>

        <button onClick= {kaydet}
         style={{backgroundColor: 'blue', color: 'white', border: 'none', padding: '10px 20px', cursor: 'pointer'}}>Kaydet</button>
      </div>
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
                <td style={{ color: daire.borc > 0 ? 'red' : 'green' }}>{daire.borc} TL</td>                
                <td>{daire.telefon}</td>
                <td style={{textAlign:'center'}}>
                  <button
                  onClick = {() => sil(daire.id)} 
                  style={{ 
                  backgroundColor: 'red', 
                  color: 'white', 
                  padding: '5px 10px', 
                  cursor: 'pointer', 
                  borderRadius: '4px', 
                  border: '2px solid #8B0000' 
                  }}>
                    Sil
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
      
    </div>
  );
}

export default App;