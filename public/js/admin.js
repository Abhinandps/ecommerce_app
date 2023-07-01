const adminlogout = async () => {
  const res = await axios.get("/api/v1/admin/logout");
  if (res.data.status === "success") {
    location.reload(true);
  }
};

// Get All Users
const getUsers = async () => {
  try {
    const res = await axios.get("/api/v1/admin/users");
    const { data } = res.data;
    const users = data.users;
    const tableBody = document.querySelector("#user-table tbody");

    tableBody.innerHTML = "";

    users.forEach((user) => {
      const row = document.createElement("tr");
      const btn = `<label type="button" id="btn-confirm"  class="badge ${
        user.isBlock ? "badge-primary " : "badge-danger"
      }" data-user-id="${user._id}" onclick="handleClick(event)">${
        user.isBlock ? "Unblock" : "Block"
      }   </label>`;

      row.innerHTML = `
              <td>${user.username}</td>
              <td>${user.email}</td>
              <td>${user.mobile}</td>
              <td>${btn}</td>
            `;
      tableBody.appendChild(row);
    });
  } catch (err) {
    console.error(error);
  }
};

// Block and Unblock users
const handleClick = (event) => {
  const userId = event.target.dataset.userId;

  showCustomConfirmation(
    "Are you sure you want to Change this User status ?",
    function (result) {
      if (result) {
        $.ajax({
          type: "PUT",
          url: `/api/v1/admin/${userId}/block`,
          success: function (user) {
            const btn = $(`label[data-user-id="${user._id}"]`);
            btn.addClass(user.isBlock ? "badge-danger" : "badge-primary");

            showToast(`User Status Changed Successfully`, "info");

            getUsers();
          },
          error: function (err) {
            console.error(err);
          },
        });
      } else {
        // User canceled the action
        console.log("Deletion canceled");
      }
    }
  );
};

const handleFormEdit = (event) => {
  const categoryID = event.target.dataset.userId;

  const editForm = document.getElementById("edit-category-form");
  $.ajax({
    type: "GET",
    url: `/api/v1/admin/category/${categoryID}`,
    success: function (response) {
      const { categories } = response.data;
      console.log(categories);

      editForm.querySelector("#name").value = categories.name;
      editForm.querySelector("#description").value = categories.description;

      const form = document.getElementById("category-form");
      form.style.display = "none";
      editForm.style.display = "block";
    },
    error: function (err) {
      console.error(err);
    },
  });

  // Listen for the edit form submission
  editForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const formData = new FormData(editForm);
    const purpose = 'category'
   

    $.ajax({
      type: "PUT",
      url: `/api/v1/admin/category/${categoryID}?purpose=${purpose}`,
      data: formData,
      processData: false,
      contentType: false,
      success: function (response) {
        console.log(response);
        // Hide the edit form and show the add form
        form.style.display = "block";
        editForm.style.display = "none";

        // Reload the categories table
        getAllCategories();
        showToast(`Category Updated Successfully`, "success");
      },
      error: function (err) {
        console.error(err);
      },
    });
  });
};


const handleCategoryDelete = (event) => {
  const categoryID = event.target.dataset.userId;

  showCustomConfirmation(
    "Are you sure you want to delete this item?",
    function (result) {
      if (result) {
        $.ajax({
          type: "DELETE",
          url: `/api/v1/admin/category/${categoryID}`,
          success: function (response) {
            console.log(response);

            // Reload the categories table
            getAllCategories();
            showToast(`Category Deleted Successfully`, "danger");
          },
          error: function (err) {
            console.error(err);
          },
        });
      } else {
        console.log("Deletion canceled");
      }
    }
  );
};


// Categories
const getAllCategories = async () => {
  try {
    const res = await axios.get(
      "/api/v1/admin/categories"
    );
    const { data } = res.data;
    const categories = data.categories;
    const tableBody = document.querySelector("#user-table tbody");

    tableBody.innerHTML = "";

    categories.forEach((category) => {
      const row = document.createElement("tr");

      const editBtn = `<label type="button"  class="badge badge-primary" data-user-id="${category._id}" onclick="handleFormEdit(event)"> <i class="mdi mdi-grease-pencil"></i></label>`;

      const dltBtn = `<label type="button"  class="badge badge-danger" data-user-id="${category._id}" onclick="handleCategoryDelete(event)"> <i class="mdi mdi-delete"></i> </label>`;
      const imagePath = category.image;
      if (imagePath) {
        console.log(imagePath);
        const newPath = imagePath.replace("public", "");

        row.innerHTML = `
              <td><img src="${newPath}" style="width: auto; height: 70px; object-fit: fill; border-radius:0px;" /></td>
              <td>${category.name}</td>
              <td style="white-space: pre-wrap">${category.description}</td>
              <td>${editBtn}</td>
              <td>${dltBtn}</td>
            `;
        tableBody.appendChild(row);
      }
    });
  } catch (err) {
    console.error(err);
  }
};


// categories list in product page as dropdown

const getDropdownCategories = async () => {
  try {
    const res = await axios.get("/api/v1/admin/categories");
    const { data } = res.data;
    const categories = data.categories;

    const select = document.querySelector("#category-dropdown");
    categories.forEach((category) => {
      const option = document.createElement("option");
      option.setAttribute("value", category._id);
      option.textContent = category.name;
      select.appendChild(option);
    });
  } catch (err) {
    console.log(err);
  }
};

// get product dropdown

const getProductDropdown = async (categoryId) => {
  try {
    const res = await axios.get(
      `/api/v1/admin/categories/${categoryId}/products`
    );
    const data = res.data;
    const products = data.products;

    const select =
      document.querySelector("#product-dropdown") ||
      document.querySelector("[product-dropdown]");

    console.log(select);
    // Clear existing options
    select.innerHTML = "";

    products.forEach((product) => {
      const option = document.createElement("option");
      option.setAttribute("value", product._id);
      option.textContent = product.name;
      select.appendChild(option);
    });
  } catch (err) {
    console.log(err);
  }
};

const categoryDropdown = document.querySelector("#category-dropdown");

