const logout = async () => {
  const res = await axios.get("/api/v1/user/logout");
  if (res.data.status === "success") {
    location.reload(true);
  }
};

const bestSellers = () => {
  const row = document.getElementById("showcase-container");
  if (row) {
    console.log(row);
    row.innerHTML = "";
    $.ajax({
      type: "GET",
      url: "/api/v1/user/bestsellers",
      success: function (res) {
        const products = res.data.bestSellers;
        products.forEach((product) => {
          const firstImage = product.image.map(
            (image) => image.split("public")[1]
          )[0];
          const item = `
                <div class="showcase fade-in-animation" data-product='${JSON.stringify(
                  product
                )}'>

                  <a href="#" class="showcase-img-box">
                      <img src="${firstImage}" alt="baby fabric shoes" width="75"
                          height="75" class="showcase-img">
                  </a>

                  <div class="showcase-content">

                      <a href="#">
                          <h4 class="showcase-title">${product.name}</h4>
                      </a>

                      <div class="showcase-rating">
                          <ion-icon name="star"></ion-icon>
                          <ion-icon name="star"></ion-icon>
                          <ion-icon name="star"></ion-icon>
                          <ion-icon name="star"></ion-icon>
                          <ion-icon name="star"></ion-icon>
                      </div>

                      <div class="price-box">
                          <del>₹ ${
                            product.originalPrice
                              ? product.originalPrice
                              : product.price + 299
                          }</del>
                          <p class="price">₹${product.price}</p>
                      </div>

                  </div>

              </div>
`;
          row.innerHTML += item;
        });
      },
    });
  }

  document.addEventListener("click", function (event) {
    if (
      event.target.classList.contains("showcase") ||
      event.target.closest(".showcase")
    ) {
      const button = event.target.classList.contains("showcase")
        ? event.target
        : event.target.closest(".showcase");
      if (button.dataset.product) {
        const product = JSON.parse(button.dataset.product);
        handleViewDetails(product);
      }
    }
  });
};

bestSellers();

const newArrivals = () => {
  const row = document.querySelector("#new-arrivals-showcase-wrapper");

  if (row) {
    row.innerHTML = "";

    $.ajax({
      type: "GET",
      url: "/api/v1/user/newArrivals",
      success: function (res) {
        const products = res;

        let showcaseContainer = document.createElement("div");
        showcaseContainer.classList.add("showcase-container");
        row.appendChild(showcaseContainer);

        products.forEach((product, index) => {
          const firstImage = product.image.map(
            (image) => image.split("public")[1]
          )[0];

          const item = `
            <div class="showcase" data-product='${JSON.stringify(product)}'>
              <a href="#" class="showcase-img-box">
                <img src=${firstImage} alt="product_img" style="width:70px;" class="showcase-img">
              </a>
              <div class="showcase-content">
                <a href="#">
                  <h4 class="showcase-title">${product.name}</h4>
                </a>
                <a href="#" class="showcase-category">${
                  product.categoryName
                }</a>
                <div class="price-box">
                  <p class="price">₹${product.price}</p>
                  <del>₹ ${
                    product.originalPrice
                      ? product.originalPrice
                      : product.price + 299
                  }</del>
                </div>
              </div>
            </div>`;

          showcaseContainer.innerHTML += item;

          // Check if the current index is a multiple of 4 to create a new showcase container
          if ((index + 1) % 4 === 0 && index < products.length - 1) {
            showcaseContainer = document.createElement("div");
            showcaseContainer.classList.add("showcase-container");
            row.appendChild(showcaseContainer);
          }
        });
      },
    });
  }

  document.addEventListener("click", function (event) {
    if (
      event.target.classList.contains("showcase") ||
      event.target.closest(".showcase")
    ) {
      const button = event.target.classList.contains("showcase")
        ? event.target
        : event.target.closest(".showcase");
      const product = JSON.parse(button.dataset.product);
      handleViewDetails(product);
    }
  });
};

