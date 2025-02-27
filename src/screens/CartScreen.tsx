import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  Platform,
} from 'react-native';
import { useTheme } from '../contexts/ThemeContext';
import { collection, addDoc } from 'firebase/firestore';
import { db, auth } from '../config/firebase';
import MapView, { Marker } from 'react-native-maps';
import * as Location from 'expo-location';
import { MaterialIcons } from '@expo/vector-icons';

interface LocationType {
  latitude: number;
  longitude: number;
}

export default function CartScreen({ route, navigation }) {
  const theme = useTheme();
  const { cart, products } = route.params;
  const [location, setLocation] = useState<LocationType | null>(null);
  const [deliveryTime, setDeliveryTime] = useState(new Date());

  async function requestLocation() {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Грешка', 'Нямаме достъп до локацията');
        return;
      }

      const location = await Location.getCurrentPositionAsync({});
      setLocation({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude
      });
    } catch (error) {
      console.error('Error getting location:', error);
      Alert.alert('Грешка', 'Не можахме да определим локацията ви');
    }
  }

  const cartItems = products.filter(product => cart[product.id] > 0);
  const total = cartItems.reduce((sum, product) => (
    sum + cart[product.id] * product.price
  ), 0);

  async function handleCheckout() {
    if (!location) {
      Alert.alert('Грешка', 'Моля, изберете адрес за доставка');
      return;
    }

    try {
      const order = {
        userId: auth.currentUser?.uid,
        items: cartItems.map(product => ({
          productId: product.id,
          quantity: cart[product.id],
          price: product.price
        })),
        total,
        location,
        deliveryTime,
        status: 'pending',
        createdAt: new Date()
      };

      await addDoc(collection(db, 'orders'), order);
      Alert.alert('Успех', 'Поръчката е приета успешно!');
      navigation.navigate('Home');
    } catch (error) {
      console.error('Error creating order:', error);
      Alert.alert('Грешка', 'Възникна проблем при създаването на поръчката');
    }
  }

  return (
    <ScrollView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: theme.colors.secondary }]}>
          Вашата поръчка
        </Text>
        {cartItems.map(product => (
          <View key={product.id} style={styles.cartItem}>
            <Text style={styles.itemName}>{product.name}</Text>
            <Text style={styles.itemQuantity}>{cart[product.id]}x</Text>
            <Text style={styles.itemPrice}>
              {(cart[product.id] * product.price).toFixed(2)} лв.
            </Text>
          </View>
        ))}
        <Text style={[styles.total, { color: theme.colors.secondary }]}>
          Общо: {total.toFixed(2)} лв.
        </Text>
      </View>

      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: theme.colors.secondary }]}>
          Адрес за доставка
        </Text>
        <TouchableOpacity
          style={[styles.locationButton, { backgroundColor: theme.colors.primary }]}
          onPress={requestLocation}
        >
          <MaterialIcons name="my-location" size={24} color={theme.colors.secondary} />
          <Text style={[styles.buttonText, { color: theme.colors.secondary }]}>
            Използвай текущата локация
          </Text>
        </TouchableOpacity>
        {location && (
          <MapView
            style={styles.map}
            initialRegion={{
              latitude: location.latitude,
              longitude: location.longitude,
              latitudeDelta: 0.005,
              longitudeDelta: 0.005,
            }}
          >
            <Marker
              coordinate={{
                latitude: location.latitude,
                longitude: location.longitude,
              }}
            />
          </MapView>
        )}
      </View>

      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: theme.colors.secondary }]}>
          Час за доставка
        </Text>
        <TouchableOpacity
          style={[styles.dateButton, { backgroundColor: theme.colors.primary }]}
          onPress={() => {
            Alert.prompt(
              'Въведете час за доставка',
              'Формат: DD/MM/YYYY HH:mm',
              (text) => {
                const date = new Date(text);
                if (!isNaN(date.getTime())) {
                  setDeliveryTime(date);
                } else {
                  Alert.alert('Грешка', 'Невалиден формат на дата');
                }
              }
            );
          }}
        >
          <MaterialIcons name="event" size={24} color={theme.colors.secondary} />
          <Text style={[styles.buttonText, { color: theme.colors.secondary }]}>
            {deliveryTime.toLocaleString()}
          </Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity
        style={[styles.checkoutButton, { backgroundColor: theme.colors.primary }]}
        onPress={handleCheckout}
      >
        <Text style={[styles.checkoutText, { color: theme.colors.secondary }]}>
          Завърши поръчката
        </Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  section: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e5e5',
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  cartItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  itemName: {
    flex: 1,
    fontSize: 16,
  },
  itemQuantity: {
    fontSize: 16,
    marginHorizontal: 16,
  },
  itemPrice: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  total: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'right',
    marginTop: 16,
  },
  locationButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
  },
  dateButton: {
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
  map: {
    height: 200,
    borderRadius: 8,
  },
  checkoutButton: {
    margin: 16,
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  checkoutText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
});