import React, { useState, useEffect, useMemo, memo } from 'react';


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
  Platform,
  Alert,
  useWindowDimensions,
} from 'react-native';
import GoalItem from './components/GoalItem';

const TABLES = [1, 2, 3, 4, 5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,"Paket1","Paket2",];



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
  { id: 'profiterol', name: 'Profiterol', price: 150, category: 'DESSERT' },
  { id: 'cileklicheesecake', name: 'Çilekli cheesecake', price: 200, category: 'DESSERT' },
   { id: 'limonlucheesecake', name: 'Limonlu Cheesecake', price: 200, category: 'DESSERT' },
  { id: 'tiramisu', name: 'Tiramisu', price: 150, category: 'DESSERT' },
  { id: 'trilece', name: 'Trileçe', price: 150, category: 'DESSERT' },

  // DRINK - SOĞUK
{ id: 'pepsi', name: 'Pepsi', price: 70, category: 'DRINK', isHot: false },
{ id: 'sevenup', name: 'SevenUp', price: 70, category: 'DRINK', isHot: false },
{ id: 'yedigun', name: 'Yedigün', price: 70, category: 'DRINK', isHot: false },
{ id: 'pepsiZero', name: 'Pepsi Zero', price: 70, category: 'DRINK', isHot: false },
{ id: 'fanta', name: 'Fanta', price: 70, category: 'DRINK', isHot: false },
{ id: 'ayran', name: 'Ayran', price: 50, category: 'DRINK', isHot: false },
{ id: 'su', name: 'Su', price: 20, category: 'DRINK', isHot: false },
{ id: 'soda', name: 'soda', price: 40, category: 'DRINK', isHot: false },
{ id: 'limonluSoda', name: 'Limonlu Soda', price: 50, category: 'DRINK', isHot: false },

// DRINK - SICAK
{ id: 'turk-kahvesi', name: 'Türk Kahvesi', price: 100, category: 'DRINK', isHot: true },
{ id: 'cappuccino', name: 'Cappuccino', price: 150, category: 'DRINK', isHot: true },
{ id: 'latte', name: 'Latte', price: 150, category: 'DRINK', isHot: true },
{ id: 'filter-coffee', name: 'Filtre Kahve', price: 150, category: 'DRINK', isHot: true },
{ id: 'nescafe', name: 'Nescafe', price: 100, category: 'DRINK', isHot: true },
{ id: 'cay', name: 'Çay', price: 50, category: 'DRINK', isHot: true },
{ id: 'espresso', name: 'Espresso', price: 150, category: 'DRINK', isHot: true },
];



  


const POPULAR_IDS = [
  'kofte-ekmek',
  'hamburger',
  'karisik-tost',
  'patso',
  "patates"
  
];

const CATEGORIES = [
  { id: 'POPULAR', label: 'Popüler' },
  { id: 'MEAT', label: 'Et Menü' },
  { id: 'TOAST', label: 'Tostlar' },
  { id: 'DESSERT', label: 'Tatlı & Kahve' },
  { id: 'DRINK', label: 'Soğuk İçecekler' }, // 🆕
   { id: 'HOT_DRINK', label: 'Sıcak İçecekler' },  // 👈 yeni
];

// PASS MODE: hangi sırada dönecek
const PASS_VIEWS = ['POPULAR', 'HOT_DRINK', 'TOAST',"DESSERT"];

function getPassViewLabel(view) {
  if (view === 'POPULAR') return 'Popüler Ürünler';
  if (view === 'HOT_DRINK') return 'Sıcak İçecekler';
  if (view === 'TOAST') return 'Tost Seçenekleri';
  if (view === 'DESSERT') return 'Tatlılar';   // 👈 EKLEDİK
  return '';
}


const PRODUCT_IMAGES = {
  'kofte-ekmek': require('./assets/kofte-ekmek.jpg'),
  hamburger: require('./assets/hamburger.jpg'),
  'kofte-tabak': require('./assets/kofte-tabak.jpg'),

  'karisik-tost': require('./assets/karisik-tost.jpg'),
  'kasarli-tost': require('./assets/kasarli-tost.jpg'),
  'sucuklu-tost': require('./assets/sucuklu-tost.jpg'),

  patso: require('./assets/patso.jpg'),
  patates: require('./assets/patates.jpg'),
  profiterol: require('./assets/profiterol.jpg'),
  waffle: require('./assets/waffle.jpg'),
  cileklicheesecake: require('./assets/cileklicheese-cake.jpg'),
  limonlucheesecake: require('./assets/limonlu-cheesecake.jpg'),
  tiramisu: require('./assets/tiramisu.jpg'),
  trilece: require('./assets/trilece.jpg'),

  // 🧊 Soğuk içecekler
  pepsi: require('./assets/pepsi.jpg'),
  sevenup: require('./assets/sevenup.jpg'),
  pepsiZero: require('./assets/pepsi-zero.jpg'),
  yedigun: require('./assets/yedigun.jpg'),
  fanta: require('./assets/drink-fanta.jpg'),
  ayran: require('./assets/drink-ayran.jpg'),
  su: require('./assets/su.jpg'),
  limonluSoda: require('./assets/limonlu-soda.jpg'),
  soda: require('./assets/soda.jpg'),

  // Sıcak içecekler
    'turk-kahvesi': require('./assets/turkish-coffee.jpg'),
  cappuccino: require('./assets/cappuccino.jpg'),
  latte: require('./assets/latte.jpg'),
  'filter-coffee': require('./assets/filitre-kahve.jpg'),
  nescafe: require('./assets/nescafe.jpg'),
  cay: require('./assets/cay.jpg'),
espresso: require('./assets/espresso.jpg'),
};


const DRINK_OPTIONS = [
  { id: 'pepsi', label: 'Pepsi', image: require('./assets/pepsi.jpg') },
  { id: 'sevenup', label: 'SevenUp', image: require('./assets/sevenup.jpg') },
  { id: 'yedigun', label: 'Yedigün', image: require('./assets/yedigun.jpg') },
  { id: 'pepsiZero', label: 'Pepsi Zero', image: require('./assets/pepsi-zero.jpg') },
  { id: 'fanta', label: 'Fanta', image: require('./assets/drink-fanta.jpg') },
  { id: 'ayran', label: 'Ayran', image: require('./assets/drink-ayran.jpg') },
  { id: 'su', label: 'Su', image: require('./assets/su.jpg') },
  { id: 'soda', label: 'Soda', image: require('./assets/soda.jpg') },
  { id: 'limonluSoda', label: 'Limonlu Soda', image: require('./assets/limonlu-soda.jpg') },
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
    const res = await fetch(`${API_URL}/orders`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newOrders),
    });

    const text = await res.text();
    console.log('syncOrdersToServer:', res.status, text);
  } catch (err) {
    console.log('Error syncing orders to server:', err);
  }
}


async function fetchLogsFromServer() {
  try {
    const res = await fetch(`${API_URL}/logs`);
    if (!res.ok) {
      console.log('Failed to fetch logs from server');
      return [];
    }
    const data = await res.json();
    if (!Array.isArray(data)) return [];
    return data;
  } catch (err) {
    console.log('Error fetching logs from server:', err);
    return [];
  }
}

async function syncLogsToServer(newLogs) {
  try {
    await fetch(`${API_URL}/logs`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newLogs),
    });
  } catch (err) {
    console.log('Error syncing logs to server:', err);
  }
}


export default function App() {
  

    const [orders, setOrders] = useState([]);// BU KALACAK orders, setOrders 
    const [selectedTable, setSelectedTable] = useState(null);
    const APP_LOGO = require('./assets/kebelioglu-logo2.png');
    const [mode, setMode] = useState('ORDER'); // ORDER | KITCHEN | WAITER | CASHIER

  // 👇 Server’a da push eden wrapper
  function updateOrders(updater) {
    setOrders((current) => {
      const next = updater(current);
      // async ama fire-and-forget
      syncOrdersToServer(next);
      return next;
    });
  }

  const [selectedCashierItems, setSelectedCashierItems] = useState([]);
  const [selectedWaiterItems, setSelectedWaiterItems] = useState([]);
  const [selectedKitchenItems, setSelectedKitchenItems] = useState([]);
  const [selectedBaristaItems, setSelectedBaristaItems] = useState([]); // 👈 YENİ
  const [expandedTables, setExpandedTables] = useState({});
  const [categoriesExpanded, setCategoriesExpanded] = useState(true);
  const [logs, setLogs] = useState([]);
  const [expandedLogs, setExpandedLogs] = useState({});
  const [passViewIndex, setPassViewIndex] = useState(0);


  const [cayStrength, setCayStrength] = useState('normal'); 
// 'acik' | 'normal' | 'demli'

const [espressoShots, setEspressoShots] = useState('single');
// 'single' | 'double'


const [tablesExpanded, setTablesExpanded] = useState(true);

const [turkKahvesiSugar, setTurkKahvesiSugar] = useState('medium'); 
// 'no' | 'medium' | 'sweet'

const [milkOptions, setMilkOptions] = useState({
  sutlu: false,
});

  
  const [basket, setBasket] = useState([]); // current order being built
  const [selectedCategory, setSelectedCategory] = useState('POPULAR');


  const [customModalVisible, setCustomModalVisible] = useState(false);
  const [customProduct, setCustomProduct] = useState(null);
const [cartModalVisible, setCartModalVisible] = useState(false);


  const [onionYes, setOnionYes] = useState(1);
  const [onionNo, setOnionNo] = useState(0);
  const [quantity, setQuantity] = useState(1);

const [drinkCounts, setDrinkCounts] = useState({
  pepsi: 0,
  sevenup:0,
  yedigun:0,
  fanta: 0,
  ayran: 0,
  su:0,
  soda:0,
  limonluSoda:0,
  pepsiZero:0,
});


  const [sauces, setSauces] = useState({
    ketcap: false,
    mayonez: false,
    aci: false,
  });

  const [validationModalVisible, setValidationModalVisible] = useState(false);
  const [validationMessage, setValidationMessage] = useState('');

  const [noteText, setNoteText] = useState('');

  useEffect(() => {
    const intervalId = setInterval(() => {
      setPassViewIndex((prev) => (prev + 1) % PASS_VIEWS.length);
    }, 5000); // 10 saniyede bir değiş

    return () => clearInterval(intervalId);
  }, []);

  async function printTicketForOrder(order) {
  try {
    // Sen projede zaten server URL kullanıyorsun.
    // Yoksa şunu ayarla:
     const SERVER_URL = 'http://192.168.0.13:3000';

    const res = await fetch(`${SERVER_URL}/print-ticket`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ order }),
    });

    const data = await res.json().catch(() => ({}));

    if (!res.ok || data?.ok === false) {
      console.log('PRINT FAILED:', data);
      // İstersen kullanıcıya modal göster:
      // setValidationMessage(`Yazdırma hatası: ${data?.error || res.status}`);
      // setValidationModalVisible(true);
      return false;
    }

    console.log('PRINT OK ✅', data);
    return true;
  } catch (err) {
    console.log('PRINT ERROR ❌', err);
    // setValidationMessage(`Yazdırma hatası: ${String(err?.message || err)}`);
    // setValidationModalVisible(true);
    return false;
  }
}


  const currentPassView = PASS_VIEWS[passViewIndex];

  const passItems = useMemo(() => {
    return MENU_ITEMS.filter((item) => {
      if (currentPassView === 'POPULAR') {
        return POPULAR_IDS.includes(item.id);
      }

      if (currentPassView === 'HOT_DRINK') {
        return item.category === 'DRINK' && item.isHot;
      }

      if (currentPassView === 'TOAST') {
        return item.category === 'TOAST';
      }

       // 👇 BURAYA TATLILAR
    if (currentPassView === 'DESSERT') {
      return item.category === 'DESSERT';
    }

      return false;
    });
  }, [currentPassView]);

   const { width: screenWidth } = useWindowDimensions();
  const passCardWidth = screenWidth > 900 ? 260 : '48%';
  // >900px ise ~tablet/web: 260px kartlar, bir sürü yan yana
  // küçük ekranda: %48 → 2 kolon/1 kolon hali devam

    // Uygulama açılınca server’dan orders çek + 2 saniyede bir yenile
  // Uygulama açılınca server’dan orders çek + 2 saniyede bir yenile
