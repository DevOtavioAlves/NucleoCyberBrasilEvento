import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import Forum from "./pages/Forum";
import Clubs from "./pages/Clubs";
import Ranking from "./pages/Ranking";
import Employability from "./pages/Employability";
import Profile from "./pages/Profile";
import "./index.css";
function App() {
    return (_jsx(Router, { children: _jsxs("div", { className: "app-container", children: [_jsx(Header, {}), _jsx("main", { className: "main-content", children: _jsxs(Routes, { children: [_jsx(Route, { path: "/", element: _jsx(Home, {}) }), _jsx(Route, { path: "/forum", element: _jsx(Forum, {}) }), _jsx(Route, { path: "/clubs", element: _jsx(Clubs, {}) }), _jsx(Route, { path: "/ranking", element: _jsx(Ranking, {}) }), _jsx(Route, { path: "/employability", element: _jsx(Employability, {}) }), _jsx(Route, { path: "/profile", element: _jsx(Profile, {}) })] }) }), _jsx(Footer, {})] }) }));
}
export default App;
//# sourceMappingURL=App.js.map