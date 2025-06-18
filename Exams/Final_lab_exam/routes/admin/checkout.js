router.get("/", async (req, res) => {
  const cart = await Cart.findOne().populate("products.productId");
  res.render("checkout", { cart });
});

router.post("/", async (req, res) => {
  const cart = await Cart.findOne();
  
  await Cart.deleteMany(); 
  res.render("order-success", { orderId: "123456" }); // pass actual ID
});