React.useEffect(() => {
  let isMounted = true;

  const loadFromServer = async () => {
    try {
      const serverOrders = await fetchOrdersFromServer();
      if (isMounted) setOrders(serverOrders);

      const serverLogs = await fetchLogsFromServer();
      if (isMounted) setLogs(serverLogs);
    } catch (err) {
      console.log('Initial / polling load error:', err);
    }
  };

  loadFromServer();
  const intervalId = setInterval(loadFromServer, 2000);

  return () => {
    isMounted = false;
    clearInterval(intervalId);
  };
}, []);


  // ---------- FILTERED MENU ----------
const filteredMenuItems = React.useMemo(() => {
  return MENU_ITEMS.filter((item) => {
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
      // Soğuk içecekler
      return item.category === 'DRINK' && !item.isHot;
    }
    if (selectedCategory === 'HOT_DRINK') {
      // Sıcak içecekler
      return item.category === 'DRINK' && item.isHot;
    }
    return true;
  });
}, [selectedCategory]);

/// TOGGLE ME

function toggleBaristaItemSelection(unitKey) {
  setSelectedBaristaItems((prev) =>
    prev.includes(unitKey)
      ? prev.filter((k) => k !== unitKey)
      : [...prev, unitKey]
  );
}

function baristaReadySelectedItemsForTable(tableKey) {
  updateOrders((currentOrders) => {
    const selectedForTable = selectedBaristaItems.filter((k) =>
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
        const isHotDrink = !!(isDrink && menuDef?.isHot);

        if (!isHotDrink) return it;

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

      return {
        ...order,
        items: newItems,
      };
    });

    return updated;
  });

  setSelectedBaristaItems((prev) =>
    prev.filter((k) => !k.endsWith(`|${tableKey}`))
  );
}




  // ---------- BASKET & ORDER LOGIC ----------

  function addItemToBasket(item) {
  if (!item) {
    console.log('addItemToBasket: item is null/undefined');
    return;
  }

  const qtyToAdd = item.quantity ?? 1;

  setBasket((current) => {
    // Bu ürünün config'ine göre bir "imza" çıkarıyoruz
    const signature = JSON.stringify({
      id: item.id,
      onionYes: item.onionYes ?? 0,
      onionNo: item.onionNo ?? 0,
      sauces: item.sauces ?? {},
      turkKahvesiSugar: item.turkKahvesiSugar ?? null,
      milkOptions: item.milkOptions ?? {},
      cayStrength: item.cayStrength ?? null,
      espressoShots: item.espressoShots ?? null,
      note: item.note ?? '',
    });

    // Aynı config'e sahip bir satır var mı?
    const existingIndex = current.findIndex((i) => i._sig === signature);

    if (existingIndex !== -1) {
      // Aynı ayarlara sahip satır varsa: sadece miktarını artır
      const updated = [...current];
      updated[existingIndex] = {
        ...updated[existingIndex],
        quantity: (updated[existingIndex].quantity || 0) + qtyToAdd,
      };
      return updated;
    }

    // Yoksa: yeni satır olarak ekle
    return [
      ...current,
      {
        ...item,
        quantity: qtyToAdd,
        _sig: signature, // içte kullanacağımız gizli alan
      },
    ];
  });
}


  function clearBasket() {
    setBasket([]);
  }

  function showNote(note) {
  if (!note) return;

  if (Platform.OS === 'web') {
    // Web'de direkt browser alert kullan
    window.alert(`Ürün Notu:\n${note}`);
  } else {
    Alert.alert('Ürün Notu', note);
  }
}

function isSameDay(d1, d2) {
  return (
    d1.getFullYear() === d2.getFullYear() &&
    d1.getMonth() === d2.getMonth() &&
    d1.getDate() === d2.getDate()
  );
}

const now = new Date();
const todayLogs = logs.filter((log) =>
  isSameDay(new Date(log.closedAt), now)
);

const bossItemMap = {};
let bossTotalTurnover = 0;



const bossTotalCash = todayLogs.reduce(
  (sum, log) => sum + (log.paymentSummary?.cash || 0),
  0
);

const bossTotalCard = todayLogs.reduce(
  (sum, log) => sum + (log.paymentSummary?.card || 0),
  0
);




todayLogs.forEach((log) => {
  bossTotalTurnover += log.totalAmount || 0;
  (log.itemsSummary || []).forEach((p) => {
    if (!bossItemMap[p.id]) {
      bossItemMap[p.id] = { ...p };
    } else {
      bossItemMap[p.id].count += p.count;
    }
  });
});

const bossProducts = Object.values(bossItemMap);
const bossTotalItems = bossProducts.reduce((s, p) => s + p.count, 0);
const bossFoodCount = bossProducts
  .filter((p) => p.category !== 'DRINK')
  .reduce((s, p) => s + p.count, 0);
const bossDrinkCount = bossProducts
  .filter((p) => p.category === 'DRINK')
  .reduce((s, p) => s + p.count, 0);


async function submitOrder() {
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

  // 1) Yeni siparişi oluştur
const newOrder = {
  id: Date.now().toString(),
  tableId: selectedTable,          // ✅ CRITICAL (your grouping uses this)
  table: selectedTable,            // optional
  status: 'PENDING',
  items: basket.map((it) => ({
    id: it.id,
    name: it.name,
    price: it.price,               // ✅ required for cashier totals
    quantity: it.quantity || 1,
    note: it.note || '',

    // ✅ status counters your unit builder reads
    readyCount: it.readyCount || 0,
    servedCount: it.servedCount || 0,
    paidCount: it.paidCount || 0,
    paidCashCount: it.paidCashCount || 0,
    paidCardCount: it.paidCardCount || 0,

    // ✅ extras your label formatters read
    onionYes: it.onionYes || 0,
    onionNo: it.onionNo || 0,
    sauces: it.sauces || { ketcap: false, mayonez: false, aci: false },
    turkKahvesiSugar: it.turkKahvesiSugar ?? null,
    milkOptions: it.milkOptions ?? { sutlu: false },
    cayStrength: it.cayStrength ?? null,
    espressoShots: it.espressoShots ?? null,
  })),
  note: noteText || '',
  createdAt: new Date().toISOString(),
};


console.log('SUBMIT ORDER tableId=', selectedTable, 'basket=', basket.length);

  // 2) Frontend + Backend’e gönder
  updateOrders((currentOrders) => [...currentOrders, newOrder]);

  // 3) MUTFAK FİŞİNİ YAZDIR
  printTicketForOrder(newOrder);   // 👈  işte burada!

  // 4) Sepeti temizle, modal kapat
  clearBasket();
  setNoteText('');
  setCartModalVisible(false);

  console.log("Sipariş gönderildi ve fiş yazdırıldı:", newOrder);
}