if (window.location.pathname === "/product/offer") {
  // Event listener for category dropdown change
  categoryDropdown.addEventListener("change", async (event) => {
    const categoryId = event.target.value;
    await getProductDropdown(categoryId);
  });
}

// Initial call to populate category dropdown
// getDropdownCategories();

// Products

const getAllProducts = async () => {
  try {
    let queryString = `/api/v1/admin/products?page=${pageNumber}&limit=5`;
    const res = await fetchData(queryString);
  } catch (err) {
    console.error(err);
  }
};

const handleProductFormEdit = (event) => {
  const productID = event.target.dataset.productId;
  const editForm = document.getElementById("edit-product-form");

  // fields
  const productName = editForm.querySelector("#product_name");
  const category = editForm.querySelector("#product_dropdown");
  const price = editForm.querySelector("#product_price");
  const stock = editForm.querySelector("#product_stock");
  const description = editForm.querySelector("#product_desc");

  // file error
  const fileError = document.querySelector(".file-error");

  $.ajax({
    type: "GET",
    url: `/api/v1/admin/product/${productID}`,
    success: async function (response) {
      const { products } = response.data;
      // console.log(products.category)

      // Fetch the category name using the category ID
      $.ajax({
        type: "GET",
        url: `/api/v1/admin/categories`,
        success: function (response) {
          const { categories } = response.data;

          // Populate the category dropdown options
          const categoryDropdown = editForm.querySelector("#product_dropdown");
          categoryDropdown.innerHTML = ""; // Clear existing options

          categories.forEach((category) => {
            const option = document.createElement("option");
            option.value = category._id;
            option.textContent = category.name;
            categoryDropdown.appendChild(option);
          });

          // Set the selected category
          const selectedCategory = categories.find(
            (category) => category._id === products.category
          );

          if (selectedCategory) {
            categoryDropdown.value = selectedCategory._id;
          }
        },
        error: function (err) {
          console.error(err);
        },
      });

      productName.value = products.name;
      // category.value= products.category;

      price.value = products.price;
      stock.value = products.stock;
      description.value = products.description;

      const cropNavigateBtn = document.getElementById("cropPageNavigate");
      console.log(cropNavigateBtn);

      const form = document.getElementById("product-form");
      form.style.display = "none";
      editForm.style.display = "block";
    },
    error: function (err) {
      console.log(error);
    },
  });

  openPopup("updateProductPopup");
  // const errorMsg = document.querySelectorAll(".error");

  let isValid = true;
  // Listen for the edit form submission
  editForm.addEventListener("submit", (e) => {
    e.preventDefault();

    clearErrorMessages();

    isValid = true; // Reset isValid before validating the form fields

    if (!productName.value.trim()) {
      showError("productName-error", "Please enter the product name.");
      isValid = false;
    }

    if (category.value === "") {
      showError("productCategory-error", "Please select a category.");
      isValid = false;
    }

    if (!price.value.trim()) {
      showError("productPrice-error", "Please enter the product price.");
      isValid = false;
    } else if (isNaN(price.value)) {
      showError("productPrice-error", "Price must be a valid number.");
      isValid = false;
    }

    if (!stock.value.trim()) {
      showError("productStock-error", "Please enter the product stock.");
      isValid = false;
    } else if (isNaN(stock.value)) {
      showError("productStock-error", "Stock must be a valid number.");
      isValid = false;
    } else if (parseInt(stock.value) < 1) {
      showError("productStock-error", "Stock must be at least 1.");
      isValid = false;
    }

    const descriptionValue = description.value.trim();
    if (!descriptionValue) {
      showError("productDesc-error", "Please enter the product description.");
      isValid = false;
    } else {
      const wordCount = countWords(descriptionValue);
      // const minWordCount = 50;
      const maxWordCount = 100;

      if (wordCount > maxWordCount) {
        showError(
          "productDesc-error",
          `Description can have a maximum of ${maxWordCount} words.`
        );
        isValid = false;
      }
    }
    try {
      if (isValid) {
        const formData = new FormData(editForm);
        console.log(formData);
        $.ajax({
          type: "PUT",
          url: `/api/v1/admin/product/${productID}`,
          data: formData,
          processData: false,
          contentType: false,
          success: function (response) {
            console.log(response);

            // Hide the edit form and show the add form
            form.style.display = "block";
            editForm.style.display = "none";

            // Reload the categories table
            getAllProducts();
            showToast(`Product Updated Successfully`, "warning");
          },
          error: function (error) {
            const message = error.responseJSON.message;
            if (message) {
              fileError.textContent = message;
            } else {
              fileError.textContent = "";
            }
          },
        });
      }
    } catch (error) {}
  });

  function showError(element, errorMessage) {
    const errorElement = document.querySelector(`#${element}`);
    errorElement.textContent = errorMessage;
  }

  function countWords(text) {
    const trimmedText = text.trim();
    const words = trimmedText.split(/\s+/);
    return words.length;
  }

  function clearErrorMessages() {
    const errorElements = document.querySelectorAll(".error");
    errorElements.forEach((element) => {
      element.textContent = "";
    });
  }
};

const handleProductDelete = (event) => {
  const productID = event.target.dataset.productId;

  showCustomConfirmation(
    "Are you sure you want to delete the product?",
    function (result) {
      if (result) {
        $.ajax({
          type: "DELETE",
          url: `/api/v1/admin/product/${productID}`,
          success: async function (response) {
            console.log(response);

            await getAllProducts();
          },
          error: function (err) {
            console.error(err);
          },
        });
      } else {
        console.log("Deletion canceled");
      }
    }
  );
};

