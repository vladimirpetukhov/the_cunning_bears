import { Link, useLocation } from 'wouter';
import { Button } from '@/components/ui/button';
import { Store, ClipboardList, LogOut } from 'lucide-react';
import { signOut } from '@/lib/auth';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [location] = useLocation();

  return (
    <div className="min-h-screen flex">
      <div className="w-64 min-h-screen bg-yellow-50 border-r border-yellow-200 p-4">
        <div className="h-16 flex items-center font-bold text-brown-800">
          Хитрите Мечоци Admin
        </div>
        <div className="space-y-2">
          <Link href="/admin/products">
            <Button
              variant={location === '/admin/products' ? 'secondary' : 'ghost'}
              className="w-full justify-start"
            >
              <Store className="mr-2 h-4 w-4" />
              Продукти
            </Button>
          </Link>
          <Link href="/admin/orders">
            <Button
              variant={location === '/admin/orders' ? 'secondary' : 'ghost'}
              className="w-full justify-start"
            >
              <ClipboardList className="mr-2 h-4 w-4" />
              Поръчки
            </Button>
          </Link>
          <Button
            variant="ghost"
            className="w-full justify-start text-red-600"
            onClick={() => signOut()}
          >
            <LogOut className="mr-2 h-4 w-4" />
            Изход
          </Button>
        </div>
      </div>
      <main className="flex-1 p-6">{children}</main>
    </div>
  );
}