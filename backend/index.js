
const express = require('express');
const cors = require('cors');
require('dotenv').config();
const { Pool } = require('pg');

const app = express();
app.use(cors());
app.use(express.json());

//Bağlantı Ayarları 
const pool = new Pool({
    user:'postgres',
    host:'localhost',
    database:'postgres',
    password:'postgres',
    port:5432,
})

app.get('/', (req, res) => {
    res.send('Site Yonetimi Backend Servisi Calisiyor!');
});


app.get('/daireler',async(req,res) => {
    try {
        const result = await pool.query('SELECT * FROM daireler');
        res.json(result.rows); //Veritabanımızdan gelen satırları json olarak gönder
    } catch (error) {
        console.error('Daireler alınırken hata oluştu:', error);
        res.status(500).json({ error: 'Daireler alınırken hata oluştu' });
    }
})

app.post('/daireler',async(req,res) =>{
    try {
        const {daire_no,blok,sakin_adi,borc,telefon} = req.body
        //Veritabanına ekleyelim
        const yeniDaire = await pool.query(
            'INSERT INTO daireler (daire_no,blok,sakin_adi,borc,telefon) VALUES ($1,$2,$3,$4,$5) RETURNING *',
            [daire_no,blok,sakin_adi,borc,telefon ]
        )

        //Başarılı mesajını burada gönderiyoruz!
        console.log("Başarıyla eklendi:", yeniDaire.rows[0]);
        res.json(yeniDaire.rows[0]); // 500 hatası yerine veriyi gönderiyoruz
    } catch (error) {
        // Sadece bir sorun çıkarsa burası çalışmalı        
        console.error("Veritabanına eklerken bir hata oldu")
        res.status(500).send("Sunucu hatası");
        
    }
})

const PORT = 5000;


app.listen(PORT,() => {
    console.log(`Sunucu http://localhost:${PORT} adresinde hazır!`)
});
