document.addEventListener('DOMContentLoaded', () => {
    fetch('/products.json')
        .then(response => response.json())
        .then(data => {
            categorizeProducts(data);
            displayCategories();
            displayProducts();
        })
        .catch(error => console.error('Error fetching the products:', error));
});

const productsPerPage = 8;
let currentPage = 1;
let currentCategory = null;
let categories = {};
let totalPages = 0;

function categorizeProducts(products) {
    categories = products.reduce((acc, product) => {
        const category = product.product_category;
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
            if (currentCategory == category) {
                categoryButton.classList.toggle("active")
            }
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

    // Enable dragging for horizontal scroll
    container.addEventListener('mousedown', (e) => {
        container.classList.add('dragging');
        container.dataset.startX = e.pageX - container.offsetLeft;
        container.dataset.scrollLeft = container.scrollLeft;
    });

    container.addEventListener('mouseleave', () => {
        container.classList.remove('dragging');
    });

    container.addEventListener('mouseup', () => {
        container.classList.remove('dragging');
    });

    container.addEventListener('mousemove', (e) => {
        if (!container.classList.contains('dragging')) return;
        e.preventDefault();
        const x = e.pageX - container.offsetLeft;
        const scroll = (x - container.dataset.startX) * 2; // Adjust scroll speed
        container.scrollLeft = container.dataset.scrollLeft - scroll;
    });
}

function displayProducts() {
    const container = document.getElementById('product-container');
    container.innerHTML = '';
    let productsToShow = [];

    if (currentCategory && categories[currentCategory]) {
        productsToShow = categories[currentCategory];
    } else {
        Object.values(categories).forEach(products => {
            productsToShow = productsToShow.concat(products);
        });
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
            <button onclick="showInquiryPopup('${product.product_name}')">Inquire Now</button>
        `;
        container.appendChild(productCard);
    });

    totalPages = Math.ceil(productsToShow.length / productsPerPage);
    displayPagination();
}

function displayPagination() {
    const paginationContainer = document.getElementById('pagination');
    paginationContainer.innerHTML = '';

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

function showInquiryPopup(productName) {
    const popup = document.getElementById('inquiry-popup');
    const productNameInput = document.getElementById('inquiry-product-name');
    productNameInput.value = productName;
    popup.style.display = 'flex';
}

document.getElementById('close-popup').addEventListener('click', () => {
    document.getElementById('inquiry-popup').style.display = 'none';
});

document.getElementById('inquiry-form').addEventListener('submit', (event) => {
    event.preventDefault();
    const formData = new FormData(event.target);
    console.log('Inquiry submitted:', Object.fromEntries(formData.entries()));
    alert('Inquiry submitted successfully!');
    document.getElementById('inquiry-popup').style.display = 'none';
});