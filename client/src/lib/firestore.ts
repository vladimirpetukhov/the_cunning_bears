import { db } from './firebase';
import { 
  collection, 
  doc,
  addDoc,
  updateDoc,
  deleteDoc,
  getDoc,
  getDocs,
  query,
  where,
  orderBy,
  serverTimestamp 
} from 'firebase/firestore';
import type { Product, Order } from './models';

// Products
export async function getProducts() {
  const querySnapshot = await getDocs(collection(db, 'products'));
  return querySnapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  })) as Product[];
}

export async function addProduct(product: Omit<Product, 'id' | 'createdAt'>) {
  const docRef = await addDoc(collection(db, 'products'), {
    ...product,
    createdAt: serverTimestamp()
  });
  return docRef.id;
}

export async function updateProduct(id: string, data: Partial<Product>) {
  const docRef = doc(db, 'products', id);
  await updateDoc(docRef, data);
}

export async function deleteProduct(id: string) {
  const docRef = doc(db, 'products', id);
  await deleteDoc(docRef);
}

// Orders
export async function getOrders() {
  const querySnapshot = await getDocs(
    query(collection(db, 'orders'), orderBy('createdAt', 'desc'))
  );
  return querySnapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  })) as Order[];
}

export async function addOrder(order: Omit<Order, 'id' | 'createdAt'>) {
  const docRef = await addDoc(collection(db, 'orders'), {
    ...order,
    createdAt: serverTimestamp()
  });
  return docRef.id;
}

export async function updateOrderStatus(id: string, status: Order['status']) {
  const docRef = doc(db, 'orders', id);
  await updateDoc(docRef, { status });
}

export async function getOrdersByUser(userId: string) {
  const querySnapshot = await getDocs(
    query(
      collection(db, 'orders'),
      where('userId', '==', userId),
      orderBy('createdAt', 'desc')
    )
  );
  return querySnapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  })) as Order[];
}
