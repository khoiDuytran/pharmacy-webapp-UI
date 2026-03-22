import config from "../configs";
import Cart from "../pages/Cart";
import Home from "../pages/Home";
import Login from "../pages/Login";
import ProductsList from "../pages/ProductsList";
import Profile from "../pages/Profile";
import Register from "../pages/Register";
import Account from "../pages/Profile/Account";
import Address from "../pages/Profile/Address";
import Order from "../pages/Profile/Order";
import ProductDetail from "../pages/ProductDetail";
import Payment from "../pages/Payment";
import Location from "../pages/Location";
import PaymentResult from "../pages/Payment/PaymentResult";

const publicRoutes = [
  { path: config.routes.home, component: Home },
  { path: config.routes.login, component: Login },
  { path: config.routes.register, component: Register },
  { path: config.routes.cart, component: Cart },
  {
    path: config.routes.profile,
    component: Profile,
    children: [
      {
        path: "thong-tin-ca-nhan",
        component: Account,
      },
      {
        path: "dia-chi",
        component: Address,
      },
      {
        path: "don-hang",
        component: Order,
      },
    ],
  },
  { path: config.routes.productsList, component: ProductsList },
  { path: config.routes.productDetail, component: ProductDetail },
  { path: config.routes.payment, component: Payment },
  { path: config.routes.paymentResult, component: PaymentResult },
  { path: config.routes.location, component: Location },
];

const privateRoutes = [];

export { publicRoutes, privateRoutes };
