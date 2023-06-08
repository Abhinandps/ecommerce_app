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

          const listTitle = document.createElement("li");
          listTitle.classList.add("menu-title");
          const navlink = document.createElement("a");
          navlink.href = "#";
          navlink.innerHTML = category.name;

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
      console.log(data);

      data.forEach((product) => {
        // const imagePath =

        // console.log(newPath)

        const card = `
        <div class="showcase">

        <div class="showcase-banner">

        ${product.image.map((path, index) => {
          const newPath = path.replace("public", "");
          let className = "product-img default";

          if (index === 1) {
            className = " product-img hover";
          }
          console.log(newPath);
          return `<img src="${newPath}" alt="Mens Winter Leathers Jackets" width="300" class="${className}">`;
        })}

      
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
      const cartCountMobile = document.querySelector("#cart_count_mobile");
      cartCount.textContent = response.count;
      cartCountMobile.textContent = response.count;
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
      showToast();
      setToastMessage(response.status, response.message);
    },
  });
};

const getCart = () => {
  const row = $(".cart-items");

  $.ajax({
    type: "GET",
    url: "/api/v1/user/cart",
    success: function (response) {
      const { cart } = response;
      const data = cart.items;
      const discountAmount = response.cart.discountAmount || 0;

      row.empty();

      if (data.length < 1) {
        const cart = `
        <div class="empty-cart">
        <h3>Missing Cart items ?</h3>
        <p>Your Cart is Empty now this time to shop</p>
        <a href="/shop" class="button">Shop</a>
        </div>
        `;
        row.append(cart);
      }

      data.forEach((item) => {
        $.ajax({
          type: "GET",
          url: `/api/v1/admin/product/${item.product}`,
          success: function (response) {
            const { data } = response;
            const product = data.products;
            console.log(product);

            const singleItem = `
              <div class="cart-product">
              <button class="exit-btn" onClick="handleRemoveCartItem('${
                product._id
              }')">
              <ion-icon name="close-outline" role="img" class="md hydrated" aria-label="close outline"></ion-icon>
          </button>
                <div class="product_image">
                ${product.image.map((path, index) => {
                  const newPath = path.replace("public", "");
                  if (index === 0) {
                    return `<img src=${newPath} />`;
                  }
                })}
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
                    showToast();
                    setToastMessage(
                      "Cart Updated",
                      `Cart Increment to ${currentValue} items`
                    );
                    removeCoupon();
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
                    showToast();
                    setToastMessage(
                      "Cart Updated",
                      `Cart Decrement to ${currentValue} items`
                    );
                    removeCoupon();
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
      text.textContent = response.cart.totalPrice;

      const couponEditCard = document.getElementById("couponEditCard");
      if (discountAmount > 0) {
        const couponListElement = document.getElementById("coupon-list");
        couponListElement.textContent = discountAmount;
        couponListElement.classList.add("discount-applied");
        const couponRemoveCard = `
        <div class="coupon-handle">
                    <div class="coupon-left">
                        <p>1 Coupon applied</p>
                        <small>You saved additional ₹${discountAmount}</small>
                    </div>
                    <div class="coupon-right">
                        <button onclick="removeCoupon()"> REMOVE </button>
                    </div>
                </div>
        `;
        couponEditCard.innerHTML = couponRemoveCard;
      } else {
        const couponListElement = document.getElementById("coupon-list");
        couponListElement.textContent = "Apply Coupon ";
        couponEditCard.innerHTML = "";
      }

      totalPayable.textContent = response.cart.totalPrice + shippingHandlingFee;
      productCount.textContent = response.cart.items.length;

      // updateCartTotal( response.cart.totalPrice + shippingHandlingFee);
    },
  });
};

function removeCoupon() {
  $.ajax({
    url: "/api/v1/user/coupons/remove",
    type: "DELETE",
    success: function (data) {
      console.log(data.message);
      getCart();
    },
    error: function (error) {
      console.error("Error:", error);
    },
  });
}

const handleRemoveCartItem = (productId) => {
  const confirm = window.confirm("Do you want to remove this item ?");
  if (confirm) {
    $.ajax({
      type: "DELETE",
      url: `/api/v1/user/cart/${productId}`,
      success: function (response) {
        getCart();
        getCartCount();
        removeCoupon();
        showToast();
        setToastMessage("Removed", "Cart Item Removed ");
      },
    });
  }
};

const goToChekOut = () => {
  // const row = $(".cart-items");
  $.ajax({
    type: "GET",
    url: "/api/v1/user/cart",
    success: function (response) {
      if (response.cart.items.length > 0) {
        getCheckOut();
        window.location.href = "/checkout";
      }
    },
  });
};

