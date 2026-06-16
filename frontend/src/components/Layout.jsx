import PropTypes from "prop-types";

import Footer from "./Footer";
import Header from "./Header";
import Notification from "./ui/Notification/Notification";

const Layout = ({ children }) => {
  return (
    <>
      <Header />
      <Notification
        defaultDismissByFlag={false} 
        title = "Системное уведомление"
        message = "Сейчас действует повышенная нагрузка на сервер. Возможны кратковременные перебои."
        theme = "warning"
       />
      <main className="container my-4">{children}</main>
      <Footer />
    </>
  );
};

Layout.propTypes = {
  children: PropTypes.node.isRequired,
};

export default Layout;
