// const express = require("express");
// const dotenv = require("dotenv");
// const cors = require("cors");
// const connectDB = require("./config/db");
// const userAuthRoutes = require("./routes/userAuthRoutes");
// const orderRoutes = require("./routes/orderRoutes");
// const adminOrderRoutes = require("./routes/adminOrderRoutes");
// const adminUsersRoutes = require("./routes/adminUsersRoutes");
// const adminDashboardRoutes = require("./routes/adminDashboardRoutes");
// const adminPlaceOrderRoutes = require("./routes/adminPlaceOrderRoutes");
// const adminSettingsRoutes = require("./routes/adminSettingsRoutes");


// dotenv.config();
// connectDB();
  
 
// const app = express();
// app.use(cors({ origin: "*", credentials: true }));
// app.use(express.json());
// app.use(express.urlencoded({ extended: true }));
 
 
 
// app.use("/api/admin", require("./routes/adminRoutes"));
// app.use("/api/foods", require("./routes/foodRoutes"));
// app.use("/api/categories", require("./routes/categoryRoutes"));
// app.use("/api/users", userAuthRoutes);
// app.use("/api/orders", orderRoutes);
// app.use("/api/admin", adminOrderRoutes);
// app.use("/api/admin", adminUsersRoutes);
// app.use("/api/admin", adminDashboardRoutes);
// app.use("/api/admin", adminPlaceOrderRoutes);
// app.use("api/admin/settings", adminSettingsRoutes);

 
// const PORT = process.env.PORT || 5000;
// app.listen(PORT, () => console.log(`server running on port ${PORT}`));



const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const connectDB = require("./config/db");

const userAuthRoutes = require("./routes/userAuthRoutes");
const orderRoutes = require("./routes/orderRoutes");
const adminOrderRoutes = require("./routes/adminOrderRoutes");
const adminUsersRoutes = require("./routes/adminUsersRoutes");
const adminDashboardRoutes = require("./routes/adminDashboardRoutes");
const adminPlaceOrderRoutes = require("./routes/adminPlaceOrderRoutes");
const adminSettingsRoutes = require("./routes/adminSettingsRoutes");

dotenv.config();
connectDB();

const app = express();

app.use(cors({ origin: "*", credentials: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api/admin", require("./routes/adminRoutes"));
app.use("/api/foods", require("./routes/foodRoutes"));
app.use("/api/categories", require("./routes/categoryRoutes"));
app.use("/api/users", userAuthRoutes);
app.use("/api/orders", orderRoutes);

app.use("/api/admin", adminOrderRoutes);
app.use("/api/admin", adminUsersRoutes);
app.use("/api/admin", adminDashboardRoutes);
app.use("/api/admin", adminPlaceOrderRoutes);
app.use("/api/admin/settings", adminSettingsRoutes); 

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`server running on port ${PORT}`));
