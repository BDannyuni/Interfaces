document.addEventListener('DOMContentLoaded', function () {
    const selectedFilters = document.getElementById('selected-filters');
    const clearFiltersButton = document.getElementById('clear-filters');
    const viewAllProductsLink = document.getElementById('view-all-products');
    const urlParams = new URLSearchParams(window.location.search);
    const brandFilter = urlParams.get('brand');
    const itemsPerPage = 9; // Número de productos por página
    let currentPage = 0;

     if (brandFilter) {
        const brandName = document.querySelector(`.filter-option[data-filter="${brandFilter}"]`).textContent;
        const filterTag = document.createElement('div');
        filterTag.className = 'filter-tag';
        filterTag.setAttribute('data-filter', brandFilter);
        filterTag.innerHTML = `${brandName} <span class="remove-filter">x</span>`;
        selectedFilters.appendChild(filterTag);
        clearFiltersButton.style.display = 'block';
        viewAllProductsLink.style.display = 'block';

        // Filtrar productos según el filtro aplicado
        filterProducts();
    }

    // Mostrar u ocultar subcategorías al hacer clic en la categoría
    document.querySelectorAll('.filter-category').forEach(function (category) {
        category.addEventListener('click', function (e) {
            e.preventDefault();
            const subcategory = this.nextElementSibling;
            subcategory.style.display = (subcategory.style.display === 'none' || !subcategory.style.display) ? 'block' : 'none';
        });

         // Manejo del enlace "Ver todos los productos"
    viewAllProductsLink.addEventListener('click', function () {
        selectedFilters.innerHTML = '';
        filterProducts();
        clearFiltersButton.style.display = 'none';
        viewAllProductsLink.style.display = 'none';
        history.replaceState({}, document.title, "productos.html"); // Quitar el parámetro de la URL
        window.location.href = `productos.html`;
    });

});


    // Manejar la selección de filtros
    document.querySelectorAll('.filter-option').forEach(function (option) {
        option.addEventListener('click', function (e) {
            e.preventDefault();
            const filterText = this.textContent;
            const filterValue = this.getAttribute('data-filter');

            // Verificar si el filtro ya está aplicado
            if (!document.querySelector(`.filter-tag[data-filter="${filterValue}"]`)) {
                const filterTag = document.createElement('div');
                filterTag.className = 'filter-tag';
                filterTag.setAttribute('data-filter', filterValue);
                filterTag.innerHTML = `${filterText} <span class="remove-filter">x</span>`;
                
                selectedFilters.appendChild(filterTag);
                clearFiltersButton.style.display = 'block';
                
                // Filtrar productos y actualizar la paginación
                filterProducts();
            }
        });
    });

    // Quitar un filtro individual
    selectedFilters.addEventListener('click', function (e) {
        if (e.target.classList.contains('remove-filter')) {
            const filterTag = e.target.parentNode;
            filterTag.remove();
            filterProducts();

            if (!selectedFilters.hasChildNodes()) {
                clearFiltersButton.style.display = 'none';
                history.replaceState({}, document.title, "productos.html"); // Quitar el parámetro de la URL
            }
        }
    });

    // Limpiar todos los filtros
    clearFiltersButton.addEventListener('click', function () {
        selectedFilters.innerHTML = '';
        filterProducts();
        clearFiltersButton.style.display = 'none';
        history.replaceState({}, document.title, "productos.html"); // Quitar el parámetro de la URL
    });

    // Filtrar productos y manejar la paginación
    // Función para filtrar productos
    function filterProducts() {
        const filters = Array.from(selectedFilters.querySelectorAll('.filter-tag')).map(tag => tag.getAttribute('data-filter'));
        const products = document.querySelectorAll('.product-card');

        let visibleProducts = [];

        products.forEach(product => {
            const productCategories = product.getAttribute('data-category').split(', ');
            const productBrands = product.getAttribute('data-brand').split(', ');

            // Si no hay filtros, mostrar todos los productos
            if (filters.length === 0) {
                product.style.display = 'block';
                visibleProducts.push(product);
            } else {
                const match = filters.some(filter => productCategories.includes(filter) || productBrands.includes(filter));
                if (match) {
                    product.style.display = 'block';
                    visibleProducts.push(product);
                } else {
                    product.style.display = 'none';
                }
            }
        });

        // Reiniciar la página actual y actualizar la paginación
        currentPage = 0;
        updatePagination(visibleProducts);
    }

    // Actualizar la paginación
    function updatePagination(visibleProducts) {
        const paginationContainer = document.querySelector('.product-pagination');
        paginationContainer.innerHTML = '';

        if (visibleProducts.length > itemsPerPage) {
            const totalPages = Math.ceil(visibleProducts.length / itemsPerPage);

            for (let i = 0; i < totalPages; i++) {
                const pageButton = document.createElement('button');
                pageButton.textContent = i + 1;
                pageButton.addEventListener('click', function () {
                    currentPage = i;
                    showPage(currentPage, visibleProducts);
                    // Desplazar al inicio de la sección al hacer clic en el botón de paginación
                    document.getElementById('product-section').scrollIntoView({ behavior: 'smooth' });
                });
                paginationContainer.appendChild(pageButton);
            }
        }

        showPage(currentPage, visibleProducts);
    }

    // Mostrar la página actual
    function showPage(page, visibleProducts) {
    const start = page * itemsPerPage;
    const end = start + itemsPerPage;

    visibleProducts.forEach((product, index) => {
        if (index >= start && index < end) {
            product.style.display = 'block';
        } else {
            product.style.display = 'none';
        }
    });

    // Actualizar la clase activa de los botones de paginación
    const paginationButtons = document.querySelectorAll('.product-pagination button');
    paginationButtons.forEach((button, index) => {
        button.classList.toggle('active', index === page);
    });
}

    // Filtrar productos al cargar la página
    filterProducts();
});


