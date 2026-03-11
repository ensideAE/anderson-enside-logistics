// Initialize form elements
const estadoOrigemSelect = document.getElementById('estadoOrigem');
const cidadeOrigemSelect = document.getElementById('cidadeOrigem');
const estadoDestinoSelect = document.getElementById('estadoDestino');
const cidadeDestinoSelect = document.getElementById('cidadeDestino');
const precoKmInput = document.getElementById('precoKm');
const pesoInput = document.getElementById('peso');
const distanciaInput = document.getElementById('distancia');
const precoInput = document.getElementById('preco');
const calcularBtn = document.getElementById('calcularBtn');
const limparBtn = document.getElementById('limparBtn');
const resultado = document.getElementById('resultado');
const loadingDistancia = document.getElementById('loadingDistancia');

// Populate states
function populateEstados() {
  estados.forEach(estado => {
    const option = document.createElement('option');
    option.value = estado;
    option.textContent = estado;
    estadoOrigemSelect.appendChild(option);

    const option2 = document.createElement('option');
    option2.value = estado;
    option2.textContent = estado;
    estadoDestinoSelect.appendChild(option2);
  });
}

// Update cities based on selected state
function updateCidades(selectEstado, selectCidade) {
  const estado = selectEstado.value;
  selectCidade.innerHTML = '<option value="">Selecione uma cidade</option>';
  
  if (estado && estadosCidades[estado]) {
    estadosCidades[estado].forEach(cidade => {
      const option = document.createElement('option');
      option.value = cidade;
      option.textContent = cidade;
      selectCidade.appendChild(option);
    });
  }
}

// Event listeners for state changes
estadoOrigemSelect.addEventListener('change', () => {
  updateCidades(estadoOrigemSelect, cidadeOrigemSelect);
});

estadoDestinoSelect.addEventListener('change', () => {
  updateCidades(estadoDestinoSelect, cidadeDestinoSelect);
});

// Calculate distance using Google Maps Distance Matrix API
async function calcularDistancia() {
  const cidadeOrigem = cidadeOrigemSelect.value;
  const estadoOrigem = estadoOrigemSelect.value;
  const cidadeDestino = cidadeDestinoSelect.value;
  const estadoDestino = estadoDestinoSelect.value;

  if (!cidadeOrigem || !estadoOrigem || !cidadeDestino || !estadoDestino) {
    alert('Por favor, selecione origem e destino');
    return;
  }

  loadingDistancia.classList.add('show');
  distanciaInput.value = '';

  try {
    const service = new google.maps.DistanceMatrixService();
    const response = await service.getDistanceMatrix({
      origins: [`${cidadeOrigem}, ${estadoOrigem}, Brasil`],
      destinations: [`${cidadeDestino}, ${estadoDestino}, Brasil`],
      travelMode: 'DRIVING',
      unitSystem: google.maps.UnitSystem.METRIC
    });

    if (response.rows[0].elements[0].status === 'OK') {
      const distanciaMetros = response.rows[0].elements[0].distance.value;
      const distanciaKm = Math.round(distanciaMetros / 1000);
      distanciaInput.value = distanciaKm;
    } else {
      alert('Não foi possível calcular a distância. Tente novamente.');
    }
  } catch (error) {
    console.error('Erro ao calcular distância:', error);
    alert('Erro ao calcular distância');
  } finally {
    loadingDistancia.classList.remove('show');
  }
}

// Calculate total price
function calcularPreco() {
  const distancia = parseFloat(distanciaInput.value) || 0;
  const precoKm = parseFloat(precoKmInput.value) || 0;
  const precoTotal = distancia * precoKm;
  precoInput.value = precoTotal.toFixed(2);
  return precoTotal;
}

// Format currency
function formatarMoeda(valor) {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(valor);
}

// Show results
function mostrarResultado() {
  const cidadeOrigem = cidadeOrigemSelect.value;
  const estadoOrigem = estadoOrigemSelect.value;
  const cidadeDestino = cidadeDestinoSelect.value;
  const estadoDestino = estadoDestinoSelect.value;
  const distancia = parseFloat(distanciaInput.value) || 0;
  const peso = parseFloat(pesoInput.value) || 0;
  const precoKm = parseFloat(precoKmInput.value) || 0;
  const precoTotal = parseFloat(precoInput.value) || 0;

  document.getElementById('resultOrigem').textContent = `${cidadeOrigem}, ${estadoOrigem}`;
  document.getElementById('resultDestino').textContent = `${cidadeDestino}, ${estadoDestino}`;
  document.getElementById('resultDistancia').textContent = `${distancia} km`;
  document.getElementById('resultPeso').textContent = `${peso} ton`;
  document.getElementById('resultPrecoKm').textContent = `R$ ${precoKm.toFixed(2)}`;
  document.getElementById('resultPrecoTotal').textContent = precoTotal.toFixed(2).replace('.', ',');

  resultado.classList.add('show');
}

// Send data to backend
async function enviarDados() {
  const cidadeOrigem = cidadeOrigemSelect.value;
  const estadoOrigem = estadoOrigemSelect.value;
  const cidadeDestino = cidadeDestinoSelect.value;
  const estadoDestino = estadoDestinoSelect.value;
  const distancia = parseFloat(distanciaInput.value) || 0;
  const peso = parseFloat(pesoInput.value) || 0;
  const precoKm = parseFloat(precoKmInput.value) || 0;
  const precoTotal = parseFloat(precoInput.value) || 0;

  try {
    const response = await fetch('/api/submit-frete', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        estadoOrigem,
        cidadeOrigem,
        estadoDestino,
        cidadeDestino,
        peso,
        distancia,
        precoKm,
        precoTotal,
        timestamp: new Date().toISOString()
      })
    });

    if (!response.ok) {
      console.error('Erro ao enviar dados');
    }
  } catch (error) {
    console.error('Erro:', error);
  }
}

// Calculate button click
calcularBtn.addEventListener('click', async (e) => {
  e.preventDefault();

  // Validate form
  if (!estadoOrigemSelect.value || !cidadeOrigemSelect.value || 
      !estadoDestinoSelect.value || !cidadeDestinoSelect.value ||
      !precoKmInput.value || !pesoInput.value) {
    alert('Por favor, preencha todos os campos obrigatórios');
    return;
  }

  // Calculate distance
  await calcularDistancia();

  // Calculate price
  calcularPreco();

  // Show results
  mostrarResultado();

  // Send data to backend
  enviarDados();
});

// Clear button click
limparBtn.addEventListener('click', (e) => {
  e.preventDefault();
  estadoOrigemSelect.value = '';
  cidadeOrigemSelect.value = '';
  estadoDestinoSelect.value = '';
  cidadeDestinoSelect.value = '';
  precoKmInput.value = '';
  pesoInput.value = '';
  distanciaInput.value = '';
  precoInput.value = '';
  resultado.classList.remove('show');
});

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
  populateEstados();
});
