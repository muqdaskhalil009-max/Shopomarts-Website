

document.querySelectorAll(".category-carousel").forEach((carousel) => {
    const images = carousel.querySelectorAll(".carousel-image");
    const dots = carousel.querySelectorAll(".carousel-dot");

    if (images.length === 0) return;

    let currentIndex = 0;

    function showImage(index) {
        images.forEach((image, i) => {
            image.classList.toggle("active", i === index);
        });

        dots.forEach((dot, i) => {
            dot.classList.toggle("active", i === index);
        });

        currentIndex = index;
    }

    dots.forEach((dot, index) => {
        dot.addEventListener("click", () => {
            if (index < images.length) {
                showImage(index);
            }
        });
    });

    if (images.length > 1) {
        setInterval(() => {
            showImage((currentIndex + 1) % images.length);
        }, 3000);
    }
});



const heroSlides = document.querySelectorAll(".hero-slide");

if (heroSlides.length > 1) {
    let heroIndex = 0;

    setInterval(() => {
        heroSlides.forEach((slide, index) => {
            slide.classList.toggle("active", index === heroIndex);
        });

        heroIndex = (heroIndex + 1) % heroSlides.length;
    }, 4000);
}



let cartItems = [];

try {
    cartItems = JSON.parse(localStorage.getItem("shopomartssssCart")) || [];

    if (!Array.isArray(cartItems)) {
        cartItems = [];
    }
} catch (error) {
    cartItems = [];
}

const cartDisplay = document.querySelector(".cart");
const cartPanel = document.getElementById("cartPanel");
const cartOverlay = document.getElementById("cartOverlay");
const closeCartButton = document.getElementById("closeCart");
const cartItemsContainer = document.getElementById("cartItems");
const cartTotalDisplay = document.getElementById("cartTotal");
const checkoutButton = document.getElementById("checkoutButton");


/* Save cart */

function saveCart() {
    try {
        localStorage.setItem("shopomartssssCart", JSON.stringify(cartItems));
    } catch (error) {
        console.error("Unable to save the cart.", error);
    }
}


/* Format prices */

function formatPrice(price) {
    return "Rs. " + Number(price).toLocaleString("en-PK");
}


/* Update cart count */

function updateCartCount() {
    const totalItems = cartItems.reduce((total, item) => {
        return total + (Number(item.quantity) || 0);
    }, 0);

    if (cartDisplay) {
        cartDisplay.textContent = `🛒 Cart (${totalItems})`;
    }

    saveCart();
}


/* Open cart panel */

function openCart() {
    if (!cartPanel || !cartOverlay) {
        alert("Cart panel is missing from this page. Please check the cart HTML.");
        return;
    }

    renderCart();

    cartPanel.classList.add("open");
    cartOverlay.classList.add("open");
    document.body.classList.add("cart-open");
}


/* Close cart panel */

function closeCart() {
    if (!cartPanel || !cartOverlay) return;

    cartPanel.classList.remove("open");
    cartOverlay.classList.remove("open");
    document.body.classList.remove("cart-open");
}


/* Display cart items */

