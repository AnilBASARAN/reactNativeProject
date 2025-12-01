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

const TABLES = [1, 2, 3, 4, 5];

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

const DRINK_OPTIONS = [
  { id: 'none', label: 'İçecek Yok', image: require('./assets/no-drink.jpg') },
  { id: 'coke', label: 'Coca Cola', image: require('./assets/drink-coke.jpg') },
  { id: 'fanta', label: 'Fanta', image: require('./assets/drink-fanta.jpg') },
  { id: 'ayran', label: 'Ayran', image: require('./assets/drink-ayran.jpg') },
];

const SAUCE_OPTIONS = [
  { id: 'ketcap', label: 'Ketçap' },
  { id: 'mayonez', label: 'Mayonez' },
  { id: 'aci', label: 'Acı Sos' },
];


const ONION_IMAGE = require('./assets/onion.jpg');


export default function App() {
  const [orders, setOrders] = useState([]);
  const [selectedTable, setSelectedTable] = useState(null);
  const [mode, setMode] = useState('WAITER'); // 'WAITER' | 'KITCHEN'
  const [basket, setBasket] = useState([]); // current order being built
  const [selectedCategory, setSelectedCategory] = useState('POPULAR');
  const [customModalVisible, setCustomModalVisible] = useState(false);
const [customProduct, setCustomProduct] = useState(null);

// İçecek adetleri (sandviç başına kaç tane hangi içecek)
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


const [onionYes, setOnionYes] = useState(1); // start with 1 soğanlı
const [onionNo, setOnionNo] = useState(0);
const [quantity, setQuantity] = useState(1);

const [validationModalVisible, setValidationModalVisible] = useState(false);
const [validationMessage, setValidationMessage] = useState("");

const [noteText, setNoteText] = useState("");



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
  const qtyToAdd = item.quantity ?? 1; // default 1 if not provided

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

  // Keep all options from basket items
const selectedItems = basket.map((item) => ({
  name: item.name,
  quantity: item.quantity,
  onionYes: item.onionYes ?? 0,
  onionNo: item.onionNo ?? 0,
  drinks: item.drinks ?? item.drinkCounts ?? { coke: 0, fanta: 0, ayran: 0 },
  sauces: item.sauces ?? item.sauceCounts ?? { ketcap: 0, mayonez: 0, aci: 0 },
  note: item.note ?? '',
}));



  // Optional: aggregate notes into a single order-level note
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
      note: orderNote, // so GoalItem's note={order.note} actually has data
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
  function handleProductPress(item) {
  // Products that need customization
  const needsDrink = ['kofte-ekmek', 'hamburger'].includes(item.id);
  const needsOnion = item.id === 'kofte-ekmek';

  if (needsDrink || needsOnion) {
    setCustomProduct(item);
    setDrinkCounts({ coke: 0, fanta: 0, ayran: 0 });
  setSauces({ ketcap: false, mayonez: false, aci: false });

    setQuantity(1);           // new order starts with 1
    setOnionYes(1);           // 1 soğanlı by default
    setOnionNo(0);            // 0 soğansız
    setNoteText("");
    setCustomModalVisible(true);
  } else {
    // Items without customization go directly
    addItemToBasket(item);
  }
}

function getTotalDrinks(dc) {
  return dc.coke + dc.fanta + dc.ayran;
}


function handleCustomizationComplete() {
  // Köfte ekmekte soğan adetleri toplamı, ürün adedine eşit olmalı
  if (customProduct.id === 'kofte-ekmek') {
    if (onionYes + onionNo !== quantity) {
      setValidationMessage('Soğan adetleri toplamı ürün adediyle eşleşmiyor.');
      setValidationModalVisible(true);
      return;
    }
  }

  // İçecek (none dahil) zorunlu
  if (
    (customProduct.id === 'kofte-ekmek' || customProduct.id === 'hamburger') &&
    selectedDrink === null
  ) {
    setValidationMessage('Lütfen içecek seçiniz.');
    setValidationModalVisible(true);
    return;
  }

  // Seçeneklerle beraber ürünü sepete ekle
  addItemToBasket({
    ...customProduct,
    drinkCounts,   // istersen böyle obje de ekleyebilirsin
    sauceCounts,
    quantity: quantity,
    onionYes: onionYes,
    onionNo: onionNo,
    note: noteText,
  });

  setCustomModalVisible(false);
}



function increaseQuantity() {
  const newQ = quantity + 1;
  setQuantity(newQ);

  // If this is Köfte Ekmek, new units start as soğanlı
  if (customProduct && customProduct.id === 'kofte-ekmek') {
    setOnionYes(onionYes + 1);
  }
}

function decreaseQuantity() {
  if (quantity === 1) return;

  const newQ = quantity - 1;
  setQuantity(newQ);

  if (customProduct && customProduct.id === 'kofte-ekmek') {
    // remove from soğanlı first, then soğansız if needed
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
      let extras = [];

     // Onion text (adetli)
if (item.onionYes || item.onionNo) {
  if (item.onionYes > 0) extras.push(`${item.onionYes} Soğanlı`);
  if (item.onionNo > 0) extras.push(`${item.onionNo} Soğansız`);
}

// Drink text
if (item.drinks) {
  const d = item.drinks;
  if (d.coke > 0) extras.push(`${d.coke} Coca Cola`);
  if (d.fanta > 0) extras.push(`${d.fanta} Fanta`);
  if (d.ayran > 0) extras.push(`${d.ayran} Ayran`);

  const used = (d.coke || 0) + (d.fanta || 0) + (d.ayran || 0);
  if (used < item.quantity) {
    extras.push(`${item.quantity - used} İçecek Yok`);
  }
}

// Sauce text
// Sauce text
if (item.sauces) {
  const s = item.sauces;
  if (s.ketcap) extras.push('Ketçap');
  if (s.mayonez) extras.push('Mayonez');
  if (s.aci) extras.push('Acı Sos');
}




      const baseText = `${item.quantity}x ${item.name}`;

      if (extras.length === 0) {
        return baseText;
      }

      return `${baseText} (${extras.join(', ')})`;
    })
    .join(', ');
}


  function getDrinkLabel(drinkId) {
  const drink = DRINK_OPTIONS.find((d) => d.id === drinkId);
  return drink ? drink.label : null;
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

{customModalVisible && customProduct && (
  <View style={styles.customModal}>
    {/* Top product area */}
<View style={styles.customTopRow}>
  <Text style={styles.customTitle}>{customProduct.name}</Text>
  <Text style={styles.customPrice}>TL {customProduct.price.toFixed(2)}</Text>

  <Image
    source={PRODUCT_IMAGES[customProduct.id]}
    style={styles.customProductImage}
    resizeMode="cover"
  />
</View>


    {/* QUANTITY ROW */}
    <View style={styles.quantityRow}>
     <Pressable style={styles.qtyButton} onPress={decreaseQuantity}>
  <Text style={styles.qtyButtonText}>-</Text>
</Pressable>

<Text style={styles.qtyText}>{quantity}</Text>

<Pressable style={styles.qtyButton} onPress={increaseQuantity}>
  <Text style={styles.qtyButtonText}>+</Text>
</Pressable>

    </View>

{customProduct.id === 'kofte-ekmek' && (
  <>
    <Text style={styles.optionTitle}>Soğan Seçimi</Text>
    <Text style={styles.optionSubtitle}>
      Toplam: {onionYes + onionNo} / {quantity}
    </Text>

    <View style={styles.onionRow}>
      {/* SOĞANLI KARTI */}
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
              // soğanlı -> soğansız
              if (onionYes > 0) {
                setOnionYes(onionYes - 1);
                setOnionNo(onionNo + 1);
              }
            }}
          >
            <Text style={styles.qtyButtonText}>-</Text>
          </Pressable>

          <Text style={styles.qtyText}>{onionYes}</Text>

          <Pressable
            style={styles.qtyButton}
            onPress={() => {
              // soğansız -> soğanlı
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

      {/* SOĞANSIZ KARTI */}
      <View style={styles.onionOption}>
        <View style={styles.onionNoWrapper}>
          <Image
            source={ONION_IMAGE}
            style={[styles.optionImage, styles.optionImageDisabled]}
            resizeMode="cover"
          />
          {/* KIRMIZI X */}
          <View style={styles.onionNoCrossLine} />
          <View style={[styles.onionNoCrossLine, styles.onionNoCrossLineReverse]} />
        </View>

        <Text style={styles.onionLabel}>Soğansız</Text>

        <View style={styles.onionCountRow}>
          <Pressable
            style={styles.qtyButton}
            onPress={() => {
              // soğansız -> soğanlı
              if (onionNo > 0) {
                setOnionNo(onionNo - 1);
                setOnionYes(onionYes + 1);
              }
            }}
          >
            <Text style={styles.qtyButtonText}>-</Text>
          </Pressable>

          <Text style={styles.qtyText}>{onionNo}</Text>

          <Pressable
            style={styles.qtyButton}
            onPress={() => {
              // soğanlı -> soğansız
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


{(customProduct.id === 'kofte-ekmek' ||
  customProduct.id === 'hamburger') && (
  <>
   {/* SOS SEÇİMİ */}
<Text style={styles.optionTitle}>Soslar</Text>
<Text style={styles.optionSubtitle}>İstediğiniz sosları seçebilirsiniz</Text>

<View style={{ marginTop: 6 }}>
  {SAUCE_OPTIONS.map((s) => {
    const isActive = sauces[s.id];

    return (
      <Pressable
        key={s.id}
        style={[
          styles.sauceRow,
          isActive && styles.sauceRowActive,
        ]}
        onPress={() =>
          setSauces((prev) => ({
            ...prev,
            [s.id]: !prev[s.id], // TRUE ↔ FALSE toggle
          }))
        }
      >
        <Text style={styles.sauceLabel}>{s.label}</Text>

        {/* Checkbox */}
        <View
          style={[
            styles.checkbox,
            isActive && styles.checkboxActive,
          ]}
        >
          {isActive && <Text style={styles.checkboxCheck}>✓</Text>}
        </View>
      </Pressable>
    );
  })}
</View>

  </>
)}



    {/* DRINK SECTION – for köfte ekmek and hamburger */}
 {(customProduct.id === 'kofte-ekmek' ||
  customProduct.id === 'hamburger') && (
  <>
    <Text style={styles.optionTitle}>İçecek Seçimi</Text>
    <Text style={styles.optionSubtitle}>
      Toplam içecek: {getTotalDrinks(drinkCounts)} (Sipariş adedi: {quantity}) 
      {'\n'}Boş kalanlar "İçecek Yok" sayılır.
    </Text>

    <View style={styles.drinkRow}>
      {/* İÇECEK YOK KARTI (sadece gösterim) */}
      <View style={styles.drinkOption}>
        <Image
          source={DRINK_OPTIONS.find((d) => d.id === 'none').image}
          style={styles.drinkImage}
          resizeMode="cover"
        />
        <Text style={styles.drinkLabel}>İçecek Yok</Text>
        <Text style={styles.drinkCountText}>
          {Math.max(
            0,
            quantity - getTotalDrinks(drinkCounts)
          )}
        </Text>
      </View>

      {/* Cola */}
      <View style={styles.drinkOption}>
        <Image
          source={DRINK_OPTIONS.find((d) => d.id === 'coke').image}
          style={styles.drinkImage}
          resizeMode="cover"
        />
        <Text style={styles.drinkLabel}>Coca Cola</Text>

        <View style={styles.onionCountRow}>
          <Pressable
            style={styles.qtyButton}
            onPress={() =>
              setDrinkCounts((prev) =>
                prev.coke > 0 ? { ...prev, coke: prev.coke - 1 } : prev
              )
            }
          >
            <Text style={styles.qtyButtonText}>-</Text>
          </Pressable>

          <Text style={styles.qtyText}>{drinkCounts.coke}</Text>

          <Pressable
            style={styles.qtyButton}
            onPress={() =>
              setDrinkCounts((prev) => {
                const used = getTotalDrinks(prev);
                if (used >= quantity) return prev;
                return { ...prev, coke: prev.coke + 1 };
              })
            }
          >
            <Text style={styles.qtyButtonText}>+</Text>
          </Pressable>
        </View>
      </View>

      {/* Fanta */}
      <View style={styles.drinkOption}>
        <Image
          source={DRINK_OPTIONS.find((d) => d.id === 'fanta').image}
          style={styles.drinkImage}
          resizeMode="cover"
        />
        <Text style={styles.drinkLabel}>Fanta</Text>

        <View style={styles.onionCountRow}>
          <Pressable
            style={styles.qtyButton}
            onPress={() =>
              setDrinkCounts((prev) =>
                prev.fanta > 0 ? { ...prev, fanta: prev.fanta - 1 } : prev
              )
            }
          >
            <Text style={styles.qtyButtonText}>-</Text>
          </Pressable>

          <Text style={styles.qtyText}>{drinkCounts.fanta}</Text>

          <Pressable
            style={styles.qtyButton}
            onPress={() =>
              setDrinkCounts((prev) => {
                const used = getTotalDrinks(prev);
                if (used >= quantity) return prev;
                return { ...prev, fanta: prev.fanta + 1 };
              })
            }
          >
            <Text style={styles.qtyButtonText}>+</Text>
          </Pressable>
        </View>
      </View>

      {/* Ayran */}
      <View style={styles.drinkOption}>
        <Image
          source={DRINK_OPTIONS.find((d) => d.id === 'ayran').image}
          style={styles.drinkImage}
          resizeMode="cover"
        />
        <Text style={styles.drinkLabel}>Ayran</Text>

        <View style={styles.onionCountRow}>
          <Pressable
            style={styles.qtyButton}
            onPress={() =>
              setDrinkCounts((prev) =>
                prev.ayran > 0 ? { ...prev, ayran: prev.ayran - 1 } : prev
              )
            }
          >
            <Text style={styles.qtyButtonText}>-</Text>
          </Pressable>

          <Text style={styles.qtyText}>{drinkCounts.ayran}</Text>

          <Pressable
            style={styles.qtyButton}
            onPress={() =>
              setDrinkCounts((prev) => {
                const used = getTotalDrinks(prev);
                if (used >= quantity) return prev;
                return { ...prev, ayran: prev.ayran + 1 };
              })
            }
          >
            <Text style={styles.qtyButtonText}>+</Text>
          </Pressable>
        </View>
      </View>
    </View>
  </>
)}

{/* SOS SEÇİMİ */}
<Text style={styles.optionTitle}>Soslar</Text>
<Text style={styles.optionSubtitle}>İstediğiniz sosları seçebilirsiniz</Text>

<View style={{ marginTop: 6 }}>
  {SAUCE_OPTIONS.map((s) => {
    const isActive = sauces[s.id];

    return (
      <Pressable
        key={s.id}
        style={[
          styles.sauceRow,
          isActive && styles.sauceRowActive,
        ]}
        onPress={() =>
          setSauces((prev) => ({
            ...prev,
            [s.id]: !prev[s.id], // toggle true/false
          }))
        }
      >
        <Text style={styles.sauceLabel}>{s.label}</Text>

        {/* Checkbox */}
        <View
          style={[
            styles.checkbox,
            isActive && styles.checkboxActive,
          ]}
        >
          {isActive && <Text style={styles.checkboxCheck}>✓</Text>}
        </View>
      </Pressable>
    );
  })}
</View>


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

    {/* Buttons */}
    <View style={styles.modalButtons}>
      <Button title="İptal" color={"#c0392b"} onPress={() => setCustomModalVisible(false)} />
      <Button
        title="Siparişe Ekle"
        color="#27ae60"
        onPress={handleCustomizationComplete}
      />
    </View>
  </View>
)}



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
  text={`Masa ${order.tableId}: ${formatOrderText(order)} [${order.status}]`}
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
    paddingHorizontal: 4, // spacing for grid
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
    width: '48%', // fix odd last item stretching
    backgroundColor: '#ffffff',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#eee',
    padding: 8,
    marginBottom: 12,
  },

  productImage: {
    height: 80,
    borderRadius: 8,
    backgroundColor: '#f0f0f0',
    marginBottom: 6,
    width: '100%',
  },

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

  // ----- CUSTOMIZATION MODAL (BURGER KING STYLE) -----
customModal: {
  position: 'absolute',
  top: 5,                 // moved slightly up
  left: 10,                // wider modal
  right: 10,
  bottom: 100,              // increased modal height
  backgroundColor: '#ffffff',
  borderRadius: 22,        // smoother round edges
  padding: 20,
  elevation: 15,

  // NEW ✨ dark green edge
  borderWidth: 3,
  borderColor: '#0b6623',  // dark rich green (looks professional)
},

customTopRow: {
  alignItems: 'center',
  justifyContent: 'center',
  marginBottom: 16,
},


  customProductImage: {
    width: 310,
    height: 190,
    borderRadius: 12,
    backgroundColor: '#f0f0f0',
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
  marginBottom: 10,
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

  // onion options
  onionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
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

  optionImage: {
    width: '100%',
    height: 70,
    borderRadius: 8,
    marginBottom: 4,
  },

  optionImageDisabled: {
    opacity: 0.4,
  },

  optionBadge: {
    position: 'absolute',
    top: 4,
    right: 4,
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: '#27ae60',
    justifyContent: 'center',
    alignItems: 'center',
  },

  optionBadgeCancel: {
    backgroundColor: '#c0392b',
  },

  optionBadgeText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '700',
  },

optionSelectedBorder: {
  borderColor: '#0acc2a',   // brighter green
  borderWidth: 3,            // THICK border
  shadowColor: '#0acc2a',
  shadowOffset: { width: 0, height: 0 },
  shadowOpacity: 0.6,
  shadowRadius: 8,
  elevation: 8,               // Android shadow
},


  onionLabel: {
    textAlign: 'center',
    fontSize: 13,
    fontWeight: '600',
    color: '#333',
  },

  // drink options
  drinkRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
    marginTop: 4,
  },

  drinkOption: {
    flex: 1,
    marginRight: 8,
    backgroundColor: '#fafafa',
    borderRadius: 12,
    padding: 6,
    borderWidth: 1,
    borderColor: '#ddd',
    alignItems: 'center',
  },

  drinkImage: {
    width: 50,
    height: 80,
    borderRadius: 8,
    marginBottom: 4,
    backgroundColor: '#f0f0f0',
  },

  drinkLabel: {
    fontSize: 12,
    textAlign: 'center',
    color: '#333',
  },

  modalButtons: {
    marginTop: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },

  // ----- (OLD GENERIC OPTION STYLES – keep if you still use them) -----
  row: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 10,
  },

  optionButton: {
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#aaa',
    backgroundColor: '#eee',
  },

  optionSelected: {
    backgroundColor: '#5e0acc',
    borderColor: '#5e0acc',
  },

  optionText: {
    color: 'black',
    fontWeight: '600',
  },
  quantityRow: {
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'center',
  marginBottom: 12,
  gap: 12,
},

qtyButton: {
  width: 34,
  height: 34,
  borderRadius: 6,
  backgroundColor: '#0acc2a',
  justifyContent: 'center',
  alignItems: 'center',
},

qtyButtonText: {
  color: '#ffffff',
  fontSize: 24,
  fontWeight: '700',
  marginTop: -2, // optical centering
},

qtyText: {
  fontSize: 20,
  fontWeight: '600',
  minWidth: 32,
  textAlign: 'center',
},
onionCountRow: {
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'center',
  marginTop: 6,
  gap: 8,
},

onionCountLabel: {
  fontSize: 14,
  fontWeight: '600',
  marginBottom: 4,
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

onionNoCrossLine: {
  position: 'absolute',
  left: 4,
  right: 4,
  top: 10,
  bottom: 10,
  borderTopWidth: 3,
  borderColor: '#c0392b',
  transform: [{ rotate: '45deg' }],
},

onionNoCrossLineReverse: {
  transform: [{ rotate: '-45deg' }],
},
drinkCountText: {
  marginTop: 4,
  fontSize: 14,
  fontWeight: '600',
},

sauceRow: {
  flexDirection: 'row',
  justifyContent: 'space-between',
  alignItems: 'center',
  paddingVertical: 10,
  paddingHorizontal: 12,
  borderRadius: 10,
  backgroundColor: '#f2f2f2',
  marginBottom: 6,
},

sauceRowActive: {
  backgroundColor: '#d6f5dd',
  borderWidth: 2,
  borderColor: '#27ae60',
},

sauceLabel: {
  fontSize: 15,
  fontWeight: '600',
  color: '#333',
},

checkbox: {
  width: 26,
  height: 26,
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
  fontSize: 18,
  fontWeight: '900',
},


});

