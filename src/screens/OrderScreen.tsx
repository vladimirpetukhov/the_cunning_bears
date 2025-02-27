import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image,
} from 'react-native';
import { useTheme } from '../contexts/ThemeContext';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../config/firebase';
import { MaterialIcons } from '@expo/vector-icons';

interface Product {
  id: string;
  name: string;
  price: number;
  description: string;
  imageUrl: string;
  available: boolean;
}

interface Cart {
  [key: string]: number;
}

export default function OrderScreen({ navigation }) {
  const theme = useTheme();
  const [products, setProducts] = useState<Product[]>([]);
  const [cart, setCart] = useState<Cart>({});

  useEffect(() => {
    loadProducts();
  }, []);

  async function loadProducts() {
    try {
      const querySnapshot = await getDocs(collection(db, 'products'));
      const productsData = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Product[];
      setProducts(productsData);
    } catch (error) {
      console.error('Error loading products:', error);
    }
  }

  function addToCart(productId: string) {
    setCart(prev => ({
      ...prev,
      [productId]: (prev[productId] || 0) + 1
    }));
  }

  function removeFromCart(productId: string) {
    setCart(prev => ({
      ...prev,
      [productId]: Math.max(0, (prev[productId] || 0) - 1)
    }));
  }

  const total = products.reduce((sum, product) => (
    sum + (cart[product.id] || 0) * product.price
  ), 0);

  function renderProduct({ item: product }: { item: Product }) {
    const quantity = cart[product.id] || 0;

    return (
      <View style={[styles.productCard, { borderColor: theme.colors.primary }]}>
        <Image
          source={{ uri: product.imageUrl }}
          style={styles.productImage}
        />
        <View style={styles.productInfo}>
          <Text style={[styles.productName, { color: theme.colors.secondary }]}>
            {product.name}
          </Text>
          <Text style={styles.productPrice}>
            {product.price.toFixed(2)} лв.
          </Text>
          <View style={styles.quantityControl}>
            <TouchableOpacity
              style={[styles.quantityButton, { backgroundColor: theme.colors.primary }]}
              onPress={() => removeFromCart(product.id)}
            >
              <MaterialIcons name="remove" size={20} color={theme.colors.secondary} />
            </TouchableOpacity>
            <Text style={styles.quantity}>{quantity}</Text>
            <TouchableOpacity
              style={[styles.quantityButton, { backgroundColor: theme.colors.primary }]}
              onPress={() => addToCart(product.id)}
            >
              <MaterialIcons name="add" size={20} color={theme.colors.secondary} />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <FlatList
        data={products}
        renderItem={renderProduct}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.productList}
      />
      {total > 0 && (
        <View style={styles.footer}>
          <Text style={[styles.total, { color: theme.colors.secondary }]}>
            Общо: {total.toFixed(2)} лв.
          </Text>
          <TouchableOpacity
            style={[styles.checkoutButton, { backgroundColor: theme.colors.primary }]}
            onPress={() => navigation.navigate('Cart', { cart, products })}
          >
            <Text style={[styles.checkoutText, { color: theme.colors.secondary }]}>
              Продължи
            </Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  productList: {
    padding: 16,
    gap: 16,
  },
  productCard: {
    flexDirection: 'row',
    borderWidth: 1,
    borderRadius: 12,
    overflow: 'hidden',
  },
  productImage: {
    width: 100,
    height: 100,
  },
  productInfo: {
    flex: 1,
    padding: 12,
    justifyContent: 'space-between',
  },
  productName: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  productPrice: {
    fontSize: 16,
    opacity: 0.7,
  },
  quantityControl: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  quantityButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  quantity: {
    fontSize: 16,
    fontWeight: 'bold',
    minWidth: 24,
    textAlign: 'center',
  },
  footer: {
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#e5e5e5',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  total: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  checkoutButton: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  checkoutText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
});