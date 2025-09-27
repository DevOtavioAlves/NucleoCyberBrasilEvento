import { Routes, Route } from "react-router-dom";
import Layout from "./layouts/Layout";
import Home from "./pages/Home";
import Event from "./pages/Event";
import ForumPage from "./pages/ForumPage";
import About from "./components/About";
import Contact from "./components/Contact";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout><Home /></Layout>} />
      <Route path="/event" element={<Layout><Event /></Layout>} />
      <Route path="/about" element={<Layout><About /></Layout>} />
      <Route path="/contact" element={<Layout><Contact /></Layout>} />
      <Route path="/forum" element={<Layout><ForumPage /></Layout>} />
    </Routes>
  );
}