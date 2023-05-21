// ADMIN

exports.getAdminLogin = (req, res) => {
  if (req.admin) {
    res.redirect("/dashboard");
  } else {
    res.render('admin/login')
  }
};

exports.getDashboard = (req, res) => {
  if(req.admin){
    res.render('admin/pages/dashboard')
  }else{
    res.redirect('/admin/login')
  }
};

exports.getUsers = (req, res) => {
  if(req.admin){
    res.render("admin/pages/users");
  }else{
    res.redirect('/admin/login')
  }
};

exports.getAllCategories = (req, res) => {
  if(req.admin){
    res.render("admin/pages/categories");
  }else{
    res.redirect('/admin/login')
  }
};

exports.getAllProducts = (req, res) => {
  if(req.admin){
    res.render("admin/pages/products");
  }else{
    res.redirect('/admin/login')
  }
};

// USER

exports.getUserLogin = (req, res) => {
  if (req.user) {
    res.redirect("/");
  } else {
    res.render("user/index.ejs");
  }
};

exports.getSignIn = (req, res) => {
  if (req.user) {
    res.redirect("/");
  } else {
    res.render("user/login.ejs");
  }
};

exports.getUserSignup = (req, res) => {
  if (req.user) {
    res.redirect("/");
  } else {
    res.render("user/signup.ejs");
  }
};

exports.getOtpForm = (req, res) => {
  if (req.user) {
    res.redirect("/");
  } else {
    const email = req.query.email;
    res.render("user/otp", { email });
  }
};

exports.getHome = (req, res) => {
  if (req.user) {
    res.render("user/home.ejs");
  } else {
    res.render("user/demo/home.ejs");
  }
};

exports.getShoppingPage = (req, res) => {
  if (req.user) {
    res.render("user/shop.ejs");
  } else {
    res.render("user/demo/shop.ejs");
  }
};


exports.getProductDetails = (req,res)=>{
  if(req.user){
    res.render("user/shopDetails")
  }else {
    res.render("user/demo/shopDetails.ejs");
  }
}

exports.getErrorPage = (req,res)=>{
  res.render("404.ejs")
}

