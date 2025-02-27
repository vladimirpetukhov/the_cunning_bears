import CustomerLayout from '@/components/layouts/CustomerLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Link } from 'wouter';
import { MapPin, Clock, Award } from 'lucide-react';

export default function HomePage() {
  return (
    <CustomerLayout>
      <div className="text-center py-12">
        <h1 className="text-4xl font-bold text-brown-900 mb-4">
          Добре дошли в Хитрите Мечоци
        </h1>
        <p className="text-xl text-brown-700 mb-8">
          Най-вкусните понички и царевица, доставени до вас
        </p>
        <Link href="/order">
          <Button size="lg" className="bg-yellow-400 hover:bg-yellow-500">
            Поръчай Сега
          </Button>
        </Link>
      </div>

      <div className="grid md:grid-cols-3 gap-8 mt-12">
        <Card>
          <CardContent className="p-6">
            <MapPin className="h-8 w-8 text-yellow-500 mb-4" />
            <h2 className="text-2xl font-bold mb-4">Намери ни</h2>
            <p className="text-gray-600">
              Открий нашите каравани на различни локации в града.
              Използвай приложението за да намериш най-близката до теб!
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <Clock className="h-8 w-8 text-yellow-500 mb-4" />
            <h2 className="text-2xl font-bold mb-4">Бърза Доставка</h2>
            <p className="text-gray-600">
              Поръчай онлайн и избери удобен час за доставка.
              Пресни и топли продукти, точно когато ги искаш!
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <Award className="h-8 w-8 text-yellow-500 mb-4" />
            <h2 className="text-2xl font-bold mb-4">Качество</h2>
            <p className="text-gray-600">
              Всички наши продукти са приготвени с най-качествените съставки.
              Опитай нашите известни понички и варена царевица!
            </p>
          </CardContent>
        </Card>
      </div>
    </CustomerLayout>
  );
}