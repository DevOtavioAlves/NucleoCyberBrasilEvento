import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import Header from "./components/Header"
import Footer from "./components/Footer"
import Home from "./pages/Home"
import Forum from "./pages/Forum"
import Clubs from "./pages/Clubs"
import Ranking from "./pages/Ranking"
import Employability from "./pages/Employability"
import Profile from "./pages/Profile"
import "./index.css"

function App() {
  return (
    <Router>
      <div className="app-container">
        <Header />
        <main className="main-content">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/forum" element={<Forum />} />
            <Route path="/clubs" element={<Clubs />} />
            <Route path="/ranking" element={<Ranking />} />
            <Route path="/employability" element={<Employability />} />
            <Route path="/profile" element={<Profile />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  )
}

export default App
