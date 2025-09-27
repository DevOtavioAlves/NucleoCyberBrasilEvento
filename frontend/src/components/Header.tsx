import { Link } from "react-router-dom"

export default function Header() {
  return (
    <header className="header">
      <div className="logo">Núcleo Cyber Brasil</div>
      <nav className="nav">
        <Link to="/">Home</Link>
        <Link to="/forum">Fórum</Link>
        <Link to="/clubs">Clubes</Link>
        <Link to="/ranking">Ranking</Link>
        <Link to="/employability">Empregabilidade</Link>
        <Link to="/profile">Perfil</Link>
      </nav>
    </header>
  )
}
