async function fetchProducts() {
    try {
      const response = await fetch('/Products.json');
      const products = await response.json();
      displayProductsByCategory(products);
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  }

  function displayProductsByCategory(products) {
    const productContainer = document.getElementById('product-container-home');
    const categories = {};

    // Group products by category and take the first product of each category
    products.forEach(product => {
      if (!categories[product.product_category]) {
        categories[product.product_category] = product;
      }
    });

    // Display each product with a "Show More" button
    for (const category in categories) {
      const product = categories[category];
      const productElement = document.createElement('div');
      productElement.classList.add('product-home col-md-4 col-sm-6 col-xs-12');
      
      productElement.innerHTML = `
        <img src="${product.product_image}" alt="${product.product_name}">
        <h2>${product.product_name}</h2>
        <button onclick="redirectToProductPage('${product.product_category}')">Show More</button>
      `;

      productContainer.appendChild(productElement);
    }
  }

  function redirectToProductPage(category) {
    // Redirect to the product page with the category as a query parameter
    window.location.href = `../templates/Products.html?category=${category}`;
  }

  // Fetch and display products on page load
  fetchProducts();