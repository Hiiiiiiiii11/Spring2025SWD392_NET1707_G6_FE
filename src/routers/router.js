import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Home from "./pages/Home";

const AppRouter = () => {
<<<<<<< HEAD
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
      </Routes>
    </BrowserRouter>
  );
=======
    return (
        <Router>
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<Login />} />
            </Routes>
        </Router>
    );
>>>>>>> 0cf30c7b133fda5625800d9bb32f254b49ab3432
};

export default AppRouter;
