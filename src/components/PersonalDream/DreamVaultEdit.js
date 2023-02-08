import { Text, View, StyleSheet, TextInput, Keyboard, TouchableWithoutFeedback, KeyboardAvoidingView, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import {useState, useRef, useContext} from 'react'
import axios from "axios";
import * as SecureStore from 'expo-secure-store';
import { DreamIdStatus } from '../../context/DreamId';
import { useQuery } from "react-query"

const DreamVaultEdit = ({navigation}) => {
  const [dreamId, setDreamId] = useContext(DreamIdStatus)
  const ref_input1 = useRef();
  const ref_input2 = useRef();

  const timeFunction = () => {
    const date = new Date();
    let day = date.getDate();
    let month = date.getMonth() + 1;
    let year = date.getFullYear();
    var time = date.toLocaleString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true })    // This arrangement can be altered based on how we want the date's format to appear.
    let currentDate = `${month}-${day}-${year} -- ${time}`
    return(currentDate)
  }
  const updateDream = async () => {
    const currentDateTime = (timeFunction())
    const userProfileInfo = await SecureStore.getItemAsync('userProfile')
    const userProfileJson = JSON.parse(userProfileInfo)
    const profileName = userProfileJson['profile_name']
    const postRequest = await axios.post(`http://10.0.0.211:8000/save_user_dream_vault`,{
      dreamDate:currentDateTime, dreamSubject:subject, dreamNote:dream, 
      profileName:profileName, view:"updatedDream", dreamId:dreamId})
    // post request to save dream to backend
    if (postRequest.data === "Successfully added to vault"){
      Alert.alert('🔐', 'Vault updated')
      // this is for response status which will be updated on screen. Conditioanl rendering
      await setSubject('')
      await setDream('')
      await setDreamId('')
      navigation.navigate("DreamVault");
      // once post request is ran, the state value will also change to empty.
    }
    else{
      Alert.alert('❌', 'Vault not updated. Try again.')
      // if there was an error with the post, thie response will be rendered and displayed on the screen using
}
  }
  const getDream = async () => {
    const userProfileInfo = await SecureStore.getItemAsync('userProfile')
    const userProfileJson = JSON.parse(userProfileInfo)
    const profileName = userProfileJson['profile_name']
    const dreamSendData = {'dream_id' : dreamId, sourceView :'DreamVaultEdit', 'profileName':profileName}
    // this takes in the value from the "community file" and sends an API request to the backend with the dreamId as index. watch this
    const postApiCall = await axios.post(`http://10.0.0.211:8000/dream_view`,dreamSendData)
    return (postApiCall.data)
      // returns an array of arrays
    }
    const {data:dataLoaded, isLoading: dataIsLoading, error: dataLoadingError} = useQuery("postApiCall", getDream)
    if (dataIsLoading)return(
      <View style={styles.container}>
        <ActivityIndicator size="large" color="red"/>
        <Text style={styles.alert}>Unlocking the revelations 🔐</Text>
      </View>
    )
    if (dataLoadingError)return(
      <View style={styles.container}>
        <Text style={styles.alert}>Error unlocking the revelations. Try again later 😃</Text>
      </View>
    )
    
    const [subject, setSubject] = useState(dataLoaded[0]['user_dream_subject'])
    // subject of the email
    const [dream, setDream] = useState(dataLoaded[0]['user_dream']);
    // state value just in case user update the state 


  return (
    <KeyboardAvoidingView style={styles.container} behavior="padding">
        {/* this will make the keyboard go up on screen upon type */}
          <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
            {/* this will make the keyboard disappear when user press on screen */}
            <View style={styles.formView}>
              <View style={styles.buttonTopView}>
                <TouchableOpacity onPress={(updateDream)} style={styles.buttonStyle}><Text style={styles.buttonText}>Update vault 🔐</Text></TouchableOpacity>
              </View>
                <View style={styles.subjectTopView}>
                  <View style={styles.subjectView}>
                  <TextInput
                    style={styles.dreamSubjectView}
                    value={subject}
                    onChangeText={(dreamSubject) => {
                      setSubject(dreamSubject)
                    }}
                    placeholder="Subject"
                    returnKeyType='next'
                    onSubmitEditing={() => ref_input2.current.focus()}
                    ref={ref_input1}
                    multiline={true}
                    />
                  </View>
                </View>
                <TextInput
                  style={styles.textTopView}
                  value={dream}
                  onChangeText={(text) => {
                    setDream(text) 
                  }}
                  placeholder="Dream"
                  multiline={true}
                  ref={ref_input2}
                />
              </View>
          </TouchableWithoutFeedback>
      </KeyboardAvoidingView>

  );
};

export default DreamVaultEdit

const styles = StyleSheet.create({
  container:{
    flexDirection: 'row', flex: 1,
    justifyContent: 'start', alignContent: 'center', 
    paddingLeft: '3%', paddingRight: '3%',
  },
  center:{
    justifyContent: 'cetner', alignContent: 'center', textAlign:'center'
  },
  formView:{
    flex: 1
  },
  subjectTopView:{
    flexWrap: 'nowrap', flex: 1,
  },
  dreamSubjectView: {
    fontSize: '20%', fontWeight: '900',
  },
  textTopView:{
    flexWrap: 'nowrap', flex: 5,
    fontSize: '20%', fontWeight: '400',
  },
  dreamText: {
    fontSize: '20%', fontWeight: '400',
  },
  buttonTopView:{
     marginBottom: '15%',
  },
  buttonStyle:{
    marginBottom: '15%',
    borderWidth: '10%',
    borderColor: "black",
    backgroundColor: 'black',
    borderRadius: '20%',
  },
  buttonText:{
    color: 'white',
    fontWeight: '500',
    fontSize: '20%',
    textAlign: 'center'
  }
});


