import { useSQLiteContext } from 'expo-sqlite';
import React from 'react';
import { ActivityIndicator, FlatList, StyleSheet, Text, View } from 'react-native';

type Product = {
  itemID: number;
  itemName: string;
  itemQuantity: number; // Added the new quantity field
};

export default function Inventory() {
  const db = useSQLiteContext();
  const [products, setProducts] = React.useState<Product[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);

  React.useEffect(() => {
    const loadInventory = async () => {
      try {
        // Updated query to include itemQuantity
        const results = await db.getAllAsync<Product>(
          'SELECT itemID, itemName, itemQuantity FROM products ORDER BY itemID'
        );
        setProducts(results);
      } catch (error) {
        console.error('Failed to load inventory:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadInventory();
  }, []);

  if (isLoading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" />
        <Text>Loading inventory...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Inventory</Text>
      <FlatList
        data={products}
        keyExtractor={(item) => item.itemID.toString()}
        renderItem={({ item }) => (
          <View style={styles.item}>
            <Text style={styles.itemId}>ID: {item.itemID}</Text>
            <Text style={styles.itemName}>{item.itemName}</Text>
            <Text style={styles.itemQuantity}>Qty: {item.itemQuantity}</Text>
          </View>
        )}
        ListEmptyComponent={
          <Text style={styles.empty}>No products found</Text>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  item: {
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  itemId: {
    color: '#666',
    fontSize: 14,
  },
  itemName: {
    fontSize: 18,
    marginTop: 4,
    fontWeight: '500',
  },
  itemQuantity: { // New style for quantity
    fontSize: 16,
    marginTop: 4,
    color: '#2e7d32', // Green color for quantity
    fontWeight: 'bold',
  },
  empty: {
    textAlign: 'center',
    marginTop: 20,
    fontSize: 16,
    color: '#888',
  },
});