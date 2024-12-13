document.addEventListener('DOMContentLoaded', () => {
    const cart = [];

    // Search bar functionality
    const searchInput = document.getElementById('search');
    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            const query = e.target.value.toLowerCase();
            document.querySelectorAll('.product').forEach(product => {
                const name = product.querySelector('h3').innerText.toLowerCase();
                const description = product.querySelector('p').innerText.toLowerCase();
                product.style.display = name.includes(query) || description.includes(query) ? 'block' : 'none';
            });
        });
    }

    // Add to cart functionality
    document.querySelectorAll('.add-to-cart').forEach(button => {
        button.addEventListener('click', (e) => {
            const product = e.target.closest('.product');
            const productId = product.getAttribute('data-id');
            const productName = product.querySelector('h3').innerText;
            const productDescription = product.querySelector('p').innerText;
            const price = parseFloat(product.getAttribute('data-price') || 0);

            cart.push({ id: productId, name: productName, description: productDescription, price });
            updateCart();
        });
    });

    // Update cart UI
    function updateCart() {
        const cartItems = document.getElementById('cart-items');
        const cartTotal = document.getElementById('cart-total');
        if (!cartItems || !cartTotal) return;

        cartItems.innerHTML = '';
        let total = 0;

        cart.forEach((item, index) => {
            total += item.price;
            const div = document.createElement('div');
            div.innerHTML = `
                <span>${item.name}: Rp ${item.price.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ".")}</span>
                <button class="remove-item" data-index="${index}">Remove</button>
            `;
            cartItems.appendChild(div);
        });

        cartTotal.innerText = `Rp ${total.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ".")}`;

        // Add remove functionality
        document.querySelectorAll('.remove-item').forEach(button => {
            button.addEventListener('click', (e) => {
                const index = parseInt(e.target.getAttribute('data-index'));
                cart.splice(index, 1);
                updateCart();
            });
        });
    }

    // Checkout functionality
    const checkoutButton = document.getElementById('checkout');
    if (checkoutButton) {
        checkoutButton.addEventListener('click', async () => {
            if (cart.length === 0) {
                alert('Your cart is empty. Please add items to your cart before checking out.');
                return;
            }

            // Validate required fields
            const name = document.getElementById('name').value.trim();
            const email = document.getElementById('email').value.trim();
            const location = document.getElementById('location').value.trim();
            const phone = document.getElementById('phone').value.trim();

            // Email validation
            const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!name || !email || !location || !phone) {
                alert('Please fill in all required fields.');
                return;
            } else if (!emailPattern.test(email)) {
                alert('Please provide a valid email address.');
                return;
            }

            const cartDetails = cart.map(item => `${item.name}: Rp ${item.price.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ".")}`).join('\n');
            const confirmation = confirm(`You are about to checkout with the following items:\n${cartDetails}\n\nDo you want to proceed?`);

            if (confirmation) {
                await sendCheckoutNotification(name, email, location, phone, cartDetails);
                cart.length = 0;
                updateCart();
                alert('Thank you for your purchase! Your order has been placed.');
            }
        });
    }

    async function sendCheckoutNotification(name, email, location, phone, cartDetails) {
        try {
            const response = await fetch('https://discord.com/api/webhooks/1316763594679128156/5uxX2K0-Tih-_2AdIwzgH1dusbMZNzc4LofYJrdAsjtXuHC5L6iZQL-hToO_0tyZxFQR', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    content: `New order from ${name}\nEmail: ${email}\nLocation: ${location}\nPhone: ${phone}\nItems:\n${cartDetails.replace(/\$/g, 'Rp')}`
                })
            });

            if (!response.ok) {
                throw new Error('Failed to send notification.');
            }
        } catch (error) {
            alert('Error sending notification to Discord: ' + error.message);
        }
    }

    // Goods submission functionality
    const goodsForm = document.getElementById('send-goods-form');
    if (goodsForm) {
        goodsForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const name = document.getElementById('send-name').value;
            const email = document.getElementById('send-email').value;
            const location = document.getElementById('send-location').value;

            try {
                const response = await fetch('https://discord.com/api/webhooks/1316929304021569546/H1tk91WRRVwsx9UCwRdLYJEFV2_r9Fozq79rdKNt38-4-35PgmKVfH9IGMRseAFtZEx6', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        content: `New goods submission from ${name}\nEmail: ${email}\nLocation: ${location}`
                    })
                });

                if (response.ok) {
                    alert('Notification sent!');
                } else {
                    throw new Error('Failed to send notification.');
                }
            } catch (error) {
                alert('Error sending notification: ' + error.message);
            }
        });
    }

    const loadingSpinner = document.getElementById('loading-spinner');
    const backToTopButton = document.getElementById('back-to-top');

    // Show spinner on page load
    loadingSpinner.style.display = 'block';

    // Hide spinner after a timeout (simulate loading)
    setTimeout(() => {
        loadingSpinner.style.display = 'none';
    }, 2000); // Adjust time as needed

    // Show or hide the back to top button based on scroll position
    window.onscroll = function() {
        if (document.body.scrollTop > 100 || document.documentElement.scrollTop > 100) {
            backToTopButton.style.display = "block";
        } else {
            backToTopButton.style.display = "none";
        }
    };

    // Scroll to top when the button is clicked
    backToTopButton.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
});
