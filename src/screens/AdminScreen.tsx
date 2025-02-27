import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
  Modal
} from 'react-native';
import { useTheme } from '../contexts/ThemeContext';
import {
  collection,
  getDocs,
  addDoc,
  updateDoc,
  doc,
  deleteDoc
} from 'firebase/firestore';
import { db } from '../config/firebase';
import { MaterialIcons } from '@expo/vector-icons';

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  imageUrl: string;
  available: boolean;
}

interface OrderItem {
  productId: string;
  quantity: number;
  price: number;
}

interface Order {
  id: string;
  userId: string;
  items: OrderItem[];
  total: number;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  createdAt: Date;
}

interface ProductForm {
  name: string;
  description: string;
  price: string;
  imageUrl: string;
  available: boolean;
}

export default function AdminScreen() {
  const theme = useTheme();
  const [activeTab, setActiveTab] = useState<'products' | 'orders'>('products');
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [productForm, setProductForm] = useState<ProductForm>({
    name: '',
    description: '',
    price: '',
    imageUrl: '',
    available: true
  });

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    try {
      const productsSnapshot = await getDocs(collection(db, 'products'));
      const productsData = productsSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Product[];
      setProducts(productsData);

      const ordersSnapshot = await getDocs(collection(db, 'orders'));
      const ordersData = ordersSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Order[];
      setOrders(ordersData);
    } catch (error) {
      console.error('Error loading data:', error);
      Alert.alert('Грешка', 'Възникна проблем при зареждането на данните');
    }
  }

  async function handleSaveProduct() {
    try {
      const productData = {
        ...productForm,
        price: parseFloat(productForm.price)
      };

      if (editingProduct) {
        await updateDoc(doc(db, 'products', editingProduct.id), productData);
      } else {
        await addDoc(collection(db, 'products'), productData);
      }

      setModalVisible(false);
      setEditingProduct(null);
      setProductForm({
        name: '',
        description: '',
        price: '',
        imageUrl: '',
        available: true
      });
      loadData();
    } catch (error) {
      console.error('Error saving product:', error);
      Alert.alert('Грешка', 'Възникна проблем при запазването на продукта');
    }
  }

  async function handleDeleteProduct(productId: string) {
    try {
      await deleteDoc(doc(db, 'products', productId));
      loadData();
    } catch (error) {
      console.error('Error deleting product:', error);
      Alert.alert('Грешка', 'Възникна проблем при изтриването на продукта');
    }
  }

  async function handleUpdateOrderStatus(orderId: string, newStatus: Order['status']) {
    try {
      await updateDoc(doc(db, 'orders', orderId), { status: newStatus });
      loadData();
    } catch (error) {
      console.error('Error updating order:', error);
      Alert.alert('Грешка', 'Възникна проблем при обновяването на поръчката');
    }
  }

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <View style={styles.tabs}>
        <TouchableOpacity
          style={[
            styles.tab,
            activeTab === 'products' && { backgroundColor: theme.colors.primary }
          ]}
          onPress={() => setActiveTab('products')}
        >
          <Text style={[
            styles.tabText,
            { color: activeTab === 'products' ? theme.colors.secondary : theme.colors.gray }
          ]}>
            Продукти
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.tab,
            activeTab === 'orders' && { backgroundColor: theme.colors.primary }
          ]}
          onPress={() => setActiveTab('orders')}
        >
          <Text style={[
            styles.tabText,
            { color: activeTab === 'orders' ? theme.colors.secondary : theme.colors.gray }
          ]}>
            Поръчки
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content}>
        {activeTab === 'products' ? (
          <>
            <TouchableOpacity
              style={[styles.addButton, { backgroundColor: theme.colors.primary }]}
              onPress={() => setModalVisible(true)}
            >
              <MaterialIcons name="add" size={24} color={theme.colors.secondary} />
              <Text style={[styles.buttonText, { color: theme.colors.secondary }]}>
                Добави продукт
              </Text>
            </TouchableOpacity>

            {products.map(product => (
              <View key={product.id} style={styles.card}>
                <Text style={styles.productName}>{product.name}</Text>
                <Text style={styles.productPrice}>{product.price.toFixed(2)} лв.</Text>
                <View style={styles.actions}>
                  <TouchableOpacity
                    onPress={() => {
                      setEditingProduct(product);
                      setProductForm({
                        name: product.name,
                        description: product.description,
                        price: product.price.toString(),
                        imageUrl: product.imageUrl,
                        available: product.available
                      });
                      setModalVisible(true);
                    }}
                  >
                    <MaterialIcons name="edit" size={24} color={theme.colors.secondary} />
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => handleDeleteProduct(product.id)}
                  >
                    <MaterialIcons name="delete" size={24} color={theme.colors.error} />
                  </TouchableOpacity>
                </View>
              </View>
            ))}
          </>
        ) : (
          orders.map(order => (
            <View key={order.id} style={styles.card}>
              <Text style={styles.orderTitle}>Поръчка #{order.id}</Text>
              <Text style={styles.orderStatus}>Статус: {order.status}</Text>
              <Text style={styles.orderTotal}>
                Общо: {order.total.toFixed(2)} лв.
              </Text>
              <View style={styles.statusButtons}>
                <TouchableOpacity
                  style={[
                    styles.statusButton,
                    { backgroundColor: theme.colors.primary }
                  ]}
                  onPress={() => handleUpdateOrderStatus(order.id, 'confirmed')}
                >
                  <Text style={{ color: theme.colors.secondary }}>Потвърди</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[
                    styles.statusButton,
                    { backgroundColor: theme.colors.success }
                  ]}
                  onPress={() => handleUpdateOrderStatus(order.id, 'completed')}
                >
                  <Text style={{ color: theme.colors.white }}>Завърши</Text>
                </TouchableOpacity>
              </View>
            </View>
          ))
        )}
      </ScrollView>

      <Modal
        visible={modalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={[styles.modalContent, { backgroundColor: theme.colors.background }]}>
            <Text style={[styles.modalTitle, { color: theme.colors.secondary }]}>
              {editingProduct ? 'Редактиране на продукт' : 'Нов продукт'}
            </Text>
            <TextInput
              style={styles.input}
              placeholder="Име"
              value={productForm.name}
              onChangeText={text => setProductForm(prev => ({ ...prev, name: text }))}
            />
            <TextInput
              style={styles.input}
              placeholder="Описание"
              value={productForm.description}
              onChangeText={text => setProductForm(prev => ({ ...prev, description: text }))}
              multiline
            />
            <TextInput
              style={styles.input}
              placeholder="Цена"
              value={productForm.price}
              onChangeText={text => setProductForm(prev => ({ ...prev, price: text }))}
              keyboardType="decimal-pad"
            />
            <TextInput
              style={styles.input}
              placeholder="URL на изображение"
              value={productForm.imageUrl}
              onChangeText={text => setProductForm(prev => ({ ...prev, imageUrl: text }))}
            />
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalButton, { backgroundColor: theme.colors.gray }]}
                onPress={() => setModalVisible(false)}
              >
                <Text style={{ color: theme.colors.white }}>Отказ</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, { backgroundColor: theme.colors.primary }]}
                onPress={handleSaveProduct}
              >
                <Text style={{ color: theme.colors.secondary }}>Запази</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  tabs: {
    flexDirection: 'row',
    padding: 16,
    gap: 16,
  },
  tab: {
    flex: 1,
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  tabText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  content: {
    flex: 1,
    padding: 16,
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
  },
  buttonText: {
    marginLeft: 8,
    fontSize: 16,
    fontWeight: 'bold',
  },
  card: {
    padding: 16,
    borderRadius: 8,
    backgroundColor: 'white',
    marginBottom: 16,
    elevation: 2,
  },
  productName: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  productPrice: {
    fontSize: 16,
    opacity: 0.7,
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 16,
    marginTop: 8,
  },
  orderTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  orderStatus: {
    fontSize: 16,
    opacity: 0.7,
  },
  orderTotal: {
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 8,
  },
  statusButtons: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 8,
    marginTop: 12,
  },
  statusButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 4,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    padding: 16,
  },
  modalContent: {
    padding: 16,
    borderRadius: 8,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  input: {
    borderWidth: 1,
    borderColor: '#e5e5e5',
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 8,
  },
  modalButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 4,
  },
});