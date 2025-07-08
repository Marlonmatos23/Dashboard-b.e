import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import axios from 'axios'; // Usado para a API OpenMeteo
import path from 'path'; // <-- CORREÇÃO: Importa o módulo 'path'
import { fileURLToPath } from 'url';

// Configuração necessária para usar __dirname com ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();

// Declaração única da variável 'app'
const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Servir os ficheiros estáticos do frontend (da pasta 'public')
app.use(express.static(path.join(__dirname, 'public')));

// Configurações do Banco de Dados
const PORT = process.env.PORT || 5000;
const uri = process.env.MONGO_URI;
const collectionName = process.env.COLLECTION_NAME;

// Conexão com o MongoDB
mongoose.connect(uri)
  .then(() => console.log("Backend: Conectado ao MongoDB com sucesso!"))
  .catch((err) => console.error("Backend: Erro na conexão com o MongoDB:", err));

// Schema do Mongoose
const dadoSchema = new mongoose.Schema({
    Timestamp:  Date,
    Speed_KPH:  Number,
    Motor_Speed_RPM: Number,
    Motor_Temp_C: Number,
    Ctrl_Temp_C: Number,
    Volt: Number,
    Current: Number,
    Speed_Mode: String,
    Autonomia: Number,
    Capacidade_Restante: Number,
}, { timestamps: true });

const Dado = mongoose.model('Dado', dadoSchema, collectionName);

// --- Rotas da API ---
// Rota para o DASHBOARD (dados recentes)
app.get('/dados', async (req, res) => {
  try {
    const dados = await Dado.find({}).sort({ Timestamp: -1 }).limit(100);
    res.json(dados.reverse());
  } catch (err) {
    res.status(500).json({ error: 'Erro ao buscar dados recentes' });
  }
});

// Rota para o HISTÓRICO (dados completos)
app.get('/dados/completo', async (req, res) => {
  try {
    const todosOsDados = await Dado.find({}).sort({ Timestamp: 1 });
    res.json(todosOsDados);
  } catch (err) {
    res.status(500).json({ error: 'Erro ao buscar histórico completo' });
  }
});

// Rota para obter dados sobre Velocidade do Vento da API OpenMeteo
const api_weather_url = "https://api.open-meteo.com/v1/forecast";
app.get('/weather', async (req, res) => {
    // --- CORREÇÃO: Usar req.query para ler parâmetros opcionais da URL ---
    const latitude = req.query.lat || -1.4558; // Coordenadas de Belém como padrão
    const longitude = req.query.lon || -48.5039;

    try {
        const params = {
            latitude,
            longitude,
            hourly: "windspeed_10m",
            timezone: 'auto'
        };
        const response = await axios.get(api_weather_url, { params });
        res.json(response.data);
    } catch (error) {
        console.error("[OpenMeteo] Erro:", error.message);
        res.status(500).json({ error: "Falha ao obter dados de meteorologia" });
    }
});


// --- Rota "Catch-All" para o Frontend ---
// Esta rota deve vir DEPOIS de todas as suas rotas de API.
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Iniciar o servidor
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
