import { StyleSheet,Text,View,Button,Pressable } from "react-native";

function GoalItem({text,id,onDelete}){

   

    return(
        <Pressable
        style={({pressed})=>pressed && styles.pressedItem}
        //it can take an object but alternatively it can take a function as an alternative
        // Style Props...
        // this function will be called automatically by pressable whenever the press state changes !!!!!!
        // You will get a argument here, a parameter, with information about the current press state !!!
        // and you can use object destructring to get hold of the pressed property that's part of this obj. you get
        // You can also name the overall parameter pressData and access pressData.pressed in that function
        // or destruct and get pressed 
         onPress={onDelete.bind(this,id)} >
             <View style={styles.goalContainer}> 
                <Text style={styles.goalStyles}> {text} </Text> 
                <Button
                onPress={ ()=> onDelete(id)} 
                title='X' 
                />
        </View>
        </Pressable>
    )
};

export default GoalItem;

const styles = StyleSheet.create({

 goalStyles:{
  padding:8,
  margin:1,
  color:"white",
  borderRadius:6,
  backgroundColor:"#5e0acc",

  width:"70%",
},
pressedItem:{
  opacity:0.5,
},
goalContainer:{
  margin:1,
  flexDirection:"row",
  alignItems:"center"
},
});