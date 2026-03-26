import Link from "next/link"

export default function Header() {
    return <div>
        <nav className="navbar">
        <div className="nav-center">
          <Link href="/">Accueil</Link>
          <Link href="/about">À propos</Link>
          <Link href="/skills">Compétences</Link>
          <Link href="/projects">Projets</Link>
          <Link href="/contact">Contact</Link>
        </div>
        {/*
        <div className="nav-right">
          <Link href="#">Inscription</Link>
          <Link href="#">Connexion</Link>
        </div>
        */}
      </nav>
    </div>
}