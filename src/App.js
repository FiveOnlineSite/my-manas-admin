import Router from "./route/Index";

import ThemeProvider from "./layout/provider/Theme";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./App.css";
const App = () => {
  return (
    <ThemeProvider>
      <Router />
      <ToastContainer
        position='top-right'
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick={false}
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme='light'
        // transition={Bounce}
      />
    </ThemeProvider>
  );
};
export default App;
