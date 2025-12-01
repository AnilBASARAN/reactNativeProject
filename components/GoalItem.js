import { StyleSheet, Text, View, Button, Pressable, Modal } from "react-native";
import { useState } from "react";

function GoalItem({ text, id, onDelete, note }) {
  const [noteVisible, setNoteVisible] = useState(false);

  return (
    <>
      <Pressable
        style={({ pressed }) => pressed && styles.pressedItem}
      >
        <View style={styles.goalContainer}>
          
          <Text style={styles.goalStyles}>{text}</Text>

          {note && (
            <Button
              title="Notu Gör"
              color="#2980b9"
              onPress={() => setNoteVisible(true)}
            />
          )}

          <Button
            onPress={() => onDelete(id)}
            title="Ready"
            color="#27ae60"
          />
        </View>
      </Pressable>

      {/* NOTE MODAL */}
      <Modal
        visible={noteVisible}
        transparent
        animationType="fade"
      >
        <View style={styles.noteModal}>
          <View style={styles.noteBox}>
            <Text style={styles.noteTitle}>Sipariş Notu</Text>
            <Text style={styles.noteText}>{note}</Text>
            <Button title="Kapat" onPress={() => setNoteVisible(false)} />
          </View>
        </View>
      </Modal>
    </>
  );
}

export default GoalItem;

const styles = StyleSheet.create({
  goalStyles: {
    padding: 8,
    margin: 1,
    color: "white",
    borderRadius: 6,
    backgroundColor: "#3b3643ff",
    width: "65%",
  },

  pressedItem: {
    opacity: 0.5,
  },

  goalContainer: {
    margin: 1,
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },

  noteModal: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },

  noteBox: {
    width: "80%",
    backgroundColor: "white",
    borderRadius: 16,
    padding: 20,
  },

  noteTitle: {
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 12,
  },

  noteText: {
    fontSize: 14,
    marginBottom: 20,
  },
});
