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
  {
    id: 6,
    name: "Sérum de régénération",
    price: 60,
    description: "Composé expérimental accélérant la reconstruction des tissus et la récupération.",
    image: "assets/img/regeneration.jpeg",
    category: "Potion",
    stock: 6
  },
  {
    id: 7,
    name: "Crâne servo ancien",
    price: 150,
    description: "Relique mécanique contenant encore des fragments de mémoire d un ancien Tech-Priest.",
    image: "assets/img/servoskull.jpeg",
    category: "Artefact",
    stock: 2
  },
  {
    id: 8,
    name: "Fragment STC endommagé",
    price: 500,
    description: "Artefact rare. Les données qu il contient pourraient changer le destin d un monde.",
    image: "assets/img/stc.jpeg",
    category: "Artefact",
    stock: 1
  }
]

// Ajout d'une relique
function addItem(id, name, price, description, image, category, stock) {
  itemsRPG.push({ id, name, price, description, image, category, stock })
}

// Crédits du requérant (mock)
let playerGold = 800

// Sélecteurs de base
const feedContainer = document.getElementById("feed-container")
const goldAmountSpan = document.getElementById("gold-amount")
const categoryFilter = document.getElementById("category-filter")

// Dropdown
const mechDropdown = document.getElementById("mechDropdown")
const mechDropBtn = document.getElementById("mechDropBtn")
const mechDropContent = document.getElementById("mechDropContent")

let closeDropdownTimer = null

function setDropdownOpen(isOpen) {
  if (!mechDropdown || !mechDropBtn) return
  mechDropdown.classList.toggle("is-open", isOpen)
  mechDropBtn.setAttribute("aria-expanded", String(isOpen))
}

function clearDropdownCloseTimer() {
  if (closeDropdownTimer) {
    clearTimeout(closeDropdownTimer)
    closeDropdownTimer = null
  }
}

function scheduleDropdownClose() {
  clearDropdownCloseTimer()
  closeDropdownTimer = setTimeout(() => {
    setDropdownOpen(false)
  }, 180)
}

// Mise à jour affichage des crédits
function updateGoldDisplay() {
  if (!goldAmountSpan) return
  goldAmountSpan.textContent = playerGold
}

// Helpers Imperium
function formatPrice(item) {
  if (typeof item.price === "number" && item.price === -1) return "Indisponible"
  if (typeof item.price === "number" && item.price === 0) return "Réquisition libre"
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
  if (!feedContainer) return

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
if (categoryFilter) {
  categoryFilter.addEventListener("change", (e) => {
    renderItems(e.target.value)
  })
}

// Initialisation
updateGoldDisplay()
renderItems()

// ===============================
// MENU COGITATOR: stable
// Desktop: hover
// Mobile: clic
// ===============================

function isDesktopHover() {
  return window.matchMedia("(hover: hover) and (pointer: fine)").matches
}

if (mechDropdown && mechDropBtn && mechDropContent) {
  if (isDesktopHover()) {
    // Sur desktop: hover uniquement
    mechDropBtn.addEventListener("click", (e) => {
      e.preventDefault()
    })

    mechDropdown.addEventListener("mouseenter", () => {
      clearDropdownCloseTimer()
      setDropdownOpen(true)
    })

    mechDropdown.addEventListener("mouseleave", () => {
      scheduleDropdownClose()
    })

    // Clavier
    mechDropdown.addEventListener("focusin", () => {
      clearDropdownCloseTimer()
      setDropdownOpen(true)
    })

    mechDropdown.addEventListener("focusout", () => {
      scheduleDropdownClose()
    })
  } else {
    // Sur mobile: clic toggle
    mechDropBtn.addEventListener("click", (e) => {
      e.preventDefault()
      e.stopPropagation()
      const isOpen = mechDropdown.classList.contains("is-open")
      setDropdownOpen(!isOpen)
    })

    document.addEventListener("click", (event) => {
      if (!mechDropdown.contains(event.target)) {
        setDropdownOpen(false)
      }
    })
  }

  // Navigation + filtres (commun)
  mechDropContent.querySelectorAll("[data-nav]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const target = btn.getAttribute("data-nav")
      const el = document.querySelector(target)
      if (el) el.scrollIntoView({ behavior: "smooth", block: "start" })
      setDropdownOpen(false)
    })
  })

  mechDropContent.querySelectorAll("[data-filter]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const value = btn.getAttribute("data-filter") || "all"
      if (categoryFilter) {
        categoryFilter.value = value
      }
      renderItems(value)
      setDropdownOpen(false)

      const feed = document.getElementById("feed-container")
      if (feed) feed.scrollIntoView({ behavior: "smooth", block: "start" })
    })
  })

  mechDropContent.querySelectorAll("[data-link]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const href = btn.getAttribute("data-link")
      if (href) {
        window.location.href = href
      }
      setDropdownOpen(false)
    })
  })
}

// ===============================
// AJOUT D'ITEMS VIA FORMULAIRE
// ===============================

const addItemForm = document.getElementById("add-item-form")
const addItemMsg = document.getElementById("add-item-msg")
const galleryContainer = document.getElementById("gallery-container")
const viewMosaicBtn = document.getElementById("view-mosaic")
const viewColumnBtn = document.getElementById("view-column")
const galleryAddForm = document.getElementById("gallery-add-form")
const galleryImageFileInput = document.getElementById("gallery-image-file")
const galleryMsg = document.getElementById("gallery-msg")

