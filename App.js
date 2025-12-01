import { useState } from 'react';
import {
  View,
  StyleSheet,
  FlatList,
  Button,
  TextInput,
  Text,
  Pressable,
  Image,
} from 'react-native';
import GoalItem from './components/GoalItem';

const TABLES = [1, 2, 3, 4, 5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22];

const MENU_ITEMS = [
  // MEAT
  { id: 'kofte-ekmek', name: 'Köfte Ekmek', price: 250, category: 'MEAT' },
  { id: 'hamburger', name: 'Hamburger', price: 300, category: 'MEAT' },
  { id: 'kofte-tabak', name: 'Köfte Porsiyon', price: 350, category: 'MEAT' },

  // TOASTS
  { id: 'karisik-tost', name: 'Karışık Tost', price: 150, category: 'TOAST' },
  { id: 'kasarli-tost', name: 'Kaşarlı Tost', price: 130, category: 'TOAST' },
  { id: 'sucuklu-tost', name: 'Sucuklu Tost', price: 140, category: 'TOAST' },

  // POTATOES
  { id: 'patso', name: 'Patso', price: 150, category: 'POTATO' },
  { id: 'patates', name: 'Patates Kızartması', price: 150, category: 'POTATO' },

  // DESSERTS
  { id: 'waffle', name: 'Waffle', price: 150, category: 'DESSERT' },
  { id: 'cheesecake', name: 'Cheesecake', price: 200, category: 'DESSERT' },
  { id: 'tiramisu', name: 'Tiramisu', price: 150, category: 'DESSERT' },
  { id: 'trilece', name: 'Trileçe', price: 150, category: 'DESSERT' },
];

const POPULAR_IDS = [
  'kofte-ekmek',
  'hamburger',
  'karisik-tost',
  'patso',
  
];

const CATEGORIES = [
  { id: 'POPULAR', label: 'Popüler Ürünler' },
  { id: 'MEAT', label: 'Et Menü' },
  { id: 'TOAST', label: 'Tostlar' },
  { id: 'DESSERT', label: 'Tatlı & Kahve' },
];

const PRODUCT_IMAGES = {
  'kofte-ekmek': require('./assets/kofte-ekmek.jpg'),
  hamburger: require('./assets/hamburger.jpg'),
  'kofte-tabak': require('./assets/kofte-tabak.jpg'),

  'karisik-tost': require('./assets/karisik-tost.jpg'),
  'kasarli-tost': require('./assets/kasarli-tost.jpg'),
  'sucuklu-tost': require('./assets/sucuklu-tost.jpg'),

  patso: require('./assets/patso.jpg'),
  patates: require('./assets/patates.jpg'),

  waffle: require('./assets/waffle.jpg'),
  cheesecake: require('./assets/cheesecake.jpg'),
  tiramisu: require('./assets/tiramisu.jpg'),
  trilece: require('./assets/trilece.jpg'),
};

const DRINK_OPTIONS = [
  { id: 'coke', label: 'Coca Cola', image: require('./assets/drink-coke.jpg') },
  { id: 'fanta', label: 'Fanta', image: require('./assets/drink-fanta.jpg') },
  { id: 'ayran', label: 'Ayran', image: require('./assets/drink-ayran.jpg') },
];

const SAUCE_OPTIONS = [
  { id: 'ketcap', label: 'Ketçap' },
  { id: 'mayonez', label: 'Mayonez' },
  { id: 'aci', label: 'Acı Sos' },
];

const SAUCE_IMAGES = {
  ketcap: require('./assets/sauce-ketcap.jpg'),
  mayonez: require('./assets/sauce-mayonez.jpg'),
  aci: require('./assets/sauce-aci.jpg'),
};

const ONION_IMAGE = require('./assets/onion.jpg');
const NO_ONION_IMAGE = require('./assets/no-onion.jpg');

function getTotalDrinks(dc) {
  return (dc.coke || 0) + (dc.fanta || 0) + (dc.ayran || 0);
}

