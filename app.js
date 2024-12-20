const products = document.querySelector('#products');
const basCategory = document.querySelector("#Bas-category");
let allProducts = [];
let cartItems = [];

const fetchProducts = async () => {
    try {
        const res = await fetch('https://anthonyfs.pythonanywhere.com/api/products/');
        if (!res.ok) throw new Error("API error");
        const data = await res.json();
        allProducts = data;
        showScreen(allProducts);
        localStorage.setItem('allProducts', JSON.stringify(allProducts));
    } catch (error) {
        console.error("Failed to fetch products:", error);
    }
};

const showScreen = (data) => {
    products.innerHTML = "";
    data.forEach((product) => {
        products.innerHTML += `
            <div class='card'>
                <img src='${product.image}' class='p-2' height='250px' alt="" />
                <div class='card-body'>
                    <h5 class='card-title line-clamp-1'>${product.title}</h5>
                    <p class='card-text line-clamp-3'>${product.description}</p>
                </div>
                <div class='card-footer w-100 fw-bold d-flex justify-content-between gap-3'>
                    <span>Fiyat:</span><span>${product.price} ₺</span>
                </div>
                <div class='card-footer w-100 d-flex justify-content-center gap-3'>
                    <button class='add-to-cart btn btn-danger' data-id='${product.id}'>Sepete Ekle</button>
                    <button class='btn btn-primary' data-id='${product.id}' data-bs-toggle='modal' data-bs-target='#exampleModal'>See Details</button>
                </div>
            </div>`;
    });
};

const selectCategory = (category) => {
    let filteredProducts;
    if (category === "ALL") {
        filteredProducts = allProducts;
    } else {
        filteredProducts = allProducts.filter(
            (product) => product.category?.toUpperCase() === category
        );
    }
    basCategory.textContent = category;
    showScreen(filteredProducts);
};

products.addEventListener("click", (e) => {
    if (e.target && e.target.classList.contains("add-to-cart")) {
        const productId = e.target.getAttribute("data-id");
        const selectedProduct = allProducts.find(product => product.id === parseInt(productId));

        if (selectedProduct && !cartItems.some(item => item.id === selectedProduct.id)) {
            cartItems.push(selectedProduct);
            localStorage.setItem("cartItems", JSON.stringify(cartItems));
            document.getElementById("cart-count").textContent = cartItems.length;
        }
    }
});

const showCartItems = () => {
    const savedItems = JSON.parse(localStorage.getItem("cartItems")) || [];
    const cartBody = document.querySelector(".offcanvas-body .row");

    cartBody.innerHTML = savedItems.map(item => `
        <div class="col-md-7 border-1 ">
            <img src=${item.image} class="w-75 rounded-start" alt="..." />
        </div>
        <div class="col-md-8">
            <div class="card-body">
                <div class="d-flex justify-content-between align-items-center py-2">
                    <span class="fw-bold">${item.title}</span>
                    <span class="fw-bold">${item.price} ₺</span>
                </div>
                <div class="border border-1 border-dark shadow-lg d-flex justify-content-center p-1">
                    <div class="adet-controller">
                        <button class="btn btn-secondary btn-sm minus" data-id="${item.id}">
                            <i class="fas fa-minus"></i>
                        </button>
                        <p class="d-inline mx-4" id="ürün-adet">1</p>
                        <button class="btn btn-secondary btn-sm plus" data-id="${item.id}">
                            <i class="fas fa-plus"></i>
                        </button>
                    </div>
                </div>
                <div class="ürün-removal mt-2 mb-4 ">
                    <button class="btn btn-danger btn-sm w-100 remove-product" data-id="${item.id}">
                        <i class="fa-solid fa-trash-can me-2"></i>Remove
                    </button>
                </div>               
            </div>
        </div>`).join("");

    calculateCardTotal();
    sepetKontrol();
};

document.querySelector(".btn-secondary").addEventListener("click", showCartItems);


const sepetKontrol = () => {
    document.querySelectorAll(".plus").forEach(plusBtn => {
        plusBtn.onclick = () => {
            const parent = plusBtn.closest(".adet-controller");
             const quantity = parent.querySelector("#ürün-adet");
            quantity.textContent = Number(quantity.textContent) + 1;
            calculateCardTotal();
            
        };
    });

    document.querySelectorAll(".minus").forEach(minusBtn => {
        minusBtn.onclick = () => {
            const parent = minusBtn.closest(".adet-controller");
            const quantity = parent.querySelector("#ürün-adet");
            if (Number(quantity.textContent) > 1) {
                quantity.textContent = Number(quantity.textContent) - 1;
                calculateCardTotal();
            }
        };
    });



    document.querySelectorAll(".remove-product").forEach(removeBtn => {
      removeBtn.onclick = () => {
          const productId = removeBtn.getAttribute("data-id");
          cartItems = cartItems.filter(item => item.id !== parseInt(productId));
          localStorage.setItem("cartItems", JSON.stringify(cartItems));
          showCartItems();
      };
  });
  
};

const calculateCardTotal = () => {
  const totals = cartItems.reduce((sum, item) => sum + item.price * (item.quantity), 0);
  document.querySelector(".productstoplam").textContent = totals.toFixed(2);
};

const searchInput = document.querySelector('input');
searchInput.addEventListener("input", (e) => {
    const sorgu = e.target.value.toLowerCase();
    const filteredProducts = allProducts.filter(product =>
        product.title.toLowerCase().includes(query) 
    );
    showScreen(filteredProducts); 
});

fetchProducts();