function formatManagerItemExtras(item) {
  const extras = [];

  // Köfte için soğanlı / soğansız
  if (item.onionYes || item.onionNo) {
    if (item.onionYes > 0) extras.push(`${item.onionYes} Soğanlı`);
    if (item.onionNo > 0) extras.push(`${item.onionNo} Soğansız`);
  }

  // Soslar
  if (item.sauces) {
    const s = item.sauces;
    if (s.ketcap) extras.push('Ketçap');
    if (s.mayonez) extras.push('Mayonez');
    if (s.aci) extras.push('Acı Sos');
  }

  // Türk kahvesi şeker
  if (item.turkKahvesiSugar) {
    if (item.turkKahvesiSugar === 'no') extras.push('Şekersiz');
    if (item.turkKahvesiSugar === 'medium') extras.push('Orta');
    if (item.turkKahvesiSugar === 'sweet') extras.push('Şekerli');
  }

  // Sütlü kahveler
  if (item.milkOptions && item.milkOptions.sutlu) {
    extras.push('Sütlü');
  }

  // Çay dem ayarı
  if (item.cayStrength) {
    if (item.cayStrength === 'acik') extras.push('Açık');
    if (item.cayStrength === 'normal') extras.push('Normal');
    if (item.cayStrength === 'demli') extras.push('Demli');
  }

  // Espresso shot
  if (item.espressoShots) {
    if (item.espressoShots === 'single') extras.push('Single');
    if (item.espressoShots === 'double') extras.push('Double');
  }

  // Not
  if (item.note) {
    extras.push(`Not: ${item.note}`);
  }

  if (extras.length === 0) return '';
  return extras.join(', ');
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
  // Sıcak içecekler: barista mutfağı gibi çalışsın
  if (unit.isHotDrink) {
    return unit.isReady ? 'READY' : 'PENDING';
  }

  // Soğuk içeceklerde mutfak durumu yok
  if (unit.isDrink) return '—';

  // Yemekler
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

  if (!Array.isArray(tableOrders)) {
    return units;
  }

  tableOrders.forEach((order) => {
    if (!order || !Array.isArray(order.items)) {
      return;
    }

    order.items.forEach((it, itemIndex) => {
      const qty = it.quantity || 0;
      const readyCount = it.readyCount || 0;
      const servedCount = it.servedCount || 0;
      const paidCount = it.paidCount || 0;

      const onionYes = it.onionYes || 0;
      const onionNo = it.onionNo || 0;

      const menuDef = MENU_ITEMS.find((m) => m.id === it.id);
      const isDrink = menuDef?.category === 'DRINK';
      const isHotDrink = !!(isDrink && menuDef?.isHot);

      // 🔍 DEBUG: item içinde ne var görelim
      console.log('ITEM IN buildUnitsForTable:', it.id, {
        cayStrength: it.cayStrength,
        turkKahvesiSugar: it.turkKahvesiSugar,
        milkOptions: it.milkOptions,
      });

      for (let unitIndex = 0; unitIndex < qty; unitIndex++) {
        const unitKey = `${order.id}|${itemIndex}|${unitIndex}|${tableKey}`;
        const isNoOnion = unitIndex < onionNo;

        const unit = {
          unitKey,
          orderId: order.id,
          itemIndex,
          unitIndex,
          id: it.id,
          name: it.name,
          price: Number.isFinite(it.price) ? it.price : (MENU_ITEMS.find(m => m.id === it.id)?.price || 0),

          note: it.note,

          isDrink,
          isHotDrink,
          isNoOnion,

          turkKahvesiSugar: it.turkKahvesiSugar ?? null,
          milkOptions: it.milkOptions ?? { sutlu: false },
          cayStrength: it.cayStrength ?? null,         // 🔥 BURADA
          espressoShots: it.espressoShots ?? null,

          isReady: (!isDrink || isHotDrink) && unitIndex < readyCount,
          isServed: unitIndex < servedCount,
          isPaid: unitIndex < paidCount,
        };

        // 🔍 DEBUG: unit nasıl oluşmuş
        console.log('UNIT BUILT:', unit.name, unit.cayStrength);

        units.push(unit);
      }
    });
  });

  return units;
}