const galleryState = {
  viewMode: "mosaic",
  images: itemsRPG.map((item) => resolveImage(item))
}

function nextItemId() {
  const maxId = itemsRPG.reduce((max, it) => Math.max(max, Number(it.id) || 0), 0)
  return maxId + 1
}

function createGalleryImage(imageSrc, index) {
  const frame = document.createElement("div")
  frame.className = "gallery-frame"

  const image = document.createElement("img")
  image.className = "gallery-image"
  image.src = imageSrc
  image.alt = `Relique ${index + 1}`

  frame.appendChild(image)
  return frame
}

function renderGallery() {
  if (!galleryContainer) return

  galleryContainer.innerHTML = ""
  galleryContainer.classList.toggle("mosaic-view", galleryState.viewMode === "mosaic")
  galleryContainer.classList.toggle("column-view", galleryState.viewMode === "column")

  for (const [index, imageSrc] of galleryState.images.entries()) {
    galleryContainer.appendChild(createGalleryImage(imageSrc, index))
  }

  if (galleryState.images.length === 0) {
    const emptyState = document.createElement("p")
    emptyState.className = "gallery-empty"
    emptyState.textContent = "Aucune image dans la galerie."
    galleryContainer.appendChild(emptyState)
  }

  if (viewMosaicBtn && viewColumnBtn) {
    viewMosaicBtn.classList.toggle("is-active", galleryState.viewMode === "mosaic")
    viewColumnBtn.classList.toggle("is-active", galleryState.viewMode === "column")
  }
}

if (viewMosaicBtn && viewColumnBtn) {
  viewMosaicBtn.addEventListener("click", () => {
    galleryState.viewMode = "mosaic"
    renderGallery()
  })

  viewColumnBtn.addEventListener("click", () => {
    galleryState.viewMode = "column"
    renderGallery()
  })
}

if (galleryAddForm && galleryImageFileInput) {
  galleryAddForm.addEventListener("submit", (event) => {
    event.preventDefault()

    const selectedFile = galleryImageFileInput.files && galleryImageFileInput.files[0]

    if (!selectedFile) {
      if (galleryMsg) galleryMsg.textContent = "Ajout refusé: sélectionnez une image locale."
      return
    }

    if (!selectedFile.type || !selectedFile.type.startsWith("image/")) {
      if (galleryMsg) galleryMsg.textContent = "Ajout refusé: fichier non image."
      return
    }

    const localImageUrl = URL.createObjectURL(selectedFile)
    galleryState.images.push(localImageUrl)
    renderGallery()

    if (galleryMsg) galleryMsg.textContent = "Image locale ajoutée dans la galerie."
    galleryAddForm.reset()
  })
}

if (addItemForm) {
  const itemNameField = document.getElementById("item-name")
  const itemDescField = document.getElementById("item-desc")
  const itemCategoryField = document.getElementById("item-category")
  const itemPriceField = document.getElementById("item-price")
  const itemStockField = document.getElementById("item-stock")
  const itemImageField = document.getElementById("item-image")

  // Garde globale: si un champ obligatoire n'existe pas, on n'active pas le submit.
  const hasRequiredFields =
    itemNameField &&
    itemDescField &&
    itemCategoryField &&
    itemPriceField &&
    itemStockField

  if (!hasRequiredFields) {
    if (addItemMsg) {
      addItemMsg.textContent = "Formulaire incomplet: vérifiez les champs requis."
    }
  }

  addItemForm.addEventListener("submit", (e) => {
    e.preventDefault()

    if (!hasRequiredFields) {
      return
    }

    const name = itemNameField.value.trim()
    const description = itemDescField.value.trim()
    const category = itemCategoryField.value
    const price = Number(itemPriceField.value)
    const stock = Number(itemStockField.value)
    const imageUrl = itemImageField ? itemImageField.value.trim() : ""

    const allowedCategories = ["Arme", "Armure", "Potion", "Artefact"]

    if (!name || !description) {
      if (addItemMsg) addItemMsg.textContent = "Décret refusé: champs incomplets."
      return
    }
    if (!allowedCategories.includes(category)) {
      if (addItemMsg) addItemMsg.textContent = "Décret refusé: catégorie invalide."
      return
    }
    if (!Number.isFinite(price) || price < 0) {
      if (addItemMsg) addItemMsg.textContent = "Décret refusé: prix invalide."
      return
    }
    if (!Number.isFinite(stock) || stock < 0) {
      if (addItemMsg) addItemMsg.textContent = "Décret refusé: stock invalide."
      return
    }

    addItem(
      nextItemId(),
      name,
      price,
      description,
      imageUrl || "assets/img/default.jpeg",
      category,
      stock
    )

    galleryState.images.push(imageUrl || "assets/img/default.jpeg")

    const activeFilter = categoryFilter ? categoryFilter.value || "all" : "all"
    renderItems(activeFilter)
    renderGallery()

    if (addItemMsg) addItemMsg.textContent = "Relique enregistrée dans le registre."
    addItemForm.reset()

    const feed = document.getElementById("feed-container")
    if (feed) feed.scrollIntoView({ behavior: "smooth", block: "start" })
  })
}

renderGallery()