const handleBannerFormEdit = (event) => {
  const bannerID = event.target.dataset.bannerId;
  const editForm = document.getElementById("edit-banner-form");

  const position = editForm.querySelector("#position");
  const title = editForm.querySelector("#title");
  const subTitle = editForm.querySelector("#subTitle");
  const text = editForm.querySelector("#text");
  const button = editForm.querySelector("#button");
  const links = editForm.querySelector("#links");
  const startDate = editForm.querySelector("#startDate");
  const endDate = editForm.querySelector("#endDate");
  const status = editForm.querySelector("#status");

  // file error
  const fileError = document.querySelector(".file-error");

  $.ajax({
    type: "GET",
    url: `/api/v1/admin/banners/${bannerID}`,
    success: async function (response) {
      const { banner } = response.data;
      console.log(banner.title);

      let sDate;
      let eDate;

      if (banner.startDate) {
        const dateString = banner.startDate;
        sDate = dateString.split("T")[0];
      }
      if (banner.endDate) {
        const dateString = banner.endDate;
        eDate = dateString.split("T")[0];
      }

      position.value = banner.position;
      title.value = banner.title;
      subTitle.value = banner.subTitle;
      text.value = banner.text;
      button.value = banner.button;
      links.value = banner.links;
      startDate.value = sDate;
      endDate.value = eDate;
      status.value = banner.status;

      const form = document.getElementById("banner-form");
      form.style.display = "none";
      editForm.style.display = "block";
    },
    error: function (err) {
      console.log(error);
    },
  });

  openPopup("updateBannerPopup");

  editForm.addEventListener("submit", (e) => {
    e.preventDefault();
    try {
      const formData = new FormData(editForm);
      const purpose = 'banner'

      $.ajax({
        type: "PUT",
        url: `/api/v1/admin/banners/${bannerID}?purpose=${purpose}`,
        data: formData,
        processData: false,
        contentType: false,
        success: async function (response) {
          console.log(response);

          // Hide the edit form and show the add form
          form.style.display = "block";
          editForm.style.display = "none";

          window.location.href = "/banners";
          showToast(`Banner Updated Successfully`, "warning");
        },
        error: function (error) {
          const message = error.responseJSON.message;
          if (message) {
            fileError.textContent = message;
          } else {
            fileError.textContent = "";
          }
        },
      });
    } catch (error) {
      console.log(error);
    }
  });
};

const handleBannerDelete = (event) => {
  const bannerID = event.target.dataset.bannerId;

  showCustomConfirmation(
    "Are you sure you want to delete the banner?",
    function (result) {
      if (result) {
        $.ajax({
          type: "DELETE",
          url: `/api/v1/admin/banners/${bannerID}`,
          success: async function (response) {
            window.location.href = "/banners";
          },
          error: function (err) {
            console.error(err);
          },
        });
      } else {
        console.log("Deletion canceled");
      }
    }
  );
};

// Coupon START

// Categories
const getAllCoupons = async () => {
  try {
    const res = await axios.get("/api/v1/admin/coupons");
    const data = res.data;
    console.log(data);
    // const categories = data.categories;
    const tableBody = document.querySelector("#user-table tbody");

    tableBody.innerHTML = "";

    data.forEach((coupon) => {
      const row = document.createElement("tr");

      const editBtn = `<label type="button"  class="badge badge-primary" data-user-id="${coupon._id}" onclick="handleCouponFormEdit(event)"> <i class="mdi mdi-grease-pencil"></i></label>`;

      const dltBtn = `<label type="button"  class="badge badge-danger" data-user-id="${coupon._id}" onclick="handleCouponDelete(event)"> <i class="mdi mdi-delete"></i> </label>`;

      const dateString = coupon.expiryDate;
      /// Splitting the string at the 'T' character
      const datePart = dateString.split("T")[0];

      row.innerHTML = `
              <td>${coupon.code}</td>
              <td>${
                coupon.isActive
                  ? '<b class="text-success">Active</b>'
                  : '<b class="text-danger">Expired</b>'
              }</td>
              <td>${coupon.value}</td>
              <td>${datePart}</td>
              <td>${coupon.minimumOrderValue}</td>
              <td>${editBtn}</td>
              <td>${dltBtn}</td>
            `;
      tableBody.appendChild(row);
    });
  } catch (err) {
    console.error(err);
  }
};

const handleCouponFormEdit = (event) => {
  const couponID = event.target.dataset.userId;
  console.log(couponID);

  const editForm = document.getElementById("edit-coupon-form");
  $.ajax({
    type: "GET",
    url: `/api/v1/admin/coupons/${couponID}`,
    success: function (response) {
      console.log(response);
      const data = response;

      const dateString = data.expiryDate;
      /// Splitting the string at the 'T' character
      const datePart = dateString.split("T")[0];

      editForm.querySelector("#code").value = data.code;
      editForm.querySelector("#value").value = data.value;
      editForm.querySelector("#expiryDate").value = datePart;

      editForm.querySelector("#minimumOrderValue").value =
        data.minimumOrderValue;

      const form = document.getElementById("coupon-form");
      form.style.display = "none";
      editForm.style.display = "block";
    },
    error: function (err) {
      console.error(err);
    },
  });

  // Listen for the edit form submission
  editForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const formData = {
      code: editForm.querySelector("#code").value,
      value: editForm.querySelector("#value").value,
      expiryDate: editForm.querySelector("#expiryDate").value,
      minimumOrderValue: parseInt(
        editForm.querySelector("#minimumOrderValue").value
      ),
    };

    $.ajax({
      type: "PATCH",
      url: `/api/v1/admin/coupons/${couponID}`,
      data: JSON.stringify(formData),
      contentType: "application/json",
      success: function (response) {
        console.log(response);

        // Hide the edit form and show the add form
        form.style.display = "block";
        editForm.style.display = "none";

        getAllCoupons();
        showToast(`Coupon Updated Successfully`, "success");
      },
      error: function (error) {
        const err = error.responseJSON;
        showToast(err.message.code ? err.message.code : err.message, "danger");
      },
    });
  });
};

const handleCouponDelete = (event) => {
  const couponID = event.target.dataset.userId;

  showCustomConfirmation(
    "Are you sure you want to delete this item?",
    function (result) {
      if (result) {
        $.ajax({
          type: "DELETE",
          url: `/api/v1/admin/coupons/${couponID}`,
          success: function (response) {
            console.log(response);

            getAllCoupons();
            showToast(`Coupon Deleted Successfully`, "danger");
          },
          error: function (err) {
            console.error(err);
          },
        });
      } else {
        console.log("Deletion canceled");
      }
    }
  );
};

// Coupon END

// --- HANDLE PAGINATION START

