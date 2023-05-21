const logout = async () => {
  const res = await axios.get("http://127.0.0.1:3000/api/v1/user/logout");
  if (res.data.status === "success") {
  location.reload(true)
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
  const row = $(".row.pb-3");
  
  $.ajax({
    type: "GET",
    url: "http://127.0.0.1:3000/api/v1/admin/products",
    success: function(products) {
      const { data } = products;
      
      data.products.forEach((product) => {
        const imagePath = product.image;
        const newPath = imagePath.replace("public", "");
    
        const card = `
          <div class="col-lg-4 col-md-6 col-sm-12 pb-1">
            <div class="card product-item border-0 mb-4 h-75">
              <div class="card-header product-img position-relative overflow-hidden bg-transparent border p-0">
                <img class="img-fluid w-100" src="${newPath}" alt="">
              </div>
              <div class="card-body border-left border-right text-center p-0 pt-4 pb-3">
                <h6 class="text-truncate mb-3">${product.name}</h6>
                <div class="d-flex justify-content-center">
                  <h6>${product.price}</h6>
                  <h6 class="text-muted ml-2"><del>$123.00</del></h6>
                </div>
              </div>
              <div class="card-footer d-flex justify-content-between bg-light border">
                <a href="#" class="btn btn-sm text-dark p-0 view-details" data-product='${JSON.stringify(product)}'>
                  <i class="fas fa-eye text-primary mr-1"></i>View Detail
                </a>
                <a href="#" class="btn btn-sm text-dark p-0 add-to-cart">
                  <i class="fas fa-shopping-cart text-primary mr-1"></i>Add To Cart
                </a>
              </div>
            </div>
          </div>
        `;
    
        row.append(card);
      });
    },
  });
};

// Handle click event on product card
$(document).on('click', '.view-details', function(event) {
  event.preventDefault();

  const product = JSON.stringify($(this).data('product'));

  // Store the product details in localStorage or sessionStorage
  localStorage.setItem('product', product);

  // Redirect to the product page
  window.location.href = '/details';
});

