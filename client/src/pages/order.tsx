import { useState } from 'react';
import CustomerLayout from '@/components/layouts/CustomerLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useQuery } from '@tanstack/react-query';
import type { Product } from '@shared/schema';

export default function OrderPage() {
  const [selectedProducts, setSelectedProducts] = useState<{[key: number]: number}>({});
  
  const { data: products, isLoading } = useQuery<Product[]>({
    queryKey: ['/api/products']
  });

  if (isLoading) {
    return <div>Loading...</div>;
  }

  const total = Object.entries(selectedProducts).reduce((sum, [id, quantity]) => {
    const product = products?.find(p => p.id === parseInt(id));
    return sum + (product?.price || 0) * quantity;
  }, 0);

  return (
    <CustomerLayout>
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Place Your Order</h1>

        <div className="grid gap-6 mb-8">
          {products?.map((product) => (
            <Card key={product.id}>
              <CardContent className="flex items-center justify-between p-6">
                <div>
                  <h3 className="font-bold">{product.name}</h3>
                  <p className="text-sm text-gray-500">{product.description}</p>
                  <p className="mt-1 font-bold">${(product.price / 100).toFixed(2)}</p>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setSelectedProducts(prev => ({
                      ...prev,
                      [product.id]: Math.max(0, (prev[product.id] || 0) - 1)
                    }))}
                  >
                    -
                  </Button>
                  <span className="w-8 text-center">
                    {selectedProducts[product.id] || 0}
                  </span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setSelectedProducts(prev => ({
                      ...prev,
                      [product.id]: (prev[product.id] || 0) + 1
                    }))}
                  >
                    +
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Order Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">${(total / 100).toFixed(2)}</p>
            <Button className="w-full mt-4">Continue to Delivery Details</Button>
          </CardContent>
        </Card>
      </div>
    </CustomerLayout>
  );
}
