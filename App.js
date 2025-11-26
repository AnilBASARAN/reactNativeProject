import { useState } from 'react';
import { View, StyleSheet, FlatList, Button, Text } from 'react-native';
import GoalItem from './components/GoalItem';
import GoalInput from './components/GoalInput';

const TABLES = [1, 2, 3, 4, 5]; // Table numbers for now

export default function App() {
  const [orders, setOrders] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedTable, setSelectedTable] = useState(null);
  const [mode, setMode] = useState('WAITER'); // 'WAITER' | 'KITCHEN'

  function startAddOrderHandler(tableId) {
    setSelectedTable(tableId);
    setModalVisible(true);
  }

  function endAddOrderHandler() {
    setModalVisible(false);
    setSelectedTable(null);
  }

  function addOrderHandler(enteredOrderText) {
    if (!selectedTable) {
      return;
    }

    setOrders((currentOrders) => [
      ...currentOrders,
      {
        id: Math.random().toString(),
        tableId: selectedTable,
        text: enteredOrderText, // e.g. "2x Burger, 1x Cola"
        status: "PENDİNG",
      },
    ]);

    endAddOrderHandler();
  }

  function deleteOrderHandler(id) {
    // For now: deleting = order is done/served
    setOrders((currentOrders) =>
      currentOrders.filter((order) => order.id !== id)
    );
  }

  function markOrderReady(id) {
  setOrders((currentOrders) =>
    currentOrders.map((order) =>
      order.id === id ? { ...order, status: 'READY' } : order
    )
  );
}

function markOrderServed(id) {
  // For now, when served, we remove it from the list
  setOrders((currentOrders) =>
    currentOrders.filter((order) => order.id !== id)
  );
}


  return (
    <View style={styles.appContainer}>
      {/* Mode switcher */}
      <View style={styles.modeSwitchContainer}>
        <Button
          title="Waiter Mode"
          color={mode === 'WAITER' ? '#5e0acc' : '#888'}
          onPress={() => setMode('WAITER')}
        />
        <Button
          title="Kitchen Mode"
          color={mode === 'KITCHEN' ? '#5e0acc' : '#888'}
          onPress={() => setMode('KITCHEN')}
        />
      </View>

      {/* Order input modal (same component as before) */}
      {modalVisible && (
        <GoalInput
          visible={modalVisible}
          onAddGoal={addOrderHandler}     // now adds an order
          onCancel={endAddOrderHandler}
        />
      )}

      {mode === 'WAITER' && (
        <>
          {/* Table selection */}
          <View style={styles.tableContainer}>
            <Text style={styles.sectionTitle}>Select a Table</Text>
            <View style={styles.tablesRow}>
              {TABLES.map((tableId) => (
                <View key={tableId} style={styles.tableButton}>
                  <Button
                    title={`Table ${tableId}`}
                    color="#5e0acc"
                    onPress={() => startAddOrderHandler(tableId)}
                  />
                </View>
              ))}
            </View>
          </View>

          {/* Orders list (what waiter sees) */}
          <View style={styles.listContainer}>
            <Text style={styles.sectionTitle}>Active Orders</Text>
            <FlatList
              data={orders}
              keyExtractor={(item) => item.id}
              renderItem={(itemData) => {
                const order = itemData.item;
                return (
                  <GoalItem
                    id={order.id}
                    text={`Table ${order.tableId}: ${order.text}`}
                    onDelete={deleteOrderHandler}
                  />
                );
              }}
            />
          </View>
        </>
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
        text={`Table ${order.tableId}: ${order.text} [${order.status}]`}
        onDelete={markOrderReady}   // 👈 kitchen = mark ready
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
    paddingTop: 50,
    paddingHorizontal: 16,
    backgroundColor: '#1e085a',
  },
  modeSwitchContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  tableContainer: {
    marginBottom: 16,
  },
  tablesRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 8,
  },
  tableButton: {
    marginRight: 8,
    marginBottom: 8,
  },
  listContainer: {
    flex: 1,
    marginTop: 16,
  },
  sectionTitle: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  emptyText: {
    color: '#ccc',
    fontSize: 16,
  },
});