function isTableFullyDone(tableKey, tableOrders) {
  if (!Array.isArray(tableOrders) || tableOrders.length === 0) return false;

  for (const order of tableOrders) {
    if (!order || !Array.isArray(order.items)) continue;

    for (const it of order.items) {
      const qty = it.quantity || 0;
      if (qty === 0) continue;

      const menuDef = MENU_ITEMS.find((m) => m.id === it.id);
      const isDrink = menuDef?.category === 'DRINK';
      const isHotDrink = !!(isDrink && menuDef?.isHot);

      const ready = it.readyCount || 0;
      const served = it.servedCount || 0;
      const paid = it.paidCount || 0;

      // Pişmiş olması sadece yemek + sıcak içecekler için zorunlu
      if ((!isDrink || isHotDrink) && ready < qty) {
        return false;
      }

      if (served < qty) return false;
      if (paid < qty) return false;
    }
  }

  return true; // tüm ürünler hazır + servis + ödenmiş
}
function closeTable(tableKey) {
  // 1) Bu masaya ait current orders’ı bul
  const tableOrders = orders.filter(
    (o) => String(o.tableId) === String(tableKey)
  );

  if (tableOrders.length === 0) return;

  // 2) Unit listesi (log & özet için)
  const allUnits = buildUnitsForTable(String(tableKey), tableOrders);
  const totalAmount = allUnits.reduce(
    (sum, u) => sum + (u.price || 0),
    0
  );

  // 3) Ürün özet tablosu (kaç hamburger, kaç içecek vs.)
  const itemMap = {};
  allUnits.forEach((u) => {
    const menuDef = MENU_ITEMS.find((m) => m.id === u.id);
    const category = menuDef?.category || 'OTHER';
    const key = u.id;

    if (!itemMap[key]) {
      itemMap[key] = {
        id: u.id,
        name: u.name,
        category,
        count: 0,
      };
    }
    itemMap[key].count += 1;
  });
  const itemsSummary = Object.values(itemMap);

  // 4) 💰 Nakit / Kart toplamlarını hesapla
  let cashTotal = 0;
  let cardTotal = 0;

  tableOrders.forEach((order) => {
    (order.items || []).forEach((it) => {
      const qtyCash = it.paidCashCount || 0;
      const qtyCard = it.paidCardCount || 0;

      const menuDef = MENU_ITEMS.find((m) => m.id === it.id);
      const unitPrice = menuDef?.price || 0;

      cashTotal += unitPrice * qtyCash;
      cardTotal += unitPrice * qtyCard;
    });
  });

  // 5) LOG kaydı oluştur
  const logEntry = {
    id: `${tableKey}-${Date.now()}`,
    tableId: String(tableKey),
    closedAt: new Date().toISOString(),
    totalAmount,
    itemCount: allUnits.length,
    itemsSummary,
    paymentSummary: {
      cash: cashTotal,
      card: cardTotal,
    },
    units: allUnits.map((u) => ({
      unitKey: u.unitKey,
      id: u.id,
      name: u.name,
      price: u.price || 0,
      isNoOnion: u.isNoOnion || false,
      turkKahvesiSugar: u.turkKahvesiSugar || null,
      cayStrength: u.cayStrength || null,
      espressoShots: u.espressoShots || null,
      milkOptions: u.milkOptions || null,
    })),
  };

  // 6) Log state + backend sync
  setLogs((prev) => {
    const updated = [logEntry, ...prev];
    syncLogsToServer(updated);
    return updated;
  });

  // 7) Orders’tan bu masayı sil + backend sync
  setOrders((prevOrders) => {
    const updatedOrders = prevOrders.filter(
      (o) => String(o.tableId) !== String(tableKey)
    );
    syncOrdersToServer(updatedOrders);
    return updatedOrders;
  });

  // 8) Kasiyer seçimini temizle
  const tableUnitKeys = allUnits.map((u) => u.unitKey);
  setSelectedCashierItems((prev) =>
    prev.filter((k) => !tableUnitKeys.includes(k))
  );
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
  if (!item) {
    console.log('handleProductPress: item is null/undefined');
    return;
  }

  // 🥪 Yemek + sos / soğan modali açılacak ürünler
  const foodWithExtrasIds = [
    'kofte-ekmek',
    'hamburger',
    'patso',
    'patates',
    'karisik-tost',
    'waffle',
  ];
  const needsFoodExtras = foodWithExtrasIds.includes(item.id);
  const needsOnion = item.id === 'kofte-ekmek';

  // ☕ Sıcak içeceklerden modali olanlar
  const hotDrinkWithOptionsIds = [
    'turk-kahvesi',   // şekerli / orta / şekersiz
    'cay',            // açık / normal / demli
    'espresso',       // single / double
    'cappuccino',     // sütlü / sütsüz
    'latte',          // sütlü / sütsüz
    'filter-coffee',  // sütlü / sütsüz
    'nescafe',        // sütlü / sütsüz
  ];
  const needsHotDrinkOptions = hotDrinkWithOptionsIds.includes(item.id);

  const needsModal = needsFoodExtras || needsOnion || needsHotDrinkOptions;

  if (needsModal) {
    setCustomProduct(item);
    setQuantity(1);

    // Köfte için default soğan
    if (needsOnion) {
      setOnionYes(1);
      setOnionNo(0);
    } else {
      setOnionYes(0);
      setOnionNo(0);
    }

    // Soğuk içecek seçimleri (kofte/hamburger/patso/waffle için)
    setDrinkCounts({
      pepsi: 0,
      pepsiZero:0,
      sevenup:0,
      yedigun:0,
      fanta: 0,
      ayran: 0,
      su: 0,
      soda: 0,
      limonluSoda: 0,
    });

    // Soslar
    setSauces({ ketcap: false, mayonez: false, aci: false });

    // Sıcak içecek default ayarları
    setTurkKahvesiSugar('medium'); // Türk kahvesi: orta
    setCayStrength('normal');      // Çay: normal
    setEspressoShots('single');    // Espresso: single
    setMilkOptions({ sutlu: false }); // sütlü kahveler: sütsüz başlasın

    setNoteText('');
    setCustomModalVisible(true);
  } else {
    // Hiçbir özel ayarı olmayan ürünler direkt sepete
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
  return basket
    .filter((i) => i.id === id)
    .reduce((sum, i) => sum + (i.quantity || 0), 0);
}


function decrementItemInBasketById(id) {
  setBasket((current) => {
    const index = current.findIndex((i) => i.id === id);
    if (index === -1) return current;

    const item = current[index];

    if ((item.quantity || 0) <= 1) {
      // Bu satır bitiyorsa tamamen kaldır
      return current.filter((_, i) => i !== index);
    }

    const updated = [...current];
    updated[index] = {
      ...item,
      quantity: item.quantity - 1,
    };
    return updated;
  });
}

function decrementBasketItemByIndex(index) {
  setBasket((current) => {
    if (index < 0 || index >= current.length) return current;

    const item = current[index];
    const qty = item.quantity || 0;

    // 1 ise komple satırı kaldır
    if (qty <= 1) {
      return current.filter((_, i) => i !== index);
    }

    const updated = [...current];
    updated[index] = {
      ...item,
      quantity: qty - 1,
    };
    return updated;
  });
}

function removeBasketItemByIndex(index) {
  setBasket((current) => current.filter((_, i) => i !== index));
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

  // Köfte ekmekte soğan kontrolü
  if (customProduct.id === 'kofte-ekmek') {
    if (onionYes + onionNo !== quantity) {
      setValidationMessage(
        'Soğan adetleri toplamı ürün adediyle eşleşmiyor.'
      );
      setValidationModalVisible(true);
      return;
    }
  }

  // 🔥 Espresso için fiyat ayarı:
  // Menüdeki fiyat SINGLE kabul, DOUBLE ise 2x
  const adjustedPrice =
    customProduct.id === 'espresso'
      ? (espressoShots === 'double'
          ? customProduct.price * 2
          : customProduct.price)
      : customProduct.price;

  const itemToAdd = {
    ...customProduct,
    price: adjustedPrice, // 💰 fiyatı override ediyoruz
    quantity,
    onionYes,
    onionNo,
    sauces,
    note: noteText,

    turkKahvesiSugar:
      customProduct.id === 'turk-kahvesi' ? turkKahvesiSugar : null,

    milkOptions, // sütlü kahveler için

    cayStrength: customProduct.id === 'cay' ? cayStrength : null,
    espressoShots: customProduct.id === 'espresso' ? espressoShots : null,
  };

  console.log('ADDING TO BASKET', itemToAdd);

  addItemToBasket(itemToAdd);
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

    // ---- SEÇİM TOGGLE FONKSİYONLARI ----
  function toggleCashierItemSelection(unitKey) {
    setSelectedCashierItems((prev) =>
      prev.includes(unitKey)
        ? prev.filter((k) => k !== unitKey)
        : [...prev, unitKey]
    );
  }

  function toggleBaristaItemSelection(unitKey) {
  setSelectedBaristaItems((prev) =>
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

  // MANAGER: Bir siparişi komple sil
function managerDeleteOrder(orderId) {
  updateOrders((currentOrders) =>
    currentOrders.filter((o) => o.id !== orderId)
  );
}

// MANAGER: Bir masadaki TÜM siparişleri sil
function managerDeleteTable(tableKey) {
  updateOrders((currentOrders) =>
    currentOrders.filter(
      (o) => String(o.tableId) !== String(tableKey)
    )
  );
}

// MANAGER: Bir sipariş içindeki item miktarını değiştir (±1)
function managerChangeItemQuantity(orderId, itemIndex, delta) {
  updateOrders((currentOrders) => {
    const updated = [];

    currentOrders.forEach((order) => {
      if (order.id !== orderId) {
        updated.push(order);
        return;
      }

      const newItems = [];
      order.items.forEach((it, idx) => {
        if (idx !== itemIndex) {
          newItems.push(it);
          return;
        }

        const oldQty = it.quantity || 0;
        const newQty = oldQty + delta;

        // 0 veya altına düşerse bu item'i tamamen sil
        if (newQty <= 0) {
          return;
        }

        const readyCount = Math.min(it.readyCount || 0, newQty);
        const servedCount = Math.min(it.servedCount || 0, newQty);
        const paidCount = Math.min(it.paidCount || 0, newQty);

        newItems.push({
          ...it,
          quantity: newQty,
          readyCount,
          servedCount,
          paidCount,
        });
      });

      // Eğer sipariş içinde hiç item kalmadıysa, o order'ı da eklemiyoruz (tamamen silinir)
      if (newItems.length > 0) {
        updated.push({
          ...order,
          items: newItems,
        });
      }
    });

    return updated;
  });
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

  function baristaReadySelectedItemsForTable(tableKey) {
  updateOrders((currentOrders) => {
    // Bu masaya ait seçili unitKey'ler
    const selectedForTable = selectedBaristaItems.filter((k) =>
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
        const isHotDrink = !!(isDrink && menuDef?.isHot);

        // ❄️ Soğuk içecek veya yemek değil → barista değiştirmez
        if (!isHotDrink) return it;

        // Bu itemIndex’e ait seçili unitKey’ler
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
          readyCount: newReady, // sadece readyCount
        };
      });

      return {
        ...order,
        items: newItems,
      };
    });

    return updated;
  });

  // Bu masaya ait seçili barista item'larını temizle
  setSelectedBaristaItems((prev) =>
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

function paySelectedItemsForTable(tableKey, method) {
  const payMethod = method === 'CARD' ? 'CARD' : 'CASH'; // default CASH

  updateOrders((currentOrders) => {
    // 1) Bu masaya ait seçili unitKey'leri, item bazında grupla
    const toPayMap = {}; // mapKey = `${orderId}|${itemIndex}` -> kaç unit seçili

    selectedCashierItems.forEach((unitKey) => {
      const [orderId, itemIndexStr, unitIndexStr, unitTableKey] =
        unitKey.split('|');

      // Farklı masaya aitse ignore et
      if (unitTableKey !== String(tableKey)) return;

      const itemIndex = parseInt(itemIndexStr, 10);
      const mapKey = `${orderId}|${itemIndex}`;
      toPayMap[mapKey] = (toPayMap[mapKey] || 0) + 1;
    });

    // Bu masadan seçili hiç unit yoksa dokunma
    if (Object.keys(toPayMap).length === 0) return currentOrders;

    const updated = currentOrders.map((order) => {
      // Sadece ilgili masadaki order'larla ilgilen
      if (String(order.tableId) !== String(tableKey)) {
        return order;
      }

      let changed = false;

      const newItems = order.items.map((item, idx) => {
        const mapKey = `${order.id}|${idx}`;
        const addCount = toPayMap[mapKey] || 0;
        if (!addCount) return item;

        const totalQty = item.quantity || 0;
        const prevPaid = item.paidCount || 0;
        const unpaidQty = totalQty - prevPaid;

        if (unpaidQty <= 0) return item;

        // Bu sefer ödenecek adet (seçili sayısı ile unpaid sayısı arasında min)
        const payNow = Math.min(addCount, unpaidQty);

        const paidCashCount = item.paidCashCount || 0;
        const paidCardCount = item.paidCardCount || 0;

        changed = true;

        if (payMethod === 'CASH') {
          return {
            ...item,
            paidCount: prevPaid + payNow,
            paidCashCount: paidCashCount + payNow,
          };
        } else {
          return {
            ...item,
            paidCount: prevPaid + payNow,
            paidCardCount: paidCardCount + payNow,
          };
        }
      });

      return changed ? { ...order, items: newItems } : order;
    });

    return updated;
  });

  // 2) Bu masaya ait seçili unitKey'leri temizle
  setSelectedCashierItems((prev) =>
    prev.filter((unitKey) => {
      const parts = unitKey.split('|');
      const unitTableKey = parts[3];
      return unitTableKey !== String(tableKey);
    })
  );
}


function formatOrderText(order) {
  if (!order.items || order.items.length === 0) {
    return 'Empty order';
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

    // Türk kahvesi şeker bilgisi
    if (item.turkKahvesiSugar) {
      if (item.turkKahvesiSugar === 'no') extras.push('Şekersiz');
      if (item.turkKahvesiSugar === 'medium') extras.push('Orta');
      if (item.turkKahvesiSugar === 'sweet') extras.push('Şekerli');
    }

    // Sütlü kahve
    if (item.milkOptions && item.milkOptions.sutlu) {
      extras.push('Sütlü');
    }

    // Çay dem ayarı
    if (item.cayStrength) {
      if (item.cayStrength === 'acik') extras.push('Açık');
      if (item.cayStrength === 'normal') extras.push('Normal');
      if (item.cayStrength === 'demli') extras.push('Demli');
    }

    // Espresso shot ayarı
    if (item.espressoShots) {
      if (item.espressoShots === 'single') extras.push('Single');
      if (item.espressoShots === 'double') extras.push('Double');
    }

    const qty = item.quantity || 0;
    const baseText = `${qty}x ${item.name}`;

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
    const key = String(order.tableId ?? order.table ?? 'Unknown'); // ✅
    if (!acc[key]) acc[key] = [];
    acc[key].push(order);
    return acc;
  }, {})
);



// tablesForCashier: [ ['1', [order1, order2]], ['3', [order3]], ... ]


  // ------------------- UI -------------------

  return (
    <View style={styles.appContainer}>

  {/* LOGO */}
<Image
  source={APP_LOGO}
  style={[
    styles.logoImage,
    Platform.OS === 'web' && { width: 1200, height: 150 }  // web’de daha da küçük
  ]}
/>


      {/* Mode switcher */}
      {mode !== 'PASS' && (
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
    title="Barista"
    color={mode === 'BARISTA' ? '#0acc2aff' : '#888'}
    onPress={() => setMode('BARISTA')}
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
<Button
  title="PASS"
  color={mode === 'PASS' ? '#0acc2aff' : '#888'}
  onPress={() => setMode('PASS')}
/>

    <Button
  title="Logs"
  color={mode === 'LOG' ? '#0acc2aff' : '#888'}
  onPress={() => setMode('LOG')}
/>
  <Button
  title="Boss"
  color={mode === 'BOSS' ? '#0acc2aff' : '#888'}
  onPress={() => setMode('BOSS')}
/>


 <Button
    title="Manager"
    color={mode === 'MANAGER' ? '#0acc2aff' : '#888'}
    onPress={() => setMode('MANAGER')}
  />

</View>
)}

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
{/* MENÜ SEÇ (Masa Seç gibi aç/kapa) */}
<View style={styles.categorySection}>

  <Pressable
    style={styles.categorySelectorHeader}
    onPress={() => setCategoriesExpanded(prev => !prev)}
  >
    <Text style={styles.sectionTitle}>Menü Seç</Text>
  </Pressable>

  {categoriesExpanded && (
    <View style={styles.categoryRow}>
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
  )}
</View>



      {/* ALTTA: ÜRÜN GRID */}
{/* ALTTA: ÜRÜN GRID */}
<View style={styles.menuGridContainer}>
  <Text style={styles.gridTitle}>
    {CATEGORIES.find((c) => c.id === selectedCategory)?.label ||
      'Ürünler'}
  </Text>

  <FlatList
    data={filteredMenuItems}
    keyExtractor={(item, index) => item?.id ?? String(index)} // ✅ null safe
    numColumns={2}
    contentContainerStyle={styles.menuList}
    renderItem={({ item }) => {
      if (!item) {
        console.log('renderItem: item is null');
        return null;
      }

      const countInBasket = getBasketCountById(item.id);
      const isDrink = item.category === 'DRINK' && !item.isHot;

      const imageSource = PRODUCT_IMAGES[item.id]; // undefined olabilir, sorun değil

      return (
        <View style={styles.productCardWrapper}>
          <Pressable
            style={styles.productCard}
            onPress={() => handleProductPress(item)}
          >
            {imageSource && ( // ✅ sadece varsa göster
              <Image
                source={imageSource}
                style={styles.productImage}
                resizeMode="cover"
              />
            )}

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

{/* ÇAY DEM AYARI */}
{customProduct.id === 'cay' && (
  <>
    <Text style={styles.optionTitle}>Dem Ayarı</Text>
    <View style={styles.sugarRow}>
      <Pressable
        style={[
          styles.sugarOption,
          cayStrength === 'acik' && styles.sugarOptionActive,
        ]}
        onPress={() => setCayStrength('acik')}
      >
        <Text style={styles.sugarOptionText}>Açık</Text>
      </Pressable>

      <Pressable
        style={[
          styles.sugarOption,
          cayStrength === 'normal' && styles.sugarOptionActive,
        ]}
        onPress={() => setCayStrength('normal')}
      >
        <Text style={styles.sugarOptionText}>Normal</Text>
      </Pressable>

      <Pressable
        style={[
          styles.sugarOption,
          cayStrength === 'demli' && styles.sugarOptionActive,
        ]}
        onPress={() => setCayStrength('demli')}
      >
        <Text style={styles.sugarOptionText}>Demli</Text>
      </Pressable>
    </View>
  </>
)}


{/* ESPRESSO SHOT AYARI */}
{customProduct.id === 'espresso' && (
  <>
    <Text style={styles.optionTitle}>Shot Seçimi</Text>
    <View style={styles.sugarRow}>
      <Pressable
        style={[
          styles.sugarOption,
          espressoShots === 'single' && styles.sugarOptionActive,
        ]}
        onPress={() => setEspressoShots('single')}
      >
        <Text style={styles.sugarOptionText}>Single</Text>
      </Pressable>

      <Pressable
        style={[
          styles.sugarOption,
          espressoShots === 'double' && styles.sugarOptionActive,
        ]}
        onPress={() => setEspressoShots('double')}
      >
        <Text style={styles.sugarOptionText}>Double</Text>
      </Pressable>
    </View>
  </>
)}



            {/* TÜRK KAHVESİ ŞEKER SEÇİMİ */}
{customProduct.id === 'turk-kahvesi' && (
  <>
    <Text style={styles.optionTitle}>Şeker Tercihi</Text>
    <View style={styles.sugarRow}>
      <Pressable
        style={[
          styles.sugarOption,
          turkKahvesiSugar === 'no' && styles.sugarOptionActive,
        ]}
        onPress={() => setTurkKahvesiSugar('no')}
      >
        <Text style={styles.sugarOptionText}>Şekersiz</Text>
      </Pressable>

      <Pressable
        style={[
          styles.sugarOption,
          turkKahvesiSugar === 'medium' && styles.sugarOptionActive,
        ]}
        onPress={() => setTurkKahvesiSugar('medium')}
      >
        <Text style={styles.sugarOptionText}>Orta</Text>
      </Pressable>

      <Pressable
        style={[
          styles.sugarOption,
          turkKahvesiSugar === 'sweet' && styles.sugarOptionActive,
        ]}
        onPress={() => setTurkKahvesiSugar('sweet')}
      >
        <Text style={styles.sugarOptionText}>Şekerli</Text>
      </Pressable>
    </View>
  </>
)}

{/* KAHVELER İÇİN SÜT */}
{['cappuccino', 'latte', 'filter-coffee', 'nescafe'].includes(customProduct.id) && (
  <>
    <Text style={styles.optionTitle}>Süt Tercihi</Text>
    <View style={styles.sauceRowContainer}>
      <Pressable
        style={[
          styles.sauceItem,
          milkOptions.sutlu && styles.sauceItemActive,
        ]}
        onPress={() =>
          setMilkOptions((prev) => ({ ...prev, sutlu: !prev.sutlu }))
        }
      >
        <Text style={styles.sauceLabel}>Sütlü olsun</Text>
        <View
          style={[
            styles.checkbox,
            milkOptions.sutlu && styles.checkboxActive,
          ]}
        >
          {milkOptions.sutlu && (
            <Text style={styles.checkboxCheck}>✓</Text>
          )}
        </View>
      </Pressable>
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

    {/* CART / SEPET MODAL */}
{cartModalVisible && (
  <View style={styles.validationOverlay}>
    <View style={styles.cartModalBox}>
      <Text style={styles.cartModalTitle}>Aktif Sipariş (Sepet)</Text>

      <Text style={styles.cartModalSubtitle}>
        Masa: {selectedTable ? selectedTable : 'Seçilmedi'}
      </Text>
      <Text style={styles.cartModalSubtitle}>
        Toplam: {totalItems} ürün | TL {totalPrice.toFixed(2)}
      </Text>

      {basket.length === 0 ? (
        <Text style={styles.cartModalEmpty}>
          Sepette ürün yok.
        </Text>
      ) : (
        <ScrollView style={styles.cartModalList}>
          {basket.map((item, index) => {
            // İsteğe bağlı: buraya da küçük “ekstralar” yazısı ekleyebiliriz
            const extras = [];

            if (item.onionYes || item.onionNo) {
              if (item.onionYes > 0) extras.push(`${item.onionYes} Soğanlı`);
              if (item.onionNo > 0) extras.push(`${item.onionNo} Soğansız`);
            }

            if (item.sauces) {
              const s = item.sauces;
              if (s.ketcap) extras.push('Ketçap');
              if (s.mayonez) extras.push('Mayonez');
              if (s.aci) extras.push('Acı Sos');
            }

            if (item.turkKahvesiSugar) {
              if (item.turkKahvesiSugar === 'no') extras.push('Şekersiz');
              if (item.turkKahvesiSugar === 'medium') extras.push('Orta');
              if (item.turkKahvesiSugar === 'sweet') extras.push('Şekerli');
            }

            const milkEligibleIds = ['cappuccino', 'latte', 'filter-coffee', 'nescafe'];
            if (
              milkEligibleIds.includes(item.id) &&
              item.milkOptions &&
              item.milkOptions.sutlu
            ) {
              extras.push('Sütlü');
            }

            if (item.cayStrength) {
              if (item.cayStrength === 'acik') extras.push('Açık');
              if (item.cayStrength === 'normal') extras.push('Normal');
              if (item.cayStrength === 'demli') extras.push('Demli');
            }

            if (item.espressoShots) {
              if (item.espressoShots === 'single') extras.push('Single');
              if (item.espressoShots === 'double') extras.push('Double');
            }

            const extrasText = extras.length > 0 ? ` (${extras.join(', ')})` : '';

            return (
              <View key={index} style={styles.cartModalRow}>
                <View style={{ flex: 1 }}>
                  <Text style={styles.cartModalItemName}>
                    {item.quantity}x {item.name}{extrasText}
                  </Text>
                  <Text style={styles.cartModalItemPrice}>
                    TL {(item.price * item.quantity).toFixed(2)}
                  </Text>
                </View>

                <View style={styles.cartModalRowButtons}>
                  {/* Miktarı 1 azalt */}
                  <Pressable
                    style={styles.cartModalQtyButton}
                    onPress={() => decrementBasketItemByIndex(index)}
                  >
                    <Text style={styles.cartModalQtyButtonText}>-</Text>
                  </Pressable>

                  {/* Satırı tamamen sil */}
                  <Pressable
                    style={styles.cartModalRemoveButton}
                    onPress={() => removeBasketItemByIndex(index)}
                  >
                    <Text style={styles.cartModalRemoveButtonText}>Sil</Text>
                  </Pressable>
                </View>
              </View>
            );
          })}
        </ScrollView>
      )}

      <View style={styles.modalButtonsRow}>
        <Pressable
          style={[styles.modalButton, styles.modalCancelButton]}
          onPress={() => setCartModalVisible(false)}
        >
          <Text style={styles.modalButtonText}>Kapat</Text>
        </Pressable>

        <Pressable
          style={[styles.modalButton, styles.modalConfirmButton]}
          onPress={() => {
            clearBasket();
            setCartModalVisible(false);
          }}
        >
          <Text style={styles.modalButtonText}>Hepsini Temizle</Text>
        </Pressable>
      </View>
    </View>
  </View>
)}


    {/* BOTTOM CART BAR */}

<View style={styles.cartBar}>
  {/* SOLDAN BİLGİ ALANI - TIKLANABİLİR */}
  <Pressable
    style={styles.cartInfoArea}
    onPress={() => {
      // Sepet boşsa açmaya gerek yok
      if (basket.length > 0) {
        setCartModalVisible(true);
      }
    }}
  >
    <Text style={styles.cartTitle}>Siparişim</Text>
    <Text style={styles.cartSubtitle}>
      {totalItems} ürün | TL {totalPrice.toFixed(2)}
    </Text>
    {selectedTable && (
      <Text style={styles.cartSubtitle}>
        Masa {selectedTable}
      </Text>
    )}
  </Pressable>

  {/* SAĞDAKİ BUTONLAR */}
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
  const isSelected = selectedKitchenItems.includes(unit.unitKey);

  const kitchenStatus = unit.isReady ? 'READY' : 'PENDING';
  const servedStatus = getServedStatusForUnit(unit);
  const paidStatus = getPaidStatusForUnit(unit);

  return (
    <Pressable
      key={unit.unitKey}
      style={[
        styles.cashierOrderRow,
        styles.cashierOrderRowUnpaid,
        isSelected && styles.cashierOrderRowSelected,
      ]}
      onPress={() => toggleKitchenItemSelection(unit.unitKey)}
    >
      <View style={styles.kitchenRowInner}>
        <Text style={styles.cashierOrderText}>
          {unit.name} {unit.isNoOnion ? ' (Soğansız)' : ''} [
          {kitchenStatus} | {servedStatus} | {paidStatus}]
        </Text>

        {/* 👇 SADECE NOTU VARSA BUTON GÖSTER */}
        {unit.note ? (
          <Pressable
            style={styles.kitchenNoteButton}
             onPress={(e) => {
      // Dıştaki Pressable'ın onPress'ini tetikleme
      e.stopPropagation?.();
      showNote(unit.note);
    }}
          >
            <Text style={styles.kitchenNoteButtonText}>
              Notu Gör
            </Text>
          </Pressable>
        ) : null}
      </View>
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
      const servedStatus = getServedStatusForUnit(unit);
      const paidStatus = getPaidStatusForUnit(unit);

      return (
        <View
          key={unit.unitKey}
          style={[
            styles.cashierOrderRow,
            styles.cashierOrderRowPaid,
          ]}
        >
          <View style={styles.kitchenRowInner}>
            <Text style={styles.cashierOrderText}>
              {unit.name} {unit.isNoOnion ? ' (Soğansız)' : ''} [
              {kitchenStatus} | {servedStatus} | {paidStatus}]
            </Text>

            {unit.note ? (
              <Pressable
                style={styles.kitchenNoteButton}
                 onPress={(e) => {
      // Dıştaki Pressable'ın onPress'ini tetikleme
      e.stopPropagation?.();
      showNote(unit.note);
    }}
              >
                <Text style={styles.kitchenNoteButtonText}>
                  Notu Gör
                </Text>
              </Pressable>
            ) : null}
          </View>
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

{mode === 'BARISTA' && (
  <View style={styles.cashierContainer}>
    <Text style={styles.sectionTitle}>Barista Overview</Text>

    {tablesForCashier.length === 0 && (
      <Text style={styles.emptyText}>No barista orders yet.</Text>
    )}

    <FlatList
      data={tablesForCashier}
      keyExtractor={([tableKey]) => tableKey}
      renderItem={({ item }) => {
        const [tableKey, tableOrders] = item;
        const allUnits = buildUnitsForTable(tableKey, tableOrders);

        // 🔥 SADECE sıcak içecekler
        const hotUnits = allUnits.filter((u) => u.isHotDrink);

        if (hotUnits.length === 0) return null;

        const unreadyUnits = hotUnits.filter((u) => !u.isReady);
        const readyUnits = hotUnits.filter((u) => u.isReady);

        const totalCount = hotUnits.length;
        const readyCount = readyUnits.length;
        const pendingCount = unreadyUnits.length;

        const isExpanded = !!expandedTables[tableKey];

        const allUnreadySelected =
          unreadyUnits.length > 0 &&
          unreadyUnits.every((u) =>
            selectedBaristaItems.includes(u.unitKey)
          );

        const selectedCount = unreadyUnits.filter((u) =>
          selectedBaristaItems.includes(u.unitKey)
        ).length;
const formatBaristaLabel = (unit) => {
  const extras = [];

  if (unit.turkKahvesiSugar) {
    if (unit.turkKahvesiSugar === 'no') extras.push('Şekersiz');
    if (unit.turkKahvesiSugar === 'medium') extras.push('Orta');
    if (unit.turkKahvesiSugar === 'sweet') extras.push('Şekerli');
  }

// Sütlü kahveler (çay ve espresso hariç)
const milkEligibleIds = ['cappuccino', 'latte', 'filter-coffee', 'nescafe'];
if (
  milkEligibleIds.includes(unit.id) &&
  unit.milkOptions &&
  unit.milkOptions.sutlu
) {
  extras.push('Sütlü');
}



  if (unit.cayStrength) {
    if (unit.cayStrength === 'acik') extras.push('Açık');
    if (unit.cayStrength === 'normal') extras.push('Normal');
    if (unit.cayStrength === 'demli') extras.push('Demli');
  }

  if (unit.espressoShots) {
    if (unit.espressoShots === 'single') extras.push('Single');
    if (unit.espressoShots === 'double') extras.push('Double');
  }

  if (extras.length === 0) return unit.name;
  return `${unit.name} (${extras.join(', ')})`;
};



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
                  TOTAL: {totalCount} hot drinks
                </Text>
                <Text style={styles.cashierSummaryText}>
                  READY: {readyCount}
                </Text>
                <Text style={styles.cashierSummaryText}>
                  PENDING: {pendingCount}
                </Text>
              </View>
              <Text
                style={{
                  fontSize: 12,
                  color: '#888',
                  marginTop: 2,
                }}
              >
                {isExpanded ? '▲ Gizle' : '▼ Detayları Göster'}
              </Text>
            </Pressable>

            {isExpanded && (
              <>
                {/* Select All / Clear All */}
                <View style={styles.cashierSelectAllRow}>
                  <Button
                    title={allUnreadySelected ? 'Clear All' : 'Select All'}
                    color="#0984e3"
                    onPress={() => {
                      const allKeys = unreadyUnits.map((u) => u.unitKey);
                      if (allUnreadySelected) {
                        setSelectedBaristaItems((prev) =>
                          prev.filter((k) => !allKeys.includes(k))
                        );
                      } else {
                        setSelectedBaristaItems((prev) => [
                          ...prev,
                          ...allKeys.filter((k) => !prev.includes(k)),
                        ]);
                      }
                    }}
                  />
                </View>

                {/* PENDING hot drinks */}
                
                {unreadyUnits.map((unit) => {
                    console.log('BARISTA LABEL DEBUG', unit.name, unit.cayStrength);
                  console.log('BARISTA UNIT', unit.name, unit.cayStrength);
                  const isSelected = selectedBaristaItems.includes(
                    unit.unitKey
                  );

                  return (
                    <Pressable
                      key={unit.unitKey}
                      style={[
                        styles.cashierOrderRow,
                        styles.cashierOrderRowUnpaid,
                        isSelected && styles.cashierOrderRowSelected,
                      ]}
                      onPress={() => toggleBaristaItemSelection(unit.unitKey)}
                    >
                      <View style={styles.kitchenRowInner}>
                        <Text style={styles.cashierOrderText}>
                          {formatBaristaLabel(unit)} [PENDING]
                        </Text>

                        {unit.note ? (
                          <Pressable
                            style={styles.kitchenNoteButton}
                            onPress={(e) => {
                              e.stopPropagation?.();
                              showNote(unit.note);
                            }}
                          >
                            <Text style={styles.kitchenNoteButtonText}>
                              Notu Gör
                            </Text>
                          </Pressable>
                        ) : null}
                      </View>
                    </Pressable>
                  );
                })}

                {/* READY hot drinks */}
                {readyUnits.length > 0 && (
                  <View style={{ marginTop: 6 }}>
                    <Text
                      style={{
                        fontSize: 12,
                        color: '#555',
                        marginBottom: 2,
                      }}
                    >
                      Ready drinks:
                    </Text>
                    {readyUnits.map((unit) => (
                      <View
                        key={unit.unitKey}
                        style={[
                          styles.cashierOrderRow,
                          styles.cashierOrderRowPaid,
                        ]}
                      >
                        <View style={styles.kitchenRowInner}>
                          <Text style={styles.cashierOrderText}>
                            {formatBaristaLabel(unit)} [READY]
                          </Text>

                          {unit.note ? (
                            <Pressable
                              style={styles.kitchenNoteButton}
                              onPress={(e) => {
                                e.stopPropagation?.();
                                showNote(unit.note);
                              }}
                            >
                              <Text style={styles.kitchenNoteButtonText}>
                                Notu Gör
                              </Text>
                            </Pressable>
                          ) : null}
                        </View>
                      </View>
                    ))}
                  </View>
                )}

                {/* Mark Ready */}
                <View style={styles.cashierPayRow}>
                  <Text style={styles.cashierSummaryText}>
                    Selected: {selectedCount} drinks
                  </Text>
                  <Button
                    title="Mark Ready"
                    color={selectedCount > 0 ? '#27ae60' : '#aaa'}
                    onPress={() => baristaReadySelectedItemsForTable(tableKey)}
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

              const formatWaiterLabel = (unit) => {
  const extras = [];

  // Soğansız yemekler
  if (unit.isNoOnion) {
    extras.push('Soğansız');
  }

  // Türk kahvesi şeker bilgisi
  if (unit.turkKahvesiSugar) {
    if (unit.turkKahvesiSugar === 'no') extras.push('Şekersiz');
    if (unit.turkKahvesiSugar === 'medium') extras.push('Orta');
    if (unit.turkKahvesiSugar === 'sweet') extras.push('Şekerli');
  }

  // Sütlü kahveler
// Sütlü kahveler (çay ve espresso hariç)
const milkEligibleIds = ['cappuccino', 'latte', 'filter-coffee', 'nescafe'];
if (
  milkEligibleIds.includes(unit.id) &&
  unit.milkOptions &&
  unit.milkOptions.sutlu
) {
  extras.push('Sütlü');
}



  // Çay dem ayarı
  if (unit.cayStrength) {
    if (unit.cayStrength === 'acik') extras.push('Açık');
    if (unit.cayStrength === 'normal') extras.push('Normal');
    if (unit.cayStrength === 'demli') extras.push('Demli');
  }

  // Espresso shot ayarı
  if (unit.espressoShots) {
    if (unit.espressoShots === 'single') extras.push('Single');
    if (unit.espressoShots === 'double') extras.push('Double');
  }

  if (extras.length === 0) return unit.name;
  return `${unit.name} (${extras.join(', ')})`;
};


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
  const isSelected = selectedWaiterItems.includes(unit.unitKey);

  const kitchenStatus = getKitchenStatusForUnit(unit);
  const servedStatus = getServedStatusForUnit(unit);
  const paidStatus = getPaidStatusForUnit(unit);

  return (
    <Pressable
      key={unit.unitKey}
      style={[
        styles.cashierOrderRow,
        styles.cashierOrderRowUnpaid,
        isSelected && styles.cashierOrderRowSelected,
      ]}
      onPress={() => toggleWaiterItemSelection(unit.unitKey)}
    >
      <Text style={styles.cashierOrderText}>
        {formatWaiterLabel(unit)} [
        {kitchenStatus} | {servedStatus} | {paidStatus}]
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
      const kitchenStatus = getKitchenStatusForUnit(unit);
      const servedStatus = getServedStatusForUnit(unit);
      const paidStatus = getPaidStatusForUnit(unit);

      return (
        <View
          key={unit.unitKey}
          style={[
            styles.cashierOrderRow,
            styles.cashierOrderRowPaid,
          ]}
        >
          <Text style={styles.cashierOrderText}>
            {formatWaiterLabel(unit)} [
            {kitchenStatus} | {servedStatus} | {paidStatus}]
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
        const fullyDone = isTableFullyDone(tableKey, tableOrders);

        if (allUnits.length === 0) return null;

        const unpaidUnits = allUnits.filter((u) => !u.isPaid);
        const paidUnits = allUnits.filter((u) => u.isPaid);

        const totalAmount = allUnits.reduce((s, u) => s + (u.price || 0), 0);

        const paidAmount = paidUnits.reduce((s, u) => s + u.price, 0);
        const unpaidAmount = unpaidUnits.reduce((s, u) => s + u.price, 0);

        const selectedAmount = unpaidUnits
          .filter((u) => selectedCashierItems.includes(u.unitKey))
          .reduce((s, u) => s + u.price, 0);

        const isExpanded = !!expandedTables[tableKey];

        const allUnpaidSelected =
          unpaidUnits.length > 0 &&
          unpaidUnits.every((u) =>
            selectedCashierItems.includes(u.unitKey)
          );

        // 💸 Kasiyer etiketi: Soğansız, Şekersiz, Sütlü, Demli, Double vs.
        const formatCashierLabel = (unit) => {
          const extras = [];

          // Soğansız yemek
          if (unit.isNoOnion) {
            extras.push('Soğansız');
          }

          // Türk kahvesi şeker
          if (unit.turkKahvesiSugar) {
            if (unit.turkKahvesiSugar === 'no') extras.push('Şekersiz');
            if (unit.turkKahvesiSugar === 'medium') extras.push('Orta');
            if (unit.turkKahvesiSugar === 'sweet') extras.push('Şekerli');
          }

          // Sütlü kahveler
// Sütlü kahveler (çay ve espresso hariç)
const milkEligibleIds = ['cappuccino', 'latte', 'filter-coffee', 'nescafe'];
if (
  milkEligibleIds.includes(unit.id) &&
  unit.milkOptions &&
  unit.milkOptions.sutlu
) {
  extras.push('Sütlü');
}



          // Çay dem ayarı
          if (unit.cayStrength) {
            if (unit.cayStrength === 'acik') extras.push('Açık');
            if (unit.cayStrength === 'normal') extras.push('Normal');
            if (unit.cayStrength === 'demli') extras.push('Demli');
          }

          // Espresso shot (single / double)
          if (unit.espressoShots) {
            if (unit.espressoShots === 'single') extras.push('Single');
            if (unit.espressoShots === 'double') extras.push('Double');
          }

          if (extras.length === 0) return unit.name;
          return `${unit.name} (${extras.join(', ')})`;
        };

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
                {isExpanded ? '▲ Gizle' : '▼ Detayları Göster'}
              </Text>
            </Pressable>

            {isExpanded && (
              <>
                {/* Select All / Clear All */}
                <View style={styles.cashierSelectAllRow}>
                  <Button
                    title={
                      allUnpaidSelected ? 'Clear All' : 'Select All'
                    }
                    color="#0984e3"
                    onPress={() => {
                      const allKeys = unpaidUnits.map(
                        (u) => u.unitKey
                      );
                      if (allUnpaidSelected) {
                        setSelectedCashierItems((prev) =>
                          prev.filter((k) => !allKeys.includes(k))
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
                  const isSelected =
                    selectedCashierItems.includes(unit.unitKey);
                  const kitchenStatus =
                    getKitchenStatusForUnit(unit);
                  const servedStatus =
                    getServedStatusForUnit(unit);
                  const paidStatus =
                    getPaidStatusForUnit(unit);

                  return (
                    <Pressable
                      key={unit.unitKey}
                      style={({ pressed }) => [
                        styles.cashierOrderRow,
                        styles.cashierOrderRowUnpaid,
                        isSelected &&
                          styles.cashierOrderRowSelected,
                        pressed && { opacity: 0.7 },
                      ]}
                      onPress={() =>
                        toggleCashierItemSelection(unit.unitKey)
                      }
                    >
                      <Text style={styles.cashierOrderText}>
                        {formatCashierLabel(unit)} - TL{' '}
                        {unit.price.toFixed(2)} [
                        {kitchenStatus} | {servedStatus} |{' '}
                        {paidStatus}]
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
                          <Text style={styles.cashierOrderText}>
                            {formatCashierLabel(unit)} - TL{' '}
                            {unit.price.toFixed(2)} [
                            {kitchenStatus} | {servedStatus} |{' '}
                            {paidStatus}]
                          </Text>
                        </View>
                      );
                    })}
                  </View>
                )}

                {/* Pay */}
<View style={styles.cashierPayRow}>
  <View>
    <Text style={styles.cashierSummaryText}>
      Selected: TL {selectedAmount.toFixed(2)}
    </Text>
    {fullyDone && (
      <Text style={[styles.cashierSummaryText, { color: '#27ae60' }]}>
        Masa tamamen hazır, servis edilmiş ve ödenmiş.
      </Text>
    )}
  </View>

  <View style={{ flexDirection: 'row', gap: 6 }}>
    <Button
      title="Pay Cash"
      color={selectedAmount > 0 ? '#27ae60' : '#aaa'}
      onPress={() => paySelectedItemsForTable(tableKey, 'CASH')}
      disabled={selectedAmount === 0}
    />
    <Button
      title="Pay Card"
      color={selectedAmount > 0 ? '#2980b9' : '#aaa'}
      onPress={() => paySelectedItemsForTable(tableKey, 'CARD')}
      disabled={selectedAmount === 0}
    />
    <Button
      title="Reset"
      color={fullyDone ? '#c0392b' : '#ccc'}
      onPress={() => fullyDone && closeTable(tableKey)}
      disabled={!fullyDone}
    />
  </View>
</View>


              </>
            )}
          </View>
        );
      }}
    />
  </View>
)}

{mode === 'LOG' && (
  <View style={styles.cashierContainer}>
    <Text style={styles.sectionTitle}>Log</Text>

    {logs.length === 0 ? (
      <Text style={styles.emptyText}>Henüz kapatılmış masa yok.</Text>
    ) : (
      <FlatList
        data={logs}
        keyExtractor={(log) => log.id}
        renderItem={({ item }) => {
          const isExpanded = !!expandedLogs[item.id];
          const itemsSummary = item.itemsSummary || [];

          return (
            <View style={styles.cashierTableCard}>
              <Pressable
                onPress={() =>
                  setExpandedLogs((prev) => ({
                    ...prev,
                    [item.id]: !prev[item.id],
                  }))
                }
              >
                <Text style={styles.cashierTableTitle}>
                  Masa {item.tableId}
                </Text>
                <Text style={styles.cashierSummaryText}>
                  Toplam: TL {item.totalAmount.toFixed(2)} ({item.itemCount} ürün)
                </Text>
                <Text style={styles.cashierSummaryText}>
                  Kapatılma: {new Date(item.closedAt).toLocaleString()}
                </Text>
                <Text
                  style={{
                    fontSize: 12,
                    color: '#888',
                    marginTop: 2,
                  }}
                >
                  {isExpanded ? 'Detayları gizle' : 'Detayları göster'}
                </Text>
              </Pressable>

              {isExpanded && itemsSummary.length > 0 && (
                <View style={{ marginTop: 6 }}>
                  {itemsSummary.map((p) => (
                    <Text
                      key={p.id}
                      style={styles.cashierOrderText}
                    >
                      {p.name} x {p.count}
                    </Text>
                  ))}
                </View>
              )}
            </View>
          );
        }}
      />
    )}
  </View>
)}

{mode === 'BOSS' && (
  <View style={styles.cashierContainer}>
    <Text style={styles.sectionTitle}>Boss Mode (Gün Sonu)</Text>

    {todayLogs.length === 0 ? (
      <Text style={styles.emptyText}>
        Bugün için kapatılmış masa yok.
      </Text>
    ) : (
      <>
      {/* Özet kartı */}

<View style={styles.cashierTableCard}>
  <Text style={styles.cashierTableTitle}>Özet</Text>

  <Text style={styles.cashierSummaryText}>
    Ciro: TL {bossTotalTurnover.toFixed(2)}
  </Text>

  <Text style={styles.cashierSummaryText}>
    Nakit: TL {bossTotalCash.toFixed(2)}
  </Text>

  <Text style={styles.cashierSummaryText}>
    Kredi Kartı: TL {bossTotalCard.toFixed(2)}
  </Text>

  <Text style={styles.cashierSummaryText}>
    Toplam Ürün: {bossTotalItems}
  </Text>

  <Text style={styles.cashierSummaryText}>
    Yemek: {bossFoodCount} | İçecek: {bossDrinkCount}
  </Text>
</View>


        {/* Ürün bazlı liste */}
        <FlatList
          data={bossProducts}
          keyExtractor={(p) => p.id}
          renderItem={({ item }) => (
            <View style={styles.cashierOrderRow}>
              <Text style={styles.cashierOrderText}>
                {item.name} — {item.count} adet
              </Text>
            </View>
          )}
        />
      </>
    )}
  </View>
)}

{mode === 'PASS' && (
  <View style={styles.passRoot}>
     <View style={styles.passInner}>
    {/* Logo */}
    <Pressable
      style={styles.passLogoWrapper}
      onPress={() => setMode('ORDER')}
    >
      <Image
        source={require('./assets/placeholder-image.jpg')} // ya da APP_LOGO
        style={styles.passLogo}
        resizeMode="contain"
      />
    </Pressable>

    {/* Başlık */}
    <View style={styles.passHeaderRow}>
      <Text style={styles.passTitle}>{getPassViewLabel(currentPassView)}</Text>
      <Text style={styles.passSubtitle}>5 sn sonra otomatik değişir</Text>
    </View>

    {/* Ürün grid'i, scroll yok */}
  <View style={styles.passGrid}>
  {passItems.map((item) => (
    <View
      key={item.id}
      style={[styles.passCard, { width: passCardWidth }]}   // 👈 FARK BURADA
    >
      {PRODUCT_IMAGES[item.id] && (
        <Image
          source={PRODUCT_IMAGES[item.id]}
          style={styles.passItemImage}
          resizeMode="cover"
        />
      )}
      <Text style={styles.passItemName}>{item.name}</Text>
      <Text style={styles.passItemPrice}>{item.price} TL</Text>
    </View>
  ))}
</View>
</View>
  </View>
)}



{mode === 'MANAGER' && (
  <View style={styles.cashierContainer}>
    <Text style={styles.sectionTitle}>Manager Mode</Text>

    {tablesForCashier.length === 0 ? (
      <Text style={styles.emptyText}>
        Aktif masa / sipariş yok.
      </Text>
    ) : (
      <FlatList
        data={tablesForCashier}
        keyExtractor={([tableKey]) => tableKey}
        renderItem={({ item }) => {
          const [tableKey, tableOrders] = item;

          return (
            <View style={styles.cashierTableCard}>
              {/* Masa başlığı + toplu silme */}
              <View style={styles.managerTableHeader}>
                <Text style={styles.cashierTableTitle}>
                  Masa {tableKey}
                </Text>
                <Pressable
                  style={styles.managerDangerButton}
                  onPress={() => managerDeleteTable(tableKey)}
                >
                  <Text style={styles.managerDangerButtonText}>
                    Masayı Temizle
                  </Text>
                </Pressable>
              </View>

              {tableOrders.map((order) => (
                <View key={order.id} style={styles.managerOrderBlock}>
                  <View style={styles.managerOrderHeader}>
                    <Text style={styles.cashierSummaryText}>
                      Sipariş ID: {order.id.slice(0, 6)}...
                    </Text>
                    <Pressable
                      style={styles.managerSmallDangerButton}
                      onPress={() => managerDeleteOrder(order.id)}
                    >
                      <Text style={styles.managerDangerButtonText}>
                        Siparişi Sil
                      </Text>
                    </Pressable>
                  </View>

                  {/* Item listesi */}
                  {order.items.map((it, idx) => {
                    const extrasText = formatManagerItemExtras(it);

                    return (
                      <View
                        key={idx}
                        style={styles.managerItemRow}
                      >
                        <View style={{ flex: 1 }}>
                          <Text style={styles.managerItemName}>
                            {it.name} (x{it.quantity || 0})
                          </Text>

                          {extrasText ? (
                            <Text style={styles.managerItemExtras}>
                              {extrasText}
                            </Text>
                          ) : null}
                        </View>

                        <View style={styles.managerItemControls}>
                          <Pressable
                            style={styles.managerQtyButton}
                            onPress={() =>
                              managerChangeItemQuantity(
                                order.id,
                                idx,
                                -1
                              )
                            }
                          >
                            <Text style={styles.managerQtyButtonText}>
                              -
                            </Text>
                          </Pressable>
                          <Pressable
                            style={styles.managerQtyButton}
                            onPress={() =>
                              managerChangeItemQuantity(
                                order.id,
                                idx,
                                +1
                              )
                            }
                          >
                            <Text style={styles.managerQtyButtonText}>
                              +
                            </Text>
                          </Pressable>
                        </View>
                      </View>
                    );
                  })}
                </View>
              ))}
            </View>
          );
        }}
      />
    )}
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
kitchenRowInner: {
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'space-between',
  gap: 8,
},

kitchenNoteButton: {
  paddingHorizontal: 8,
  paddingVertical: 4,
  borderRadius: 6,
  borderWidth: 1,
  borderColor: '#555',
  backgroundColor: '#fff',
},

kitchenNoteButtonText: {
  fontSize: 11,
  fontWeight: '600',
  color: '#333',
},

kitchenRowInner: {
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'space-between',
  gap: 8,
},

kitchenNoteButton: {
  paddingHorizontal: 8,
  paddingVertical: 4,
  borderRadius: 6,
  borderWidth: 1,
  borderColor: '#555',
  backgroundColor: '#ffffff',
},

kitchenNoteButtonText: {
  fontSize: 11,
  fontWeight: '600',
  color: '#333',
},

sugarRow: {
  flexDirection: 'row',
  justifyContent: 'space-between',
  marginTop: 6,
  marginBottom: 8,
  gap: 6,
},

sugarOption: {
  flex: 1,
  paddingVertical: 8,
  borderRadius: 10,
  borderWidth: 1,
  borderColor: '#ccc',
  backgroundColor: '#f7f7f7',
  alignItems: 'center',
},

sugarOptionActive: {
  borderColor: '#27ae60',
  backgroundColor: '#d6f5dd',
},

sugarOptionText: {
  fontSize: 12,
  fontWeight: '600',
  color: '#333',
},

cartInfoArea: {
  flex: 1,
},

cartModalBox: {
  width: '85%',
  maxHeight: '80%',
  backgroundColor: '#fff',
  borderRadius: 16,
  padding: 14,
  elevation: 10,
},

cartModalTitle: {
  fontSize: 18,
  fontWeight: '700',
  color: '#333',
  marginBottom: 4,
},

cartModalSubtitle: {
  fontSize: 13,
  color: '#666',
},

cartModalEmpty: {
  marginTop: 12,
  fontSize: 14,
  color: '#777',
},

cartModalList: {
  marginTop: 10,
  marginBottom: 10,
},

cartModalRow: {
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'space-between',
  paddingVertical: 6,
  borderBottomWidth: 1,
  borderBottomColor: '#eee',
},

cartModalItemName: {
  fontSize: 14,
  fontWeight: '600',
  color: '#333',
},

cartModalItemPrice: {
  fontSize: 13,
  color: '#555',
  marginTop: 2,
},

cartModalRowButtons: {
  flexDirection: 'row',
  alignItems: 'center',
  gap: 6,
},

cartModalQtyButton: {
  paddingHorizontal: 10,
  paddingVertical: 6,
  borderRadius: 8,
  backgroundColor: '#f1c40f',
},

cartModalQtyButtonText: {
  color: '#333',
  fontWeight: '700',
},

cartModalRemoveButton: {
  paddingHorizontal: 10,
  paddingVertical: 6,
  borderRadius: 8,
  backgroundColor: '#e74c3c',
},

cartModalRemoveButtonText: {
  color: '#fff',
  fontWeight: '700',
},
logoContainer: {
  width: '100%',
  alignItems: 'center',
  justifyContent: 'center',
  marginTop: 8,
  marginBottom: 8,
},


logoImage: {
  marginTop:-60,
  marginBottom:-50,
  width: 500,
  height: 170,
  resizeMode: 'contain',
  alignSelf: 'center',
},


categorySection: {
  marginBottom: 8,
},

menuSelectorHeader: {
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'space-between',
},

  managerTableHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },

  managerOrderBlock: {
    marginTop: 6,
    paddingTop: 6,
    borderTopWidth: 1,
    borderTopColor: '#ddd',
  },

  managerOrderHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },

  managerItemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 4,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },

  managerItemName: {
    fontSize: 13,
    fontWeight: '600',
    color: '#333',
  },

  managerItemControls: {
    flexDirection: 'row',
    gap: 6,
  },

  managerQtyButton: {
    width: 28,
    height: 28,
    borderRadius: 6,
    backgroundColor: '#f1c40f',
    justifyContent: 'center',
    alignItems: 'center',
  },

  managerQtyButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#333',
    marginTop: -1,
  },

  managerDangerButton: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
    backgroundColor: '#c0392b',
  },

  managerSmallDangerButton: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    backgroundColor: '#e74c3c',
  },

  managerDangerButtonText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#fff',
  },

  passRoot: {
    flex: 1,
    backgroundColor: '#000',
    paddingTop: 16,
    paddingHorizontal: 16,
  },
  passLogoWrapper: {
    alignSelf: 'center',
    marginBottom: 8,
  },
  passLogo: {
    width: 80,
    height: 80,
    borderRadius: 40,
  },
  passHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    marginBottom: 8,
  },
  passTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#fff',
  },
  passSubtitle: {
    fontSize: 12,
    color: '#aaa',
  },
  passGrid: {
    flex: 1,
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    alignContent: 'flex-start',
  },
  passCard: {
    width: '48%',           // yan yana 2 kart
    backgroundColor: '#222',
    borderRadius: 12,
    padding: 8,
    marginBottom: 10,
  },
  passItemImage: {
    width: '100%',
    height: 80,
    borderRadius: 8,
    marginBottom: 6,
  },
  passItemName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
    marginBottom: 4,
  },
  passItemPrice: {
    fontSize: 14,
    color: '#ffeb3b',
  },
passRoot: {
    flex: 1,
    backgroundColor: '#000',
    paddingTop: -6,
    paddingHorizontal: 16,
    paddingBottom: 16,  
  },
  passLogoWrapper: {
    alignSelf: 'center',
    marginBottom: 8,
  },

  passHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    marginBottom: 8,
  },
  passTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#fff',
  },
  passSubtitle: {
    fontSize: 12,
    color: '#aaa',
  },

  // GRID
  passGrid: {
    flex: 1,
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',      // 👈 geniş ekranda ortalasın
    alignContent: 'flex-start',
    gap: 20,   
                     // RN web destekliyorsa güzel; desteklemezse margin ile çözeriz
  },

  passCard: {
    // width'i buradan SİLDİK, artık JS’den geliyor
    backgroundColor: '#222',
    borderRadius: 12,
    padding: 8,
    margin: 5,
  },
  passItemImage: {
    width: '100%',
    height: 120,                   // 👈 sabit yükseklik, artık tren gibi uzamayacak
    borderRadius: 8,
    marginBottom: 6,
  },
  passItemName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
    marginBottom: 22,
  },
  passItemPrice: {
    fontSize: 14,
    color: '#ffeb3b',
  },


});
