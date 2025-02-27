import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../contexts/ThemeContext';

export default function HomeScreen() {
  const navigation = useNavigation();
  const theme = useTheme();

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <View style={styles.header}>
        <Image
          source={require('../assets/logo.png')}
          style={styles.logo}
          resizeMode="contain"
        />
        <Text style={[styles.title, { color: theme.colors.secondary }]}>
          Хитрите Мечоци
        </Text>
        <Text style={[styles.subtitle, { color: theme.colors.gray }]}>
          Най-вкусните понички и царевица
        </Text>
      </View>

      <View style={styles.content}>
        <TouchableOpacity
          style={[styles.button, { backgroundColor: theme.colors.primary }]}
          onPress={() => navigation.navigate('Order')}
        >
          <Ionicons name="cart-outline" size={24} color={theme.colors.secondary} />
          <Text style={[styles.buttonText, { color: theme.colors.secondary }]}>
            Поръчай Сега
          </Text>
        </TouchableOpacity>

        <View style={styles.features}>
          <FeatureItem
            icon="location-outline"
            title="Намери ни"
            description="Открий най-близката количка до теб"
          />
          <FeatureItem
            icon="time-outline"
            title="Бърза доставка"
            description="Избери удобен час за доставка"
          />
          <FeatureItem
            icon="star-outline"
            title="Качество"
            description="Винаги пресни продукти"
          />
        </View>
      </View>
    </View>
  );
}

function FeatureItem({ icon, title, description }) {
  const theme = useTheme();
  
  return (
    <View style={styles.featureItem}>
      <Ionicons name={icon} size={32} color={theme.colors.primary} />
      <Text style={[styles.featureTitle, { color: theme.colors.secondary }]}>
        {title}
      </Text>
      <Text style={[styles.featureDescription, { color: theme.colors.gray }]}>
        {description}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    alignItems: 'center',
    padding: 20,
  },
  logo: {
    width: 120,
    height: 120,
    marginBottom: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
  },
  content: {
    flex: 1,
    padding: 20,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    borderRadius: 12,
    marginBottom: 32,
  },
  buttonText: {
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 8,
  },
  features: {
    flex: 1,
  },
  featureItem: {
    alignItems: 'center',
    marginBottom: 24,
  },
  featureTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 8,
    marginBottom: 4,
  },
  featureDescription: {
    textAlign: 'center',
    fontSize: 14,
  },
});
