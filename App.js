import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  FlatList,
  Button,
  TextInput,
  Text,
  Pressable,
  Image,
  Modal,
  ScrollView,
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

  // DRINK
  { id: 'coke', name: 'Coca Cola', price: 70, category: 'DRINK' },
  { id: 'fanta', name: 'Fanta', price: 70, category: 'DRINK' },
  { id: 'ayran', name: 'Ayran', price: 50, category: 'DRINK' },
];

  


const POPULAR_IDS = [
  'kofte-ekmek',
  'hamburger',
  'karisik-tost',
  'patso',
  
];

const CATEGORIES = [
  { id: 'POPULAR', label: 'Popüler' },
  { id: 'MEAT', label: 'Et Menü' },
  { id: 'TOAST', label: 'Tostlar' },
  { id: 'DESSERT', label: 'Tatlı & Kahve' },
  { id: 'DRINK', label: 'Soğuk İçecekler' }, // 🆕
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

  // 🧊 Soğuk içecekler
  coke: require('./assets/drink-coke.jpg'),
  fanta: require('./assets/drink-fanta.jpg'),
  ayran: require('./assets/drink-ayran.jpg'),
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

// --- BACKEND CONFIG ---
const API_URL = 'http://192.168.0.13:3000'; // ← BURAYI kendi IP adresinle değiştir

async function fetchOrdersFromServer() {
  try {
    const res = await fetch(`${API_URL}/orders`);
    if (!res.ok) {
      console.log('Failed to fetch orders from server');
      return [];
    }
    const data = await res.json();
    // data array değilse fallback
    if (!Array.isArray(data)) return [];
    return data;
  } catch (err) {
    console.log('Error fetching orders from server:', err);
    return [];
  }
}

async function syncOrdersToServer(newOrders) {
  try {
    await fetch(`${API_URL}/orders`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newOrders),
    });
  } catch (err) {
    console.log('Error syncing orders to server:', err);
  }
}



