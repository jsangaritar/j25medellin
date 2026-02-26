import { Outlet } from 'react-router-dom';
import { ContactCTA } from './ContactCTA';
import { Footer } from './Footer';
import { Header } from './Header';

export function RootLayout() {
  return (
    <div className="min-h-screen bg-bg-primary text-text-primary">
      <Header />
      <main>
        <Outlet />
      </main>
      <ContactCTA />
      <Footer />
    </div>
  );
}
