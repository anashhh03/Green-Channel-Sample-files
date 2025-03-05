document.addEventListener('DOMContentLoaded', () => {
    fetch('/products.json')
        .then(response => response.json())
        .then(data => {
            products = data;
            categorizeProducts();
            displayCategories();
            displayProducts();
        })
        .catch(error => console.error('Error fetching the products:', error));
});

const productsPerPage = 12;
let currentPage = 1;
let currentCategory = null;
let categories = {};
let products = [];
let isDragging = false;
let startX;
let scrollLeft;

function categorizeProducts() {
    categories = products.reduce((acc, product) => {
        const category = product.product_category || 'Uncategorized';
        if (!acc[category]) {
            acc[category] = [];
        }
        acc[category].push(product);
        return acc;
    }, {});
}

function displayCategories() {
    const container = document.getElementById('category-container');
    container.innerHTML = '';

    Object.keys(categories).forEach(category => {
        const categoryButton = document.createElement('div');
        categoryButton.className = 'category-button';
        categoryButton.textContent = category;
        categoryButton.addEventListener('click', () => {
            currentCategory = category;
            currentPage = 1;
            displayProducts();
        });
        container.appendChild(categoryButton);
    });

    // Add "All" button
    const allButton = document.createElement('div');
    allButton.className = 'category-button';
    allButton.textContent = 'All';
    allButton.addEventListener('click', () => {
        currentCategory = null;
        currentPage = 1;
        displayProducts();
    });
    container.appendChild(allButton);

    // Enable dragging
    container.addEventListener('mousedown', (e) => {
        isDragging = true;
        startX = e.pageX - container.offsetLeft;
        scrollLeft = container.scrollLeft;
    });

    container.addEventListener('mouseleave', () => {
        isDragging = false;
    });

    container.addEventListener('mouseup', () => {
        isDragging = false;
    });

    container.addEventListener('mousemove', (e) => {
        if (!isDragging) return;
        e.preventDefault();
        const x = e.pageX - container.offsetLeft;
        const scroll = (x - startX) * 2;
        container.scrollLeft = scrollLeft - scroll;
    });
}

function displayProducts() {
    const container = document.getElementById('product-container');
    container.innerHTML = '';
    let productsToShow = [];

    if (currentCategory) {
        productsToShow = categories[currentCategory] || [];
    } else {
        productsToShow = products;
    }

    const startIndex = (currentPage - 1) * productsPerPage;
    const endIndex = startIndex + productsPerPage;
    const paginatedProducts = productsToShow.slice(startIndex, endIndex);

    paginatedProducts.forEach(product => {
        const productCard = document.createElement('div');
        productCard.className = 'product-card col-md-4 col-sm-6 col-12';
        productCard.innerHTML = `
            <img src="${product.product_image}" alt="${product.product_name}">
            <h3>${product.product_name}</h3>
        `;
        container.appendChild(productCard);
    });

    displayPagination(productsToShow.length);
}

function displayPagination(totalProducts) {
    const paginationContainer = document.getElementById('pagination');
    paginationContainer.innerHTML = '';
    const totalPages = Math.ceil(totalProducts / productsPerPage);

    if (totalPages <= 5) {
        for (let i = 1; i <= totalPages; i++) {
            createPageButton(i);
        }
    } else {
        let startPage = Math.max(1, currentPage - 2);
        let endPage = Math.min(totalPages, startPage + 4);

        if (endPage - startPage < 4) {
            startPage = Math.max(1, endPage - 4);
        }

        for (let i = startPage; i <= endPage; i++) {
            createPageButton(i);
        }

        if (endPage < totalPages) {
            const nextPageButton = document.createElement('button');
            nextPageButton.textContent = 'Next';
            nextPageButton.addEventListener('click', () => {
                currentPage = endPage + 1;
                displayProducts();
            });
            paginationContainer.appendChild(nextPageButton);
        }
    }

    const prevButton = document.createElement('button');
    prevButton.textContent = 'Previous';
    prevButton.disabled = currentPage === 1;
    prevButton.addEventListener('click', () => {
        currentPage--;
        displayProducts();
    });
    paginationContainer.appendChild(prevButton);
}

function createPageButton(pageNumber) {
    const paginationContainer = document.getElementById('pagination');
    const pageButton = document.createElement('button');
    pageButton.textContent = pageNumber;
    pageButton.disabled = pageNumber === currentPage;
    pageButton.addEventListener('click', () => {
        currentPage = pageNumber;
        displayProducts();
    });
    paginationContainer.appendChild(pageButton);
}