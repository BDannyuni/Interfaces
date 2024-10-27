// script.js
function showProductDetails(name, price) {
    // Crea una página de detalles del producto en tiempo real
    const productPage = document.createElement('div');
    productPage.classList.add('product-page');
    
    productPage.innerHTML = `
        <h2>${name}</h2>
        <p>Precio: $${price}</p>
        <p>Descripción detallada del producto...</p>
        <button onclick="closeProductDetails()">Cerrar</button>
    `;

    document.body.appendChild(productPage);
}

function closeProductDetails() {
    const productPage = document.querySelector('.product-page');
    if (productPage) {
        productPage.remove();
    }
}



function applyFilters() {
    // Obtener los filtros seleccionados
    const selectedFilters = Array.from(document.querySelectorAll(".filter:checked")).map(input => input.dataset.filter);

    // Obtener todos los productos
    const products = document.querySelectorAll(".product-card");

    products.forEach(product => {
        // Obtener la categoría del producto
        const category = product.dataset.category;

        // Mostrar u ocultar el producto según los filtros seleccionados
        if (selectedFilters.length === 0 || selectedFilters.includes(category)) {
            product.style.display = "block";
        } else {
            product.style.display = "none";
        }
    });
}


function viewProductDetails(id) {
    localStorage.setItem('productId', id);
    window.location.href = 'detalle.html';
}


let products = [];

// Cargar productos desde productos.json
document.addEventListener('DOMContentLoaded', () => {
    fetch('assets/scripts/productos.json')
        .then(response => response.json())
        .then(data => {
            products = data;
        })
        .catch(error => console.error('Error al cargar los productos:', error));
});

function searchProducts() {
    const input = document.getElementById('search-input');
    const filter = input.value.toLowerCase();
    const autocompleteList = document.getElementById('autocomplete-list');

    // Limpiar sugerencias previas
    autocompleteList.innerHTML = '';

    if (!filter) return;

    // Filtrar productos según el texto ingresado
    const filteredProducts = products.filter(product => product.name.toLowerCase().includes(filter));

    // Mostrar sugerencias de autocompletado
    filteredProducts.forEach(product => {
        const suggestion = document.createElement('div');
        suggestion.textContent = product.name;
        suggestion.onclick = () => selectProduct(product);
        autocompleteList.appendChild(suggestion);
    });
}

function selectProduct(product) {
    // Guarda los datos del producto en localStorage para la página de detalles
    localStorage.setItem('productId', product.id);

    // Redirigir a la página de detalles
    window.location.href = 'detalle.html';
}
