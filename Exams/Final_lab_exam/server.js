



const express = require("express");
const mongoose = require("mongoose");
const session = require("express-session");
const flash = require("connect-flash");
const path = require("path");
const expressLayouts = require("express-ejs-layouts");
const multer = require("multer");

const authorize = require("./middleware/authorize");
const isAdmin = require("./middleware/admin");

// Controllers
const productController = require("./controller/product.controller");
const categoryController = require("./controller/category.controller");
const orderController = require("./controller/order.controller");

//const cartController = require("./controller/cartcontroller");
const complaintRoutes = require('./routes/complaint');
// Models
const User = require("./models/User");
const Order = require("./models/Order");
const Product = require("./models/product.model");


const cartRoutes = require("./routes/admin/cart.routes");

const app = express();


mongoose
  .connect("mongodb://localhost:27017/bai", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => console.error("❌ MongoDB connection error:", err));

// 🔧 View Engine Setup
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(expressLayouts);
app.set("layout", "layout");

app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));
app.use(
  session({ secret: "mysecret", resave: false, saveUninitialized: false })
);
app.use(flash());
app.use((req, res, next) => {
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  res.locals.user = req.session.user || null;
  next();
});


const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "public/uploads/"),
  filename: (req, file, cb) => cb(null, Date.now() + "-" + file.originalname),
});
const upload = multer({ storage });

// ==================
// Public Routes
// ==================
app.get("/", (req, res) => res.render("landingpage"));

app.get("/signup", (req, res) => res.render("admin/signup"));
app.post("/signup", async (req, res) => {
  const { firstname, email, password } = req.body;
  try {
    const existing = await User.findOne({ email });
    if (existing) {
      req.flash("error", "Email already exists.");
      return res.redirect("/signup");
    }
    await new User({ firstname, email, password }).save();
    req.flash("success", "Signup successful! Now log in.");
    res.redirect("/login");
  } catch (error) {
    console.error(error);
    req.flash("error", "Something went wrong during signup.");
    res.redirect("/signup");
  }
});

app.get("/login", (req, res) =>
  res.render("admin/login", { layout: false, showLink: !!req.session.user })
);

app.post("/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user || user.password !== password) {
      req.flash("error", "Invalid email or password.");
      return res.redirect("/login");
    }
    req.session.user = user;
    req.flash("success", "Login successful!");
    res.redirect("/dashboard");
  } catch (error) {
    console.error(error);
    req.flash("error", "Something went wrong during login.");
    res.redirect("/login");
  }
});

app.get("/logout", (req, res) => {
  req.session.destroy(() => res.redirect("/"));
});

// ==================
// User Dashboard and Orders
// ==================
app.get("/dashboard", authorize, (req, res) =>
  res.render("admin/dashboard", { user: req.session.user })
);

app.get("/my-orders", authorize, async (req, res) => {
  try {
    const orders = await Order.find({ "customer.email": req.session.user.email }).populate("items.productId");
    res.render("my-orders", { orders });
  } catch (err) {
    console.error("❌ Error fetching orders:", err);
    req.flash("error", "Could not load your orders.");
    res.redirect("/");
  }
});

// ==================
// Admin Routes
// ==================

// Product CRUD
app.get("/admin/product", authorize, isAdmin, productController.showProducts);
app.post("/admin/product", authorize, isAdmin, upload.single("image"), productController.createProduct);
app.get("/admin/product/edit/:id", authorize, isAdmin, productController.showEditForm);
app.post("/admin/product/edit/:id", authorize, isAdmin, upload.single("image"), productController.updateProduct);
app.post("/admin/product/delete/:id", authorize, isAdmin, productController.deleteProduct);

// Category CRUD
app.get("/admin/category", authorize, isAdmin, categoryController.showCategories);
app.get("/admin/category/create", authorize, isAdmin, categoryController.showCreateForm);
app.post("/admin/category/create", authorize, isAdmin, categoryController.createCategory);
app.get("/admin/category/edit/:id", authorize, isAdmin, categoryController.showEditForm);
app.post("/admin/category/edit/:id", authorize, isAdmin, categoryController.updateCategory);
app.get("/admin/category/delete/:id", authorize, isAdmin, categoryController.deleteCategory);

// Order CRUD
app.get("/admin/order", authorize, isAdmin, orderController.viewAllOrders);
app.get("/admin/order/create", authorize, isAdmin, orderController.showCreateForm);
app.post("/admin/order/create", authorize, isAdmin, orderController.createOrder);
app.get("/admin/order/:id", authorize, isAdmin, orderController.viewOrder);
app.post("/admin/order/update/:id", authorize, isAdmin, orderController.updateOrder);
app.post("/admin/order/delete/:id", authorize, isAdmin, orderController.deleteOrder);

// Cart Routes
app.use("/admin", cartRoutes);


app.get("/checkout", authorize, (req, res) => {
  res.render("form");
});
app.use('/complaints', complaintRoutes);

app.get("/admin/home", authorize, isAdmin, (req, res) =>
  res.redirect("/admin/product")
);

// ==================
// Start Server
// ==================
const PORT = 3003;
app.listen(PORT, () => {
  console.log(`✅ Server running at http://localhost:${PORT}`);
});