const trending = () => {
  const row = document.querySelector("#trending-showcase-wrapper");

  if (row) {
    row.innerHTML = "";

    $.ajax({
      type: "GET",
      url: "/api/v1/user/trending",
      success: function (res) {
        const products = res;

        let showcaseContainer = document.createElement("div");
        showcaseContainer.classList.add("showcase-container");
        row.appendChild(showcaseContainer);

        products.forEach((product, index) => {
          const firstImage = product.image.map(
            (image) => image.split("public")[1]
          )[0];

          const item = `
            <div class="showcase" data-product='${JSON.stringify(product)}'>
              <a href="#" class="showcase-img-box">
                <img src=${firstImage} alt="product_img" style="width:70px;" class="showcase-img">
              </a>
              <div class="showcase-content">
                <a href="#">
                  <h4 class="showcase-title">${product.name}</h4>
                </a>
                
                <a href="#" class="showcase-category">${
                  product.categoryName
                }</a>
                <div class="price-box">
                  <p class="price">₹${product.price}</p>
                  <del>₹ ${
                    product.originalPrice
                      ? product.originalPrice
                      : product.price + 299
                  }</del>
                </div>
              </div>
            </div>`;

          showcaseContainer.innerHTML += item;

          // Check if the current index is a multiple of 4 to create a new showcase container
          if ((index + 1) % 4 === 0 && index < products.length - 1) {
            showcaseContainer = document.createElement("div");
            showcaseContainer.classList.add("showcase-container");
            row.appendChild(showcaseContainer);
          }
        });
      },
    });
  }

  document.addEventListener("click", function (event) {
    if (
      event.target.classList.contains("showcase") ||
      event.target.closest(".showcase")
    ) {
      const button = event.target.classList.contains("showcase")
        ? event.target
        : event.target.closest(".showcase");
      const product = JSON.parse(button.dataset.product);
      handleViewDetails(product);
    }
  });
};

const topRated = () => {
  const row = document.querySelector("#topRated-showcase-wrapper");

  if (row) {
    row.innerHTML = "";

    $.ajax({
      type: "GET",
      url: "/api/v1/user/topRated",
      success: function (res) {
        const products = res;

        let showcaseContainer = document.createElement("div");
        showcaseContainer.classList.add("showcase-container");
        row.appendChild(showcaseContainer);

        products.forEach((product, index) => {
          const firstImage = product.image.map(
            (image) => image.split("public")[1]
          )[0];

          const item = `
            <div class="showcase" data-product='${JSON.stringify(product)}'>
              <a href="#" class="showcase-img-box">
                <img src=${firstImage} alt="product_img" style="width:70px;" class="showcase-img">
              </a>
              <div class="showcase-content">
                <a href="#">
                  <h4 class="showcase-title">${product.name}</h4>
                </a>
                
                <a href="#" class="showcase-category">${
                  product.categoryName
                }</a>
                <div class="price-box">
                  <p class="price">₹${product.price}</p>
                  <del>₹ ${
                    product.originalPrice
                      ? product.originalPrice
                      : product.price + 299
                  }</del>
                </div>
              </div>
            </div>`;

          showcaseContainer.innerHTML += item;

          // Check if the current index is a multiple of 4 to create a new showcase container
          if ((index + 1) % 4 === 0 && index < products.length - 1) {
            showcaseContainer = document.createElement("div");
            showcaseContainer.classList.add("showcase-container");
            row.appendChild(showcaseContainer);
          }
        });
      },
    });
  }
  document.addEventListener("click", function (event) {
    if (
      event.target.classList.contains("showcase") ||
      event.target.closest(".showcase")
    ) {
      const button = event.target.classList.contains("showcase")
        ? event.target
        : event.target.closest(".showcase");
      const product = JSON.parse(button.dataset.product);
      handleViewDetails(product);
    }
  });
};

