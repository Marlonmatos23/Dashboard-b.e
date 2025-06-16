import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import axios from 'axios';

import { fetchWeatherApi } from 'openmeteo'; //API - Velocidade Vento


dotenv.config();

const app = express();
app.use(cors());

const PORT = process.env.PORT || 5050;
const uri = process.env.MONGO_URI;
const collectionName = process.env.COLLECTION_NAME;

//Conexão API - Open Meteo : Obter Velocidade do Vento
const api_weather_url = "https://api.open-meteo.com/v1/forecast";


// Validação de variáveis de ambiente
if (!uri || !collectionName) {
  console.error("Erro: Variáveis de ambiente MONGO_URI e COLLECTION_NAME são obrigatórias.");
  process.exit(1);
}

mongoose.connect(uri)
  .then(() => console.log("Backend: Conectado ao MongoDB com sucesso!"))
  .catch((err) => console.error("Backend: Erro na conexão com o MongoDB:", err));

// --- CORREÇÃO CRÍTICA: Timestamp é do tipo 'Date' para ordenação correta. ---
const dadoSchema = new mongoose.Schema({
    Timestamp:  { type: Date, required: true }, 
    Speed_KPH:  Number,
    Motor_Speed_RPM: Number,
    Motor_Temp_C: Number,
    Ctrl_Temp_C: Number,
    Volt: Number,
    Current: Number,
    Speed_Mode: String,
    Autonomia: Number,
    Capacidade_Restante: Number,

}, { timestamps: true }); // Adiciona createdAt e updatedAt automaticamente

const Dado = mongoose.model('Dado', dadoSchema, collectionName);

// Rota principal para buscar os dados do dashboard
app.get('/dados', async (req, res) => {
  try {
    const dados = await Dado.find({})
      .sort({ Timestamp: -1 }) // Ordena do mais novo para o mais antigo
      .limit(100); // Pega os 100 registos mais recentes

    // Retorna os dados na ordem cronológica (mais antigo primeiro) para o frontend
    res.json(dados.reverse()); 

    console.log(`${new Date().toISOString()}: [SUCESSO] Enviados ${dados.length} registos.`);
  } catch (err) {
    console.error("Backend: Erro ao buscar dados na rota /dados:", err);
    res.status(500).json({ error: 'Erro interno ao buscar dados do dashboard.' });
  }
});

// Rota para obter dados sobre Velocidade do Vento (Ainda Estáticos - Baseados no MapComponent)
app.get('/weather', async (req, res) => { //  Consultar dinamicamente Com /:lat/:lon
    const { lat, lon } = req.params;

    try {
        const params = {
            latitude: -1.4772889522549837, //parseFloat(lat),
            longitude: -48.45399135672737, //parseFloat(lon),
            hourly: ["temperature_2m","windspeed_10m"],
            timezone: 'auto'
        };

        const response = await axios.get(api_weather_url, { params }); //Realizo a conexão com a Api usando AXIOS
        const data = response.data;
        console.log(`${new Date().toISOString()}: [SUCESSO] Conectado a API - WindSpeed`); //Log de Sucesso de Conexão

        const time = data?.hourly?.time || []; //Timestamp da Consulta
        const temperature = data?.hourly?.temperature_2m || []; // Temperatura Local
        const windspeed = data?.hourly?.windspeed_10m || [];    // Velocidade do vento Local

        const forecast = time.map((t, i) => ({
            time: t,
            temperature: temperature[i],
            windspeed: windspeed[i]
        }));

        res.json(forecast);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.listen(PORT, () => {
  console.log(`Servidor do backend a rodar na porta ${PORT}`);
});
