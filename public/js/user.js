const logout = async () => {
  const res = await axios.get("http://127.0.0.1:3000/api/v1/user/logout");
  if (res.data.status === "success") {
    location.reload(true);
  }
};

const getCategories = () => {
  $.ajax({
    type: "GET",
    url: "http://127.0.0.1:3000/api/v1/admin/categories",
    success: function (categories) {
      const { data } = categories;
      data.categories.forEach((category) => {
        const imagePath = category.icon;
        const newPath = imagePath.replace("public", "");
        const link = `<a href="/category/${category.id}" class="nav-item nav-link my-0"> <img width=15 class="mr-2" src=${newPath}  /> ${category.name}</a>`;
        $("#category-list").append(link);
      });
    },
  });
};

const getProducts = () => {
  const row = $(".product-grid");

  $.ajax({
    type: "GET",
    url: "http://127.0.0.1:3000/api/v1/user/products",
    success: function (products) {
      const { data } = products;

      data.forEach((product) => {
        const imagePath = product.image;
        const newPath = imagePath.replace("public", "");

        const card = `
        <div class="showcase">

        <div class="showcase-banner">

        <img src="${newPath}" alt="Mens Winter Leathers Jackets"
            width="300" class="product-img default">
        <img src="src/images/products/jacket-4.jpg" alt="Mens Winter Leathers Jackets"
            width="300" class="product-img hover">

        <p class="showcase-badge">15%</p>

        <div class="showcase-actions">

            <button class="btn-action">
                <ion-icon name="heart-outline"></ion-icon>
            </button>

            <button class="btn-action view-details" data-product='${JSON.stringify(
              product
            )}'>
            <ion-icon name="eye-outline"></ion-icon>
              </button>

            <button class="btn-action">
                <ion-icon name="bag-add-outline"></ion-icon>
            </button>

        </div>

    </div>

    <div class="showcase-content">

        <a href="#" class="showcase-category">${product.category.name}</a>

        <a href="#">
            <h3 class="showcase-title">${product.name}</h3>
        </a>

        <div class="showcase-rating">
            <ion-icon name="star"></ion-icon>
            <ion-icon name="star"></ion-icon>
            <ion-icon name="star"></ion-icon>
            <ion-icon name="star-outline"></ion-icon>
            <ion-icon name="star-outline"></ion-icon>
        </div>

        <div class="price-box">
            <p class="price">₹${product.price}</p>
            <del>₹${product.price * 2}</del>
        </div>

    </div>
    </div>
        `;

        row.append(card);
      });
    },
  });
};

const getCart = () => {
  const row = $(".cart-items");

  $.ajax({
    type: "GET",
    url: "http://127.0.0.1:3000/api/v1/user/cart",
    success: function (response) {
      const { cart } = response;
      const data = cart.items;
      console.log(data);

      row.empty();

      data.forEach((item) => {
        $.ajax({
          type: "GET",
          url: `http://127.0.0.1:3000/api/v1/admin/product/${item.product}`,
          success: function (response) {
            const { data } = response;
            const product = data.products;

            const imagePath = product.image;
            const newPath = imagePath.replace("public", "");

            const singleItem = `
              <div class="cart-product">
                <div class="product_image">
                  <img src=${newPath} />
                  <div class="product_details">
                    <div class="product_title">
                      <p>${product.name}</p>
                    </div>
                    <div class="product_qty">
                      <p>${product.price} * ${item.quantity} <span>  ${
              product.price * item.quantity
            }</span></p>
                    </div>
                  </div>
                </div>

                <div class="exit-btn">
                  <i></i>
                </div>
                <form class="counter">
                  <button class="inc-btn" data-product-id="${
                    product._id
                  }">+</button>
                  <input  class="qty-input" name="quantity" type="text" minlength="1" value=${
                    item.quantity
                  } readonly />
                  <button class="dec-btn" data-product-id="${
                    product._id
                  }">-</button>
                </form>
              </div>`;

            row.append(singleItem);

            const counterDiv = row.find(".counter").last();
            const quantityInput = counterDiv.find(".qty-input");
            const incButton = counterDiv.find(".inc-btn");
            const decButton = counterDiv.find(".dec-btn");

            incButton.click(incrementCounter);
            decButton.click(decrementCounter);

            // Counter functions
            async function incrementCounter(e) {
              e.preventDefault();
              const productId = $(this).data("product-id");
              const currentInput = $(this).siblings(".qty-input");
              let currentValue = parseInt(currentInput.val());
              if (currentValue < product.stock) {
                setTimeout(async () => {
                  currentValue++;
                  currentInput.val(currentValue);
                  try {
                    await updateCartItem(productId, currentValue);
                    getCart();
                  } catch (error) {
                    console.error(error);
                  }
                }, 800);
              }
            }

            async function decrementCounter(e) {
              e.preventDefault();
              const productId = $(this).data("product-id");
              const currentInput = $(this).siblings(".qty-input");
              let currentValue = parseInt(currentInput.val());
              if (currentValue > 1) {
                setTimeout(async () => {
                  currentValue--;
                  currentInput.val(currentValue);

                  try {
                    await updateCartItem(productId, currentValue);
                    getCart();
                  } catch (error) {
                    console.error(error);
                  }
                }, 800);
              }
            }

            async function updateCartItem(productId, quantity) {
              try {
                await axios.put(`/api/v1/user/cart/${productId}`, {
                  quantity: quantity,
                });
                // Update the item quantity in the local data
                const updatedItem = data.find(
                  (item) => item.product === productId
                );
                if (updatedItem) {
                  updatedItem.quantity = quantity;
                  getCart();
                }
              } catch (error) {
                console.error(error);
              }
            }
          },
        });
      });

      const totalPrice = document.querySelector("#totalPrice");
      const totalPayable = document.querySelector("#totalPayable");
      const productCount = document.querySelector("[item-count]");
      const shippingHandlingFee = 98;

      const text = totalPrice.querySelector("span");
      text.textContent = response.totalPrice;
      totalPayable.textContent = response.totalPrice + shippingHandlingFee;
      productCount.textContent = response.cart.items.length;
    },
  });
};


const goToChekOut = ()=>{
  window.location.href = "/checkout";
}





// Handle click event on product card
$(document).on("click", ".view-details", function (event) {
  event.preventDefault();

  const product = JSON.stringify($(this).data("product"));

  console.log(product);

  // Store the product details in localStorage or sessionStorage
  localStorage.setItem("product", product);

  // Redirect to the product page
  window.location.href = "/details";
});