export default function App() {
  const [orders, setOrders] = useState([]);
  const [selectedTable, setSelectedTable] = useState(null);
  const [mode, setMode] = useState('WAITER'); // 'WAITER' | 'KITCHEN'
  const [basket, setBasket] = useState([]); // current order being built
  const [selectedCategory, setSelectedCategory] = useState('POPULAR');

  const [customModalVisible, setCustomModalVisible] = useState(false);
  const [customProduct, setCustomProduct] = useState(null);

  const [onionYes, setOnionYes] = useState(1);
  const [onionNo, setOnionNo] = useState(0);
  const [quantity, setQuantity] = useState(1);

  const [drinkCounts, setDrinkCounts] = useState({
    coke: 0,
    fanta: 0,
    ayran: 0,
  });

  const [sauces, setSauces] = useState({
    ketcap: false,
    mayonez: false,
    aci: false,
  });

  const [validationModalVisible, setValidationModalVisible] = useState(false);
  const [validationMessage, setValidationMessage] = useState('');

  const [noteText, setNoteText] = useState('');

  // ---------- FILTERED MENU ----------
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

  // ---------- BASKET & ORDER LOGIC ----------
  function addItemToBasket(item) {
    const qtyToAdd = item.quantity ?? 1;

    setBasket((current) => {
      const existing = current.find((i) => i.id === item.id);
      if (existing) {
        return current.map((i) =>
          i.id === item.id
            ? { ...i, quantity: i.quantity + qtyToAdd }
            : i
        );
      }
      return [...current, { ...item, quantity: qtyToAdd }];
    });
  }

  function clearBasket() {
    setBasket([]);
  }

  function submitOrder() {
    if (!selectedTable) {
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
      onionYes: item.onionYes ?? 0,
      onionNo: item.onionNo ?? 0,
      drinks: item.drinks ?? { coke: 0, fanta: 0, ayran: 0 },
      sauces: item.sauces ?? {
        ketcap: false,
        mayonez: false,
        aci: false,
      },
      note: item.note ?? '',
    }));

    const orderNote = basket
      .map((item) => item.note)
      .filter(Boolean)
      .join(' | ');

    setOrders((currentOrders) => [
      ...currentOrders,
      {
        id: Math.random().toString(),
        tableId: selectedTable,
        items: selectedItems,
        status: 'PENDING',
        note: orderNote,
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

  function handleProductPress(item) {
    const needsDrink = ['kofte-ekmek', 'hamburger',"patso","karisik-tost","waffle"].includes(item.id);
    const needsOnion = item.id === 'kofte-ekmek';

    if (needsDrink || needsOnion) {
      setCustomProduct(item);
      setQuantity(1);
      setOnionYes(1);
      setOnionNo(0);
      setDrinkCounts({ coke: 0, fanta: 0, ayran: 0 });
      setSauces({ ketcap: false, mayonez: false, aci: false });
      setNoteText('');
      setCustomModalVisible(true);
    } else {
      addItemToBasket(item);
    }
  }

  function handleCustomizationComplete() {
    if (!customProduct) return;

    // Köfte ekmekte soğan adetleri toplamı quantity ile eşit olmalı
    if (customProduct.id === 'kofte-ekmek') {
      if (onionYes + onionNo !== quantity) {
        setValidationMessage(
          'Soğan adetleri toplamı ürün adediyle eşleşmiyor.'
        );
        setValidationModalVisible(true);
        return;
      }
    }

    // Toplam içecek sayısı quantity'den fazla olamaz
    const usedDrinks = getTotalDrinks(drinkCounts);
    if (usedDrinks > quantity) {
      setValidationMessage('İçecek sayısı ürün adedini geçemez.');
      setValidationModalVisible(true);
      return;
    }

    addItemToBasket({
      ...customProduct,
      quantity,
      onionYes,
      onionNo,
      drinks: drinkCounts,
      sauces,
      note: noteText,
    });

    setCustomModalVisible(false);
  }

  function increaseQuantity() {
    const newQ = quantity + 1;
    setQuantity(newQ);

    if (customProduct && customProduct.id === 'kofte-ekmek') {
      setOnionYes(onionYes + 1); // yeni eklenen varsayılan soğanlı
    }
  }

  function decreaseQuantity() {
    if (quantity === 1) return;

    const newQ = quantity - 1;
    setQuantity(newQ);

    if (customProduct && customProduct.id === 'kofte-ekmek') {
      if (onionYes > 0) {
        setOnionYes(onionYes - 1);
      } else if (onionNo > 0) {
        setOnionNo(onionNo - 1);
      }
    }
  }

  function formatOrderText(order) {
    if (!order.items || order.items.length === 0) {
      return 'Empty order';
    }

    return order.items
      .map((item) => {
        const extras = [];

        // Onion text
        if (item.onionYes || item.onionNo) {
          if (item.onionYes > 0) extras.push(`${item.onionYes} Soğanlı`);
          if (item.onionNo > 0) extras.push(`${item.onionNo} Soğansız`);
        }

        // Drink text
        if (item.drinks) {
          const d = item.drinks;
          const used =
            (d.coke || 0) + (d.fanta || 0) + (d.ayran || 0);

          if (d.coke > 0) extras.push(`${d.coke} Coca Cola`);
          if (d.fanta > 0) extras.push(`${d.fanta} Fanta`);
          if (d.ayran > 0) extras.push(`${d.ayran} Ayran`);

          if (used < item.quantity) {
            extras.push(`${item.quantity - used} İçecek Yok`);
          }
        }

        // Sauce text
        if (item.sauces) {
          const s = item.sauces;
          if (s.ketcap) extras.push('Ketçap');
          if (s.mayonez) extras.push('Mayonez');
          if (s.aci) extras.push('Acı Sos');
        }

        const baseText = `${item.quantity}x ${item.name}`;
        if (extras.length === 0) return baseText;

        return `${baseText} (${extras.join(', ')})`;
      })
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
          {/* Table selector */}
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
                      selectedTable === tableId &&
                        styles.tableChipTextSelected,
                    ]}
                  >
                    Masa {tableId}
                  </Text>
                </Pressable>
              ))}
            </View>
          </View>

          {/* Main waiter layout */}
          <View style={styles.waiterContent}>
            {/* Category column */}
            <View style={styles.categoryColumn}>
              {CATEGORIES.map((cat) => (
                <Pressable
                  key={cat.id}
                  onPress={() => setSelectedCategory(cat.id)}
                  style={[
                    styles.categoryButton,
                    selectedCategory === cat.id &&
                      styles.categoryButtonSelected,
                  ]}
                >
                  <Text
                    style={[
                      styles.categoryText,
                      selectedCategory === cat.id &&
                        styles.categoryTextSelected,
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
                {CATEGORIES.find((c) => c.id === selectedCategory)?.label ||
                  'Ürünler'}
              </Text>
              <FlatList
                data={filteredMenuItems}
                keyExtractor={(item) => item.id}
                numColumns={2}
                contentContainerStyle={styles.menuList}
                renderItem={({ item }) => (
                  <Pressable
                    style={styles.productCard}
                    onPress={() => handleProductPress(item)}
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

          {/* CUSTOMIZATION MODAL */}
          {customModalVisible && customProduct && (
            <View style={styles.customModal}>
              {/* Product header */}
              <View style={styles.customTopRow}>
                <Text style={styles.customTitle}>
                  {customProduct.name}
                </Text>
               
                <Image
                  source={PRODUCT_IMAGES[customProduct.id]}
                  style={styles.customProductImage}
                  resizeMode="cover"
                />
              </View>

              {/* QUANTITY */}
              <View style={styles.quantityRow}>
                <Pressable
                  style={styles.qtyButton}
                  onPress={decreaseQuantity}
                >
                  <Text style={styles.qtyButtonText}>-</Text>
                </Pressable>

                <Text style={styles.qtyText}>{quantity}</Text>

                <Pressable
                  style={styles.qtyButton}
                  onPress={increaseQuantity}
                >
                  <Text style={styles.qtyButtonText}>+</Text>
                </Pressable>
              </View>

              {/* ONION SECTION */}
              {customProduct.id === 'kofte-ekmek' && (
                <>
                  <Text style={styles.optionTitle}>
                    Soğan Seçimi
                  </Text>
                  <Text style={styles.optionSubtitle}>
                    Toplam: {onionYes + onionNo} / {quantity}
                  </Text>

                  <View style={styles.onionRow}>
                    {/* SOĞANLI */}
                    <View style={styles.onionOption}>
                      <Image
                        source={ONION_IMAGE}
                        style={styles.optionImage}
                        resizeMode="cover"
                      />
                      <Text style={styles.onionLabel}>Soğanlı</Text>

                      <View style={styles.onionCountRow}>
                        <Pressable
                          style={styles.qtyButton}
                          onPress={() => {
                            if (onionYes > 0) {
                              setOnionYes(onionYes - 1);
                              setOnionNo(onionNo + 1);
                            }
                          }}
                        >
                          <Text style={styles.qtyButtonText}>-</Text>
                        </Pressable>

                        <Text style={styles.qtyText}>
                          {onionYes}
                        </Text>

                        <Pressable
                          style={styles.qtyButton}
                          onPress={() => {
                            if (onionNo > 0) {
                              setOnionYes(onionYes + 1);
                              setOnionNo(onionNo - 1);
                            }
                          }}
                        >
                          <Text style={styles.qtyButtonText}>+</Text>
                        </Pressable>
                      </View>
                    </View>

                    {/* SOĞANSIZ */}
                    <View style={styles.onionOption}>
                      <View style={styles.onionNoWrapper}>
                        <Image
                          source={NO_ONION_IMAGE}
                          style={[
                            styles.optionImage,
                            styles.optionImageDisabled,
                          ]}
                          resizeMode="cover"
                        />
                        <View />
                        <View
                          style={[
                            styles.onionNoCrossLine,
                            styles.onionNoCrossLineReverse,
                          ]}
                        />
                      </View>
                      <Text style={styles.onionLabel}>
                        Soğansız
                      </Text>

                      <View style={styles.onionCountRow}>
                        <Pressable
                          style={styles.qtyButton}
                          onPress={() => {
                            if (onionNo > 0) {
                              setOnionNo(onionNo - 1);
                              setOnionYes(onionYes + 1);
                            }
                          }}
                        >
                          <Text style={styles.qtyButtonText}>-</Text>
                        </Pressable>

                        <Text style={styles.qtyText}>
                          {onionNo}
                        </Text>

                        <Pressable
                          style={styles.qtyButton}
                          onPress={() => {
                            if (onionYes > 0) {
                              setOnionNo(onionNo + 1);
                              setOnionYes(onionYes - 1);
                            }
                          }}
                        >
                          <Text style={styles.qtyButtonText}>+</Text>
                        </Pressable>
                      </View>
                    </View>
                  </View>
                </>
              )}

              {/* DRINKS SECTION */}
              {(customProduct.id === 'kofte-ekmek' ||
                customProduct.id === 'hamburger') && (
                <>
                  <Text style={styles.optionTitle}>İçecekler</Text>
                  <Text style={styles.optionSubtitle}>
                    Toplam içecek: {getTotalDrinks(drinkCounts)} /{' '}
                    {quantity}{'\n'}
                    Seçilmemiş kalanlar: İçecek Yok
                  </Text>

                  <View style={styles.drinkGrid}>
                    {DRINK_OPTIONS.map((drink) => {
                      const count = drinkCounts[drink.id] || 0;
                      return (
                        <View
                          key={drink.id}
                          style={styles.drinkCard}
                        >
                          <Image
                            source={drink.image}
                            style={styles.drinkImage}
                            resizeMode="contain"
                          />
                          <Text style={styles.drinkLabel}>
                            {drink.label}
                          </Text>

                          <View style={styles.drinkCountRow}>
                            <Pressable
                              style={styles.qtyButton}
                              onPress={() =>
                                setDrinkCounts((prev) => ({
                                  ...prev,
                                  [drink.id]:
                                    prev[drink.id] > 0
                                      ? prev[drink.id] - 1
                                      : 0,
                                }))
                              }
                            >
                              <Text style={styles.qtyButtonText}>
                                -
                              </Text>
                            </Pressable>

                            <Text style={styles.qtyText}>
                              {count}
                            </Text>

                            <Pressable
                              style={styles.qtyButton}
                              onPress={() =>
                                setDrinkCounts((prev) => {
                                  const used = getTotalDrinks(prev);
                                  if (used >= quantity) return prev;
                                  return {
                                    ...prev,
                                    [drink.id]:
                                      (prev[drink.id] || 0) + 1,
                                  };
                                })
                              }
                            >
                              <Text style={styles.qtyButtonText}>
                                +
                              </Text>
                            </Pressable>
                          </View>
                        </View>
                      );
                    })}
                  </View>
                </>
              )}

              {/* SAUCE SECTION */}
              {(customProduct.id === 'patso' ||
                customProduct.id === 'karisik-tost') && (
                <>
                  <Text style={styles.optionTitle}>Soslar</Text>
                

                  <View style={styles.sauceRowContainer}>
                    {SAUCE_OPTIONS.map((s) => {
                      const isActive = sauces[s.id];
                      return (
                        <Pressable
                          key={s.id}
                          style={[
                            styles.sauceItem,
                            isActive && styles.sauceItemActive,
                          ]}
                          onPress={() =>
                            setSauces((prev) => ({
                              ...prev,
                              [s.id]: !prev[s.id],
                            }))
                          }
                        >
                          <Image
                            source={SAUCE_IMAGES[s.id]}
                            style={styles.sauceImage}
                            resizeMode="contain"
                          />
                          <Text style={styles.sauceLabel}>
                            {s.label}
                          </Text>
                          <View
                            style={[
                              styles.checkbox,
                              isActive && styles.checkboxActive,
                            ]}
                          >
                            {isActive && (
                              <Text style={styles.checkboxCheck}>
                                ✓
                              </Text>
                            )}
                          </View>
                        </Pressable>
                      );
                    })}
                  </View>
                </>
              )}

              {/* NOTE */}
              <Text style={styles.optionTitle}>Ek Not</Text>
              <TextInput
                style={styles.noteInput}
                placeholder="Örn: Ekmeği az kızartın, acısız olsun..."
                placeholderTextColor="#aaa"
                multiline
                value={noteText}
                onChangeText={setNoteText}
              />

              {/* MODAL BUTTONS */}
              <View style={styles.modalButtons}>
                <Button
                  title="İptal"
                  color="#c0392b"
                  onPress={() => setCustomModalVisible(false)}
                />
                <Button
                  title="Siparişe Ekle"
                  color="#27ae60"
                  onPress={handleCustomizationComplete}
                />
              </View>
            </View>
          )}

          {/* VALIDATION MODAL */}
          {validationModalVisible && (
            <View style={styles.validationOverlay}>
              <View style={styles.validationBox}>
                <Text style={styles.validationText}>
                  {validationMessage}
                </Text>
                <Button
                  title="Tamam"
                  onPress={() => setValidationModalVisible(false)}
                />
              </View>
            </View>
          )}

          {/* Bottom cart bar */}
          <View style={styles.cartBar}>
            <View>
              <Text style={styles.cartTitle}>Siparişim</Text>
              <Text style={styles.cartSubtitle}>
                {totalItems} ürün | TL {totalPrice.toFixed(2)}
              </Text>
              {selectedTable && (
                <Text style={styles.cartSubtitle}>
                  Masa {selectedTable}
                </Text>
              )}
            </View>
            <View style={styles.cartButtons}>
              <Button
                title="Temizle"
                color="#c0392b"
                onPress={clearBasket}
              />
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
                  text={`Masa ${order.tableId}: ${formatOrderText(
                    order
                  )} [${order.status}]`}
                  onDelete={markOrderReady}
                  note={order.note}
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

  // ----- WAITER LAYOUT -----
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
    borderColor: '#0acc2a',
    marginRight: 6,
    marginBottom: 6,
    backgroundColor: '#ffffff',
  },

  tableChipSelected: {
    backgroundColor: '#0acc2a',
  },

  tableChipText: {
    color: '#0acc2a',
    fontWeight: '600',
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

  categoryButtonSelected: {
    backgroundColor: '#27ae60',
  },

  categoryText: {
    color: '#333',
    fontSize: 13,
  },

  categoryTextSelected: {
    color: '#ffffff',
    fontWeight: '700',
  },

  menuGridContainer: {
    flex: 1,
    paddingHorizontal: 4,
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
    width: '48%',
    backgroundColor: '#ffffff',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#eee',
    padding: 8,
    marginBottom: 12,
  },

  productImage: {
    height: 180,
    borderRadius: 8,
    backgroundColor: '#f0f0f0',
    marginBottom: 6,
    width: '100%',
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

  // ----- CART BAR -----
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

  // ----- KITCHEN LIST -----
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

  // ----- CUSTOMIZATION MODAL -----
  customModal: {
    position: 'absolute',
    top: -71,
    left: 10,
    right: 10,
    bottom: 80,
    backgroundColor: '#ffffff',
    borderRadius: 20,
    padding: 14,
    elevation: 15,
    borderWidth: 3,
    borderColor: '#0b6623',
  },

  customTopRow: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },

  customProductImage: {
    width: '50%',
    height: 170,
    borderRadius: 12,
    backgroundColor: '#f0f0f0',
    marginTop: 6,
  },

  customTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#333',
    textAlign: 'center',
  },

  customPrice: {
    fontSize: 18,
    fontWeight: '700',
    color: '#27ae60',
    textAlign: 'center',
    marginTop: 4,
  },

  optionTitle: {
    fontSize: 16,
    fontWeight: '700',
    marginTop: 8,
    color: '#333',
  },

  optionSubtitle: {
    fontSize: 12,
    color: '#777',
    marginBottom: 6,
  },

  // QUANTITY
  quantityRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
    gap: 12,
  },

  qtyButton: {
    width: 32,
    height: 32,
    borderRadius: 6,
    backgroundColor: '#0acc2a',
    justifyContent: 'center',
    alignItems: 'center',
  },

  qtyButtonText: {
    color: '#ffffff',
    fontSize: 20,
    fontWeight: '700',
    marginTop: -1,
  },

  qtyText: {
    fontSize: 18,
    fontWeight: '600',
    minWidth: 32,
    textAlign: 'center',
  },

  // ONION
  onionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
    marginTop: 4,
  },

  onionOption: {
    flex: 1,
    marginRight: 8,
    backgroundColor: '#fafafa',
    borderRadius: 12,
    padding: 6,
    borderWidth: 1,
    borderColor: '#ddd',
  },

  onionLabel: {
    textAlign: 'center',
    fontSize: 13,
    fontWeight: '600',
    color: '#333',
    marginTop: 4,
  },

  optionImage: {
    width: '100%',
    height: 150,
    borderRadius: 8,
  },

  optionImageDisabled: {
    opacity: 0.4,
  },

  onionCountRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 6,
    gap: 8,
  },

  onionNoWrapper: {
    position: 'relative',
  },

  onionNoCrossLineReverse: {
    transform: [{ rotate: '-45deg' }],
  },

  // DRINKS
  drinkGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 8,
  },

  drinkCard: {
    width: '31%',
    backgroundColor: '#fafafa',
    borderRadius: 10,
    padding: 6,
    borderWidth: 1,
    borderColor: '#ddd',
    marginBottom: 6,
    alignItems: 'center',
  },

  drinkImage: {
    width: 100,
    height: 100,
    marginBottom: 4,
  },

  drinkLabel: {
    fontSize: 11,
    textAlign: 'center',
    color: '#333',
    marginBottom: 2,
  },

  drinkCountRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },

  // SAUCES
  sauceRowContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 6,
    marginBottom: 4,
  },

  sauceItem: {
    width: '30%',
    backgroundColor: '#f2f2f2',
    borderRadius: 10,
    paddingVertical: 6,
    paddingHorizontal: 4,
    alignItems: 'center',
  },

  sauceItemActive: {
    backgroundColor: '#d6f5dd',
    borderWidth: 2,
    borderColor: '#27ae60',
  },

  sauceImage: {
    width: 86,
    height: 86,
    marginBottom: 4,
  },

  sauceLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#333',
    marginBottom: 2,
    textAlign: 'center',
  },

  checkbox: {
    width: 22,
    height: 22,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: '#aaa',
    justifyContent: 'center',
    alignItems: 'center',
  },

  checkboxActive: {
    backgroundColor: '#27ae60',
    borderColor: '#27ae60',
  },

  checkboxCheck: {
    color: 'white',
    fontSize: 16,
    fontWeight: '900',
  },

  noteInput: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 10,
    padding: 8,
    minHeight: 50,
    maxHeight: 80,
    marginTop: 4,
    fontSize: 13,
  },

  modalButtons: {
    marginTop: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },

  // VALIDATION MODAL
  validationOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },

  validationBox: {
    width: '70%',
    backgroundColor: '#fff',
    borderRadius: 14,
    padding: 16,
    elevation: 10,
  },

  validationText: {
    fontSize: 14,
    marginBottom: 12,
    color: '#333',
    textAlign: 'center',
  },
});
