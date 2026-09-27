/**
 * DEDICA STORE - CONTROL DE BOTTOM SHEET & WHATSAPP
 * Número: 51988799404
 */

const WA_NUMBER = "51988799404";
let currentProduct = "Camino hacia ti";

document.addEventListener('DOMContentLoaded', () => {
  const overlay = document.getElementById('buySheet');
  if (overlay) {
    overlay.addEventListener('click', (e) => {
      if (e.target === overlay) {
        closeSheet();
      }
    });
  }
});

function openSheet(productName) {
  currentProduct = productName || "Camino hacia ti";
  const titleEl = document.getElementById('sheetProductName');
  if (titleEl) titleEl.textContent = currentProduct;

  const overlay = document.getElementById('buySheet');
  if (overlay) {
    overlay.classList.add('active');
    document.body.style.overflow = 'hidden';
  }
}

function closeSheet() {
  const overlay = document.getElementById('buySheet');
  if (overlay) {
    overlay.classList.remove('active');
    document.body.style.overflow = '';
  }
}

function chooseOption(modality) {
  let message = "";
  if (modality === 'link') {
    message = `Hola, quiero comprar "${currentProduct}" como link personalizado.`;
  } else {
    message = `Hola, quiero comprar "${currentProduct}" como proyecto completo / archivos.`;
  }

  const url = `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(message)}`;
  window.open(url, '_blank');
  closeSheet();
}

window.openSheet = openSheet;
window.closeSheet = closeSheet;
window.chooseOption = chooseOption;
