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
    const clearButton = document.querySelector('.clear-button');

    // Mostrar o esconder el botón de limpiar según el texto en el input
    clearButton.style.display = filter ? 'inline' : 'none';

    // Limpiar sugerencias previas
    autocompleteList.innerHTML = '';

    if (!filter) return;

    // Filtrar productos según el nombre, la marca o el material
    const filteredProducts = products.filter(product =>
        product.name.toLowerCase().includes(filter) ||
        product.brand.toLowerCase().includes(filter) ||
        product.material.toLowerCase().includes(filter)
    );

    // Mostrar sugerencias de autocompletado
    filteredProducts.forEach(product => {
        const suggestion = document.createElement('div');
        suggestion.textContent = product.name;
        suggestion.onclick = () => selectProduct(product);
        autocompleteList.appendChild(suggestion);
    });
}

function clearInput() {
    const input = document.getElementById('search-input');
    input.value = '';
    searchProducts(); // Actualizar resultados
}

function selectProduct(product) {
    // Si deseas redirigir a una página de detalles
    viewProductDetails(product.id);

    // O para mostrar detalles en la misma página
    showProductDetails(product.name, product.price);
}

// Maneja la búsqueda al enviar el formulario
function handleSearch(event) {
    // Prevenir el envío del formulario por defecto
    event.preventDefault(); 
    const input = document.getElementById('search-input');
    const query = input.value.trim().toLowerCase();

    // Verificar si hay texto en el campo de búsqueda
    if (query) {
        // Filtrar productos según el nombre, la marca o el material
        const filteredProducts = products.filter(product =>
            product.name.toLowerCase().includes(query) ||
            product.brand.toLowerCase().includes(query) ||
            product.material.toLowerCase().includes(query)
        );

        // Si hay solo un producto que coincide, redirigir a la página de detalles
        if (filteredProducts.length === 1) {
            viewProductDetails(filteredProducts[0].id);
        } else {
            // Guardar la búsqueda en localStorage para recuperarla en la página de resultados
            localStorage.setItem('searchQuery', query);
            window.location.href = 'resultados.html';
        }
    }
}

// Función para manejar el autocompletado
function searchProducts() {
    const input = document.getElementById('search-input');
    const filter = input.value.toLowerCase();
    const autocompleteList = document.getElementById('autocomplete-list');
    const clearButton = document.querySelector('.clear-button');

    // Mostrar u ocultar el botón de limpiar según el texto en el input
    clearButton.style.display = filter ? 'inline' : 'none';

    // Limpiar sugerencias previas
    autocompleteList.innerHTML = '';

    if (!filter) return;

    // Filtrar productos según el nombre, la marca o el material
    const filteredProducts = products.filter(product =>
        product.name.toLowerCase().includes(filter) ||
        product.brand.toLowerCase().includes(filter) ||
        product.material.toLowerCase().includes(filter)
    );

    // Mostrar sugerencias de autocompletado
    filteredProducts.forEach(product => {
        const suggestion = document.createElement('div');
        suggestion.textContent = product.name;
        suggestion.onclick = () => selectProduct(product);
        autocompleteList.appendChild(suggestion);
    });
}

// Función para limpiar el campo de entrada
function clearInput() {
    const input = document.getElementById('search-input');
    input.value = '';
    searchProducts(); // Actualizar resultados
}

// Asignar productos a la variable products desde productos.json
document.addEventListener('DOMContentLoaded', () => {
    fetch('assets/scripts/productos.json')
        .then(response => response.json())
        .then(data => {
            products = data;
        })
        .catch(error => console.error('Error al cargar los productos:', error));
});

// Añadir un evento para manejar el "Enter" en el campo de búsqueda
document.getElementById('search-form').addEventListener('submit', handleSearch);

// Añadir evento para escuchar cambios en el campo de búsqueda
document.getElementById('search-input').addEventListener('input', searchProducts);