const getCheckOut = () => {
  const row = $(".address_list");
  const totalPrice = document.querySelector("#totalPrice");
  const totalPayable = document.querySelector("#totalPayable");
  const productCount = document.querySelector("[item-count]");
  const proceedPay = document.querySelector("[proceed-pay]");
  const shippingHandlingFee = 98;

  const text = totalPrice.querySelector("span");
  $.ajax({
    type: "GET",
    url: "/api/v1/user/cart",
    success: function (response) {
      const { cart } = response;
      const data = cart.shippingAddress;
      row.empty();
      console.log(data);

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
                <p> ${address.address}, ${address.locality}, ${address.city},${address.state}, ${address.zipCode}</p>
            </div>
        </div>
        <button>EDIT</button>

    </div>
        `;
        row.append(addressList);
      });

      proceedPay.addEventListener("click", () => {
        const selectedAddressId = $('input[name="user-info"]:checked').val();
        console.log(`Selected address ID: ${selectedAddressId}`);
        if (selectedAddressId) {
          window.location.href = "/payment?addressId=" + selectedAddressId;
        } else {
          showToast();
          setToastMessage("Warning", "Please select a shipping address.");
        }
      });

      text.textContent = response.cart.totalPrice;
      console.log(response);
      let totalPriceValue = response.cart.totalPrice + shippingHandlingFee;
      totalPayable.textContent = totalPriceValue;
      productCount.textContent = response.cart.items.length;

      // // Update the cart collection's total value
      // updateCartTotal(totalPriceValue);
    },
  });
};

const getCoupons = () => {
  const row = $("#coupon-codes-container");

  $.ajax({
    type: "GET",
    url: "/api/v1/user/coupons",
    success: (response) => {
      console.log(response);
      row.empty();

      response.forEach((singleCoupon) => {
        const dateString = singleCoupon.expiryDate;
        /// Splitting the string at the 'T' character
        const datePart = dateString.split("T")[0];

        const coupon = `
      <div class="coupon-code-selection">
      <p>${singleCoupon.code}</p>

      <div class="coupon-details">
          <p class="highlight_text">Save ₹${singleCoupon.value}</p>
          <p class="more-details">
              Rs.${singleCoupon.value - 1} off on minimum purchase of Rs. ${
          singleCoupon.minimumOrderValue
        }.
              Expires On: ${datePart} | 12:00 AM
          </p>
      </div>
  </div>`;
        row.append(coupon);
      });
    },
  });
};

getCoupons();

const updateCartTotal = (totalPrice) => {
  $.ajax({
    type: "PATCH",
    url: "/api/v1/user/cart/total",
    data: {
      totalPrice,
    },
    success: function (response) {},
    error: function (error) {
      console.error("Error updating cart total:", error);
      getCart();
      getCheckOut();
    },
  });
};

getCheckOut();

const getPaymentDetails = () => {
  const shippingHandlingFee = 98;

  const totalPayable = document.querySelector("#totalPayable");
  // const productCount = document.querySelector("[item-count]");
  const placeOrderButton = document.querySelector("[place_order]");

  $.ajax({
    type: "GET",
    url: "/api/v1/user/cart",
    success: function (response) {
      const cart = response.cart;
      totalPayable.textContent = cart.totalPrice + shippingHandlingFee;
      updateCartTotal(cart.totalPrice);
      console.log(cart.totalPrice);

      placeOrderButton.addEventListener("click", async () => {
        const selectedPaymentOption = $(
          'input[name="payment-option"]:checked'
        ).val();

        if (selectedPaymentOption) {
          const urlParams = new URLSearchParams(window.location.search);
          const addressId = urlParams.get("addressId");
          if (addressId) {
            try {
              await placeOrder(
                addressId,
                selectedPaymentOption,
                cart,
                shippingHandlingFee
              );
            } catch (error) {
              console.log(error);
            }
          }
        } else {
          showToast();
          setToastMessage("Warning", "Please select payment method.");
        }
      });
    },
  });

  async function placeOrder(
    addressId,
    selectedPaymentOption,
    response,
    shippingHandlingFee
  ) {
    console.log(response);
    try {
      const totalPrice = response.totalPrice + shippingHandlingFee;
      const axiosResponse = await axios.post("/api/v1/user/cart/purchase", {
        shippingAddress: addressId,
        paymentMethod: selectedPaymentOption,
        totalPrice,
      });

      if (selectedPaymentOption === "cod") {
        const popUp = document.querySelector(".order-success-popup");
        const container = document.querySelector('.container.wrapper')
        popUp.style.display = "block";

        container.classList.add("bg-blur");

        setTimeout(function () {
          container.classList.remove("bg-blur");
          window.location.href = "/myorders";
        }, 3000);

        // showToast();
        // removeCoupon();
        // setToastMessage("Success", "Order placed successfully");

        
      } else if (selectedPaymentOption === "upi") {
        const orderID = axiosResponse.data.orderID;
        const KEY_ID = "rzp_test_MpNQwQcp20migY";
        const options = {
          key: KEY_ID,
          amount: totalPrice * 100,
          currency: "INR",
          name: "Anon Stores",
          description: "Payment for Purchase",
          order_id: orderID,
          handler: function (response) {
            console.log(response);
            const popUp = document.querySelector(".order-success-popup");
            const container = document.querySelector('.container.wrapper')
            popUp.style.display = "block";
    
            container.classList.add("bg-blur");
    
            setTimeout(function () {
              container.classList.remove("bg-blur");
              window.location.href = "/myorders";
            }, 3000);
          },
          prefill: {
            email: "user@example.com",
            contact: "9876543210",
          },
        };

        const razorpayInstance = new Razorpay(options);
        razorpayInstance.open();
      }
    } catch (error) {
      console.error("Error placing order:", error);
      setToastMessage("Failed", error.response.data.message);
    }
  }
};

// getOrders function included in order.ejs
