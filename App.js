
import { useState } from 'react';
import {View, StyleSheet,FlatList, Button } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import GoalItem from './components/GoalItem';
import GoalInput from './components/GoalInput';
export default function App() {

  const [courseGoals,setcourseGoals] = useState([]);

  const [modalVisible,setModalVisible] = useState(false);

  function startAddGoalHandler(){
    setModalVisible(true);
  }

  function endAddGoalHandler(){
    setModalVisible(false);
  }

 function deleteGoalHandler(id){
setcourseGoals((currentGoals)=>
currentGoals.filter((goal) => goal.id !== id)
);
}

function addGoalHandler(enteredGoalText){
  
  setcourseGoals(()=>[...courseGoals,{text:enteredGoalText,id:Math.random().toString()},]);
 endAddGoalHandler();
}
  

  return (
    <>
    <StatusBar style='light'/>
    <View style={styles.appContainer}>
      <Button title='Add New Goal' color="#b3a2c8ff" onPress={startAddGoalHandler} />
      { modalVisible && <GoalInput onCancel={endAddGoalHandler}  visible={modalVisible} onAddGoal={addGoalHandler} /> }
    <View style={styles.goalsContainer} >
      <FlatList
      alwaysBounceVertical={false}
      data={courseGoals}
      keyExtractor={(item,index)=> { return item.id}}
      renderItem={(itemData) =>{
        return (
       <GoalItem 
       addGoalHandler={addGoalHandler} 
       onDelete={deleteGoalHandler} 
       id={itemData.item.id} 
       text={itemData.item.text} />
      )
      }}
      />
    </View>
    </View>
    </>
  );
}

const styles = StyleSheet.create({
textInput:{
  borderWidth:1,
  borderColor:"#cccccc",
  width:"70%",
  marginRight: 8,
  padding: 8,
}
,

     goalsContainer: {
    flex:5,
    margin:"auto"
 },


 appContainer: {
  flex:1,
  paddingTop: 50,
  paddingHorizontal:16,
backgroundColor: "#1e085a"
 },

  
});




     
   