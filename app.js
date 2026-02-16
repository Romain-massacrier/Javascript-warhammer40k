// ===============================
// MUNITORUM IMPERIALIS - APP.JS
// Thème: Imperium (Warhammer 40k)
// ===============================


// Données mock d'items (reliques) du Munitorum
const itemsRPG = [
  {
    id: 1,
    name: "Bolter MK II sanctifié",
    price: 220,
    description: "Arme sacrée des Space Marines. Chaque tir est accompagné d une prière à l Empereur.",
    image: "assets/img/bolter.jpeg",
    category: "Arme",
    stock: 2
  },
  {
    id: 2,
    name: "Épée tronçonneuse Astartes",
    price: 180,
    description: "Lame motorisée capable de déchiqueter armure et chair sur les champs de bataille impériaux.",
    image: "assets/img/chainsword.jpeg",
    category: "Arme",
    stock: 4
  },
  {
    id: 3,
    name: "Armure énergétique partielle",
    price: 320,
    description: "Plaques renforcées issues d une ancienne armure impériale récupérée sur un monde ruche.",
    image: "assets/img/powerarmor.jpeg",
    category: "Armure",
    stock: 1
  },
  {
    id: 4,
    name: "Casque de Skitarii",
    price: 140,
    description: "Interface neuronale permettant de recevoir les ordres directement depuis la Noosphère.",
    image: "assets/img/skitariihelmet.jpeg",
    category: "Armure",
    stock: 3
  },
  {
    id: 5,
    name: "Stim de combat du Medicae",
    price: 45,
    description: "Injection d urgence augmentant réflexes et résistance à la douleur pendant l engagement.",
    image: "assets/img/combatstim.jpeg",
    category: "Potion",
    stock: 12
  },
  ]


// Ajout d'une relique
function addItem(id, name, price, description, image, category, stock) {
  itemsRPG.push({ id, name, price, description, image, category, stock })
}

// Reliques additionnelles (mock)
addItem(
  6,
  "Sérum de régénération",
  1,
  "Composé expérimental accélérant la reconstruction des tissus et la récupération.",
  "assets/img/regeneration.jpeg",
  "Potion",
  147
)

addItem(
  7,
  "Crâne servo ancien",
  -1,
  "Relique mécanique contenant encore des fragments de mémoire d un ancien Tech-Priest.",
  "assets/img/servoskull.jpeg",
  "Artefact",
  -1
)

addItem(
  8,
  "Fragment STC endommagé",
  0,
  "Artefact extrêmement rare. Les données qu il contient pourraient changer le destin d un monde.",
  "assets/img/stc.jpeg",
  "Artefact",
  12940
)

// Crédits du requérant (mock)
let playerGold = 800

// Sélecteurs de base
const feedContainer = document.getElementById("feed-container")
const goldAmountSpan = document.getElementById("gold-amount")
const categoryFilter = document.getElementById("category-filter")


// Mise à jour affichage des crédits
function updateGoldDisplay() {
  goldAmountSpan.textContent = playerGold
}

// Helpers Imperium
function formatPrice(item) {
  // Prix -1: indisponible
  if (typeof item.price === "number" && item.price === -1) return "Indisponible"
  // Prix 0: gratuit
  if (typeof item.price === "number" && item.price === 0) return "Réquisition libre"
  // Prix normal
  if (typeof item.price === "number") return `${item.price} Crédits`
  return "Erreur de registre"
}

function formatStock(item) {
  if (typeof item.stock !== "number") return "Erreur de registre"
  if (item.stock <= 0) return ""
  return `Stock : ${item.stock}`
}

function resolveImage(item) {
  return item.image || "assets/img/default.jpeg"
}

function isPurchasable(item) {
  // Achetable si stock > 0 ET prix >= 0
  if (typeof item.stock !== "number" || item.stock <= 0) return false
  if (typeof item.price !== "number" || item.price < 0) return false
  return true
}

// Création d'une carte relique
function createItemCard(item) {
  const card = document.createElement("article")
  card.className = "item-card"

  const img = document.createElement("img")
  img.className = "item-image"
  img.src = resolveImage(item)
  img.alt = item.name

  const title = document.createElement("h2")
  title.className = "item-title"
  title.textContent = item.name

  const category = document.createElement("p")
  category.className = "item-category"
  category.textContent = item.category

  const desc = document.createElement("p")
  desc.className = "item-description"
  desc.textContent = item.description

  const price = document.createElement("p")
  price.className = "item-price"
  price.textContent = formatPrice(item)

  const stock = document.createElement("p")
  stock.className = "item-stock"
  stock.textContent = formatStock(item)

  const button = document.createElement("button")
  button.className = "item-buy-btn"

  const canBuy = isPurchasable(item)
  button.disabled = !canBuy

  if (typeof item.stock === "number" && item.stock <= 0) {
    button.textContent = "Scellé"
  } else if (typeof item.price === "number" && item.price < 0) {
    button.textContent = "Inaccessible"
  } else if (canBuy) {
    button.textContent = "Réquisitionner"
  } else {
    button.textContent = "Erreur"
  }

  button.addEventListener("click", () => handleRequisition(item, stock, button))

  card.appendChild(img)
  card.appendChild(title)
  card.appendChild(category)
  card.appendChild(desc)
  card.appendChild(price)
  card.appendChild(stock)
  card.appendChild(button)

  return card
}

// Gestion de la réquisition (achat)
function handleRequisition(item, stockElement, buttonElement) {
  if (!isPurchasable(item)) return

  if (playerGold < item.price) {
    alert("Décret refusé: crédits insuffisants.")
    return
  }

  playerGold -= item.price
  item.stock -= 1

  updateGoldDisplay()
  stockElement.textContent = formatStock(item)

  if (item.stock <= 0) {
    buttonElement.disabled = true
    buttonElement.textContent = "Scellé"
  }
}

// Rendu des reliques
function renderItems(filterCategory = "all") {
  feedContainer.innerHTML = ""

  const filtered = itemsRPG.filter((item) => {
    return filterCategory === "all" || item.category === filterCategory
  })

  filtered.forEach((item) => {
    feedContainer.appendChild(createItemCard(item))
  })

  if (filtered.length === 0) {
    const emptyMsg = document.createElement("p")
    emptyMsg.className = "empty-message"
    emptyMsg.textContent = "Aucune relique enregistrée pour ce décret."
    feedContainer.appendChild(emptyMsg)
  }
}

// Écouteur sur le select de catégorie
categoryFilter.addEventListener("change", (e) => {
  renderItems(e.target.value)
})


// Initialisation
updateGoldDisplay()
renderItems()

