import { useState } from 'react';
import {
  View,
  Text,
  Button,
  StyleSheet,
  Modal,
} from 'react-native';

const MENU_ITEMS = [
  { id: 'burger', name: 'Burger' },
  { id: 'pizza', name: 'Pizza' },
  { id: 'cola', name: 'Cola' },
];

function GoalInput(props) {
  // We store quantity per menu item
  const [items, setItems] = useState(
    MENU_ITEMS.map((item) => ({ ...item, quantity: 0 }))
  );

  function increaseQuantity(itemId) {
    setItems((currentItems) =>
      currentItems.map((item) =>
        item.id === itemId
          ? { ...item, quantity: (item.quantity || 0) + 1 }
          : item
      )
    );
  }

  function decreaseQuantity(itemId) {
    setItems((currentItems) =>
      currentItems.map((item) =>
        item.id === itemId
          ? {
              ...item,
              quantity: item.quantity > 0 ? item.quantity - 1 : 0,
            }
          : item
      )
    );
  }

  function submitHandler() {
    props.onAddGoal(items);
    // reset for next time
    setItems(MENU_ITEMS.map((item) => ({ ...item, quantity: 0 })));
  }

  function cancelHandler() {
    // reset when cancelling as well
    setItems(MENU_ITEMS.map((item) => ({ ...item, quantity: 0 })));
    props.onCancel();
  }

  return (
    <Modal visible={props.visible} animationType="slide">
      <View style={styles.inputContainer}>
        <Text style={styles.title}>Select Items for Order</Text>

        {items.map((item) => (
          <View key={item.id} style={styles.menuRow}>
            <Text style={styles.menuItemText}>
              {item.name} ({item.quantity})
            </Text>
            <View style={styles.buttonsRow}>
              <Button title="-" onPress={() => decreaseQuantity(item.id)} />
              <View style={styles.space} />
              <Button title="+" onPress={() => increaseQuantity(item.id)} />
            </View>
          </View>
        ))}

        <View style={styles.actionsRow}>
          <Button title="Cancel" color="#f31282" onPress={cancelHandler} />
          <Button title="Add Order" color="#5e0acc" onPress={submitHandler} />
        </View>
      </View>
    </Modal>
  );
}

export default GoalInput;

const styles = StyleSheet.create({
  inputContainer: {
    flex: 1,
    backgroundColor: '#311b6b',
    padding: 16,
    justifyContent: 'center',
  },
  title: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
  },
  menuRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#cccccc',
  },
  menuItemText: {
    color: 'white',
    fontSize: 16,
  },
  buttonsRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  space: {
    width: 8,
  },
  actionsRow: {
    marginTop: 24,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
});
