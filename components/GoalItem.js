import { StyleSheet, Text, View, Button, Pressable } from "react-native";

function GoalItem({ text, id, status, onReady, onServe }) {
  return (
    <Pressable
      style={({ pressed }) => pressed && styles.pressedItem}
    >
      <View style={styles.goalContainer}>
        <Text style={styles.goalStyles}>{text}</Text>

        {/* If order is PENDING, show a READY button */}
        {status === "PENDING" && (
          <View style={styles.buttonWrapper}>
            <Button
              title="Ready"
              onPress={() => onReady(id)}
            />
          </View>
        )}

        {/* Always show the X button = served / remove */}
        <View style={styles.buttonWrapper}>
          <Button
            title="X"
            onPress={() => onServe(id)}
          />
        </View>
      </View>
    </Pressable>
  );
}

export default GoalItem;

const styles = StyleSheet.create({
  goalStyles: {
    padding: 8,
    margin: 1,
    color: "white",
    borderRadius: 6,
    backgroundColor: "#5e0acc",
    width: "70%",
  },
  pressedItem: {
    opacity: 0.5,
  },
  goalContainer: {
    margin: 1,
    flexDirection: "row",
    alignItems: "center",
  },
  buttonWrapper: {
    marginLeft: 4,
  },
});
