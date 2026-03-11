import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();

const SHEETS_API_URL = 'https://sheets.googleapis.com/v4/spreadsheets';
const GOOGLE_SHEETS_ID = process.env.GOOGLE_SHEETS_ID;
const GOOGLE_MAPS_API_KEY = process.env.GOOGLE_MAPS_API_KEY;

/**
 * Append a row to Google Sheets
 * @param {Object} data - Freight calculation data
 */
export async function appendToGoogleSheets(data) {
  if (!GOOGLE_SHEETS_ID || !GOOGLE_MAPS_API_KEY) {
    console.log('⚠️ Google Sheets not configured. Skipping sync.');
    return;
  }

  try {
    const values = [
      [
        data.timestamp || new Date().toISOString(),
        data.estadoOrigem,
        data.cidadeOrigem,
        data.estadoDestino,
        data.cidadeDestino,
        data.peso,
        data.distancia,
        data.precoKm,
        data.precoTotal
      ]
    ];

    const response = await axios.post(
      `${SHEETS_API_URL}/${GOOGLE_SHEETS_ID}/values/Sheet1!A:I:append?valueInputOption=USER_ENTERED&key=${GOOGLE_MAPS_API_KEY}`,
      { values },
      {
        headers: {
          'Content-Type': 'application/json'
        }
      }
    );

    console.log('✅ Data synced to Google Sheets');
    return response.data;
  } catch (error) {
    console.error('❌ Error syncing to Google Sheets:', error.message);
    // Don't throw - allow app to continue even if Sheets sync fails
  }
}

/**
 * Get statistics from Google Sheets
 */
export async function getSheetStats() {
  if (!GOOGLE_SHEETS_ID || !GOOGLE_MAPS_API_KEY) {
    return null;
  }

  try {
    const response = await axios.get(
      `${SHEETS_API_URL}/${GOOGLE_SHEETS_ID}/values/Sheet1?key=${GOOGLE_MAPS_API_KEY}`
    );

    const rows = response.data.values || [];
    
    if (rows.length <= 1) {
      return {
        total_fretes: 0,
        total_distancia: 0,
        total_valor: 0,
        media_valor: 0
      };
    }

    // Skip header row
    const dataRows = rows.slice(1);
    
    let totalDistancia = 0;
    let totalValor = 0;

    dataRows.forEach(row => {
      const distancia = parseFloat(row[6]) || 0;
      const valor = parseFloat(row[8]) || 0;
      totalDistancia += distancia;
      totalValor += valor;
    });

    return {
      total_fretes: dataRows.length,
      total_distancia: totalDistancia,
      total_valor: totalValor,
      media_valor: dataRows.length > 0 ? totalValor / dataRows.length : 0
    };
  } catch (error) {
    console.error('Error getting stats:', error.message);
    return null;
  }
}