const getCategories = () => {
  $.ajax({
    type: "GET",
    url: "/api/v1/admin/categories",
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

          navlink.addEventListener("click", function () {
            handleProductPaginationClick(1, null, category._id);
          });

          const listItem = document.createElement("li");
          listItem.classList.add("panel-list-item");
          const link = document.createElement("a");
          link.href = "#";
          const img = document.createElement("img");
          img.src = newPath;
          img.alt = "";
          img.width = 250;
          img.height = 119;
          img.addEventListener("click", function () {
            handleProductPaginationClick(1, undefined, category._id);
          });

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

const getMobileCategories = () => {
  $.ajax({
    type: "GET",
    url: "/api/v1/admin/categories",
    success: function (categories) {
      const { data } = categories;
      const menuContainer = document.querySelector(".menu-category-container");

      data.categories.forEach((category) => {
        const listItem = document.createElement("li");
        listItem.classList.add("menu-category");

        const button = document.createElement("button");
        button.classList.add("accordion-menu");
        button.setAttribute("data-accordion-btn", "");

        const title = document.createElement("p");
        title.classList.add("menu-title");
        title.innerHTML = category.name;

        button.appendChild(title);
        listItem.appendChild(button);
        menuContainer.appendChild(listItem);

        button.addEventListener("click", function () {
          handleProductPaginationClick(1, null, category._id);
        });
      });
    },
  });
};

getMobileCategories();

// Home Products Render

const getHomeProducts = () => {
  const row = $("#home-product-grid");

  row.empty();

  $.ajax({
    type: "GET",
    url: `/api/v1/user/home`,
    success: function (products) {
      const data = products;

      data.forEach((product) => {
        const card = `
        <div class="showcase fade-in-animation">

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

        <p class="showcase-badge">${product.offer ? product.offer : ""}</p>

        <div class="showcase-actions">

        <button class="btn-action add-to-wishlist"  data-productId='${
          product._id
        }'>
            <ion-icon name="heart-outline" ></ion-icon>
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
            <del>₹ ${
              product.originalPrice ? product.originalPrice : product.price * 2
            }</del>
        </div>

    </div>
    </div>
        `;

        row.append(card);
      });
    },
  });
};

// PAGINATION START

const fetchData = async (url) => {
  try {
    const response = await axios.get(url);
    return response.data;
  } catch (error) {
    throw new Error(error.message);
  }
};

// Products

const handleProductPaginationClick = async (
  pageNumber,
  searchQuery,
  categoryId,
  minPrice,
  maxPrice
) => {
  try {
    // Get filter and sort parameters for products

    // const category = document.getElementById("category").value;
    // const priceRange = document.getElementById("price-range").value || undefined;
    // const sortBy = document.getElementById("sort-by").value || undefined;
    // const sortOrder = document.getElementById("sort-product").value || undefined;

    // Construct the query string with filtering and sorting parameters
    let queryString = `/api/v1/user/products?page=${pageNumber}&limit=8`;

    if (categoryId) {
      queryString += `&category=${categoryId}`;
    }

    // if (priceRange) {
    //   queryString += `&priceRange=${priceRange}`;
    // }
    // if (sortBy && sortOrder) {
    //   queryString += `&sortBy=${sortBy}&sortOrder=${sortOrder}`;
    // }

    if (searchQuery) {
      queryString += `&search=${searchQuery}`;
    }

    if (minPrice && maxPrice) {
      queryString += `&minPrice=${minPrice}&maxPrice=${maxPrice}`;
    }

    const response = await fetchData(queryString);
    // console.log(response)

    const data = response.data;
    const row = $(".product-grid");
    // console.log(data);

    row.empty();

    data.results.forEach((product) => {
      // console.log(product)

      const card = `
            <div class="showcase fade-in-animation">

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

            <p class="showcase-badge">${product.offer ? product.offer : ""}</p>

            <div class="showcase-actions">

                <button class="btn-action add-to-wishlist" data-productId='${
                  product._id
                }'>
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
                <del>₹ ${
                  product.originalPrice
                    ? product.originalPrice
                    : product.price * 2
                }</del>
            </div>

        </div>
        </div>
            `;
      // card.classList.add("fade-in-animation");
      row.append(card);
    });

    updatePaginationNumbers(data.previous, data.next, pageNumber, "shop");
  } catch (error) {
    console.error(error);
  }
};

function createPaginationButton(pageNumber, label, isActive, paginationType) {
  // console.log("pageNumber "+)
  var button = document.createElement("button");
  button.innerHTML = label;
  button.classList.add("paginationBtn");

  if (isActive) {
    button.classList.add("active");
  }

  button.addEventListener("click", function () {
    if (paginationType === "orders") {
      handlePaginationClick(pageNumber);
    } else if (paginationType === "shop") {
      handleProductPaginationClick(pageNumber);
    }
  });

  return button;
}

const updatePaginationNumbers = (
  previousPage,
  nextPage,
  currentPage,
  paginationType
) => {
  console.log(previousPage, nextPage, currentPage, paginationType);
  const paginationContainer = document.getElementById("pagination-container");
  if (paginationContainer) {
    paginationContainer.innerHTML = "";

    if (previousPage) {
      const previousButton = createPaginationButton(
        previousPage.page,
        "Previous",
        false,
        paginationType
      );
      paginationContainer.appendChild(previousButton);
    }

    const currentButton = createPaginationButton(
      currentPage,
      currentPage,
      true,
      paginationType
    );
    paginationContainer.appendChild(currentButton);

    if (nextPage) {
      const nextButton = createPaginationButton(
        nextPage.page,
        "Next",
        false,
        paginationType
      );
      paginationContainer.appendChild(nextButton);
    }
  }
};

async function fetchDataAndPaginate(url, currentPage, dataType) {
  try {
    const row = $(".product-grid");

    row.empty();

    const response = await fetchData(`${url}?page=${currentPage}&limit=8`);

    const data = response.data;

    if (dataType === "orders") {
      data.results.forEach((order) => {
        let statusColor;
        // // Determine the color based on the order status
        if (order.status === "pending") {
          statusColor = "warning";
        } else if (order.status === "delivered") {
          statusColor = "success";
        } else if (order.status === "shipped") {
          statusColor = "primary";
        } else if (order.status === "confirmed") {
          statusColor = "info";
        } else {
          statusColor = "danger";
        }

        const dateString = order.updatedAt;

        /// Splitting the string at the 'T' character
        const datePart = dateString.split("T")[0];

        const row = document.createElement("tr");

        const statusBadge = `<span class="badge badge-${statusColor}">${order.status}</span>`;
        const editBtn = `<label id="view" type="button"  class="badge badge-primary" data-order-id="${order.orderID}" onclick="handleOrders(event)"> <i class="mdi mdi-eye" muted></i></label>`;

        row.innerHTML = `
        <td> ${order.orderID} </td>
        <td> ₹${order.totalPrice} </td>
        <td> ${order.paymentMethod} </td>
        <td> ${datePart} </td>
        <td> ${statusBadge}</td>
        <td> ${editBtn}</td>
        `;
        tableBody.innerHTML += row.outerHTML;
      });
      updatePaginationNumbers(data.previous, data.next, currentPage, "orders");
    } else if (dataType === "shop") {
      data.results.forEach((product) => {
        console.log(product);

        const card = `
            <div class="showcase fade-in-animation">
      
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
      
            
            <p class="showcase-badge">${product.offer ? product.offer : ""}</p>
      
            <div class="showcase-actions">
      
                <button class="btn-action add-to-wishlist"  data-productId='${
                  product._id
                }'>
                    <ion-icon name="heart-outline" ></ion-icon>
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
                <del>₹ ${
                  product.originalPrice
                    ? product.originalPrice
                    : product.price * 2
                }</del>
            </div>
      
        </div>
        </div>
            `;
        // card.classList.add("fade-in-animation");
        row.append(card);
      });
      updatePaginationNumbers(data.previous, data.next, currentPage, "shop");
    }
  } catch (error) {
    console.error(error);
  }
}

// Initial render for products
if (window.location.pathname.includes("/shop")) {
  fetchDataAndPaginate("/api/v1/user/products", 1, "shop");
}

// PAGINATION END

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
  } else if (
    event.target.classList.contains("add-to-wishlist") ||
    event.target.closest(".add-to-wishlist")
  ) {
    const button = event.target.classList.contains("add-to-wishlist")
      ? event.target
      : event.target.closest(".add-to-wishlist");
      const productId = button.dataset.productid;
    saveToWishList(productId);
  }
});

