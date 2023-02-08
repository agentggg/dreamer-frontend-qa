import { StyleSheet, ScrollView, Text, View, Keyboard, KeyboardAvoidingView, Alert, TouchableOpacity, TouchableWithoutFeedback, TextInput, SafeAreaView } from 'react-native'
import React, {useState } from 'react'
import axios from 'axios'


const CreateAccount = ({navigation}) => {
    const [username, setUserName] = useState('')
    const [password, setPassword] = useState('')
    const [profileName, setProfileName] = useState('')
    const [firstName, setFirstName] = useState('')
    const [lastName, setLastName] = useState('')
    const [email, setEmail] = useState('')
    const [phoneNumber, setPhoneNumber] = useState('')
    const [valid, isValid] = useState(true)


    
    const postApiResponse = async() => {
      const postApiData = {
        username:username, password:password, profileName:profileName, 
        firstName:firstName, lastName:lastName, email:email, phoneNumber:phoneNumber
      }
      const postApiCall = await axios.post(`http://10.0.0.211:8000/create_account`,postApiData)
      if (postApiCall.data == 'successful'){
        Alert.alert("✅", "Account created",
        [{text: 'OK', onPress: () => {navigation.goBack()}}]
        )
      }
      else{
        Alert.alert("🚫Error", postApiCall.data)
          }
        }

      

    return (
        <KeyboardAvoidingView style={styles.container} behavior="padding" >
          <SafeAreaView>
            <ScrollView>
              <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
                  <View>
                      <TextInput
                          style={styles.fieldData}
                          value={firstName}
                          autoCorrect={false}
                          onChangeText={(text) => {
                              setFirstName(text) 
                          }}
                          placeholder="First name"
                          clearButtonMode="always"
                          returnKeyType="next"
                      />
                      <TextInput
                          style={styles.fieldData}
                          value={lastName}
                          autoCorrect={false}
                          onChangeText={(text) => {
                              setLastName(text) 
                          }}
                          placeholder="Last name"
                          clearButtonMode="always"
                          returnKeyType="next"
                      />
                      <TextInput
                          style={styles.fieldData}
                          value={email}
                          autoCapitalize='none'
                          autoCorrect={false}
                          onChangeText={(text) => {
                              setEmail(text) 
                          }}
                          placeholder="email"
                          clearButtonMode="always"
                          returnKeyType="next"
                      />
                      <TextInput
                          style={styles.fieldData}
                          value={phoneNumber}
                          autoCapitalize='none'
                          autoCorrect={false}
                          onChangeText={(text) => {
                              setPhoneNumber(text) 
                          }}
                          placeholder="111-222-3333"
                          clearButtonMode="always"
                          returnKeyType="next"
                      />
                      <TextInput
                          style={styles.fieldData}
                          value={profileName}
                          autoCapitalize='none'
                          autoCorrect={false}
                          onChangeText={(text) => {
                            setProfileName(text) 
                          }}
                          placeholder="display name"
                          clearButtonMode="always"
                          returnKeyType="next"
                      />
                      <TextInput
                          style={styles.fieldData}
                          value={username}
                          autoCapitalize='none'
                          autoCorrect={false}
                          onChangeText={(text) => {
                              setUserName(text) 
                          }}
                          placeholder="login name"
                          clearButtonMode="always"
                          returnKeyType="next"
                          secureTextEntry={false}
                      />
                      <TextInput
                          style={styles.fieldData}
                          value={password}
                          autoCapitalize='none'
                          autoCorrect={false}
                          onChangeText={(text) => {
                              setPassword(text) 
                          }}
                          placeholder="password"
                          secureTextEntry={true}
                          clearButtonMode="always"
                          returnKeyType="next"
                          pattern={[
                            '^.{8,}$', // min 8 chars
                            '(?=.*\\d)', // number required
                            '(?=.*[A-Z])', // uppercase letter
                          ]}
                          onValidation={isValid => this.setState({ isValid })}                    />
                      <View style={styles.buttons}>
                        <TouchableOpacity onPress={postApiResponse} title="Register">
                            <Text style={styles.buttonText}>Register</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={()=>navigation.navigate("Login")} title="Login">
                            <Text style={styles.buttonText}>Login</Text>
                        </TouchableOpacity>
                      </View>
                  </View>
              </TouchableWithoutFeedback>
            </ScrollView>
          </SafeAreaView>
        </KeyboardAvoidingView>
      
    )
}

export default CreateAccount

const styles = StyleSheet.create({
    container:{
        flexDirection: 'column',
        backgroundColor: 'black', 
        justifyContent: 'space-evenly', alignContent: 'center',
        height: '100%', width: '100%',
      },
    fieldData:{
        backgroundColor: 'white',
        fontWeight: '400', fontSize: '25%',
        textAlign: 'center',
        borderWidth: '20%', borderRadius: '30%',
        paddingTop: '3%', paddingBottom: '3%',
        textAlign: 'center',
    },
    buttons:{
      flexDirection: 'row',
      justifyContent: 'space-around', alignContent: 'center', textAlign: 'cetner',
  },
    loginButton:{
        color: 'white',
        
    },
    buttonText:{
        color: 'white',
        fontSize: '40%'
  },
})