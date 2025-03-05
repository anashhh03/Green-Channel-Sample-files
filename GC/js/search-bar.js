fetch('/products.json')
    .then(response => response.json())
    .then(products => {
        const searchInput = document.getElementById('search-input');
        const cardsContainer = document.querySelector('.search__container');
        let currentIndex = -1;

        searchInput.addEventListener('input', (e) => {
            const query = e.target.value.trim().toLowerCase();
            let results = [];

            if (query !== '') {
                results = searchProducts(products, query);
            }

            cardsContainer.innerHTML = '';
            currentIndex = -1;

            if (results.length > 0) {
                results.forEach((product, index) => {
                    const card = document.createElement('div');
                    card.className = 'search-card';

                    const image = document.createElement('img');
                    image.src = product.product_image; // Replace with the actual property name for the image URL
                    image.alt = product.product_name;
                    image.className = 'product-image';

                    const text = document.createElement('span');
                    text.textContent = product.product_name;

                    card.appendChild(image);
                    card.appendChild(text);

                    card.addEventListener('click', () => {
                        handleCardClick(product);
                    });
                    cardsContainer.appendChild(card);
                });
                cardsContainer.classList.add('active');
            } else {
                if (query !== '') {
                    const noResults = document.createElement('div');
                    noResults.textContent = 'No matching products found';
                    cardsContainer.appendChild(noResults);
                }
                cardsContainer.classList.remove('active');
            }
        });

        searchInput.addEventListener('keydown', (e) => {
            const items = cardsContainer.getElementsByClassName('search-card');

            if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
                e.preventDefault();
                currentIndex = updateIndex(items, currentIndex, e.key);
                updateActiveItem(items, currentIndex);
            } else if (e.key === 'Enter' && currentIndex !== -1) {
                const selectedProduct = getSelectedProduct(items, currentIndex);
                if (selectedProduct) {
                    redirectToCategory(selectedProduct);
                }
            }
        });

        function updateIndex(items, currentIndex, key) {
            const maxIndex = items.length - 1;
            if (key === 'ArrowDown' && currentIndex < maxIndex) {
                return currentIndex + 1;
            } else if (key === 'ArrowUp' && currentIndex > 0) {
                return currentIndex - 1;
            }
            return currentIndex;
        }

        function updateActiveItem(items, currentIndex) {
            Array.from(items).forEach((item, idx) => {
                if (idx === currentIndex) {
                    item.classList.add('active');
                    item.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
                } else {
                    item.classList.remove('active');
                }
            });
        }

        function handleCardClick(product) {
            redirectToCategory(product);
        }

        function getSelectedProduct(items, currentIndex) {
            return products.find(product =>
                `${product.product_name}` === items[currentIndex].textContent.trim()
            );
        }

        function redirectToCategory(product) {
            const category = product.product_category; // Replace with actual category property
            console.log(`Redirecting to category: ${category}`);
            window.location.href = `./Products.html?category=${encodeURIComponent(category)}`;
        }

        function searchProducts(products, query) {
            return products.filter(product =>
                product.product_name.toLowerCase().includes(query) ||
                product.product_category.toLowerCase().includes(query)
            );
        }
    })
    .catch(error => console.error('Error fetching data:', error));