const fetchData = async (url) => {
  try {
    const response = await axios.get(url);
    return response.data;
  } catch (error) {
    throw new Error(error.message);
  }
};

// Orders

const handlePaginationClick = async (pageNumber) => {
  try {
    const orderId = document.getElementById("order-id").value;
    const orderStatus = document.getElementById("order-status").value;
    const paymentMethod = document.getElementById("payment-method").value;
    const startDate = document.getElementById("start-date").value;
    const endDate = document.getElementById("end-date").value;
    const sortBy = document.getElementById("sort-by").value;
    const sortOrder = document.getElementById("sort-order").value;

    // Construct the query string with sorting and filtering parameters
    let queryString = `/api/v1/admin/orders?page=${pageNumber}&limit=10`;

    if (orderId) {
      queryString += `&orderId=${orderId}`;
    }
    if (orderStatus) {
      queryString += `&orderStatus=${orderStatus}`;
    }
    if (paymentMethod) {
      queryString += `&paymentMethod=${paymentMethod}`;
    }
    if (startDate && endDate) {
      queryString += `&startDate=${startDate}&endDate=${endDate}`;
    }

    if (sortBy && sortOrder) {
      queryString += `&sortBy=${sortBy}&sortOrder=${sortOrder}`;
    }

    const response = await fetchData(queryString);

    const { data } = response;

    console.log(data);
    const tableBody = document.getElementsByTagName("tbody")[0];
    tableBody.innerHTML = "";
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

    updatePaginationNumbers(data.previous, data.next, pageNumber, "orders");
  } catch (error) {
    console.error(error);
  }
};

// Products

const handleProductPaginationClick = async (pageNumber, searchQuery) => {
  try {
    // Get filter and sort parameters for products
    // const category = document.getElementById("category").value;
    const priceRange = document.getElementById("price-range").value;
    const sortBy = document.getElementById("sort-by").value;
    const sortOrder = document.getElementById("sort-product").value;

    // Construct the query string with filtering and sorting parameters
    let queryString = `/api/v1/admin/products?page=${pageNumber}&limit=10`;

    // if (category) {
    //   queryString += `&category=${category}`;
    // }
    if (priceRange) {
      queryString += `&priceRange=${priceRange}`;
    }
    if (sortBy && sortOrder) {
      queryString += `&sortBy=${sortBy}&sortOrder=${sortOrder}`;
    }

    if (searchQuery) {
      queryString += `&search=${searchQuery}`;
    }

    const response = await fetchData(queryString);

    const { data } = response;

    const tableBody = document.getElementsByTagName("tbody")[0];
    tableBody.innerHTML = "";
    data.results.forEach((product) => {
      const row = document.createElement("tr");
      const editBtn = `<label type="button"  class="badge badge-primary" data-product-id="${product._id}" onclick="handleProductFormEdit(event)"> <i class="mdi mdi-grease-pencil"></i></label>`;
      const cropBtn = `<label type="button"  class="badge badge-info" data-product-id="${product._id}" onclick="handleProductCrop(event)"> <i class="mdi mdi-crop"></i></label>`;

      const dltBtn = `<label type="button"  class="badge badge-danger" data-product-id="${product._id}" onclick="handleProductDelete(event)"> <i class="mdi mdi-delete"></i> </label>`;

      $.ajax({
        type: "GET",
        url: `/api/v1/admin/category/${product.category}`,
        success: function (response) {
          const categoryName = response.data.categories.name;
          row.innerHTML = `
            <td>
              ${product.image.map((path, index) => {
                const newPath = path.replace("public", "");
                if (index === 0) {
                  return `<img width=20 src="${newPath}" />`;
                } else {
                  return `<img width=20 src="${newPath}" /> ${product.name}`;
                }
              })}
            </td>
  
            <td>${categoryName}</td>
            <td style="white-space: pre-wrap">${product.description}</td>
            <td>${product.stock}</td>
            <td>${product.price}</td>
            <td>${editBtn}</td>
            <td>${cropBtn}</td>
            <td>${dltBtn}</td>
          `;
          tableBody.innerHTML += row.outerHTML;
        },
        error: function (err) {
          console.error(err);
        },
      });
    });

    updatePaginationNumbers(data.previous, data.next, pageNumber, "products");
  } catch (error) {
    console.error(error);
  }
};

const handleProductCrop = (event) => {
  const productId = event.target.getAttribute("data-product-id");

  $.ajax({
    type: "GET",
    url: `/api/v1/admin/product/${productId}`,
    success: (response) => {
      const paths = response.data.products.image;
      const manipulatedPaths = paths.map((path) =>
        path.replace("public\\", "")
      );
      window.location.href = `/product-images?imagePath=${manipulatedPaths}`;
    },
  });
};


