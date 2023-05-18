const Product = require("../Models/products");
const Cart  = require("../Models/cart");
const catchAsync = require("../utils/catchAsync");

const AppError = require("../utils/appError");

exports.getHomeProducts = catchAsync(async (req, res) => {
  const products = await Product.find()
    .limit(10) // Limit to 10 products
    .populate("category", "name"); // Populate category field with name only

  res.json(products);
});

exports.getAllProducts = catchAsync(async (req, res) => {
  const products = await Product.find().populate("category"); // Populate category field with full category document

  res.json(products);
});



exports.getCart = catchAsync(async (req,res)=>{
  const cart = await Cart.findOne({ user: req.user._id });
  const { productSum, totalPrice } = await cart.calculatePrices();

  res.status(200).json({
    status: "success",
    cart,
    productSum,
    totalPrice,
  });
})


exports.addToCart = catchAsync(async (req,res)=>{
  const { productId,quantity } = req.body
  
  let cart = await Cart.findOne({user:req.user._id})

  if (!cart) {
    // Create a new cart if it doesn't exist for the user
    cart = new Cart({ user: req.user._id, items: [] });
  }

   // Check if the product already exists in the cart
   const existingItem = cart.items.find((item) => item.product.toString() === productId);
   if(existingItem){
    existingItem.quantity+=Number(quantity)
   }else{
    cart.items.push({product:productId, quantity})
   }

   await cart.save()

   const { productSum, totalPrice } = await cart.calculatePrices();

   res.status(201).json({status:"success",message:"Item added to cart successfully",cart,productSum,totalPrice})
})


exports.updateCartItem = catchAsync(async (req,res)=>{
      const { productId } = req.params;
      const { quantity } = req.body;
      const cart = await Cart.findOne({ user: req.user._id });
  
      // Update the quantity of the specified product in the cart
      const cartItem = cart.items.find((item) => item.product.toString() === productId);
      cartItem.quantity = quantity;
  
      await cart.save();

      const { productSum, totalPrice } = await cart.calculatePrices();

      res.status(201).json({status:"success",message:"Cart item updated successfully.",cart,productSum,totalPrice})
})


exports.removeCartItem = catchAsync(async (req,res)=>{
      const { productId } = req.params;
      const cart = await Cart.findOne({ user: req.user._id });
  
      // Update the quantity of the specified product in the cart
      cart.items = cart.items.filter((item) => item.product.toString() !== productId);
  
      await cart.save();

      const { productSum, totalPrice } = await cart.calculatePrices();

      res.status(204).json({status:"success",message:"Cart item removed successfully.",cart,productSum,totalPrice})
})


