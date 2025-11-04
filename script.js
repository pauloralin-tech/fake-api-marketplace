// === 1. Seletores principais ===
const APIURL = 'https://fakestoreapi.com/products';
const lista = document.getElementById('lista-Produtos');
const carrinhoDiv = document.getElementById('itens-carrinho');
const totalSpan = document.getElementById('total-valor'); // mesmo id do HTML

let carrinho = []; // array para guardar os itens do carrinho

// === 2. Buscar produtos da API ===
async function carregarProdutos() {
  try {
    const resposta = await fetch(APIURL);
    const produtos = await resposta.json();
    exibirProdutos(produtos);
  } catch (erro) {
    console.error("Erro ao carregar produtos: ", erro);
    lista.innerHTML = "<p>Erro ao carregar produtos.</p>";
  }
}

// === 3. Exibir produtos na tela ===
function exibirProdutos(produtos) {
  lista.innerHTML = ''; // limpa antes de exibir

  produtos.forEach(prod => {
    const div = document.createElement('div');
    div.classList.add('produto');
    div.innerHTML = `
      <img src="${prod.image}" alt="${prod.title}">
      <h3>${prod.title}</h3>
      <p><strong>R$ ${prod.price.toFixed(2)}</strong></p>
      <button onclick="adicionar(${prod.id}, '${prod.title.replace(/'/g, "\\'")}', ${prod.price})">
        Adicionar
      </button>
    `;
    lista.appendChild(div);
  });
}

// === 4. Adicionar item ao carrinho ===
function adicionar(id, nome, preco) {
  // verifica se já existe no carrinho
  const existente = carrinho.find(item => item.id === id);

  if (existente) {
    existente.quantidade += 1; // soma 1 à quantidade
  } else {
    carrinho.push({ id, nome, preco, quantidade: 1 });
  }

  atualizarCarrinho();
}

// === 5. Atualizar carrinho na tela ===
function atualizarCarrinho() {
  carrinhoDiv.innerHTML = '';
  let total = 0;

  carrinho.forEach(item => {
    const div = document.createElement('div');
    div.className = 'item-carrinho';
    div.innerHTML = `
      <span>${item.nome}</span>
      <span>Qtd: ${item.quantidade}</span>
      <span>R$ ${(item.preco * item.quantidade).toFixed(2)}</span>
      <button onclick="alterarQtd(${item.id}, 1)">+</button>
      <button onclick="alterarQtd(${item.id}, -1)">−</button>
    `;
    carrinhoDiv.appendChild(div);
    total += item.preco * item.quantidade;
  });

  totalSpan.textContent = total.toFixed(2);
}

// === 6. Alterar quantidade ===
function alterarQtd(id, delta) {
  const item = carrinho.find(i => i.id === id);
  if (!item) return;

  item.quantidade += delta;

  if (item.quantidade <= 0) {
    // remove o item do carrinho se a quantidade ficar zero ou negativa
    carrinho = carrinho.filter(i => i.id !== id);
  }

  atualizarCarrinho();
}

// === 7. Inicializa ===
carregarProdutos();

// === Inicializa o mapa Leaflet ===
function iniciarMapa() {
  // Espera o HTML carregar
  document.addEventListener("DOMContentLoaded", () => {
    // Cria o mapa
    const mapa = L.map('mapa', {
      center: [-23.55052, -46.633308], // São Paulo
      zoom: 12,
      scrollWheelZoom: false // Desativa zoom pelo scroll
    });

    // Camada base do mapa
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '© OpenStreetMap'
    }).addTo(mapa);

    // Marcador inicial
    L.marker([-23.55052, -46.633308])
      .addTo(mapa)
      .bindPopup('Supermercado Central')
      .openPopup();

    // 🔥 Corrige bug de “mapa despedaçado”
    setTimeout(() => {
      mapa.invalidateSize();
      // === Mapa corrigido e estável ===
window.addEventListener("load", () => {
  const mapaDiv = document.getElementById("mapa");

  // Evita erro se o elemento não existir
  if (!mapaDiv) return;

  // Define localização inicial
  const mapa = L.map("mapa", {
    center: [-23.55052, -46.633308],
    zoom: 13,
    zoomControl: true,
    scrollWheelZoom: false, // desativa zoom do scroll
  });

  // Adiciona camada base
  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution: "© OpenStreetMap",
    maxZoom: 19,
  }).addTo(mapa);

  // Marcador de exemplo
  L.marker([-23.55052, -46.633308])
    .addTo(mapa)
    .bindPopup("Supermercado Central 🛒")
    .openPopup();

  // ⚙️ Força renderização correta do mapa após o CSS aplicar
  setTimeout(() => {
    mapa.invalidateSize(true);
  }, 1000);
});

    }, 500);
  });
}

// Chama a função
iniciarMapa();