function createPaginationButton(pageNumber, label, isActive, paginationType) {
  var button = document.createElement("button");
  button.innerHTML = label;
  button.classList.add("btn", "btn-primary", "page-link");

  if (isActive) {
    button.classList.add("active");
  }

  button.addEventListener("click", function () {
    if (paginationType === "orders") {
      handlePaginationClick(pageNumber);
    } else if (paginationType === "products") {
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
    const response = await fetchData(`${url}?page=${currentPage}&limit=10`);
    const { data } = response;
    console.log(data.results);
    const tableBody = document.getElementsByTagName("tbody")[0];
    tableBody.innerHTML = "";

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
    } else if (dataType === "products") {
      data.results.forEach((product) => {
        const row = document.createElement("tr");
        const editBtn = `<label type="button"  class="badge badge-primary" data-product-id="${product._id}" onclick="handleProductFormEdit(event)"> <i class="mdi mdi-grease-pencil"></i></label>`;
        const cropBtn = `<label type="button"  class="badge badge-info" data-product-id="${product._id}" onclick="handleProductCrop(event)"> <i class="mdi mdi-crop"></i></label>`;

        const dltBtn = `<label type="button"  class="badge badge-danger" data-product-id="${product._id}" onclick="handleProductDelete(event)"> <i class="mdi mdi-delete"></i> </label>`;

        $.ajax({
          type: "GET",
          url: `/api/v1/admin/category/${product.category}`,
          success: function (response) {
            const categoryName = response.data.categories.name;
            row.innerHTML = `
          <td>
            ${product.image.map((path, index) => {
              const newPath = path.replace("public", "");
              if (index === 0) {
                return `<img width=20 src="${newPath}" />`;
              } else {
                return `<img width=20 src="${newPath}" /> ${product.name}`;
              }
            })}
          </td>

          <td>${categoryName}</td>
          <td style="white-space: pre-wrap">${product.description}</td>
          <td>${product.stock}</td>
          <td>${product.price}</td>
          <td>${editBtn}</td>
          <td>${cropBtn}</td>
          <td>${dltBtn}</td>
        `;
            tableBody.innerHTML += row.outerHTML;
          },
          error: function (err) {
            console.error(err);
          },
        });
      });
      updatePaginationNumbers(
        data.previous,
        data.next,
        currentPage,
        "products"
      );
    } else if (dataType === "banners") {
      data.results.forEach((banner) => {
        console.log(banner);

        const editBtn = `<label type="button"  class="badge badge-primary" data-banner-id="${banner._id}" onclick="handleBannerFormEdit(event)"> <i class="mdi mdi-grease-pencil"></i></label>`;

        const dltBtn = `<label type="button"  class="badge badge-danger" data-banner-id="${banner._id}" onclick="handleBannerDelete(event)"> <i class="mdi mdi-delete"></i> </label>`;

        let startDate;
        let endDate;
        if (banner.startDate) {
          const dateString = banner.startDate;
          startDate = dateString.split("T")[0];
        }
        if (banner.endDate) {
          const dateString = banner.endDate;
          endDate = dateString.split("T")[0];
        }

        const link = banner.image;
        const newPath = link.split("public")[1];

        row = `
        <tr>
        <td rowspan="2"> <img src="${newPath}" style="border-radius:0px; width:auto;"> </td>
        <td rowspan="2">${banner.position}</td>
        <td class="card-title font-weight-bold display-4 text-primary">${
          banner.title
        }</td>
        <td>${banner.text}</td>
        <td>${startDate}</td>
        <td>${banner.links}</td>
        <td>${editBtn}</td>
      </tr>
      <tr>
        <td class="">${banner.subTitle}</td>
        <td> <button class="badge badge-dark text-white">${
          banner.button
        }</button></td>
        <td>${endDate}</td>
        <td class="${
          banner.status === "active" ? "text-success" : "text-danger"
        }">${banner.status}</td>

        <td>${dltBtn}</td>
      </tr>
      
        `;
        tableBody.innerHTML += row;
      });
      updatePaginationNumbers(data.previous, data.next, currentPage, "banners");
    }
  } catch (error) {
    console.error(error);
  }
}

// Initial render for orders
if (window.location.pathname.includes("/orders")) {
  fetchDataAndPaginate("/api/v1/admin/orders", 1, "orders");
}

// Initial render for products
if (window.location.pathname.includes("/products")) {
  fetchDataAndPaginate("/api/v1/admin/products", 1, "products");
}

// Initial render for products
if (window.location.pathname.includes("/banners")) {
  fetchDataAndPaginate("/api/v1/admin/banners", 1, "banners");
}

// --- HANDLE PAGINATION END

// ----OFFERS START----

// Category Offers

const getAllCategoryOffers = async () => {
  try {
    const res = await axios.get("/api/v1/admin/category-offers");
    const categoriesOff = res.data.categoryOffers;

    const tableBody = document.querySelector("#user-table tbody");

    tableBody.innerHTML = "";

    categoriesOff.forEach((category) => {
      const row = document.createElement("tr");

      const editBtn = `<label type="button"  class="badge badge-primary" data-user-id="${category.id}" onclick="handleCategoryOfferFormEdit(event)"> <i class="mdi mdi-grease-pencil"></i></label>`;

      const dltBtn = `<label type="button"  class="badge badge-danger" data-user-id="${category.categoryId}" onclick="handleCategoryOfferDelete(event)"> <i class="mdi mdi-delete"></i> </label>`;

      row.innerHTML = `
              <td>${category.categoryName}</td>
              <td style="white-space: pre-wrap">${category.offer}</td>
              <td>${editBtn}</td>
              <td>${dltBtn}</td>
            `;
      tableBody.appendChild(row);
    });
  } catch (err) {
    console.error(err);
  }
};

const addCategoryOffer = () => {
  const cardBody = document.getElementById("card-body");

  const form = document.getElementById("category-form");

  const categoryError = document.getElementsByClassName("category-error")[0];

  const category = form.querySelector("#category-dropdown");
  const discount = form.querySelector("#value");
  const description = form.querySelector("#category-desc");

  console.log(category, discount, description);

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    try {
      const formData = {
        categoryId: category.value,
        discount: discount.value,
        description: description.value,
      };

      $.ajax({
        url: "/api/v1/admin/category-offers",
        type: "POST",
        data: formData,
        success: function (response) {
          showToast("OFFER Added Successfully", "success");
          getAllCategoryOffers();
          console.log(response);
        },
        error: function (error) {
          showToast(error.responseJSON.message, "danger");
          const name = error.responseJSON.error;
          if (name) {
            categoryError.innerHTML = name;
          } else {
            categoryError.innerHTML = "";
          }
        },
      });
    } catch (error) {
      const name = error.response.data.message.name;
      if (name) {
        nameError.innerHTML = name;
      } else {
        nameError.innerHTML = "";
      }
    }
  });
};

