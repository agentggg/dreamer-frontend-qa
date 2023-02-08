import React, { useState } from "react";
import { StyleSheet, View, Text, TextInput, KeyboardAvoidingView, Button, SafeAreaView } from "react-native";

const Feedback = ({route, navigation}) => {
    const selectedWord = route.params.e
    // the selected word that is coming in from the frontend.
    // only the name of the word comes in for processing 
    // this comes in as an array
    // ['word', 'good/bad']
    const [textInputValue, setTextInputValue] = useState(null);
    // state value for the textinput where the user will provide feedback/comments
    const postResponse = async () => {
      try {
        await fetch(`http://10.0.0.211:8000/word_feedback`,{
            method: 'POST',
            headers:{'content-type': 'application/json'},
            body: JSON.stringify({
              word:selectedWord[0], feedback:'bad', feedback_notes:textInputValue
                }),
            }
        )
        if (response.status !== 200){
            Alert.alert('❌', 'Username and/or password is invalid. Please try again.')
        }
        else{
          navigation.goBack()
        }
      }
    catch (err) {
      console.log(err)
    }  
  }

  
    // API request with the data to be processed to the backend
  return (
    <SafeAreaView style={styles.container}> 
        <KeyboardAvoidingView style={styles.mainView}>
                <View style={styles.headerView}>
                    <Text style={styles.headerText}>Tell us know your thoughts, provide reference if you believe that the meaning or scripture is incorrect.</Text>
                </View>
                <View style={styles.textInputHeader}>
                    <TextInput
                        style={styles.textBox}
                        value={textInputValue}
                        onChangeText={(text) => {
                            setTextInputValue(text) 
                        }}
                        placeholder="Add your valuable feedback"
                        multiline={true}
                    />
                </View>
                <View style={styles.buttonView}>
                    <Button 
                        onPress={postResponse}
                        // POST request
                        title='Submit'
                    />
                </View>
        </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

export default Feedback

const styles = StyleSheet.create({
  container: {
    flex: 1, flexDirection: 'column',
    backgroundColor: "#fff",
    justifyContent: "center",
  },
  mainView:{
    flex: 1,
  },
  headerView:{
    flex: 1,
    marginTop: '20%',
  },
  headerText:{
    textAlign: 'center',
    fontSize: '20%',
  },
  textInputHeader:{
    flex: 2,
    padding: '5%',
  },
  textBox: {
    height: '100%', 
    borderColor: 'gray', borderWidth: 3,
    placeholderTextColor: 'gray',
    fontSize: '20%', fontWeight: '300',
    padding: '5%',
  },
  buttonView: {
    fontSize: '20%', fontWeight: '300',
    alignItems:'center', justifyContent: 'center',
    flex: 1
},
});