export default function App() {
  

    const [orders, setOrders] = useState([]);// BU KALACAK orders, setOrders 
  const [selectedTable, setSelectedTable] = useState(null);

  // 👇 Server’a da push eden wrapper
  function updateOrders(updater) {
    setOrders((current) => {
      const next = updater(current);
      // async ama fire-and-forget
      syncOrdersToServer(next);
      return next;
    });
  }




  const [mode, setMode] = useState('ORDER'); // ORDER | KITCHEN | WAITER | CASHIER

  const [selectedCashierItems, setSelectedCashierItems] = useState([]);
  const [selectedWaiterItems, setSelectedWaiterItems] = useState([]);
  const [selectedKitchenItems, setSelectedKitchenItems] = useState([]);
  const [expandedTables, setExpandedTables] = useState({});

const [tablesExpanded, setTablesExpanded] = useState(true);


  
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

    // Uygulama açılınca server’dan orders çek + 2 saniyede bir yenile
  React.useEffect(() => {
    let isMounted = true;

    async function loadInitial() {
      const serverOrders = await fetchOrdersFromServer();
      if (isMounted) {
        setOrders(serverOrders);
      }
    }

    loadInitial();

    const interval = setInterval(async () => {
      const serverOrders = await fetchOrdersFromServer();
      if (isMounted) {
        setOrders(serverOrders);
      }
    }, 2000); // 2 saniyede bir

    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, []);


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
  if (selectedCategory === 'DRINK') {
    return item.category === 'DRINK';
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
    setValidationMessage('Önce masa seçmelisiniz.');
    setValidationModalVisible(true);
    return;
  }
  if (basket.length === 0) {
    setValidationMessage('Sepet boş, ürün ekleyin.');
    setValidationModalVisible(true);
    return;
  }

const selectedItems = basket.map((item) => ({
  id: item.id,
  name: item.name,
  price: item.price,
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
  paidCount: item.paidCount || 0,   // ödeme adedi
  servedCount: item.servedCount || 0, // 🆕 servis adedi
}));




  const orderNote = basket
    .map((item) => item.note)
    .filter(Boolean)
    .join(' | ');

  updateOrders((currentOrders) => [
    ...currentOrders,
    {
      id: Math.random().toString(),
      tableId: selectedTable,
      items: selectedItems,
      status: 'PENDING',
      note: orderNote,
      paid: false,
    },
  ]);

  clearBasket();
}


  // WAITER: remove order (served)
  function deleteOrderHandler(id) {
    updateOrders((currentOrders) =>
      currentOrders.filter((order) => order.id !== id)
    );
  }
  //-----------------------------

  // Status helper’ları
function getKitchenStatusForUnit(unit) {
  // İçeceklerde mutfak durumu yok
  if (unit.isDrink) return '—';
  return unit.isReady ? 'READY' : 'PENDING';
}

function getServedStatusForUnit(unit) {
  return unit.isServed ? 'SERVED' : 'NOT SERVED';
}

function getPaidStatusForUnit(unit) {
  return unit.isPaid ? 'PAID' : 'NOT PAID';
}


function buildUnitsForTable(tableKey, tableOrders) {
  console.log('buildUnitsForTable called with:', tableKey, tableOrders);

  const units = [];

  // Güvenlik: tableOrders yoksa veya array değilse, boş dön
  if (!Array.isArray(tableOrders)) {
    return units;
  }

  tableOrders.forEach((order) => {
    // 👉 Backend'ten gelen eski/simple kayıtlar items içermiyor
    // Bunları atlıyoruz ki app çakılmasın
    if (!order || !Array.isArray(order.items)) {
      return;
    }

    order.items.forEach((it, itemIndex) => {
      const qty = it.quantity || 0;
      const readyCount = it.readyCount || 0;
      const servedCount = it.servedCount || 0;
      const paidCount = it.paidCount || 0;

      const menuDef = MENU_ITEMS.find((m) => m.id === it.id);
      const isDrink = menuDef?.category === 'DRINK';

      for (let unitIndex = 0; unitIndex < qty; unitIndex++) {
        const unitKey = `${order.id}|${itemIndex}|${unitIndex}|${tableKey}`;

        units.push({
          unitKey,
          orderId: order.id,
          itemIndex,
          unitIndex,
          name: it.name,
          price: it.price,
          note: it.note,
          isDrink,
          isReady: !isDrink && unitIndex < readyCount,
          isServed: unitIndex < servedCount,
          isPaid: unitIndex < paidCount,
        });
      }
    });
  });

  return units;
}



  //------------------------------

  // KITCHEN: mark PENDING → READY
  function markOrderReady(id) {
    updateOrders((currentOrders) =>
      currentOrders.map((order) =>
        order.id === id ? { ...order, status: 'READY' } : order
      )
    );
  }
  function toggleOrderPaid(id) {
  updateOrders((currentOrders) =>
    currentOrders.map((order) =>
      order.id === id ? { ...order, paid: !order.paid } : order
    )
  );
}

function handleProductPress(item) {
  console.log('handleProductPress ->', item.id);

  const needsCustomization = ['kofte-ekmek', 'hamburger', 'patso', 'karisik-tost', 'waffle']
    .includes(item.id);
  const needsOnion = item.id === 'kofte-ekmek';

  if (needsCustomization || needsOnion) {
    setCustomProduct(item);
    setQuantity(1);

    if (needsOnion) {
      setOnionYes(1);
      setOnionNo(0);
    } else {
      setOnionYes(0);
      setOnionNo(0);
    }

    setSauces({ ketcap: false, mayonez: false, aci: false });
    setNoteText('');
    setCustomModalVisible(true);
  } else {
    addItemToBasket(item);
  }
}


function toggleKitchenItemSelection(unitKey) {
  setSelectedKitchenItems((prev) =>
    prev.includes(unitKey)
      ? prev.filter((k) => k !== unitKey)
      : [...prev, unitKey]
  );
}



function getBasketCountById(id) {
  const found = basket.find((i) => i.id === id);
  return found ? found.quantity : 0;
}

function decrementItemInBasketById(id) {
  setBasket((current) => {
    const existing = current.find((i) => i.id === id);
    if (!existing) return current;

    if (existing.quantity <= 1) {
      // son 1 taneyse tamamen çıkar
      return current.filter((i) => i.id !== id);
    }

    // 1 azalt
    return current.map((i) =>
      i.id === id ? { ...i, quantity: i.quantity - 1 } : i
    );
  });
}


function readySelectedItemsForTable(tableKey) {
  updateOrders((currentOrders) => {
    // Bu masaya ait seçili unitKey'ler
    const selectedForTable = selectedKitchenItems.filter((k) =>
      k.endsWith(`|${tableKey}`)
    );
    if (selectedForTable.length === 0) return currentOrders;

    const updated = currentOrders.map((order) => {
      // Bu order'a ait seçili unitKey'ler
      const orderSelected = selectedForTable.filter((k) =>
        k.startsWith(order.id + '|')
      );
      if (orderSelected.length === 0) return order;

      const newItems = order.items.map((it, itemIndex) => {
        const itemKeys = orderSelected.filter((k) => {
          const parts = k.split('|');
          return parts[1] === String(itemIndex);
        });

        if (itemKeys.length === 0) return it;

        const qty = it.quantity || 0;
        const currentReady = it.readyCount || 0;
        const add = itemKeys.length;
        const newReady = Math.min(qty, currentReady + add);

        return {
          ...it,
          readyCount: newReady,   // ✅ SADECE readyCount
          // servedCount'a DOKUNMUYORUZ
        };
      });

      // Sadece yemekler (DRINK hariç) ready ise order.status = READY
      const allFoodReady = newItems
        .filter((it) => {
          const menuDef = MENU_ITEMS.find((m) => m.id === it.id);
          return menuDef?.category !== 'DRINK';
        })
        .every((it) => (it.readyCount || 0) >= (it.quantity || 0));

      return {
        ...order,
        items: newItems,
        status: allFoodReady ? 'READY' : 'PENDING',
      };
    });

    return updated;
  });

  // Bu masaya ait seçili mutfak item'larını temizle
  setSelectedKitchenItems((prev) =>
    prev.filter((k) => !k.endsWith(`|${tableKey}`))
  );
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

addItemToBasket({
  ...customProduct,
  quantity,
  onionYes,
  onionNo,
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

    // ---- TABLE → ORDERS grupla ----
  const tablesForCashier = Object.entries(
    orders.reduce((acc, order) => {
      const key = String(order.tableId);
      if (!acc[key]) acc[key] = [];
      acc[key].push(order);
      return acc;
    }, {})
  );



  // ---- SEÇİM TOGGLE FONKSİYONLARI ----
  function toggleCashierItemSelection(unitKey) {
    setSelectedCashierItems((prev) =>
      prev.includes(unitKey)
        ? prev.filter((k) => k !== unitKey)
        : [...prev, unitKey]
    );
  }

  function toggleWaiterItemSelection(unitKey) {
    setSelectedWaiterItems((prev) =>
      prev.includes(unitKey)
        ? prev.filter((k) => k !== unitKey)
        : [...prev, unitKey]
    );
  }

  function toggleKitchenItemSelection(unitKey) {
    setSelectedKitchenItems((prev) =>
      prev.includes(unitKey)
        ? prev.filter((k) => k !== unitKey)
        : [...prev, unitKey]
    );
  }

  // ---- ACTIONS: KITCHEN → READY ----
  function readySelectedItemsForTable(tableKey) {
    updateOrders((currentOrders) => {
      const selectedForTable = selectedKitchenItems.filter((k) =>
        k.endsWith(`|${tableKey}`)
      );
      if (selectedForTable.length === 0) return currentOrders;

      const updated = currentOrders.map((order) => {
        const orderSelected = selectedForTable.filter((k) =>
          k.startsWith(order.id + '|')
        );
        if (orderSelected.length === 0) return order;

        const newItems = order.items.map((it, itemIndex) => {
          const menuDef = MENU_ITEMS.find((m) => m.id === it.id);
          const isDrink = menuDef?.category === 'DRINK';
          if (isDrink) return it; // içecek mutfakta yok sayılır

          const itemKeys = orderSelected.filter((k) => {
            const parts = k.split('|');
            return parts[1] === String(itemIndex);
          });

          if (itemKeys.length === 0) return it;

          const qty = it.quantity || 0;
          const currentReady = it.readyCount || 0;
          const add = itemKeys.length;
          const newReady = Math.min(qty, currentReady + add);

          return {
            ...it,
            readyCount: newReady,
          };
        });

        const allFoodReady = newItems
          .filter((it) => {
            const menuDef = MENU_ITEMS.find((m) => m.id === it.id);
            return menuDef?.category !== 'DRINK';
          })
          .every(
            (it) => (it.readyCount || 0) >= (it.quantity || 0)
          );

        return {
          ...order,
          items: newItems,
          status: allFoodReady ? 'READY' : 'PENDING',
        };
      });

      return updated;
    });

    setSelectedKitchenItems((prev) =>
      prev.filter((k) => !k.endsWith(`|${tableKey}`))
    );
  }

  // ---- ACTIONS: WAITER → SERVED ----
  function serveSelectedItemsForTable(tableKey) {
    updateOrders((currentOrders) => {
      const selectedForTable = selectedWaiterItems.filter((k) =>
        k.endsWith(`|${tableKey}`)
      );
      if (selectedForTable.length === 0) return currentOrders;

      const updated = currentOrders.map((order) => {
        const orderSelected = selectedForTable.filter((k) =>
          k.startsWith(order.id + '|')
        );
        if (orderSelected.length === 0) return order;

        const newItems = order.items.map((it, itemIndex) => {
          const itemKeys = orderSelected.filter((k) => {
            const parts = k.split('|');
            return parts[1] === String(itemIndex);
          });

          if (itemKeys.length === 0) return it;

          const qty = it.quantity || 0;
          const currentServed = it.servedCount || 0;
          const add = itemKeys.length;
          const newServed = Math.min(qty, currentServed + add);

          return {
            ...it,
            servedCount: newServed, // sadece servedCount
          };
        });

        return {
          ...order,
          items: newItems,
        };
      });

      return updated;
    });

    setSelectedWaiterItems((prev) =>
      prev.filter((k) => !k.endsWith(`|${tableKey}`))
    );
  }

  // ---- ACTIONS: CASHIER → PAID ----
  function paySelectedItemsForTable(tableKey) {
    updateOrders((currentOrders) => {
      const selectedForTable = selectedCashierItems.filter((k) =>
        k.endsWith(`|${tableKey}`)
      );
      if (selectedForTable.length === 0) return currentOrders;

      const updated = currentOrders.map((order) => {
        const orderSelected = selectedForTable.filter((k) =>
          k.startsWith(order.id + '|')
        );
        if (orderSelected.length === 0) return order;

        const newItems = order.items.map((it, itemIndex) => {
          const itemKeys = orderSelected.filter((k) => {
            const parts = k.split('|');
            return parts[1] === String(itemIndex);
          });

          if (itemKeys.length === 0) return it;

          const qty = it.quantity || 0;
          const currentPaid = it.paidCount || 0;
          const add = itemKeys.length;
          const newPaid = Math.min(qty, currentPaid + add);

          return {
            ...it,
            paidCount: newPaid,
          };
        });

        return {
          ...order,
          items: newItems,
        };
      });

      return updated;
    });

    setSelectedCashierItems((prev) =>
      prev.filter((k) => !k.endsWith(`|${tableKey}`))
    );
  }

  // ---- STATUS HELPERS (CASHIER/WAITER için ortak kullanabiliriz) ----
  function getKitchenStatusForUnit(unit) {
    if (unit.isDrink) return '—'; // içecekte asla PENDING/READY yok
    return unit.isReady ? 'READY' : 'PENDING';
  }

  function getServedStatusForUnit(unit) {
    return unit.isServed ? 'SERVED' : 'NOT SERVED';
  }

  function getPaidStatusForUnit(unit) {
    return unit.isPaid ? 'PAID' : 'NOT PAID';
  }


  const lines = [];

  order.items.forEach((item) => {
    // Menüden bu ürünün kategorisini bul
    const menuDef = MENU_ITEMS.find((m) => m.id === item.id);

    // Eğer bu bir içecekse mutfakta göstermiyoruz
    if (menuDef && menuDef.category === 'DRINK') {
      return;
    }

    const extras = [];

    // Soğan metni
    if (item.onionYes || item.onionNo) {
      if (item.onionYes > 0) extras.push(`${item.onionYes} Soğanlı`);
      if (item.onionNo > 0) extras.push(`${item.onionNo} Soğansız`);
    }

    // Sos metni
    if (item.sauces) {
      const s = item.sauces;
      if (s.ketcap) extras.push('Ketçap');
      if (s.mayonez) extras.push('Mayonez');
      if (s.aci) extras.push('Acı Sos');
    }

    const baseText = `${item.quantity}x ${item.name}`;
    if (extras.length === 0) {
      lines.push(baseText);
    } else {
      lines.push(`${baseText} (${extras.join(', ')})`);
    }
  });

  // Eğer yemek yok, sadece içecek varsa:
  if (lines.length === 0) {
    return 'Sadece içecek (mutfak hazırlığı yok)';
  }

  return lines.join(', ');
}



const totalItems = basket.reduce((sum, item) => sum + item.quantity, 0);
const totalPrice = basket.reduce(
  (sum, item) => sum + item.quantity * item.price,
  0
);

function toggleCashierItemSelection(unitKey) {
  setSelectedCashierItems((prev) =>
    prev.includes(unitKey)
      ? prev.filter((k) => k !== unitKey)
      : [...prev, unitKey]
  );
}

function toggleWaiterItemSelection(unitKey) {
  setSelectedWaiterItems((prev) =>
    prev.includes(unitKey)
      ? prev.filter((k) => k !== unitKey)
      : [...prev, unitKey]
  );
}

function paySelectedItemsForTable(tableKey) {
  updateOrders((currentOrders) => {
    const toPayMap = {};

    selectedCashierItems.forEach((unitKey) => {
      const [orderId, itemIndexStr, unitIndexStr, unitTableKey] =
        unitKey.split('|');
      if (unitTableKey !== String(tableKey)) return;
      const itemIndex = parseInt(itemIndexStr, 10);
      const mapKey = `${orderId}|${itemIndex}`;
      toPayMap[mapKey] = (toPayMap[mapKey] || 0) + 1;
    });

    if (Object.keys(toPayMap).length === 0) return currentOrders;

    const updated = currentOrders.map((order) => {
      let changed = false;

      const newItems = order.items.map((item, idx) => {
        const mapKey = `${order.id}|${idx}`;
        const addCount = toPayMap[mapKey] || 0;
        if (!addCount) return item;

        const prevPaid = item.paidCount || 0;
        const totalQty = item.quantity || 0;
        const newPaid = Math.min(prevPaid + addCount, totalQty);

        if (newPaid !== prevPaid) {
          changed = true;
          return { ...item, paidCount: newPaid };
        }
        return item;
      });

      if (!changed) return order;
      return { ...order, items: newItems };
    });

    return updated;
  });

  // bu masaya ait seçili satırları temizle
  setSelectedCashierItems((prev) =>
    prev.filter((unitKey) => {
      const parts = unitKey.split('|');
      const unitTableKey = parts[3];
      return unitTableKey !== String(tableKey);
    })
  );
}

function serveSelectedItemsForTable(tableKey) {
  updateOrders((currentOrders) => {
    // Bu masaya ait seçili unitKey'ler
    const selectedForTable = selectedWaiterItems.filter((k) =>
      k.endsWith(`|${tableKey}`)
    );
    if (selectedForTable.length === 0) return currentOrders;

    const updated = currentOrders.map((order) => {
      // Bu order'a ait seçili unitKey'ler
      const orderSelected = selectedForTable.filter((k) =>
        k.startsWith(order.id + '|')
      );
      if (orderSelected.length === 0) return order;

      const newItems = order.items.map((it, itemIndex) => {
        // Bu itemIndex’e ait seçili unitKey’ler
        const itemKeys = orderSelected.filter((k) => {
          const parts = k.split('|');
          return parts[1] === String(itemIndex);
        });

        if (itemKeys.length === 0) return it;

        const qty = it.quantity || 0;
        const currentServed = it.servedCount || 0;
        const add = itemKeys.length;
        const newServed = Math.min(qty, currentServed + add);

        return {
          ...it,
          servedCount: newServed,   // 🔥 SADECE servedCount değişiyor
          // readyCount aynen bırakıyoruz
        };
      });

      // 🔥 ÖNEMLİ: Burada order.status'a DOKUNMUYORUZ
      return {
        ...order,
        items: newItems,
      };
    });

    return updated;
  });

  // Bu masaya ait seçili item'ları temizle
  setSelectedWaiterItems((prev) =>
    prev.filter((k) => !k.endsWith(`|${tableKey}`))
  );
}


const tablesForCashier = Object.entries(
  orders.reduce((acc, order) => {
    const key = String(order.tableId ?? 'Unknown');
    if (!acc[key]) acc[key] = [];
    acc[key].push(order);
    return acc;
  }, {})
);



// tablesForCashier: [ ['1', [order1, order2]], ['3', [order3]], ... ]


  // ------------------- UI -------------------

  return (
    <View style={styles.appContainer}>
      {/* Mode switcher */}
<View style={styles.modeSwitchContainer}>
  <Button
    title="Order"
    color={mode === 'ORDER' ? '#0acc2aff' : '#888'}
    onPress={() => setMode('ORDER')}
  />
  <Button
    title="Waiter"
    color={mode === 'WAITER' ? '#0acc2aff' : '#888'}
    onPress={() => setMode('WAITER')}
  />
  <Button
    title="Kitchen"
    color={mode === 'KITCHEN' ? '#0acc2aff' : '#888'}
    onPress={() => setMode('KITCHEN')}
  />
  <Button
    title="Cashier"
    color={mode === 'CASHIER' ? '#0acc2aff' : '#888'}
    onPress={() => setMode('CASHIER')}
  />
</View>


{mode === 'ORDER' && (
  <View style={styles.waiterRoot}>
    {/* Table selector */}
    <View style={styles.tableSelector}>
      <Pressable
        style={styles.tableSelectorHeader}
        onPress={() => setTablesExpanded((prev) => !prev)}
      >
        <Text style={styles.sectionTitle}>Masa Seç</Text>
      </Pressable>

      {tablesExpanded && (
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
      )}
    </View>

    {/* Main waiter layout */}
    <View style={styles.waiterContent}>
      {/* KATEGORİLER: ÜSTTE, TEK SATIR / WRAP */}
      <View style={styles.categoryRow}>
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

      {/* ALTTA: ÜRÜN GRID */}
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
          renderItem={({ item }) => {
            const countInBasket = getBasketCountById(item.id);
            const isDrink = item.category === 'DRINK';

            return (
              <View style={styles.productCardWrapper}>
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

                  {/* DRINK ise altına - sayı + counter koy */}
                  {isDrink && (
                    <View style={styles.drinkInlineCounter}>
                      <Pressable
                        style={styles.qtyButton}
                        onPress={() =>
                          decrementItemInBasketById(item.id)
                        }
                      >
                        <Text style={styles.qtyButtonText}>-</Text>
                      </Pressable>

                      <Text style={styles.qtyText}>{countInBasket}</Text>

                      <Pressable
                        style={styles.qtyButton}
                        onPress={() => handleProductPress(item)}
                      >
                        <Text style={styles.qtyButtonText}>+</Text>
                      </Pressable>
                    </View>
                  )}
                </Pressable>
              </View>
            );
          }}
        />
      </View>
    </View>

    {/* CUSTOMIZATION MODAL */}
    {customModalVisible && customProduct && (
      <View style={styles.customModalOverlay}>
        <View style={styles.customModalBox}>
          <ScrollView
            contentContainerStyle={styles.customModalContent}
            showsVerticalScrollIndicator={false}
          >
            {/* Product header */}
            <View style={styles.customTopRow}>
              <Text style={styles.customTitle}>{customProduct.name}</Text>

              <Image
                source={PRODUCT_IMAGES[customProduct.id]}
                style={styles.customProductImage}
                resizeMode="cover"
              />
            </View>

            {/* QUANTITY */}
            <View style={styles.quantityRow}>
              <Pressable style={styles.qtyButton} onPress={decreaseQuantity}>
                <Text style={styles.qtyButtonText}>-</Text>
              </Pressable>

              <Text style={styles.qtyText}>{quantity}</Text>

              <Pressable style={styles.qtyButton} onPress={increaseQuantity}>
                <Text style={styles.qtyButtonText}>+</Text>
              </Pressable>
            </View>

            {/* ONION SECTION – sadece köfte ekmek */}
            {customProduct.id === 'kofte-ekmek' && (
              <>
                <Text style={styles.optionTitle}>Soğan Seçimi</Text>
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

                      <Text style={styles.qtyText}>{onionYes}</Text>

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
                        style={[styles.optionImage, styles.optionImageDisabled]}
                        resizeMode="cover"
                      />
                      <View
                        style={[
                          styles.onionNoCrossLine,
                          styles.onionNoCrossLineReverse,
                        ]}
                      />
                    </View>
                    <Text style={styles.onionLabel}>Soğansız</Text>

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

                      <Text style={styles.qtyText}>{onionNo}</Text>

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
                        <Text style={styles.sauceLabel}>{s.label}</Text>
                        <View
                          style={[
                            styles.checkbox,
                            isActive && styles.checkboxActive,
                          ]}
                        >
                          {isActive && (
                            <Text style={styles.checkboxCheck}>✓</Text>
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
          </ScrollView>

          {/* MODAL BUTTONS – hep en altta görünür */}
          <View style={styles.modalButtonsRow}>
            <Pressable
              style={[styles.modalButton, styles.modalCancelButton]}
              onPress={() => setCustomModalVisible(false)}
            >
              <Text style={styles.modalButtonText}>İptal</Text>
            </Pressable>

            <Pressable
              style={[styles.modalButton, styles.modalConfirmButton]}
              onPress={handleCustomizationComplete}
            >
              <Text style={styles.modalButtonText}>Siparişi Ekle</Text>
            </Pressable>
          </View>
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

    {/* BOTTOM CART BAR */}
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
          color={selectedTable && basket.length > 0 ? '#27ae60' : '#aaa'}
          onPress={submitOrder}
          disabled={!selectedTable || basket.length === 0}
        />
      </View>
    </View>
  </View>
)}



      {mode === 'KITCHEN' && (
        <View style={styles.cashierContainer}>
          <Text style={styles.sectionTitle}>Kitchen Overview</Text>

          {tablesForCashier.length === 0 && (
            <Text style={styles.emptyText}>No orders yet.</Text>
          )}

          <FlatList
            data={tablesForCashier}
            keyExtractor={([tableKey]) => tableKey}
            renderItem={({ item }) => {
              const [tableKey, tableOrders] = item;
              const allUnits = buildUnitsForTable(tableKey, tableOrders);
              const foodUnits = allUnits.filter((u) => !u.isDrink);

              if (foodUnits.length === 0) return null;

              const unreadyUnits = foodUnits.filter(
                (u) => !u.isReady
              );
              const readyUnits = foodUnits.filter((u) => u.isReady);

              const totalCount = foodUnits.length;
              const readyCountTotal = readyUnits.length;
              const pendingCountTotal = unreadyUnits.length;

              const isExpanded = !!expandedTables[tableKey];

              const allUnreadySelected =
                unreadyUnits.length > 0 &&
                unreadyUnits.every((u) =>
                  selectedKitchenItems.includes(u.unitKey)
                );

              const selectedCount = unreadyUnits.filter((u) =>
                selectedKitchenItems.includes(u.unitKey)
              ).length;

              return (
                <View style={styles.cashierTableCard}>
                  {/* HEADER */}
                  <Pressable
                    onPress={() =>
                      setExpandedTables((prev) => ({
                        ...prev,
                        [tableKey]: !prev[tableKey],
                      }))
                    }
                  >
                    <Text style={styles.cashierTableTitle}>
                      Masa {tableKey}
                    </Text>
                    <View style={styles.cashierSummaryRow}>
                      <Text style={styles.cashierSummaryText}>
                        TOTAL: {totalCount} items
                      </Text>
                      <Text style={styles.cashierSummaryText}>
                        READY: {readyCountTotal}
                      </Text>
                      <Text style={styles.cashierSummaryText}>
                        PENDING: {pendingCountTotal}
                      </Text>
                    </View>
                    <Text
                      style={{
                        fontSize: 12,
                        color: '#888',
                        marginTop: 2,
                      }}
                    >
                      {isExpanded
                        ? '▲ Gizle'
                        : '▼ Detayları Göster'}
                    </Text>
                  </Pressable>

                  {isExpanded && (
                    <>
                      {/* Select All / Clear All */}
                      <View style={styles.cashierSelectAllRow}>
                        <Button
                          title={
                            allUnreadySelected
                              ? 'Clear All'
                              : 'Select All'
                          }
                          color="#0984e3"
                          onPress={() => {
                            const allKeys = unreadyUnits.map(
                              (u) => u.unitKey
                            );
                            if (allUnreadySelected) {
                              setSelectedKitchenItems((prev) =>
                                prev.filter(
                                  (k) => !allKeys.includes(k)
                                )
                              );
                            } else {
                              setSelectedKitchenItems((prev) => [
                                ...prev,
                                ...allKeys.filter(
                                  (k) => !prev.includes(k)
                                ),
                              ]);
                            }
                          }}
                        />
                      </View>

                      {/* PENDING (unready) items */}
                      {unreadyUnits.map((unit) => {
                        const isSelected =
                          selectedKitchenItems.includes(
                            unit.unitKey
                          );

                        const kitchenStatus = unit.isReady
                          ? 'READY'
                          : 'PENDING';
                        const servedStatus =
                          getServedStatusForUnit(unit);
                        const paidStatus =
                          getPaidStatusForUnit(unit);

                        return (
                          <Pressable
                            key={unit.unitKey}
                            style={[
                              styles.cashierOrderRow,
                              styles.cashierOrderRowUnpaid,
                              isSelected &&
                                styles.cashierOrderRowSelected,
                            ]}
                            onPress={() =>
                              toggleKitchenItemSelection(
                                unit.unitKey
                              )
                            }
                          >
                            <Text style={styles.cashierOrderText}>
                              {unit.name} - TL{' '}
                              {unit.price.toFixed(2)} [
                              {kitchenStatus} | {servedStatus} |{' '}
                              {paidStatus}]
                            </Text>
                          </Pressable>
                        );
                      })}

                      {/* READY items */}
                      {readyUnits.length > 0 && (
                        <View style={{ marginTop: 6 }}>
                          <Text
                            style={{
                              fontSize: 12,
                              color: '#555',
                              marginBottom: 2,
                            }}
                          >
                            Ready items:
                          </Text>
                          {readyUnits.map((unit) => {
                            const kitchenStatus = 'READY';
                            const servedStatus =
                              getServedStatusForUnit(unit);
                            const paidStatus =
                              getPaidStatusForUnit(unit);

                            return (
                              <View
                                key={unit.unitKey}
                                style={[
                                  styles.cashierOrderRow,
                                  styles.cashierOrderRowPaid,
                                ]}
                              >
                                <Text
                                  style={styles.cashierOrderText}
                                >
                                  {unit.name} - TL{' '}
                                  {unit.price.toFixed(2)} [
                                  {kitchenStatus} | {servedStatus}{' '}
                                  | {paidStatus}]
                                </Text>
                              </View>
                            );
                          })}
                        </View>
                      )}

                      {/* Mark Ready */}
                      <View style={styles.cashierPayRow}>
                        <Text
                          style={styles.cashierSummaryText}
                        >
                          Selected: {selectedCount} items
                        </Text>
                        <Button
                          title="Mark Ready"
                          color={
                            selectedCount > 0
                              ? '#27ae60'
                              : '#aaa'
                          }
                          onPress={() =>
                            readySelectedItemsForTable(tableKey)
                          }
                          disabled={selectedCount === 0}
                        />
                      </View>
                    </>
                  )}
                </View>
              );
            }}
          />
        </View>
      )}



      {mode === 'WAITER' && (
        <View style={styles.cashierContainer}>
          <Text style={styles.sectionTitle}>Waiter Overview</Text>

          {tablesForCashier.length === 0 && (
            <Text style={styles.emptyText}>No orders yet.</Text>
          )}

          <FlatList
            data={tablesForCashier}
            keyExtractor={([tableKey]) => tableKey}
            renderItem={({ item }) => {
              const [tableKey, tableOrders] = item;
              const allUnits = buildUnitsForTable(tableKey, tableOrders);

              if (allUnits.length === 0) return null;

              const unservedUnits = allUnits.filter(
                (u) => !u.isServed
              );
              const servedUnits = allUnits.filter(
                (u) => u.isServed
              );

              const totalCount = allUnits.length;
              const servedCountTotal = servedUnits.length;
              const unservedCountTotal = unservedUnits.length;

              const isExpanded = !!expandedTables[tableKey];

              const allUnservedSelected =
                unservedUnits.length > 0 &&
                unservedUnits.every((u) =>
                  selectedWaiterItems.includes(u.unitKey)
                );

              const selectedCount = unservedUnits.filter((u) =>
                selectedWaiterItems.includes(u.unitKey)
              ).length;

              return (
                <View style={styles.cashierTableCard}>
                  {/* HEADER */}
                  <Pressable
                    onPress={() =>
                      setExpandedTables((prev) => ({
                        ...prev,
                        [tableKey]: !prev[tableKey],
                      }))
                    }
                  >
                    <Text style={styles.cashierTableTitle}>
                      Masa {tableKey}
                    </Text>
                    <View style={styles.cashierSummaryRow}>
                      <Text style={styles.cashierSummaryText}>
                        TOTAL: {totalCount} items
                      </Text>
                      <Text style={styles.cashierSummaryText}>
                        SERVED: {servedCountTotal}
                      </Text>
                      <Text style={styles.cashierSummaryText}>
                        UNSERVED: {unservedCountTotal}
                      </Text>
                    </View>
                    <Text
                      style={{
                        fontSize: 12,
                        color: '#888',
                        marginTop: 2,
                      }}
                    >
                      {isExpanded
                        ? '▲ Gizle'
                        : '▼ Detayları Göster'}
                    </Text>
                  </Pressable>

                  {isExpanded && (
                    <>
                      {/* Select All / Clear All */}
                      <View style={styles.cashierSelectAllRow}>
                        <Button
                          title={
                            allUnservedSelected
                              ? 'Clear All'
                              : 'Select All'
                          }
                          color="#0984e3"
                          onPress={() => {
                            const allKeys = unservedUnits.map(
                              (u) => u.unitKey
                            );
                            if (allUnservedSelected) {
                              setSelectedWaiterItems((prev) =>
                                prev.filter(
                                  (k) => !allKeys.includes(k)
                                )
                              );
                            } else {
                              setSelectedWaiterItems((prev) => [
                                ...prev,
                                ...allKeys.filter(
                                  (k) => !prev.includes(k)
                                ),
                              ]);
                            }
                          }}
                        />
                      </View>

                      {/* UNSERVED items */}
                      {unservedUnits.map((unit) => {
                        const isSelected =
                          selectedWaiterItems.includes(
                            unit.unitKey
                          );

                        const kitchenStatus =
                          getKitchenStatusForUnit(unit);
                        const servedStatus =
                          getServedStatusForUnit(unit);
                        const paidStatus =
                          getPaidStatusForUnit(unit);

                        return (
                          <Pressable
                            key={unit.unitKey}
                            style={[
                              styles.cashierOrderRow,
                              styles.cashierOrderRowUnpaid,
                              isSelected &&
                                styles.cashierOrderRowSelected,
                            ]}
                            onPress={() =>
                              toggleWaiterItemSelection(
                                unit.unitKey
                              )
                            }
                          >
                            <Text style={styles.cashierOrderText}>
                              {unit.name} - TL{' '}
                              {unit.price.toFixed(2)} [
                              {kitchenStatus} | {servedStatus} |{' '}
                              {paidStatus}]
                            </Text>
                          </Pressable>
                        );
                      })}

                      {/* SERVED items */}
                      {servedUnits.length > 0 && (
                        <View style={{ marginTop: 6 }}>
                          <Text
                            style={{
                              fontSize: 12,
                              color: '#555',
                              marginBottom: 2,
                            }}
                          >
                            Served items:
                          </Text>
                          {servedUnits.map((unit) => {
                            const kitchenStatus =
                              getKitchenStatusForUnit(unit);
                            const servedStatus =
                              getServedStatusForUnit(unit);
                            const paidStatus =
                              getPaidStatusForUnit(unit);

                            return (
                              <View
                                key={unit.unitKey}
                                style={[
                                  styles.cashierOrderRow,
                                  styles.cashierOrderRowPaid,
                                ]}
                              >
                                <Text
                                  style={styles.cashierOrderText}
                                >
                                  {unit.name} - TL{' '}
                                  {unit.price.toFixed(2)} [
                                  {kitchenStatus} | {servedStatus}{' '}
                                  | {paidStatus}]
                                </Text>
                              </View>
                            );
                          })}
                        </View>
                      )}

                      {/* Serve button */}
                      <View style={styles.cashierPayRow}>
                        <Text
                          style={styles.cashierSummaryText}
                        >
                          Selected: {selectedCount} items
                        </Text>
                        <Button
                          title="Serve"
                          color={
                            selectedCount > 0
                              ? '#27ae60'
                              : '#aaa'
                          }
                          onPress={() =>
                            serveSelectedItemsForTable(tableKey)
                          }
                          disabled={selectedCount === 0}
                        />
                      </View>
                    </>
                  )}
                </View>
              );
            }}
          />
        </View>
      )}


      {mode === 'CASHIER' && (
        <View style={styles.cashierContainer}>
          <Text style={styles.sectionTitle}>Cashier Overview</Text>

          {tablesForCashier.length === 0 && (
            <Text style={styles.emptyText}>No orders yet.</Text>
          )}

          <FlatList
            data={tablesForCashier}
            keyExtractor={([tableKey]) => tableKey}
            renderItem={({ item }) => {
              const [tableKey, tableOrders] = item;
              const allUnits = buildUnitsForTable(tableKey, tableOrders);

              if (allUnits.length === 0) return null;

              const unpaidUnits = allUnits.filter(
                (u) => !u.isPaid
              );
              const paidUnits = allUnits.filter((u) => u.isPaid);

              const totalAmount =
                allUnits.reduce(
                  (s, u) => s + u.price,
                  0
                );
              const paidAmount = paidUnits.reduce(
                (s, u) => s + u.price,
                0
              );
              const unpaidAmount = unpaidUnits.reduce(
                (s, u) => s + u.price,
                0
              );

              const selectedAmount = unpaidUnits
                .filter((u) =>
                  selectedCashierItems.includes(u.unitKey)
                )
                .reduce((s, u) => s + u.price, 0);

              const isExpanded = !!expandedTables[tableKey];

              const allUnpaidSelected =
                unpaidUnits.length > 0 &&
                unpaidUnits.every((u) =>
                  selectedCashierItems.includes(u.unitKey)
                );

              return (
                <View style={styles.cashierTableCard}>
                  {/* HEADER */}
                  <Pressable
                    onPress={() =>
                      setExpandedTables((prev) => ({
                        ...prev,
                        [tableKey]: !prev[tableKey],
                      }))
                    }
                  >
                    <Text style={styles.cashierTableTitle}>
                      Masa {tableKey}
                    </Text>
                    <View style={styles.cashierSummaryRow}>
                      <Text style={styles.cashierSummaryText}>
                        TOTAL: TL {totalAmount.toFixed(2)}
                      </Text>
                      <Text style={styles.cashierSummaryText}>
                        PAID: TL {paidAmount.toFixed(2)}
                      </Text>
                      <Text style={styles.cashierSummaryText}>
                        UNPAID: TL {unpaidAmount.toFixed(2)}
                      </Text>
                    </View>
                    <Text
                      style={{
                        fontSize: 12,
                        color: '#888',
                        marginTop: 2,
                      }}
                    >
                      {isExpanded
                        ? '▲ Gizle'
                        : '▼ Detayları Göster'}
                    </Text>
                  </Pressable>

                  {isExpanded && (
                    <>
                      {/* Select All / Clear All */}
                      <View style={styles.cashierSelectAllRow}>
                        <Button
                          title={
                            allUnpaidSelected
                              ? 'Clear All'
                              : 'Select All'
                          }
                          color="#0984e3"
                          onPress={() => {
                            const allKeys = unpaidUnits.map(
                              (u) => u.unitKey
                            );
                            if (allUnpaidSelected) {
                              setSelectedCashierItems((prev) =>
                                prev.filter(
                                  (k) => !allKeys.includes(k)
                                )
                              );
                            } else {
                              setSelectedCashierItems((prev) => [
                                ...prev,
                                ...allKeys.filter(
                                  (k) => !prev.includes(k)
                                ),
                              ]);
                            }
                          }}
                        />
                      </View>

                      {/* UNPAID items */}
                {unpaidUnits.map((unit) => {
  const isSelected = selectedCashierItems.includes(unit.unitKey);
  const kitchenStatus = getKitchenStatusForUnit(unit);
  const servedStatus = getServedStatusForUnit(unit);
  const paidStatus = getPaidStatusForUnit(unit);

  return (
    <Pressable
      key={unit.unitKey}
      style={({ pressed }) => [
        styles.cashierOrderRow,
        styles.cashierOrderRowUnpaid,          // hafif kırmızı arka plan
        isSelected && styles.cashierOrderRowSelected, // seçilince hafif farklı renk
        pressed && { opacity: 0.7 },           // SADECE opacity değişiyor
      ]}
      onPress={() => toggleCashierItemSelection(unit.unitKey)}
    >
      <Text style={styles.cashierOrderText}>
        {unit.name} - TL {unit.price.toFixed(2)} [
        {kitchenStatus} | {servedStatus} | {paidStatus}]
      </Text>
    </Pressable>
  );
})}


                      {/* PAID items */}
                      {paidUnits.length > 0 && (
                        <View style={{ marginTop: 6 }}>
                          <Text
                            style={{
                              fontSize: 12,
                              color: '#555',
                              marginBottom: 2,
                            }}
                          >
                            Paid items:
                          </Text>
                          {paidUnits.map((unit) => {
                            const kitchenStatus =
                              getKitchenStatusForUnit(unit);
                            const servedStatus =
                              getServedStatusForUnit(unit);
                            const paidStatus =
                              getPaidStatusForUnit(unit);

                            return (
                              <View
                                key={unit.unitKey}
                                style={[
                                  styles.cashierOrderRow,
                                  styles.cashierOrderRowPaid,
                                ]}
                              >
                                <Text
                                  style={styles.cashierOrderText}
                                >
                                  {unit.name} - TL{' '}
                                  {unit.price.toFixed(2)} [
                                  {kitchenStatus} | {servedStatus}{' '}
                                  | {paidStatus}]
                                </Text>
                              </View>
                            );
                          })}
                        </View>
                      )}

                      {/* Pay */}
                      <View style={styles.cashierPayRow}>
                        <Text
                          style={styles.cashierSummaryText}
                        >
                          Selected: TL{' '}
                          {selectedAmount.toFixed(2)}
                        </Text>
                        <Button
                          title="Pay"
                          color={
                            selectedAmount > 0
                              ? '#27ae60'
                              : '#aaa'
                          }
                          onPress={() =>
                            paySelectedItemsForTable(tableKey)
                          }
                          disabled={selectedAmount === 0}
                        />
                      </View>
                    </>
                  )}
                </View>
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
  flexDirection: 'column',   // ← artık dikey
  marginTop: 4,
},

// categoryColumn artık kullanılmıyor, istersen silebilirsin
// categoryRow: yeni stil


categoryButton: {
  paddingVertical: 18,
  paddingHorizontal: 14,
  marginBottom: 14,
  marginRight:15,
  borderRadius: 12,
  backgroundColor: '#f7f7f7',
  shadowColor: '#000',
  shadowOpacity: 0.06,
  shadowRadius: 3,
  shadowOffset: { width: 0, height: 1 },
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




customModalScroll: {
  paddingBottom: 10,
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
    // ----- CASHIER -----
  cashierContainer: {
    flex: 1,
    marginTop: 16,
  },

  cashierTableCard: {
    marginBottom: 10,
    padding: 10,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#ddd',
    backgroundColor: '#fafafa',
  },

  cashierTableTitle: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 6,
    color: '#333',
  },

  cashierOrderRow: {
    paddingVertical: 6,
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },

  cashierOrderRowPaid: {
    backgroundColor: '#d6f5dd',
  },

  cashierOrderText: {
    fontSize: 13,
    color: '#333',
  },

  cashierOrderStatus: {
    fontSize: 12,
    color: '#555',
    marginTop: 2,
  },

  cashierOrderNote: {
    fontSize: 12,
    color: '#777',
    marginTop: 2,
    fontStyle: 'italic',
  },
  productImageWrapper: {
    position: 'relative',
  },

  itemCounterBadge: {
    position: 'absolute',
    top: 6,
    right: 6,
    minWidth: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: '#27ae60',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 4,
  },

  itemCounterText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '700',
  },
  cashierSummaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 6,
  },

  cashierSummaryText: {
    fontSize: 12,
    color: '#333',
    fontWeight: '600',
  },

  cashierOrderRowSelected: {
    backgroundColor: '#ffeaa7',
  },

  cashierPayRow: {
    marginTop: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
cashierOrderRowUnpaid: {
  backgroundColor: '#e19292ff',  // çok hafif kırmızı
},
cashierSelectAllRow: {
  marginTop: 6,
  marginBottom: 4,
  alignItems: 'flex-start',
},

cashierOrderRowUnpaid: {
  backgroundColor: '#ffefef', // hafif kırmızı
},

cashierOrderRowSelected: {
  backgroundColor: '#ffeaa7', // seçili (sarımsı)
},

cashierPayRow: {
  marginTop: 8,
  flexDirection: 'row',
  justifyContent: 'space-between',
  alignItems: 'center',
},

cashierSelectAllRow: {
  marginTop: 6,
  marginBottom: 4,
  alignItems: 'flex-start',
},

cashierOrderRowUnpaid: {
  backgroundColor: '#ffefef', // hafif kırmızı
},

cashierOrderRowSelected: {
  backgroundColor: '#ffeaa7', // seçili (sarımsı)
},

cashierPayRow: {
  marginTop: 8,
  flexDirection: 'row',
  justifyContent: 'space-between',
  alignItems: 'center',
},
productCard: {
  backgroundColor: '#ffffff',
  borderRadius: 12,
  borderWidth: 1,
  borderColor: '#eee',
  padding: 8,
  // width: '48%',  // ← bunu kaldırabilirsin
},
productCardWrapper: {
  width: '48%',
  marginBottom: 12,
},

productImageWrapper: {
  position: 'relative',
},

productBadge: {
  position: 'absolute',
  top: 6,
  right: 6,
  backgroundColor: 'rgba(231, 76, 60, 0.9)', // hafif kırmızı
  borderRadius: 12,
  paddingHorizontal: 8,
  paddingVertical: 2,
},

productBadgeText: {
  color: '#fff',
  fontSize: 12,
  fontWeight: '700',
},

productCardWrapper: {
  width: '48%',
  marginBottom: 12,
},

drinkInlineCounter: {
  flexDirection: 'row',
  justifyContent: 'center',
  alignItems: 'center',
  marginTop: 6,
  gap: 12,
},

  // --- DRINK inline counter ---
  productCardWrapper: {
    width: '48%',
    marginBottom: 12,
  },
  drinkInlineCounter: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 6,
    gap: 12,
  },

  // ----- CASHIER / WAITER / KITCHEN ortak kartlar -----
  cashierContainer: {
    flex: 1,
    marginTop: 16,
  },
  cashierTableCard: {
    marginBottom: 10,
    padding: 10,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#ddd',
    backgroundColor: '#fafafa',
  },
  cashierTableTitle: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 6,
    color: '#333',
  },
  cashierSummaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 4,
  },
  cashierSummaryText: {
    fontSize: 12,
    color: '#333',
  },
  cashierSelectAllRow: {
    marginTop: 8,
    marginBottom: 4,
    alignItems: 'flex-start',
  },

cashierOrderRow: {
  paddingVertical: 6,
  borderTopWidth: 1,
  borderTopColor: '#eee',
},

cashierOrderRowUnpaid: {
  backgroundColor: '#ffecec', // hafif kırmızımsı
},

cashierOrderRowPaid: {
  backgroundColor: '#d6f5dd', // yeşilimsi (zaten vardı)
},

cashierOrderRowSelected: {
  // sadece hafif vurgu; border yok artık
  backgroundColor: '#fdf6d9', // çok hafif sarı/kremsi ton
},

cashierOrderText: {
  fontSize: 13,
  color: '#333',
},


  cashierPayRow: {
    marginTop: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  tableSelectorHeader: {
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'space-between',
},

tableSelectorToggle: {
  fontSize: 16,
  color: '#666',
},

waiterRoot: {
  flex: 1,
  paddingBottom: 80,   // cart bar için boşluk
},

categoryRow: {
  flexDirection: 'row',
  flexWrap: 'wrap',
  marginBottom: 8,
  gap: 6,
},

cartBar: {
  position: 'absolute',
  left: 0,
  right: 0,
  bottom: 0,
  flexDirection: 'row',
  justifyContent: 'space-between',
  alignItems: 'center',
  paddingVertical: 10,
  paddingHorizontal: 12,
  borderTopWidth: 1,
  borderColor: '#ddd',
  backgroundColor: '#fafafa',
},

customModalOverlay: {
  position: 'absolute',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  backgroundColor: 'rgba(0,0,0,0.35)',
  justifyContent: 'center',
  alignItems: 'center',
  zIndex: 20,
},

customModalBox: {
  width: '90%',
  maxHeight: '85%',
  backgroundColor: '#fff',
  borderRadius: 20,
  padding: 14,
  borderWidth: 2,
  borderColor: '#0b6623',
},

customModalContent: {
  paddingBottom: 16,
},

modalButtonsRow: {
  flexDirection: 'row',
  justifyContent: 'space-between',
  marginTop: 10,
},

modalButton: {
  flex: 1,
  paddingVertical: 10,
  borderRadius: 10,
  alignItems: 'center',
  marginHorizontal: 4,
},

modalCancelButton: {
  backgroundColor: '#c0392b',
},

modalConfirmButton: {
  backgroundColor: '#27ae60',
},

modalButtonText: {
  color: '#fff',
  fontWeight: '700',
},


});
