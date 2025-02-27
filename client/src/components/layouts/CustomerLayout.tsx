import { Link } from 'wouter';
import { Button } from '@/components/ui/button';
import { ShoppingCart, User } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

export default function CustomerLayout({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-yellow-50">
      <header className="bg-yellow-400 shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="h-16 flex items-center justify-between">
            <Link href="/">
              <a className="font-bold text-2xl text-brown-900">Хитрите Мечоци</a>
            </Link>
            <div className="flex items-center space-x-4">
              <Link href="/order">
                <Button variant="secondary">
                  <ShoppingCart className="mr-2 h-4 w-4" />
                  Поръчай
                </Button>
              </Link>
              {user ? (
                <Link href="/profile">
                  <Button variant="ghost">
                    <User className="mr-2 h-4 w-4" />
                    Профил
                  </Button>
                </Link>
              ) : (
                <Link href="/auth">
                  <Button variant="ghost">
                    <User className="mr-2 h-4 w-4" />
                    Вход
                  </Button>
                </Link>
              )}
            </div>
          </div>
        </div>
      </header>
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>
    </div>
  );
}