function renderCart() {
    if (!cartItemsContainer || !cartTotalDisplay) return;

    cartItemsContainer.innerHTML = "";

    if (cartItems.length === 0) {
        cartItemsContainer.innerHTML =
            '<p class="empty-cart">Your cart is empty. Add a product to get started!</p>';

        cartTotalDisplay.textContent = formatPrice(0);
        updateCartCount();
        return;
    }

    let total = 0;

    cartItems.forEach((item, index) => {
        const subtotal = Number(item.price) * Number(item.quantity);
        total += subtotal;

        const itemElement = document.createElement("div");
        itemElement.className = "cart-item";

        const details = document.createElement("div");

        const name = document.createElement("h3");
        name.textContent = item.name;

        const price = document.createElement("p");
        price.textContent =
            `${formatPrice(item.price)} × ${item.quantity} = ${formatPrice(subtotal)}`;

        const actions = document.createElement("div");
        actions.className = "cart-item-actions";

        const minusButton = document.createElement("button");
        minusButton.type = "button";
        minusButton.textContent = "−";
        minusButton.setAttribute("aria-label", "Decrease quantity");

        const quantity = document.createElement("span");
        quantity.textContent = item.quantity;

        const plusButton = document.createElement("button");
        plusButton.type = "button";
        plusButton.textContent = "+";
        plusButton.setAttribute("aria-label", "Increase quantity");

        const removeButton = document.createElement("button");
        removeButton.type = "button";
        removeButton.textContent = "Remove";
        removeButton.className = "remove-item";

        minusButton.addEventListener("click", () => {
            if (item.quantity > 1) {
                item.quantity--;
            } else {
                cartItems.splice(index, 1);
            }

            saveCart();
            renderCart();
        });

        plusButton.addEventListener("click", () => {
            item.quantity++;
            saveCart();
            renderCart();
        });

        removeButton.addEventListener("click", () => {
            cartItems.splice(index, 1);
            saveCart();
            renderCart();
        });

        actions.append(minusButton, quantity, plusButton, removeButton);
        details.append(name, price, actions);
        itemElement.appendChild(details);
        cartItemsContainer.appendChild(itemElement);
    });

    cartTotalDisplay.textContent = formatPrice(total);
    updateCartCount();
}


/* Add products to cart */

document.querySelectorAll(".product-card").forEach((card) => {
    const button = card.querySelector(".product-button");

    if (!button) return;

    button.addEventListener("click", () => {
        const name = card.querySelector("h3")?.textContent.trim();
        const priceText = card.querySelector(".product-price")?.textContent || "";
        const price = Number(priceText.replace(/[^\d]/g, ""));

        if (!name || !Number.isFinite(price) || price <= 0) {
            alert("Product name or price is missing. Please check the product card.");
            return;
        }

        const existingItem = cartItems.find((item) => item.name === name);

        if (existingItem) {
            existingItem.quantity++;
        } else {
            cartItems.push({
                name: name,
                price: price,
                quantity: 1
            });
        }

        saveCart();
        updateCartCount();

        const originalText = button.textContent;
        button.textContent = "✓ Added!";
        button.style.background = "#287a45";

        setTimeout(() => {
            button.textContent = originalText;
            button.style.background = "";
        }, 1000);
    });
});


/* Open cart when Cart is clicked */

if (cartDisplay) {
    cartDisplay.style.cursor = "pointer";
    cartDisplay.addEventListener("click", openCart);
}


/* Close cart buttons */

if (closeCartButton) {
    closeCartButton.addEventListener("click", closeCart);
}

if (cartOverlay) {
    cartOverlay.addEventListener("click", closeCart);
}


/* Close cart with Escape key */

document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
        closeCart();
    }
});


/* Demo checkout */

if (checkoutButton) {
    checkoutButton.addEventListener("click", () => {
        if (cartItems.length === 0) {
            alert("Your cart is empty. Please add a product first!");
            return;
        }

        alert(
            "Thank you for shopping with shopomartssss!\n\n" +
            "Your demo cart total is " + cartTotalDisplay.textContent +
            ".\n\nCheckout and online payment are not connected yet."
        );
    });
}


/* Initial cart count */

updateCartCount();
// shopomartssss Contact Form Demo
const contactForm = document.getElementById("contactForm");

if (contactForm) {
    contactForm.addEventListener("submit", function (event) {
        event.preventDefault();

        const name = document.getElementById("contactName").value.trim();
        const email = document.getElementById("contactEmail").value.trim();
        const subject = document.getElementById("contactSubject").value.trim();
        const message = document.getElementById("contactMessage").value.trim();
        const feedback = document.getElementById("contactFeedback");

        if (!name || !email || !subject || !message) {
            feedback.textContent = "Please complete all fields.";
            feedback.className = "contact-feedback error";
            return;
        }

        feedback.textContent =
            "Thank you, " + name + "! Your message passed the demo validation.";
        feedback.className = "contact-feedback success";

        contactForm.reset();
    });
}

