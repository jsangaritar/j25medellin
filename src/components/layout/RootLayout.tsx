import { Outlet } from 'react-router-dom';
import { ContactCTA } from './ContactCTA';
import { Footer } from './Footer';
import { Header } from './Header';

export function RootLayout() {
  return (
    <div className="flex min-h-screen flex-col bg-bg-primary">
      <Header />
      <main className="flex-1">
        <Outlet />
      </main>
      <ContactCTA />
      <Footer />
    </div>
  );
}