const handleCategoryOfferFormEdit = (event) => {
  const form = document.getElementById("category-form");

  const categoryID = event.target.dataset.userId;
  const editForm = document.getElementById("edit-category-form");

  $.ajax({
    type: "GET",
    url: `/api/v1/admin/category-offers/${categoryID}`,
    success: function (response) {
      const categoryOff = response.categoryOffer;

      // Fetch the category name using the category ID
      $.ajax({
        type: "GET",
        url: `/api/v1/admin/categories`,
        success: function (response) {
          console.log(response);
          console.log(response);
          const { categories } = response.data;

          // Populate the category dropdown options
          const categoryDropdown = editForm.querySelector("#categoryId");
          categoryDropdown.innerHTML = "";

          categories.forEach((category) => {
            const option = document.createElement("option");
            option.value = category._id;
            option.textContent = category.name;
            categoryDropdown.appendChild(option);
          });

          // Set the selected category
          const selectedCategory = categories.find(
            (category) => category._id === categoryOff.categoryId
          );

          if (selectedCategory) {
            console.log(selectedCategory._id);
            categoryDropdown.value = selectedCategory._id;
            showToast(`You can Edit Now`, "info");
          }
        },
        error: function (err) {
          console.log(err);
        },
      });

      editForm.querySelector("#category-desc").value = categoryOff.offer;
      editForm.querySelector("#discount").value = categoryOff.discount;

      const form = document.getElementById("category-form");
      form.style.display = "none";
      editForm.style.display = "block";
    },
    error: function (err) {
      console.error(err);
    },
  });
  // Listen for the edit form submission
  editForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const category = editForm.querySelector("#categoryId").value;
    const discount = editForm.querySelector("#discount").value;
    const description = editForm.querySelector("#category-desc").value;

    const formData = {
      category,
      discount,
      description,
    };

    $.ajax({
      type: "PUT",
      url: `/api/v1/admin/category-offers/${category}`,
      data: JSON.stringify(formData),
      processData: true,
      contentType: "application/json",
      success: function (response) {
        // Hide the edit form and show the add form
        form.style.display = "block";
        editForm.style.display = "none";

        // Reload the categories table
        showToast(`Category Updated Successfully`, "success");
        getAllCategoryOffers();
      },
      error: function (err) {
        // console.error(err);
        showToast(err.responseJSON.message, "danger");
      },
    });
  });
};

const handleCategoryOfferDelete = (event) => {
  const categoryID = event.target.dataset.userId;
  console.log(categoryID);

  showCustomConfirmation(
    "Are you sure you want to delete the Category Offer?",
    function (result) {
      if (result) {
        $.ajax({
          type: "DELETE",
          url: `/api/v1/admin/category-offers/${categoryID}`,
          success: async function (response) {
            console.log(response);
            showToast(`OFFER Deleted Successfully`, "danger");
            // window.location.href = "/category/offers";
            getAllCategoryOffers();
          },
          error: function (err) {
            console.error(err);
          },
        });
      } else {
        console.log("Deletion canceled");
      }
    }
  );
};

// Product Off

const getAllProductOffers = async () => {
  try {
    const res = await axios.get("/api/v1/admin/product-offers");
    const productOff = res.data.ProductOffers;
    console.log(productOff);

    const tableBody = document.querySelector("#user-table tbody");

    tableBody.innerHTML = "";

    console.log(productOff);

    productOff.forEach((offer) => {
      const row = document.createElement("tr");

      const editBtn = `<label type="button"  class="badge badge-primary" data-user-id="${offer.id}" onclick="handleProductOfferFormEdit(event)"> <i class="mdi mdi-grease-pencil"></i></label>`;

      const dltBtn = `<label type="button"  class="badge badge-danger" data-user-id="${offer.productId}" onclick="handleProductOfferDelete(event)"> <i class="mdi mdi-delete"></i> </label>`;

      // <td>${offer.product}</td>
      row.innerHTML = `
              <td style="white-space: pre-wrap">${offer.product}</td>
              <td>${offer.offer}</td>
              <td>${offer.categoryOff} <br> <small class="text-warning">${offer.categoryName}</small> </td>
              <td class="text-info">₹${offer.productPrice}</td>
              <td>₹<del class="text-primary">${offer.originalPrice}</del></td>
              <td>${editBtn}   ${dltBtn}</td>
            `;

      tableBody.appendChild(row);
    });
  } catch (err) {
    console.error(err);
  }
};

const addProductOffer = () => {
  const cardBody = document.getElementById("card-body");

  const form = document.getElementById("category-form");

  const categoryError = document.getElementsByClassName("category-error")[0];

  const category = form.querySelector("#category-dropdown");
  const product = form.querySelector("#product-dropdown");
  const discount = form.querySelector("#value");

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    try {
      const formData = {
        productId: product.value,
        categoryId: category.value,
        discount: discount.value,
      };

      console.log(formData);

      $.ajax({
        url: "/api/v1/admin/product-offers",
        type: "POST",
        data: formData,
        success: function (response) {
          showToast("OFFER Added Successfully", "success");
          getAllProductOffers();
          console.log(response);
        },
        error: function (error) {
          showToast(error.responseJSON.message, "danger");
          const name = error.responseJSON.error;
          if (name) {
            categoryError.innerHTML = name;
          } else {
            categoryError.innerHTML = "";
          }
        },
      });
    } catch (error) {
      const name = error.response.data.message.name;
      if (name) {
        nameError.innerHTML = name;
      } else {
        nameError.innerHTML = "";
      }
    }
  });
};

