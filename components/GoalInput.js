import { View, Button, TextInput, StyleSheet, Modal,Image } from "react-native";
import { useState } from "react";

function GoalInput({ onAddGoal,visible,onCancel }) {
  const [enteredGoalText, setEnteredGoalText] = useState("");

  function goalInputHandler(enteredText) {
    setEnteredGoalText(enteredText);
  }

  function resetInput() {
    setEnteredGoalText("");
  }

  function addGoalHandler() {
    onAddGoal(enteredGoalText);
    resetInput();
  }

  return (
   <Modal visible={visible} animationType="slide" >
     <View style={styles.inputContainer}>
      <Image style={styles.image} source={require("../assets/goal.png")} />
      <TextInput
        value={enteredGoalText}
        onChangeText={goalInputHandler}
        style={styles.textInput}
        placeholder="Your course Goal!"
      />
      <View style={styles.buttonContainer}>
        <View style={styles.button} >
          <Button
          color="#b180f0"
        onPress={addGoalHandler}
        title="Add Goal"
      />
        </View>
        <View style={styles.button} >
          <Button
          color="#f31282"
          title="Cancel"
          onPress={onCancel}
           />
        </View>
      </View>
    </View>
   </Modal>
  );
}

const styles = StyleSheet.create({
  inputContainer: {
    backgroundColor:"#311b6b",
    padding:16,
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    borderBottomWidth: 1,
    borderBottomColor: "#cccccc",
    marginBottom:-1,
  },
  image:{
    width:100,
    height:100,
    margin:20
  },
  buttonContainer:{
    marginTop:16,
    flexDirection:"row",
  },
  button:{
    width:"20%",
    marginHorizontal:8,
    paddingHorizontal:20,
    borderWidth:1,
    backgroundColor:"white",
    borderRadius:5

  },
  textInput: {
    borderWidth: 1,
    borderColor: "#e4d0ff",
    borderRadius:6,
    width: "100%",
    padding: 8,
    backgroundColor:"#e4d0ff",
    color:"#120438",
  },
});

export default GoalInput;
