import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import axios from 'axios';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(join(__dirname, 'public')));

// Google Sheets configuration
const GOOGLE_SHEETS_ID = process.env.GOOGLE_SHEETS_ID;
const GOOGLE_SHEETS_API_KEY = process.env.GOOGLE_MAPS_API_KEY;

// Evolution API configuration
const EVOLUTION_API_URL = process.env.EVOLUTION_API_URL;
const EVOLUTION_API_TOKEN = process.env.EVOLUTION_API_TOKEN;
const EVOLUTION_INSTANCE = process.env.EVOLUTION_INSTANCE;

// Groq API configuration
const GROQ_API_KEY = process.env.GROQ_API_KEY;

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Submit freight calculation
app.post('/api/submit-frete', async (req, res) => {
  try {
    const {
      estadoOrigem,
      cidadeOrigem,
      estadoDestino,
      cidadeDestino,
      peso,
      distancia,
      precoKm,
      precoTotal,
      timestamp
    } = req.body;

    console.log('Recebido:', {
      estadoOrigem,
      cidadeOrigem,
      estadoDestino,
      cidadeDestino,
      peso,
      distancia,
      precoKm,
      precoTotal,
      timestamp
    });

    // TODO: Integrar com Google Sheets API
    // Por enquanto, apenas log
    
    // TODO: Enviar para Evolution API (WhatsApp)
    // if (EVOLUTION_API_URL && EVOLUTION_API_TOKEN) {
    //   await enviarWhatsApp(req.body);
    // }

    // TODO: Usar Groq para análise
    // if (GROQ_API_KEY) {
    //   await analisarComGroq(req.body);
    // }

    res.json({
      success: true,
      message: 'Frete recebido com sucesso',
      data: req.body
    });
  } catch (error) {
    console.error('Erro:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Get statistics
app.get('/api/stats', async (req, res) => {
  try {
    res.json({
      total_fretes: 0,
      total_distancia: 0,
      total_valor: 0,
      media_valor: 0
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Send WhatsApp message via Evolution API
async function enviarWhatsApp(dados) {
  try {
    const mensagem = `
📦 *Novo Frete Calculado*

📍 *Origem:* ${dados.cidadeOrigem}, ${dados.estadoOrigem}
📍 *Destino:* ${dados.cidadeDestino}, ${dados.estadoDestino}
📏 *Distância:* ${dados.distancia} km
⚖️ *Peso:* ${dados.peso} ton
💰 *Preço/KM:* R$ ${dados.precoKm.toFixed(2)}
💵 *Total:* R$ ${dados.precoTotal.toFixed(2)}
    `;

    const response = await axios.post(
      `${EVOLUTION_API_URL}/message/sendText/${EVOLUTION_INSTANCE}`,
      {
        number: 'ensideanderson12@gmail.com',
        text: mensagem
      },
      {
        headers: {
          'Authorization': `Bearer ${EVOLUTION_API_TOKEN}`,
          'Content-Type': 'application/json'
        }
      }
    );

    console.log('WhatsApp enviado:', response.data);
  } catch (error) {
    console.error('Erro ao enviar WhatsApp:', error.message);
  }
}

// Analyze with Groq
async function analisarComGroq(dados) {
  try {
    const response = await axios.post(
      'https://api.groq.com/openai/v1/chat/completions',
      {
        model: 'mixtral-8x7b-32768',
        messages: [
          {
            role: 'user',
            content: `Analise este frete e forneça insights: ${JSON.stringify(dados)}`
          }
        ]
      },
      {
        headers: {
          'Authorization': `Bearer ${GROQ_API_KEY}`,
          'Content-Type': 'application/json'
        }
      }
    );

    console.log('Análise Groq:', response.data);
  } catch (error) {
    console.error('Erro ao analisar com Groq:', error.message);
  }
}

// Serve index.html for root path
app.get('/', (req, res) => {
  res.sendFile(join(__dirname, 'public', 'index.html'));
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Rota não encontrada' });
});

// Error handler
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ error: 'Erro interno do servidor' });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Servidor rodando em http://localhost:${PORT}`);
  console.log(`📊 Google Sheets ID: ${GOOGLE_SHEETS_ID || 'não configurado'}`);
  console.log(`📱 Evolution API: ${EVOLUTION_API_URL || 'não configurado'}`);
  console.log(`🤖 Groq API: ${GROQ_API_KEY ? 'configurado' : 'não configurado'}`);
});
