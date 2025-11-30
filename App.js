import { useState } from 'react';
import {
  View,
  StyleSheet,
  FlatList,
  Button,
  Text,
  Pressable,
  Image,
} from 'react-native';
import GoalItem from './components/GoalItem';

const TABLES = [1, 2, 3, 4, 5];

const MENU_ITEMS = [
  // MEAT
  { id: 'kofte-ekmek', name: 'Köfte Ekmek', price: 180, category: 'MEAT' },
  { id: 'hamburger', name: 'Hamburger', price: 160, category: 'MEAT' },
  { id: 'kofte-tabak', name: 'Köfte Porsiyon', price: 220, category: 'MEAT' },

  // TOASTS
  { id: 'karisik-tost', name: 'Karışık Tost', price: 120, category: 'TOAST' },
  { id: 'kasarli-tost', name: 'Kaşarlı Tost', price: 100, category: 'TOAST' },
  { id: 'sucuklu-tost', name: 'Sucuklu Tost', price: 110, category: 'TOAST' },

  // POTATOES
  { id: 'patso', name: 'Patso', price: 95, category: 'POTATO' },
  { id: 'patates', name: 'Patates Kızartması', price: 75, category: 'POTATO' },

  // DESSERTS
  { id: 'waffle', name: 'Waffle', price: 150, category: 'DESSERT' },
  { id: 'cheesecake', name: 'Cheesecake', price: 140, category: 'DESSERT' },
  { id: 'tiramisu', name: 'Tiramisu', price: 130, category: 'DESSERT' },
  { id: 'trilece', name: 'Trileçe', price: 130, category: 'DESSERT' },
];
const POPULAR_IDS = [
  'kofte-ekmek',
  'hamburger',
  'karisik-tost',
  'patso',
  'waffle',
];

const CATEGORIES = [
  { id: 'POPULAR', label: 'Popüler Ürünler' },
  { id: 'MEAT', label: 'Et Menü' },
  { id: 'TOAST', label: 'Tostlar' },
  // you can add a separate potato section later if you want
  { id: 'DESSERT', label: 'Tatlı & Kahve' },
];


const PRODUCT_IMAGES = {
  'kofte-ekmek': require('./assets/kofte-ekmek.jpg'),
  'hamburger': require('./assets/hamburger.jpg'),
  'kofte-tabak': require('./assets/kofte-tabak.jpg'),

  'karisik-tost': require('./assets/karisik-tost.jpg'),
  'kasarli-tost': require('./assets/kasarli-tost.jpg'),
  'sucuklu-tost': require('./assets/sucuklu-tost.jpg'),

  'patso': require('./assets/patso.jpg'),
  'patates': require('./assets/patates.jpg'),

  'waffle': require('./assets/waffle.jpg'),
  'cheesecake': require('./assets/cheesecake.jpg'),
  'tiramisu': require('./assets/tiramisu.jpg'),
  'trilece': require('./assets/trilece.jpg'),
};