// Function to handle the view details functionality
const handleViewDetails = (product) => {
  localStorage.setItem("product", JSON.stringify(product));
  $.ajax({
    type: "GET",
    url: `/api/v1/user/trending?productId=${product._id}`,
    success: function (response) {},
  });
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
      if (response.count > 0) {
        cartCount.style.display = "block";
        cartCountMobile.style.display = "block";
      } else {
        cartCount.style.display = "none";
        cartCountMobile.style.display = "none";
      }
    },
    error: function (error) {
      console.error("Error retrieving cart items count", error);
    },
  });
};

getCartCount();

// get the count of wishlist items
const getWishListCount = () => {
  $.ajax({
    type: "GET",
    url: "/api/v1/user/wishlist/items/count",
    success: function (response) {
      const wishListCount = document.querySelector("#wishlist_count");
      const wishListCountMobile = document.querySelector(
        "#wishlist_count_mobile"
      );
      wishListCount.textContent = response.count;
      wishListCountMobile.textContent = response.count;
      if (response.count > 0) {
        wishListCount.style.display = "block";
        wishListCountMobile.style.display = "block";
      } else {
        wishListCount.style.display = "none";
        wishListCountMobile.style.display = "none";
      }
    },
    error: function (error) {
      console.error("Error retrieving cart items count", error);
    },
  });
};

