


exports.getAdminLogin = (req,res)=>{
    res.render('admin/login')
}

exports.getDashboard = (req,res)=>{
    res.render('admin/pages/dashboard')
}

exports.getUsers = (req,res)=>{
    res.render('admin/pages/users')
}

exports.getAllCategories = (req,res)=>{
    res.render('admin/pages/categories')
}

