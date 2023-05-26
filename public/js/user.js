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
      const dropdown = document.querySelector(".dropdown-panel");

      data.categories.forEach((category) => {
        const imagePath = category.image;
        if (imagePath) {
          const newPath = imagePath.replace("public", "");

          const list = document.createElement("ul");
          list.classList.add("dropdown-panel-list");

          const listTitle = document.createElement("li")
          listTitle.classList.add("menu-title")
          const navlink = document.createElement("a")
          navlink.href="#"
          navlink.innerHTML = category.name

          const listItem = document.createElement("li");
          listItem.classList.add("panel-list-item");
          const link = document.createElement("a");
          link.href = "#";
          const img = document.createElement("img");
          img.src = newPath;
          img.alt = "";
          img.width = 250;
          img.height = 119;

          link.appendChild(img);
          listTitle.appendChild(navlink);
          listItem.appendChild(link);
          list.appendChild(listTitle);
          list.appendChild(listItem);

          dropdown.appendChild(list);
        }
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

            <button class="btn-action add-to-cart" data-productId='${
              product._id
            }'>
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

// Event listener for clicking on "View Details - add to cart - remove from cart" button
document.addEventListener("click", function (event) {
  if (
    event.target.classList.contains("view-details") ||
    event.target.closest(".view-details")
  ) {
    const button = event.target.classList.contains("view-details")
      ? event.target
      : event.target.closest(".view-details");
    const product = JSON.parse(button.dataset.product);
    handleViewDetails(product);
  } else if (
    event.target.classList.contains("add-to-cart") ||
    event.target.closest(".add-to-cart")
  ) {
    const button = event.target.classList.contains("add-to-cart")
      ? event.target
      : event.target.closest(".add-to-cart");
    const productId = button.dataset.productid;
    handleaddToCart(productId);
  } else if (
    event.target.classList.contains("add-to-cart") ||
    event.target.closest(".add-to-cart")
  ) {
    const button = event.target.classList.contains("add-to-cart")
      ? event.target
      : event.target.closest(".add-to-cart");
    const productId = button.dataset.productid;
    handleaddToCart(productId);
  }
});

// Function to handle the view details functionality
const handleViewDetails = (product) => {
  localStorage.setItem("product", JSON.stringify(product));
  window.location.href = "/details";
};

// get the count of cart items
const getCartCount = () => {
  $.ajax({
    type: "GET",
    url: "/api/v1/user/cart/items/count",
    success: function (response) {
      const cartCount = document.querySelector("#cart_count");
      cartCount.textContent = response.count;
    },
    error: function (error) {
      console.error("Error retrieving cart items count", error);
    },
  });
};

getCartCount();

// function to handle the add to cart functionality
const handleaddToCart = (productId) => {
  $.ajax({
    type: "POST",
    url: "/api/v1/user/cart",
    data: {
      productId,
    },
    success: function (response) {
      console.log(response);
      getCartCount();
      alert(response.message);
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
              <button class="exit-btn" onClick="handleRemoveCartItem('${
                product._id
              }')">
              <ion-icon name="close-outline" role="img" class="md hydrated" aria-label="close outline"></ion-icon>
          </button>
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
                }, 600);
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

const handleRemoveCartItem = (productId) => {
  const confirm = window.confirm("Do you want to remove this item ?");
  if (confirm) {
    $.ajax({
      type: "DELETE",
      url: `/api/v1/user/cart/${productId}`,
      success: function (response) {
        getCart();
        getCartCount();
      },
    });
  }
};

const goToChekOut = () => {
  const row = $(".cart-items");
  $.ajax({
    type: "GET",
    url: "/api/v1/user/cart",
    success: function (response) {
      if (response.cart.items.length > 0) {
        window.location.href = "/checkout";
      } else {
        const cart = `
        <div class="empty-cart">
        <h3>Missing Cart items ?</h3>
        <p>Your Cart is Empty now this time to shop</p>
        <a href="/shop" class="button">Shop</a>
        </div>
        `;
        row.append(cart);
        // alert("cart is Empty")
        // window.location.href = "/cart";
      }
    },
  });
};

const getCheckOut = () => {
  const row = $(".address_list");
  const totalPrice = document.querySelector("#totalPrice");
  const totalPayable = document.querySelector("#totalPayable");
  const productCount = document.querySelector("[item-count]");
  const pay = document.querySelector("[proceed-pay]");
  const shippingHandlingFee = 98;

  const text = totalPrice.querySelector("span");

  $.ajax({
    type: "GET",
    url: "/api/v1/user/cart",
    success: function (response) {
      const { cart } = response;
      const data = cart.shippingAddress;
      row.empty();

      data.forEach((address) => {
        const addressList = `
        <div class="address-details">
        <div class="box">
       <div class="group">
       <input type="radio" id="${address._id}" name="user-info" value="${address._id}">
       <div class="user-data">
           <p>${address.custName}</p>
           <p>${address.mobile}</p>
       </div>
       </div>
            <div class="address">
                <p> ${address.address}, ${address.city}, ${address.state}, ${address.zipCode}</p>
            </div>
        </div>
        <button>EDIT</button>

    </div>
        `;
        row.append(addressList);
      });

      pay.addEventListener("click", async () => {
        const selectedAddressId = $('input[name="user-info"]:checked').val();
        console.log(`Selected address ID: ${selectedAddressId}`);
        await placeOrder(selectedAddressId, response);
      });

      async function placeOrder(addressId, response) {
        console.log(response)
        try {
          const axiosResponse = await axios.post("/api/v1/user/cart/purchase", {
            shippingAddress: addressId,
            // totalPrice: 1000,
            totalPrice: response.cart.productSum,
          });
          console.log(axiosResponse.data);
          console.log("Order placed successfully");
          alert("Order placed successfully");
          window.location.href="/"
        } catch (error) {
          console.error("Error placing order:", error);
          // console.error();
          alert(error.response.data.message)
          // console.log(error)
        }
      }

      text.textContent = response.totalPrice;
      totalPayable.textContent = response.totalPrice + shippingHandlingFee;
      productCount.textContent = response.cart.items.length;
    },
  });
};

getCheckOut();

// getOrders function included in order.ejs

// Event listener for address selection