const handleProductOfferFormEdit = (event) => {
  const form = document.getElementById("category-form");

  const productID = event.target.dataset.userId;
  const editForm = document.getElementById("edit-category-form");

  $.ajax({
    type: "GET",
    url: `/api/v1/admin/product-offers/${productID}`,
    success: function (response) {
      const productOff = response.productOffer;

      // Fetch the category name using the category ID
      $.ajax({
        type: "GET",
        url: `/api/v1/admin/categories`,
        success: function (response) {
          const { categories } = response.data;

          // Populate the category dropdown options
          const categoryDropdown = editForm.querySelector("#category-dropdown");

          categoryDropdown.innerHTML = "";

          categories.forEach(async (category) => {
            const option = document.createElement("option");
            option.value = category._id;
            option.textContent = category.name;
            categoryDropdown.appendChild(option);
          });

          // Set the selected category
          const selectedCategory = categories.find(
            (category) => category._id === productOff.CategoryId
          );

          if (selectedCategory) {
            categoryDropdown.value = selectedCategory._id;
            categoryDropdown.disabled = true;
            showToast(`You can Edit Now`, "info");
          }

          $.ajax({
            type: "GET",
            url: `/api/v1/admin/categories/${selectedCategory._id}/products`,
            success: function (res) {
              const data = res.products;

              console.log(data);

              const select = document.querySelector("[product-dropdown]");

              // // Clear existing options
              select.innerHTML = "";

              data.forEach((product) => {
                const option = document.createElement("option");
                option.setAttribute("value", product._id);
                option.textContent = product.name;
                select.appendChild(option);
              });

              const selectedCategory = data.find(
                (product) => product._id === productOff.productId
              );

              if (selectedCategory) {
                select.value = selectedCategory._id;
                select.disabled = true;
              }
            },
          });
        },
        error: function (err) {
          console.log(err);
        },
      });

      console.log(productOff.offer, productOff.discount);

      // editForm.querySelector("#category-desc").value = productOff.offer;
      editForm.querySelector("#discount").value = productOff.discount;

      const form = document.getElementById("category-form");
      form.style.display = "none";
      editForm.style.display = "block";
    },
    error: function (err) {
      console.error(err);
    },
  });

  // Listen for the edit form submission
  editForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const category = editForm.querySelector("#category-dropdown").value;
    const product = editForm.querySelector("#product-dropdown").value;
    const discount = editForm.querySelector("#discount").value;
    const description = "";

    const formData = {
      category,
      product,
      discount,
      description,
    };

    console.log(formData);

    $.ajax({
      type: "PUT",
      url: `/api/v1/admin/product-offers/${product}`,
      data: JSON.stringify(formData),
      processData: true,
      contentType: "application/json",
      success: function (response) {
        // Hide the edit form and show the add form
        form.style.display = "block";
        editForm.style.display = "none";

        // Reload the categories table
        showToast(`Category Updated Successfully`, "success");
        getAllProductOffers();
      },
      error: function (err) {
        // console.error(err);
        showToast(err.responseJSON.message, "danger");
      },
    });
  });
};

const handleProductOfferDelete = (event) => {
  const productID = event.target.dataset.userId;

  showCustomConfirmation(
    "Are you sure you want to delete the Product Offer?",
    function (result) {
      if (result) {
        $.ajax({
          type: "DELETE",
          url: `/api/v1/admin/product-offers/${productID}`,
          success: async function (response) {
            showToast(`OFFER Deleted Successfully`, "danger");
            // window.location.href = "/category/offers";
            getAllProductOffers();
          },
          error: function (err) {
            console.error(err);
          },
        });
      } else {
        console.log("Deletion canceled");
      }
    }
  );
};

// ----OFFERS END----

const handleOrders = (event) => {
  const orderID = event.target.dataset.orderId;
  $.ajax({
    type: "GET",
    url: `api/v1/admin/orders/${orderID}`,
    success: function (response) {
      const { data } = response;
      const { order } = data;
      localStorage.setItem("order", JSON.stringify(order));
      // Redirect to the order page
      window.location.href = "/order";
    },
  });
};

// Apply Filters button click event
if (document.getElementById("apply-filters")) {
  document
    .getElementById("apply-filters")
    .addEventListener("click", function () {
      handlePaginationClick(1);
    });
}

// Apply Sort button click event
if (document.getElementById("apply-sort")) {
  document.getElementById("apply-sort").addEventListener("click", function () {
    handlePaginationClick(1);
  });
}

// Banners

const getAllBanners = async () => {
  try {
    let queryString = `/api/v1/admin/banners?page=1&limit=5`;
    await fetchData(queryString);
  } catch (err) {
    console.error(err);
  }
};

// Download Report

// Block and Unblock users
const handleReportDownload = () => {
  showCustomConfirmation(
    "Are you sure you want to Change this User status ?",
    function (result) {
      if (result) {
        $.ajax({
          type: "PUT",
          url: `/api/v1/admin/${userId}/block`,
          success: function (user) {
            const btn = $(`label[data-user-id="${user._id}"]`);
            btn.addClass(user.isBlock ? "badge-danger" : "badge-primary");

            showToast(`User Status Changed Successfully`, "info");

            getUsers();
          },
          error: function (err) {
            console.error(err);
          },
        });
      } else {
        // User canceled the action
        console.log("Deletion canceled");
      }
    }
  );
};

// ------------------------------------------------------------------

function showToast(message, type) {
  const toastContainer = document.getElementById("toastContainer");

  const toast = document.createElement("div");
  toast.className = `toast p-3 position-fixed top-100 end-0 z-index-100000`;
  toast.style.zIndex = "20000";
  toast.style.top = "100px";
  toast.style.right = "25px";

  toast.classList.add(`bg-${type}`);
  toast.textContent = message;

  toastContainer.appendChild(toast);

  setTimeout(() => {
    toast.classList.add("show");
    setTimeout(() => {
      toast.classList.remove("show");
      toast.remove();
    }, 3000); // Adjust the duration as needed
  }, 100); // Delay the toast appearance if needed
}

// Function to open the confirmation dialog
function openConfirmationDialog() {
  $("#confirmationDialog").modal("show");
}

// Function to handle the confirmation action
function confirmAction() {
  console.log("Confirmed");

  $("#confirmationDialog").modal("hide");
}

function showCustomConfirmation(message, callback) {
  var modalHtml =
    '<div class="modal fade" id="customConfirmationModal" tabindex="-1" role="dialog">' +
    '<div class="modal-dialog" role="document">' +
    '<div class="modal-content">' +
    '<div class="modal-header">' +
    '<h5 class="modal-title">Confirmation</h5>' +
    '<button type="button" class="close" data-dismiss="modal" aria-label="Close">' +
    '<span aria-hidden="true">&times;</span>' +
    "</button>" +
    "</div>" +
    '<div class="modal-body">' +
    "<p>" +
    message +
    "</p>" +
    "</div>" +
    '<div class="modal-footer">' +
    '<button type="button" class="btn btn-secondary" data-dismiss="modal">Cancel</button>' +
    '<button type="button" class="btn btn-primary" id="confirmButton">Confirm</button>' +
    "</div>" +
    "</div>" +
    "</div>" +
    "</div>";

  $("body").append(modalHtml);

  $("#customConfirmationModal").modal("show");

  $("#confirmButton").on("click", function () {
    callback(true);
    $("#customConfirmationModal").modal("hide");
  });

  $("#customConfirmationModal").on("hidden.bs.modal", function () {
    $(this).remove();
  });
}

