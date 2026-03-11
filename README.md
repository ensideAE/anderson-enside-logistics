# 🚚 Anderson Enside Logistics - Sistema de Cálculo de Frete

Sistema completo de cálculo de frete com integração Google Sheets, Google Maps, Groq IA e Evolution API (WhatsApp).

## 🎯 Funcionalidades

- ✅ Cálculo automático de distância via Google Maps
- ✅ Cálculo de preço de frete (Distância × Preço/KM)
- ✅ Sincronização com Google Sheets
- ✅ Integração Evolution API (WhatsApp)
- ✅ Análise com Groq IA
- ✅ Design neon verde em fundo preto
- ✅ 27 estados brasileiros com 270 cidades

## 🛠️ Tecnologias

- **Frontend:** HTML5, CSS3, JavaScript Vanilla
- **Backend:** Node.js + Express
- **APIs:** Google Maps, Google Sheets, Groq, Evolution
- **Deploy:** Vercel
- **Versionamento:** Git/GitHub

## 📋 Requisitos

- Node.js 18+
- npm ou yarn
- Chaves de API configuradas

## 🚀 Instalação Local

```bash
# Clonar repositório
git clone https://github.com/ensideanderson-nova/anderson-enside-logistics.git
cd anderson-enside-logistics

# Instalar dependências
npm install

# Configurar variáveis de ambiente
cp .env.example .env
# Editar .env com suas chaves de API

# Executar em desenvolvimento
npm run dev

# Executar em produção
npm start
```

## 📝 Variáveis de Ambiente

```env
# Google APIs
GOOGLE_MAPS_API_KEY=sua_chave_aqui
GOOGLE_SHEETS_ID=seu_id_aqui

# Groq API
GROQ_API_KEY=sua_chave_aqui

# Evolution API (WhatsApp)
EVOLUTION_API_URL=https://evolution-api-enside.onrender.com
EVOLUTION_API_TOKEN=seu_token_aqui
EVOLUTION_INSTANCE=ENSIDE

# Server
PORT=3000
NODE_ENV=development
```

## 📊 Endpoints da API

### Health Check
```
GET /api/health
```

### Submit Freight Calculation
```
POST /api/submit-frete
Content-Type: application/json

{
  "estadoOrigem": "SP",
  "cidadeOrigem": "São Paulo",
  "estadoDestino": "RJ",
  "cidadeDestino": "Rio de Janeiro",
  "peso": 25,
  "distancia": 430,
  "precoKm": 8.50,
  "precoTotal": 3655.00,
  "timestamp": "2024-01-15T10:30:00Z"
}
```

### Get Statistics
```
GET /api/stats
```

## 🌐 Deploy no Vercel

```bash
# Login no Vercel
vercel login

# Deploy
vercel --prod
```

## 📱 Estrutura do Projeto

```
anderson-enside-logistics/
├── public/
│   ├── index.html      # Página principal
│   ├── app.js          # Lógica do formulário
│   └── data.js         # Estados e cidades
├── server.js           # Backend Express
├── package.json        # Dependências
├── vercel.json         # Configuração Vercel
├── .env.example        # Template de variáveis
└── README.md           # Este arquivo
```

## 🔗 Integração Google Sheets

A sincronização com Google Sheets será realizada através da API Google Sheets v4. Os dados serão salvos em tempo real quando o usuário calcular um frete.

**Colunas esperadas:**
- Timestamp
- Estado Origem
- Cidade Origem
- Estado Destino
- Cidade Destino
- Peso (Toneladas)
- Distância (KM)
- Preço por KM
- Preço Total (R$)

## 💬 Integração Evolution API

Quando um frete é calculado, uma mensagem é enviada via WhatsApp através da Evolution API com os detalhes do cálculo.

## 🤖 Análise com Groq

O Groq IA analisa os dados de frete para fornecer insights sobre:
- Preços competitivos
- Rotas otimizadas
- Padrões de demanda

## 🐛 Troubleshooting

### Erro: "Google Maps API key is invalid"
- Verifique se a chave está correta em `.env`
- Ative a Distance Matrix API no Google Cloud Console

### Erro: "Google Sheets not found"
- Verifique o ID da planilha
- Confirme que a conta tem acesso

### Erro: "Evolution API connection failed"
- Verifique a URL e token da Evolution API
- Confirme que a instância está ativa

## 📞 Suporte

Para suporte, entre em contato com Anderson Enside através de:
- Email: ensideanderson12@gmail.com
- WhatsApp: via Evolution API

## 📄 Licença

MIT

## 👨‍💻 Autor

Anderson Enside - 2024
