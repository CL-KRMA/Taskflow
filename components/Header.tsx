import Link from "next/link"

export default function Header() {
    return <div>
        <nav className="navbar">
        <div className="nav-center">
          <Link href="/">Accueil</Link>
          <Link href="/liste">Liste D'images</Link>
          <Link href="/ajouter">Ajouter</Link>
          <Link href="/contact">Contact</Link>
        </div>
        <div className="nav-right">
          <Link href="#">Inscription</Link>
          <Link href="#">Connexion</Link>
        </div>
      </nav>
    </div>
}