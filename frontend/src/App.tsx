import { useEffect, useState } from "react";
import './App.css'

interface Daire{
  id:number;
  daire_no:number;
  blok:string;
  sakin_adi:string;
  borc:number;
  telefon:string;
}

const inputStyle = {
  padding: '10px',
  borderRadius: '6px',
  border: '1px solid #ddd',
  outline: 'none'
};

const thStyle = {
  padding: '15px',
  textAlign: 'left' as const
};

const tdStyle = {
  padding: '12px'
};

const silButonStyle = {
  backgroundColor: '#c0392b',
  color: 'white',
  border: 'none',
  padding: '6px 12px',
  borderRadius: '4px',
  cursor: 'pointer',
  fontSize: '12px'
};

function App() {

  const [daireler,setDaireler] = useState<Daire[]>([]);
  const [mesaj,setMesaj] = useState<string>("Backendden cevap bekleniyor...");
  const [yukleniyor,setYukleniyor] = useState<boolean>(true);
  const [duzenleId,setDuzenleId] = useState<number | null>(null)
  const [aramaMetni,setAramaMetni] = useState("")

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
      // Karar veriyoruz
      const url = duzenleId ? `http://localhost:5000/daireler/${duzenleId}` : 'http://localhost:5000/daireler';
      const method = duzenleId ? 'PUT' : 'POST';
      const response = await fetch(url, {
        method:method,
        headers:{
          'Content-Type':'application/json'
        },
        body: JSON.stringify(yeniKisi)
      })
      console.log("Backend cevap verdi mi?:", response.ok); // Konsolda true mu yazıyor bak
      if(response.ok){
        const data = await response.json() 
        console.log("Veritabanından gelen yanıt:", data);
        alert(duzenleId ? "Başarıyla Güncellendi!" : "Başarıyla Kaydedildi!");        //Kayıt sonrası formu temizle
        setDuzenleId(null); // Modu sıfırla
        setYeniKişi({
          id:0,
          daire_no:0,
          blok:"",
          sakin_adi:"",
          borc:0,
          telefon:"",
        });
        // Listeyi yenilemek için senin fetch kodun...
        const res = await fetch('http://localhost:5000/daireler');
        setDaireler(await res.json());
        //Daireleri güncelle
        const updatedResponse = await fetch('http://localhost:5000/daireler');
        const updatedDaireler = await updatedResponse.json();
        setDaireler(updatedDaireler);             
      }
    }catch(error){
    console.error("Kayıt sırasında hata",error)
  }  
  }
  //Düzenle butonu 
  const duzenleModunaGec = async(daire:Daire) =>{
    setDuzenleId(daire.id);
    setYeniKişi({
      id:daire.id,
      daire_no:daire.daire_no,
      blok:daire.blok,
      sakin_adi:daire.sakin_adi,
      borc: daire.borc,
      telefon: daire.telefon
    })   
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

//Vazgeç fonksiyonu
const vazgec = () =>{
  setDuzenleId(null);
  setYeniKişi({
    id:0,
    daire_no:0,
    blok:"",
    sakin_adi:"",
    borc:0,
    telefon:"",
  })
}

//Filtreleme ile arama
  const suzulmusDairler = daireler.filter(daire => {
    const isim = daire.sakin_adi ? daire.sakin_adi.toLowerCase():"";
    const blok = daire.blok ? daire.blok.toLowerCase():"";
    const arama = aramaMetni.toLowerCase();
    return isim.includes(arama) || blok.includes(arama)
  })

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
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif", 
    backgroundColor: '#f4f7f6', 
    minHeight: '100vh', 
    padding: '40px' 
  }}>
    <div style={{ maxWidth: '1000px', margin: '0 auto', backgroundColor: 'white', padding: '30px', borderRadius: '12px', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}>
      
      <h1 style={{ textAlign: 'center', color: '#2c3e50', marginBottom: '30px' }}>🏙️ Site Yönetimi Paneli</h1>

      {/* Giriş Formu Alanı */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '15px', marginBottom: '30px', padding: '20px', border: '1px solid #eee', borderRadius: '8px' }}>
        <input type="text" placeholder="Blok" value={yeniKisi.blok} onChange={(e) => setYeniKişi({...yeniKisi, blok:e.target.value})} style={inputStyle}/>
        <input type="number" placeholder="Daire No" value={yeniKisi.daire_no} onChange={(e) => setYeniKişi({...yeniKisi, daire_no:Number(e.target.value)})} style={inputStyle}/>
        <input type="text" placeholder="Sakin Adı" value={yeniKisi.sakin_adi} onChange={(e) => setYeniKişi({...yeniKisi, sakin_adi:e.target.value})} style={inputStyle}/>
        <input type="number" placeholder="Borç" value={yeniKisi.borc} onChange={(e) => setYeniKişi({...yeniKisi, borc:Number(e.target.value)})} style={inputStyle}/>
        <input type="text" placeholder="Telefon" value={yeniKisi.telefon} onChange={(e) => setYeniKişi({...yeniKisi, telefon:e.target.value})} style={inputStyle}/>
        
        <button type="button" className="vazgec-btn" onClick={vazgec}>Vazgeç</button>
        <button onClick={kaydet} style={{ 
          gridColumn: 'span 1', backgroundColor: '#27ae60', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold', transition: '0.3s' 
        }}>Kaydet</button>
      </div>

      {/* Durum Mesajı */}
      <div style={{ textAlign: 'center', marginBottom: '20px', fontSize: '14px', color: '#7f8c8d' }}>
        {yukleniyor ? "Yükleniyor..." : `Sistem Durumu: ${mesaj}`}
      </div>
      
      {/* Arama Kutusu */}
      <div style={{marginBottom:"20px"}}>
        <p style={{fontWeight:"bold",marginBottom:"5px"}}>Kişi veya blok ara</p>
        <input
        type = "text"
        placeholder = "İsim veya blok arat"
        value = {aramaMetni}
        onChange = {(e) => setAramaMetni(e.target.value)}
        style={{ ...inputStyle, width: '100%', boxSizing: 'border-box' }}>
        </input>
      </div>

      {/* Tablo Alanı */}
      {!yukleniyor && daireler.length > 0 && (
        <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '20px' }}>
          <thead>
            <tr style={{ backgroundColor: '#34495e', color: 'white' }}>
              <th style={thStyle}>Blok</th>
              <th style={thStyle}>Daire</th>
              <th style={thStyle}>Sakin</th>
              <th style={thStyle}>Borç</th>
              <th style={thStyle}>Telefon</th>
              <th style={thStyle}>İşlem</th>
            </tr>
          </thead>
          <tbody>
            {suzulmusDairler.map((daire) => (
              <tr key={daire.id} style={{ borderBottom: '1px solid #eee' }}>
                <td style={tdStyle}>{daire.blok}</td>
                <td style={tdStyle}>{daire.daire_no}</td>
                <td style={tdStyle}>{daire.sakin_adi}</td>
                <td style={{ ...tdStyle, color: daire.borc > 0 ? '#e74c3c' : '#27ae60', fontWeight: 'bold' }}>{daire.borc} TL</td>
                <td style={tdStyle}>{daire.telefon}</td>
                <td style={tdStyle}>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <button onClick={() => sil(daire.id)} style={silButonStyle}>Sil</button>
                    <button onClick={() =>duzenleModunaGec(daire)}
                    style={{backgroundColor: '#2980b9',color: 'white',
                      border: 'none',padding: '5px 10px',borderRadius: '4px',cursor: 'pointer'
                    }}
                    >Düzenle</button>
                  </div>
                
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  </div>
);
}

export default App;