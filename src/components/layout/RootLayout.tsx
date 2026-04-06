import { useEffect, useRef } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { ContactCTA } from './ContactCTA';
import { Footer } from './Footer';
import { Header } from './Header';

function ScrollToTop() {
  const { pathname } = useLocation();
  const prevPath = useRef(pathname);

  useEffect(() => {
    if (prevPath.current !== pathname) {
      window.scrollTo(0, 0);
      prevPath.current = pathname;
    }
  });

  return null;
}

export function RootLayout() {
  return (
    <div className="flex min-h-screen flex-col bg-bg-primary">
      <ScrollToTop />
      <Header />
      <main className="flex-1">
        <Outlet />
      </main>
      <ContactCTA />
      <Footer />
    </div>
  );
}
