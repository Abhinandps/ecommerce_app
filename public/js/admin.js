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
    console.log(users);
    const tableBody = document.querySelector("#user-table tbody");

    tableBody.innerHTML = "";

    users.forEach((user) => {
      const row = document.createElement("tr");
      const btn = `<label type="button"  class="badge ${
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
  const confirmed = window.confirm(
    `Are you sure you want to change the status ?`
  );

  if (confirmed) {
    $.ajax({
      type: "PUT",
      url: `http://127.0.0.1:3000/api/v1/admin/${userId}/block`,
      success: function (user) {
        const btn = $(`label[data-user-id="${user._id}"]`);
        btn.addClass(user.isBlock ? "badge-danger" : "badge-primary");
        getUsers();
      },
      error: function (err) {
        console.error(err);
      },
    });
  }
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
      },
      error: function (err) {
        console.error(err);
      },
    });
  });
};

const handleCategoryDelete = (event) => {
  const categoryID = event.target.dataset.userId;
  const confirmed = window.confirm(
    `Are you sure you want to delete the category ?`
  );

  if (confirmed) {
    $.ajax({
      type: "DELETE",
      url: `http://127.0.0.1:3000/api/v1/admin/category/${categoryID}`,
      success: function (response) {
        console.log(response);

        // Reload the categories table
        getAllCategories();
      },
      error: function (err) {
        console.error(err);
      },
    });
  }
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
    const res = await axios.get("http://127.0.0.1:3000/api/v1/admin/products");
    const { data } = res.data;
    const products = data.products;

    const tableBody = document.getElementsByTagName("tbody")[0];
    tableBody.innerHTML = "";

    products.forEach((product) => {
      const row = document.createElement("tr");
      const editBtn = `<label type="button"  class="badge badge-primary" data-product-id="${product._id}" onclick="handleProductFormEdit(event)"> <i class="mdi mdi-grease-pencil"></i></label>`;

      const dltBtn = `<label type="button"  class="badge badge-danger" data-product-id="${product._id}" onclick="handleProductDelete(event)"> <i class="mdi mdi-delete"></i> </label>`;
      // const imagePath = product.image;
      // const newPath = imagePath.replace("public", "");
      //

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
  } catch (err) {
    console.error(err);
  }
};

const handleProductFormEdit = (event) => {
  const productID = event.target.dataset.productId;
  const editForm = document.getElementById("edit-product-form");

  $.ajax({
    type: "GET",
    url: `http://127.0.0.1:3000/api/v1/admin/product/${productID}`,
    success: function (response) {
      const { products } = response.data;

      // Fetch the category name using the category ID
      // $.ajax({
      //   type: "GET",
      //   url: `http://127.0.0.1:3000/api/v1/admin/category/${products.category}`,
      //   success: function (response) {
      //     const categoryName = response.data.categories.name;
      //     editForm.querySelector("#product_dropdown").value = categoryName;
      //   },
      //   error: function (err) {
      //     console.error(err);
      //   },
      // });

      editForm.querySelector("#product_name").value = products.name;

      editForm.querySelector("#product_price").value = products.price;
      editForm.querySelector("#product_stock").value = products.stock;
      editForm.querySelector("#product_desc").value = products.description;

      const form = document.getElementById("product-form");
      form.style.display = "none";
      editForm.style.display = "block";
    },
    error: function (err) {
      console.error(err);
    },
  });

  // Listen for the edit form submission
  editForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const formData = new FormData(editForm);

    $.ajax({
      type: "PUT",
      url: `http://127.0.0.1:3000/api/v1/admin/product/${productID}`,
      data: formData,
      processData: false,
      contentType: false,
      success: async function (response) {
        console.log(response);

        // Hide the edit form and show the add form
        form.style.display = "block";
        editForm.style.display = "none";

        // Reload the categories table
        await getAllProducts();
      },
      error: function (err) {
        console.error(err);
      },
    });
  });
};

const handleProductDelete = (event) => {
  const productID = event.target.dataset.productId;
  const confirmed = window.confirm(
    `Are you sure you want to delete the category ?`
  );

  if (confirmed) {
    $.ajax({
      type: "DELETE",
      url: `http://127.0.0.1:3000/api/v1/admin/product/${productID}`,
      success: async function (response) {
        console.log(response);

        // Reload the products table
        await getAllProducts();
      },
      error: function (err) {
        console.error(err);
      },
    });
  }
};

// Orders

const getAllOrders = async () => {
  try {
    const res = await axios.get("/api/v1/admin/orders");
    const { data } = res.data;
    const orders = data.orders;
    // console.log(orders)
    // orders.forEach((order)=>{
    //   console.log(order)
    // })
    const tableBody = document.getElementsByTagName("tbody")[0];
    // tableBody.innerHTML = "";

    orders.forEach((order) => {
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

      order.items.forEach((item) => {
        // Find User
        $.ajax({
          type: "GET",
          url: `/api/v1/admin/users/${order.user}`,
          success: function (response) {
            const { data } = response;
            const userData = data;

            // Find product details
            $.ajax({
              type: "GET",
              url: `/api/v1/admin/product/${item.product}`,
              success: function (response) {
                const { data } = response;
                const { products } = data;
                const dateString = products.updatedAt;

                // Splitting the string at the 'T' character
                const datePart = dateString.split("T")[0];

                // console.log(userData.email);
                // console.log(products.name);
                // console.log(order.totalPrice);
                // console.log(datePart);
                // console.log(order.status);

                const row = document.createElement("tr");

                const statusBadge = `<span class="badge badge-${statusColor}">${order.status}</span>`;
                const editBtn = `<label id="view" type="button"  class="badge badge-primary" data-order-id="${order.orderID}" onclick="handleOrders(event)"> <i class="mdi mdi-eye" muted></i></label>`;

                row.innerHTML = `
                <td> ${products.name} </td>
                <td> ${userData.email} </td>
                <td> ₹${order.totalPrice} </td>
                <td> ${order.paymentMethod} </td>
                <td> ${datePart} </td>
                <td> ${statusBadge}</td>
                <td> ${editBtn}</td>
                `;
                tableBody.innerHTML += row.outerHTML;
              },
            });
            // console.log(item);
          },
        });
      });
    });
  } catch (err) {}
};

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
