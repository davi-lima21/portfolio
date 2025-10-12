// Redireciona botão de compra (Hotmart, Mercado Pago etc)
document.getElementById("btnComprar").addEventListener("click", function(e) {
  e.preventDefault();
  window.location.href = "https://pay.hotmart.com/SEU_LINK_AQUI"; // coloque o link real
});