export default function App() {
  const [orders, setOrders] = useState([]);
  const [selectedTable, setSelectedTable] = useState(null);
  const [mode, setMode] = useState('WAITER'); // 'WAITER' | 'KITCHEN'
  const [basket, setBasket] = useState([]); // current order being built
  const [selectedCategory, setSelectedCategory] = useState('POPULAR');


  // ---------- BASKET & ORDER LOGIC ----------
  const filteredMenuItems = MENU_ITEMS.filter((item) => {
  if (selectedCategory === 'POPULAR') {
    return POPULAR_IDS.includes(item.id);
  }
  if (selectedCategory === 'MEAT') {
    return item.category === 'MEAT';
  }
  if (selectedCategory === 'TOAST') {
    return item.category === 'TOAST';
  }
  if (selectedCategory === 'DESSERT') {
    return item.category === 'DESSERT';
  }
  return true;
});


  function addItemToBasket(item) {
    setBasket((current) => {
      const existing = current.find((i) => i.id === item.id);
      if (existing) {
        return current.map((i) =>
          i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i
        );
      }
      return [...current, { ...item, quantity: 1 }];
    });
  }

  function clearBasket() {
    setBasket([]);
  }

  function submitOrder() {
    if (!selectedTable) {
      // you can replace this with Alert later if you want
      console.log('No table selected');
      return;
    }
    if (basket.length === 0) {
      console.log('Basket empty');
      return;
    }

    const selectedItems = basket.map((item) => ({
      name: item.name,
      quantity: item.quantity,
    }));

    setOrders((currentOrders) => [
      ...currentOrders,
      {
        id: Math.random().toString(),
        tableId: selectedTable,
        items: selectedItems,
        status: 'PENDING',
      },
    ]);

    clearBasket();
  }

  // WAITER: remove order (served)
  function deleteOrderHandler(id) {
    setOrders((currentOrders) =>
      currentOrders.filter((order) => order.id !== id)
    );
  }

  // KITCHEN: mark PENDING → READY
  function markOrderReady(id) {
    setOrders((currentOrders) =>
      currentOrders.map((order) =>
        order.id === id ? { ...order, status: 'READY' } : order
      )
    );
  }

  // (optional) could be used later to fully remove from kitchen
  function markOrderServed(id) {
    setOrders((currentOrders) =>
      currentOrders.filter((order) => order.id !== id)
    );
  }

  function formatOrderText(order) {
    if (!order.items || order.items.length === 0) {
      return 'Empty order';
    }

    return order.items
      .map((item) => `${item.quantity}x ${item.name}`)
      .join(', ');
  }

  const totalItems = basket.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = basket.reduce(
    (sum, item) => sum + item.quantity * item.price,
    0
  );

  // ------------------- UI -------------------

  return (
    <View style={styles.appContainer}>
      {/* Mode switcher */}
      <View style={styles.modeSwitchContainer}>
        <Button
          title="Waiter Mode"
          color={mode === 'WAITER' ? '#0acc2aff' : '#888'}
          onPress={() => setMode('WAITER')}
        />
        <Button
          title="Kitchen Mode"
          color={mode === 'KITCHEN' ? '#0acc2aff' : '#888'}
          onPress={() => setMode('KITCHEN')}
        />
      </View>

      {mode === 'WAITER' && (
        <View style={styles.waiterRoot}>
          {/* Table selector (top) */}
          <View style={styles.tableSelector}>
            <Text style={styles.sectionTitle}>Masa Seç</Text>
            <View style={styles.tablesRow}>
              {TABLES.map((tableId) => (
                <Pressable
                  key={tableId}
                  onPress={() => setSelectedTable(tableId)}
                  style={[
                    styles.tableChip,
                    selectedTable === tableId && styles.tableChipSelected,
                  ]}
                >
                <Text
  style={[
    styles.tableChipText,
    selectedTable === tableId && styles.tableChipTextSelected
  ]}
>
  Masa {tableId}
</Text>

                </Pressable>
              ))}
            </View>
          </View>

          {/* Main kiosk layout */}
          <View style={styles.waiterContent}>
            {/* Left category column (visual only for now) */}
           <View style={styles.categoryColumn}>
  {CATEGORIES.map((cat) => (
    <Pressable
      key={cat.id}
      onPress={() => setSelectedCategory(cat.id)}
      style={[
        styles.categoryButton,
        selectedCategory === cat.id && styles.categoryButtonSelected,
      ]}
    >
      <Text
        style={[
          styles.categoryText,
          selectedCategory === cat.id && styles.categoryTextSelected,
        ]}
      >
        {cat.label}
      </Text>
    </Pressable>
  ))}
</View>


            {/* Product grid */}
            <View style={styles.menuGridContainer}>
             <Text style={styles.gridTitle}>
  {CATEGORIES.find((c) => c.id === selectedCategory)?.label || 'Ürünler'}
</Text>
              <FlatList
                data={filteredMenuItems}
                keyExtractor={(item) => item.id}
                numColumns={2}
                contentContainerStyle={styles.menuList}
                renderItem={({ item }) => (
               <Pressable
  style={styles.productCard}
  onPress={() => addItemToBasket(item)}
>
  <Image
    source={PRODUCT_IMAGES[item.id]}
    style={styles.productImage}
    resizeMode="cover"
  />
  <Text style={styles.productName}>{item.name}</Text>
  <Text style={styles.productPrice}>
    TL {item.price.toFixed(2)}
  </Text>
</Pressable>

                )}
              />
            </View>
          </View>

          {/* Bottom "Siparişim" bar */}
          <View style={styles.cartBar}>
            <View>
              <Text style={styles.cartTitle}>Siparişim</Text>
              <Text style={styles.cartSubtitle}>
                {totalItems} ürün | TL {totalPrice.toFixed(2)}
              </Text>
              {selectedTable && (
                <Text style={styles.cartSubtitle}>Masa {selectedTable}</Text>
              )}
            </View>
            <View style={styles.cartButtons}>
              <Button title="Temizle" color="#c0392b" onPress={clearBasket} />
              <Button
                title="Siparişi Gönder"
                color="#27ae60"
                onPress={submitOrder}
              />
            </View>
          </View>
        </View>
      )}

      {mode === 'KITCHEN' && (
        <View style={styles.listContainer}>
          <Text style={styles.sectionTitle}>Kitchen Orders</Text>
          {orders.length === 0 && (
            <Text style={styles.emptyText}>No orders yet.</Text>
          )}
          <FlatList
            data={orders}
            keyExtractor={(item) => item.id}
            renderItem={(itemData) => {
              const order = itemData.item;
              return (
                <GoalItem
                  id={order.id}
                  text={`Table ${order.tableId}: ${formatOrderText(order)} [${order.status}]`}
                  onDelete={markOrderReady} // kitchen tap = mark ready
                />
              );
            }}
          />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  appContainer: {
    flex: 1,
    paddingTop: 40,
    paddingHorizontal: 16,
    backgroundColor: '#ffffff',
  },
  modeSwitchContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },

  // Waiter layout
  waiterRoot: {
    flex: 1,
  },
  tableSelector: {
    marginBottom: 8,
  },
  tablesRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 4,
  },
  tableChip: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#0acc2aff',
    marginRight: 6,
    marginBottom: 6,
    backgroundColor: '#ffffff',
  },
  tableChipSelected: {
    backgroundColor: '#0acc2aff',
  },
  tableChipTextSelected: {
  color: '#ffffff',
  fontWeight: '700',
},
  waiterContent: {
    flex: 1,
    flexDirection: 'row',
    marginTop: 4,
  },
  categoryColumn: {
    width: 110,
    marginRight: 8,
  },
  categoryButton: {
    paddingVertical: 10,
    paddingHorizontal: 8,
    marginBottom: 4,
    borderRadius: 8,
    backgroundColor: '#f2f2f2',
  },
  categoryText: {
    color: '#333',
    fontSize: 13,
  },

 menuGridContainer: {
  flex: 1,
  paddingHorizontal: 4,   // 👈 Helps spacing look clean
},
  gridTitle: {
    color: '#333',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  menuList: {
  justifyContent: 'space-between',
  paddingBottom: 80,
},
productCard: {
  width: '48%',               // 👈 FIXES the stretching issue
  backgroundColor: '#ffffff',
  borderRadius: 12,
  borderWidth: 1,
  borderColor: '#eee',
  padding: 8,
  marginBottom: 12,
}
,
  productImagePlaceholder: {
    height: 70,
    borderRadius: 8,
    backgroundColor: '#f0f0f0',
    marginBottom: 6,
  },
  productName: {
    fontSize: 13,
    fontWeight: '600',
    marginBottom: 4,
    color: '#333',
  },
  productPrice: {
    fontSize: 13,
    fontWeight: 'bold',
    color: '#27ae60',
  },

  cartBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderTopWidth: 1,
    borderColor: '#ddd',
    backgroundColor: '#fafafa',
  },
  cartTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#333',
  },
  cartSubtitle: {
    fontSize: 13,
    color: '#666',
  },
  cartButtons: {
    flexDirection: 'row',
    gap: 8,
  },

  // Kitchen list
  listContainer: {
    flex: 1,
    marginTop: 16,
  },
  sectionTitle: {
    color: '#333',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  emptyText: {
    color: '#888',
    fontSize: 16,
  },
  productImage: {
  height: 80,
  borderRadius: 8,
  backgroundColor: '#f0f0f0',
  marginBottom: 6,
  width: '100%',
},

});