// ------------------

function openConfirmationDialog() {
  $("#confirmationDialog").modal("show");
}

// Function to handle the confirmation action
function confirmAction() {
  console.log("Confirmed");
  $("#confirmationDialog").modal("hide");
}

function showCustomPopup(message, callback) {
  var modalHtml = `<div class="modal fade" id="customConfirmationModal" tabindex="-1" role="dialog" aria-labelledby="confirmationDialogTitle" aria-hidden="true">
    <div class="modal-dialog" role="document">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title" id="confirmationDialogTitle">Confirmation</h5>
          <button type="button" class="close" data-dismiss="modal" aria-label="Close">
            <span aria-hidden="true">&times;</span>
          </button>
        </div>
        <div class="modal-body">
          <div class="form-group">
            <label for="filterOptions">Filter Options</label>
            <select class="form-control" id="filterOptions">
              <option value="">-- Select an option --</option>
              <option value="sales">Sales</option>
              <option value="stock">Stocks</option>
              <option value="cancelled">Cancellation</option>
            
            </select>
            
          </div>

          <div class="modal-body">
          <div class="form-group">
            <label for="startDate">Start Date</label>
            <input type="date" class="form-control" id="startDate" required>
          </div>
          <div class="form-group">
            <label for="endDate">End Date</label>
            <input type="date" class="form-control" id="endDate" required>
          </div>
          <div class="form-group">
            <label for="downloadType">Download Type</label>
            <select class="form-control" id="downloadType">
              <option value="pdf">PDF</option>
              <option value="csv">CSV</option>
            </select>
          </div>
          <div class="invalid-feedback" id="filterOptionsError"></div>
        </div>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-secondary" data-dismiss="modal">Cancel</button>
          <button type="button" class="btn btn-primary" id="downloadButton">Download</button>
        </div>
      </div>
    </div>
  </div>`;

  $("body").append(modalHtml);

  $("#customConfirmationModal").modal("show");

  $("#downloadButton").on("click", function () {
    var startDate = $("#startDate").val();
    var endDate = $("#endDate").val();
    var downloadType = $("#downloadType").val();
    var selectedOption = $("#filterOptions").val();

    if (selectedOption !== "stock") {
      // Perform validation for startDate, endDate, downloadType
      if (!startDate || !endDate) {
        // Handle validation errors
        $("#filterOptionsError").text("Please select all options.");
        alert("Please select all options");
        console.log("called");
        return;
      }
    }

    if (!startDate && !endDate && downloadType) {
      console.log("Values : " + startDate, endDate, downloadType);
      downloadReport(null, null, downloadType);
    } else {
      downloadReport(startDate, endDate, downloadType);
    }

    $("#customConfirmationModal").modal("hide");
  });

  $("#customConfirmationModal").on("hidden.bs.modal", function () {
    $(this).remove();
  });
}

// Function to download the report
function downloadReport(startDate, endDate, downloadType) {
  // Validate the selected filter option
  var selectedOption = $("#filterOptions").val();
  if (!selectedOption) {
    $("#filterOptionsError").text("Please select an option.");
    return;
  }

  // Perform the download action based on the selected option
  if (selectedOption === "sales") {
    console.log(
      "Downloading sales report..." + startDate,
      endDate,
      downloadType
    );
    getReport(startDate, endDate, downloadType, selectedOption);
  } else if (selectedOption === "stock") {
    console.log("Downloading stocks report...");

    getReport(null, null, downloadType, selectedOption);
  } else if (selectedOption === "cancelled") {
    console.log(
      "Downloading cancelled report..." + startDate,
      endDate,
      downloadType
    );
    getReport(startDate, endDate, downloadType, selectedOption);
  } else if (selectedOption === "return") {
    console.log("Downloading return report...");
  }

  // Close the confirmation dialog
  $("#confirmationDialog").modal("hide");
}

// Add a click event listener to open the confirmation dialog
$(document).on("click", "#exportButton", function () {
  showCustomPopup("Are you sure you want to proceed?", confirmAction);
});

// function getReport(startDate, endDate, downloadType,selectedOption) {
//   var data = {
//     startDate: startDate,
//     endDate: endDate,
//     downloadType: downloadType
//   };

//   var url = `/api/v1/admin/${selectedOption}/report`;
//   url += '?' + $.param(data);

//   $.ajax({
//     type: "GET",
//     url: `/api/v1/admin/${selectedOption}/report`,
//     data,
//     responseType: "arraybuffer", // Set the response type to arraybuffer
//     success: function(response) {
//       // Create a Blob object from the response data
//       var blob = new Blob([response], { type: "application/pdf" });

//       // Create a download link for the Blob
//       var downloadLink = document.createElement("a");
//       downloadLink.href = URL.createObjectURL(blob);
//       downloadLink.download = "report.pdf";
//       downloadLink.click();
//     },
//   });
// }

async function getReport(startDate, endDate, downloadType, selectedOption) {
  try {
    const response = await axios.get(`/api/v1/admin/${selectedOption}/report`, {
      responseType: "blob",
      params: {
        startDate: startDate,
        endDate: endDate,
        downloadType: downloadType,
      },
    });

    let contentType;
    let fileExtension;
    if (downloadType == "csv") {
      contentType =
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";
      fileExtension = "xlsx";
    } else if (downloadType === "pdf") {
      contentType = "application/pdf";
      fileExtension = "pdf";
    } else {
      throw new Error("Invalid download type");
    }

    const blob = new Blob([response.data], { type: contentType });

    // Create a download link element
    const a = document.createElement("a");
    a.href = window.URL.createObjectURL(blob);
    a.download = `Report.${fileExtension}`;
    a.style.display = "none";

    // Append the link element to the document body
    document.body.appendChild(a);

    // Programmatically trigger the click event to start the download
    a.click();

    // Remove the link element from the document body
    document.body.removeChild(a);
  } catch (error) {
    console.error("Error downloading file:", error);
  }
}