getWishListCount();

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
  updateButton();
};

// Get Cart

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
              <div class="cart-product fade-in-animation">
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
                   
                    ${
                      product.stock > 0
                        ? `<div class="product_qty">
                            <p>${product.price} * ${item.quantity} <span> ${
                            product.price * item.quantity
                          }</span></p>
                          </div>
                        </div>`
                        : ""
                    }
              </div>

              ${
                product.stock == 1
                  ? `<p class="noti"> <span>Hurry Up!  One product left</p>`
                  : ""
              }

              <div class="exit-btn">
                  <i></i>
              </div>

              ${
                product.stock > 0
                  ? `
                <form class="counter">
                  <button class="inc-btn" data-product-id="${product._id}">+</button>
                  <input  class="qty-input" name="quantity" type="text" minlength="1" value=${item.quantity} readonly />
                  <button class="dec-btn" data-product-id="${product._id}">-</button>
                </form>

                `
                  : `
                <div class="outOfStock">
                <span> Currently Out Of Stock </span>
                </div>
                
                `
              }

              <button class="saveForLater" data-product-id="${
                product._id
              }">Save for Later</button>

                


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
              } else {
                showToast();
                setToastMessage("warning", `Insufficient stock `);
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

            $(".saveForLater").on("click", function (e) {
              e.preventDefault();
              const productId = $(this).data("product-id");
              moveToWishlist(productId);
            });
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
        couponListElement.textContent = `₹${discountAmount}`;
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

// Whish list

const getWishList = () => {
  const row = $(".cart-items");

  $.ajax({
    type: "GET",
    url: "/api/v1/user/wishlist",
    success: function (response) {
      const { wishList } = response;
      const data = wishList.items;

      row.empty();

      if (data.length < 1) {
        const cart = `
        <div class="cart-items">
                        <div class="empty-cart">
                            <h3>Missing Wishlist items ?</h3>
                            <p>You have no items in your WishList. Start Adding</p>
                        </div>
                    </div>
        `;
        row.append(cart);
      }

      data.forEach((item) => {
        $.ajax({
          type: "GET",
          url: `/api/v1/admin/product/${item.product}`,
          success: function (response) {
            console.log(response);
            const { data } = response;
            const product = data.products;

            const singleItem = `
              <div class="cart-product fade-in-animation">
              <button class="exit-btn" onClick="handleRemoveWishListItem('${
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
                            <p><span>₹
                            ${product.price}</span></p>
                          </div>
                        </div>
              </div>

             
              <button class="addToCart" data-product-id="${
                product._id
              }">Move To Cart</button>

                <script>
                </script>

              

              <div class="exit-btn">
                  <i></i>
              </div>

              </div>
              
              `;

            row.append(singleItem);

            $(".addToCart").on("click", function (e) {
              e.preventDefault();
              const productId = $(this).data("product-id");
              moveToCart(productId);
            });
          },
        });
      });
    },
  });
};

const moveToCart = (productId) => {
  $.ajax({
    type: "POST",
    url: "/api/v1/user/cart",
    data: { productId: productId },
    success: function (response) {
      getCartCount();
      removeFromWishlist(productId);
    },
    error: function (error) {
      console.log("Error moving the product to the cart:", error);
      // Handle the error case if the product fails to move to the cart.
    },
  });
};

const moveToWishlist = (productId) => {
  $.ajax({
    type: "POST",
    url: "/api/v1/user/wishlist",
    data: { productId: productId },
    success: function (response) {
      getWishListCount();
      handleRemoveCartItem(productId);
    },
    error: function (error) {
      console.log("Error moving the product to the cart:", error);
      // Handle the error case if the product fails to move to the cart.
    },
  });
};

const removeFromWishlist = (productId) => {
  $.ajax({
    type: "DELETE",
    url: `/api/v1/user/wishlist/${productId}`,
    success: function (response) {
      // Remove the product from the wishlist UI dynamically
      const wishlistItem = $(`.cart-items [data-product-id="${productId}"]`);
      wishlistItem.fadeOut(400, function () {
        wishlistItem.remove();
      });

      // Update the wishlist count dynamically
      getWishListCount();
      getWishList();
      showToast();
      setToastMessage("Moved", "Item moved to the cart");
    },
    error: function (error) {
      console.log("Error removing the product from the wishlist:", error);
      // Handle the error case if the product fails to be removed from the wishlist.
    },
  });
};

const saveToWishList = (productId) => {
  $.ajax({
    type: "POST",
    url: "/api/v1/user/wishlist",
    data: {
      productId,
    },
    success: function (response) {
      console.log(response);
      getWishListCount();
      showToast();
      setToastMessage(response.status, response.message);
    },
  });
};

const handleRemoveWishListItem = (productId) => {
  const confirm = window.confirm("Do you want to remove this item ?");
  if (confirm) {
    $.ajax({
      type: "DELETE",
      url: `/api/v1/user/wishlist/${productId}`,
      success: function (response) {
        getWishList();
        getWishListCount();
        showToast();
        setToastMessage("Removed", "Item Removed from Wishlist");
      },
    });
  }
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
  // Find the index of the item with matching productId

  const confirm = window.confirm("Do you want to remove this item ?");
  if (confirm) {
    const cartItems = JSON.parse(localStorage.getItem("cartItems")) || [];
    const index = cartItems.findIndex((item) => item.productId === productId);

    if (index !== -1) {
      cartItems.splice(index, 1);
      localStorage.setItem("cartItems", JSON.stringify(cartItems));
    }

    $.ajax({
      type: "DELETE",
      url: `/api/v1/user/cart/${productId}`,
      success: function (response) {
        // await call();

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
      const data = cart.shippingAddress.filter((address) => !address.deleted);
      console.log("address");
      console.log(data);

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
                <p> ${address.address}, ${address.locality}, ${address.city},${address.state}, ${address.zipCode}</p>
            </div>
        </div>

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

const getAddress = () => {
  const row = $(".address_list");
  $.ajax({
    type: "GET",
    url: "/api/v1/user/cart",
    success: function (response) {
      const { cart } = response;
      const data = cart.shippingAddress.filter((address) => !address.deleted);
      row.empty();

      data.forEach((address) => {
        const addressList = `
        <div class="address-details">
        <div class="box">
       <div class="group">
       <div class="user-data">
           <p>${address.custName}</p>
           <p>${address.mobile}</p>
       </div>
       </div>
            <div class="address">
                <p> ${address.address}, ${address.locality}, ${address.city},${address.state}, ${address.zipCode}</p>
            </div>
        </div>

        <button data-address-id="${address._id}" onClick="editAddress(this)" >EDIT</button>
        &nbsp;&nbsp;&nbsp;
        <button data-address-id="${address._id}" onClick="removeAddress(this)" >REMOVE</button>

    </div>
    <script>

      function editAddress(button) {
        var addressId = button.getAttribute("data-address-id");
       
        console.log("Editing address with ID:", addressId);
        fetch(\`/api/v1/user/address/\${addressId}\`)
        .then(response => response.json())
        .then(data => {
          console.log(data);
          const res = data.address

          const  currentAddress = {
            custName: res.custName,
            mobile: res.mobile,
            address: res.address,
            city: res.city,
            state: res.state,
            locality: res.locality,
            zipCode: res.zipCode,
        }

        document.getElementById("name").value = currentAddress.custName;
        document.getElementById("phone").value = currentAddress.mobile;
        document.getElementById("zipCode").value = currentAddress.zipCode;
        document.getElementById("locality").value = currentAddress.locality;
        document.getElementById("address").value = currentAddress.address;
        document.getElementById("city").value = currentAddress.city;
        document.getElementById("state").value = currentAddress.state;

        

        var formPopupBg = document.querySelector('.form-popup-bg');
        formPopupBg.classList.add('is-visible');

        const form = document.getElementById("add-new-address");
        form.setAttribute("data-mode", "update");

       
          const addressIdInput = document.getElementById('addressIdInput');
          addressIdInput.value = addressId;
      
       
        })
        .catch(error => {
          // Handle any errors that occurred during the request
          console.error(error);
        });
      }


      function removeAddress(button) {
        var addressId = button.getAttribute("data-address-id");
        console.log("Deleting address with ID:", addressId);
        fetch(\`/api/v1/user/address/\${addressId}\`, {
          method: "DELETE",
        })
          .then(response => response.json())
          .then(data => {
            showToast();
             setToastMessage("Success", data.message);
             getAddress();
           
          })
          .catch(error => {
           
            console.error("Error deleting address:", error);
          });
      }
      
     
    </script>
        `;

        row.append(addressList);
      });
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
      // console.log(cart.totalPrice);

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
      const axiosResponse = await axios.post(
        "/api/v1/user/cart/initialPayment",
        {
          shippingAddress: addressId,
          paymentMethod: selectedPaymentOption,
          totalPrice,
        }
      );

      if (selectedPaymentOption === "cod") {
        const popUp = document.querySelector(".order-success-popup");
        const container = document.querySelector(".container.wrapper");
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
          handler: async function (response) {
            if (response.razorpay_payment_id) {
              const axiosResponse = await axios.post(
                "/api/v1/user/cart/placeOrder",
                {
                  orderID,
                  shippingAddress: addressId,
                  paymentMethod: selectedPaymentOption,
                  totalPrice,
                }
              );
              // console.log(axiosResponse);
              const popUp = document.querySelector(".order-success-popup");
              const container = document.querySelector(".container.wrapper");
              popUp.style.display = "block";

              container.classList.add("bg-blur");

              const overlay = document.querySelector(".overlay");
              overlay.style.opacity = "1";
              setTimeout(function () {
                container.classList.remove("overlay");
                container.classList.remove("bg-blur");
                window.location.href = "/myorders";
                overlay.style.opacity = "0";
              }, 4000);
            }
          },
          prefill: {
            email: "user@example.com",
            contact: "9876543210",
          },
          notes: {
            webhookUrl: "/api/v1/user/cart/razorpayWebhook",
          },
        };

        const razorpayInstance = new Razorpay(options);
        razorpayInstance.open();
      }
    } catch (error) {
      console.error("Error placing order:", error);
      // showToast()
      // setToastMessage("Failed", error.response.data.message);
      // console.log(error.response.data.message)
    }
  }
};

// getOrders function included in order.ejs
