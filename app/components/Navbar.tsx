'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Navbar() {
  const pathname = usePathname();

  const isActive = (path: string) => pathname === path;

  const linkStyle = (isActiveLink: boolean) => ({
    fontWeight: isActiveLink ? 'bold' : '500',
    color: isActiveLink ? '#ffdd57' : '#fff',
  });

  return (
    <nav className="navbar">
      <div className="nav-center">
        <Link href="/" style={linkStyle(isActive('/'))}>
          TaskFlow
        </Link>
        {pathname !== '/' && pathname !== '/login' && (
          <>
            <Link href="/dashboard" style={linkStyle(isActive('/dashboard'))}>
              Tableau de bord
            </Link>
            <Link href="/projects" style={linkStyle(isActive('/projects'))}>
              Projets
            </Link>
          </>
        )}
      </div>
      <div className="nav-right">
        {pathname === '/login' || pathname === '/' ? (
          <Link href="/login" className="btn btn-sm btn-warning">
            Connexion
          </Link>
        ) : (
          <Link href="/" className="btn btn-sm btn-outline">
            Déconnexion
          </Link>
        )}
      </div>
    </nav>
  );
}