function redirectToBrand(brand) {
    window.location.href = `productos.html?brand=${brand}`;
}

document.addEventListener("DOMContentLoaded", function() {
    const urlParams = new URLSearchParams(window.location.search);
    const selectedBrand = urlParams.get('brand');

    if (selectedBrand) {
        filterProductsByBrand(selectedBrand);
    }
});

function filterProductsByBrand(brand) {
    const allProducts = document.querySelectorAll('.product-card');
    const selectedFilters = document.getElementById('selected-filters');
    const clearFiltersButton = document.getElementById('clear-filters');

    // Primero, limpiar todos los productos
    allProducts.forEach(product => {
        product.style.display = 'none';
    });

    // Mostrar solo los productos que coincidan con la marca seleccionada
    let visibleProducts = [];
    allProducts.forEach(product => {
        const productBrands = product.getAttribute('data-brand').split(', ');

        if (productBrands.includes(brand)) {
            product.style.display = 'block';
            visibleProducts.push(product);
        }
    });

    // Agregar el filtro visual en la sección de filtros seleccionados
    const filterOptionElement = document.querySelector(`.filter-option[data-filter="${brand}"]`);
    if (filterOptionElement) {
        const filterText = filterOptionElement.textContent;

        if (!document.querySelector(`.filter-tag[data-filter="${brand}"]`)) {
            const filterTag = document.createElement('div');
            filterTag.className = 'filter-tag';
            filterTag.setAttribute('data-filter', brand);
            filterTag.innerHTML = `${filterText} <span class="remove-filter">x</span>`;
            
            selectedFilters.appendChild(filterTag);
            clearFiltersButton.style.display = 'block';
        }
    }

    // Actualizar la paginación
    updatePagination(visibleProducts);
}

document.querySelectorAll('.product-description').forEach(function(description) {
    if (description.scrollHeight > description.clientHeight) {
        const seeMoreButton = description.nextElementSibling;
        seeMoreButton.style.display = 'inline-block';

        seeMoreButton.addEventListener('click', function () {
            description.classList.toggle('expanded');
            seeMoreButton.textContent = description.classList.contains('expanded') ? 'Ver menos' : 'Ver más';
        });
    }
});