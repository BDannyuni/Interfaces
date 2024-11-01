let products = [];

// Cargar productos desde productos.json
async function cargarProductos() {
    try {
        const response = await fetch('assets/scripts/productos.json');
        products = await response.json();
        mostrarResultados();
    } catch (error) {
        console.error('Error al cargar los productos:', error);
        document.getElementById('resultados-container').innerHTML = '<p>Error al cargar los productos.</p>';
    }
}

// Mostrar los resultados de la búsqueda
function mostrarResultados() {
    const query = localStorage.getItem('searchQuery')?.toLowerCase();
    const resultadosContainer = document.getElementById('resultados-container');
    resultadosContainer.innerHTML = ''; // Limpiar contenido previo

    if (!query) {
        resultadosContainer.innerHTML = '<p>No se ha ingresado una búsqueda.</p>';
        return;
    }

    // Filtrar los productos que coincidan con la búsqueda
    const filteredProducts = products.filter(product =>
        product.name.toLowerCase().includes(query) || 
        product.description.toLowerCase().includes(query) || 
        product.brand.toLowerCase().includes(query)
    );

    // Mostrar resultados
    if (filteredProducts.length === 0) {
        resultadosContainer.innerHTML = '<p>No se encontraron productos.</p>';
    } else {
        filteredProducts.forEach(product => {
            const productElement = document.createElement('div');
            productElement.className = 'producto-card';
            productElement.setAttribute('onclick', `viewProductDetails(${product.id})`);
            productElement.innerHTML = `
                <img src="${product.images[0]}" alt="${product.name}" class="producto-imagen">
                <div class="producto-info">
                    <div class="producto-nombre">${product.name}</div>
                    <div class="producto-rating">${product.rating}</div>
                    <div class="producto-precio">Precio: ${product.price}</div>
                    <div class="producto-descripcion">${product.description.substring(0, 100)}...</div>
                </div>
            `;
            resultadosContainer.appendChild(productElement);
        });
    }
}

// Función para redirigir a la página de detalles del producto
function viewProductDetails(id) {
    localStorage.setItem('productId', id);
    window.location.href = 'detalle.html';
}

// Cargar productos y mostrar resultados al cargar la página
document.addEventListener('DOMContentLoaded', cargarProductos);