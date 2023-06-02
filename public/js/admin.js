const adminlogout = async () => {
  const res = await axios.get("http://127.0.0.1:3000/api/v1/admin/logout");
  if (res.data.status === "success") {
    location.reload(true);
  }
};

// Get All Users
const getUsers = async () => {
  try {
    const res = await axios.get("http://127.0.0.1:3000/api/v1/admin/users");
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
          url: `http://127.0.0.1:3000/api/v1/admin/${userId}/block`,
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
    url: `http://127.0.0.1:3000/api/v1/admin/category/${categoryID}`,
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

    $.ajax({
      type: "PUT",
      url: `http://127.0.0.1:3000/api/v1/admin/category/${categoryID}`,
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
          url: `http://127.0.0.1:3000/api/v1/admin/category/${categoryID}`,
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
      "http://127.0.0.1:3000/api/v1/admin/categories"
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
    const res = await axios.get(
      "http://127.0.0.1:3000/api/v1/admin/categories"
    );
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

// Products

const getAllProducts = async () => {
  try {
    let queryString = `/api/v1/admin/products?page=${pageNumber}&limit=5`;

    const res = await fetchData(queryString);
    // const { data } = res.data;
    // const products = data.products;
    console.log(res);

    const tableBody = document.getElementsByTagName("tbody")[0];
    tableBody.innerHTML = "";

    // products.forEach((product) => {
    //   const row = document.createElement("tr");
    //   const editBtn = `<label type="button"  class="badge badge-primary" data-product-id="${product._id}" onclick="handleProductFormEdit(event)"> <i class="mdi mdi-grease-pencil"></i></label>`;

    //   const dltBtn = `<label type="button"  class="badge badge-danger" data-product-id="${product._id}" onclick="handleProductDelete(event)"> <i class="mdi mdi-delete"></i> </label>`;
    //   // const imagePath = product.image;
    //   // const newPath = imagePath.replace("public", "");
    //   //

    //   $.ajax({
    //     type: "GET",
    //     url: `http://127.0.0.1:3000/api/v1/admin/category/${product.category}`,
    //     success: function (response) {
    //       const categoryName = response.data.categories.name;
    //       row.innerHTML = `
    //       <td>
    //         ${product.image.map((path, index) => {
    //           const newPath = path.replace("public", "");
    //           if (index === 0) {
    //             return `<img width=20 src="${newPath}" />`;
    //           } else {
    //             return `<img width=20 src="${newPath}" /> ${product.name}`;
    //           }
    //         })}
    //       </td>

    //       <td>${categoryName}</td>
    //       <td style="white-space: pre-wrap">${product.description}</td>
    //       <td>${product.stock}</td>
    //       <td>${product.price}</td>
    //       <td>${editBtn}</td>
    //       <td>${dltBtn}</td>
    //     `;
    //       tableBody.innerHTML += row.outerHTML;
    //     },
    //     error: function (err) {
    //       console.error(err);
    //     },
    //   });
    // });
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
    url: `http://127.0.0.1:3000/api/v1/admin/product/${productID}`,
    success: async function (response) {
      const { products } = response.data;
      // console.log(products.category)

      // Fetch the category name using the category ID
      $.ajax({
        type: "GET",
        url: `http://127.0.0.1:3000/api/v1/admin/categories`,
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
        $.ajax({
          type: "PUT",
          url: `http://127.0.0.1:3000/api/v1/admin/product/${productID}`,
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
          url: `http://127.0.0.1:3000/api/v1/admin/product/${productID}`,
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

    updatePaginationNumbers(data.previous, data.next, pageNumber,"orders");
  } catch (error) {
    console.error(error);
  }
};


// Products

const handleProductPaginationClick = async (pageNumber,searchQuery) => {
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
  
        const dltBtn = `<label type="button"  class="badge badge-danger" data-product-id="${product._id}" onclick="handleProductDelete(event)"> <i class="mdi mdi-delete"></i> </label>`;
       
  
        $.ajax({
          type: "GET",
          url: `http://127.0.0.1:3000/api/v1/admin/category/${product.category}`,
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
            <td>${dltBtn}</td>
          `;
            tableBody.innerHTML += row.outerHTML;
          },
          error: function (err) {
            console.error(err);
          },
        });
      });

    updatePaginationNumbers(data.previous, data.next, pageNumber,"products");
  } catch (error) {
    console.error(error);
  }
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


const updatePaginationNumbers = (previousPage, nextPage, currentPage, paginationType) => {
  const paginationContainer = document.getElementById("pagination-container");
  if (paginationContainer) {
    paginationContainer.innerHTML = "";

    if (previousPage) {
      const previousButton = createPaginationButton(previousPage.page, "Previous", false, paginationType);
      paginationContainer.appendChild(previousButton);
    }

    const currentButton = createPaginationButton(currentPage, currentPage, true, paginationType);
    paginationContainer.appendChild(currentButton);

    if (nextPage) {
      const nextButton = createPaginationButton(nextPage.page, "Next", false, paginationType);
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

      const dltBtn = `<label type="button"  class="badge badge-danger" data-product-id="${product._id}" onclick="handleProductDelete(event)"> <i class="mdi mdi-delete"></i> </label>`;
     

      $.ajax({
        type: "GET",
        url: `http://127.0.0.1:3000/api/v1/admin/category/${product.category}`,
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
          <td>${dltBtn}</td>
        `;
          tableBody.innerHTML += row.outerHTML;
        },
        error: function (err) {
          console.error(err);
        },
      });
    });
      updatePaginationNumbers(data.previous, data.next, currentPage, "products");
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


// --- HANDLE PAGINATION END



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
if(document.getElementById("apply-filters")){
  document.getElementById("apply-filters").addEventListener("click", function () {
    handlePaginationClick(1);
  });
}

// Apply Sort button click event
if(document.getElementById("apply-sort")){

  document.getElementById("apply-sort").addEventListener("click", function () {
    handlePaginationClick(1);
  });
}




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
