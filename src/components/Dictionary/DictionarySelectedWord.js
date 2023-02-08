import { StyleSheet, Text, TouchableOpacity, View, Alert, ScrollView, SafeAreaView } from 'react-native'
import * as Linking from 'expo-linking';
import {LinearGradient} from 'expo-linear-gradient';
import Icon from 'react-native-vector-icons/FontAwesome';
import copyToClipboard from '../../reuseableComponents/copyPaste';

const SelectedWord = ({route, navigation}) => {
    
    const jsonData = route.params.objSearch
    console.log(jsonData)
    const scriptureReference = (e) => {
        Linking.openURL(`https://www.biblegateway.com/passage/?search=${e}`)
        // used for expo linking
    }
    const wordFeedback = (e) => {
        // used to gather the feedback value of good or bad
        if (e[1] === 'bad'){
            // the feedback value comes in as an array of 2 values. 
            // First value is the word the second value is "good" or "bad"
            // The values are sent to the backend for processing
            Alert.alert(
                "Thank you!",
                "Your feedback is very instrumental to us and all the users using the platform. Would you mind jotting down a few of your thoughts?",
                [
                  {
                    text: "Yes",
                    onPress: () => {
                        navigation.navigate('Feedback', {e})
                    }
                  },
                  { text: "Later", onPress: async () => {
                    try {
                        const response  = await fetch(`http://10.0.0.211:8000/word_feedback`,{
                            method: 'POST',
                            headers:{'content-type': 'application/json'},
                            body: JSON.stringify({
                                word:e[0], feedback:'bad'
                                }),
                            }
                        )
                        if (response.status !== 200){
                            Alert.alert('❌', 'Was unable to update. Try restart the app, or try again later.')
                        }
                        else{
                          navigation.goBack()
                        }
                      }
                    catch (err) {
                      console.log(err)
                    }  
                }, stlye: 'cancel'}
                ]
            )
        }
        else{
            Alert.alert(  
                "Thank you!",
                "Yayy 😀🤠",
                [
                    {
                      text: "Ok",
                      onPress: async () => {
                        try {
                            const response = await fetch(`http://10.0.0.211:8000/word_feedback`,{
                                method: 'POST',
                                headers:{'content-type': 'application/json'},
                                body: JSON.stringify({
                                    word:e[0], feedback:'good'
                                    }),
                                }
                            )
                            if (response.status !== 200){
                                Alert.alert('❌', 'Was unable to update. Try restart the app, or try again later.')
                            }
                            else{
                              navigation.goBack()
                            }
                          }
                        catch (err) {
                          console.log(err)
                        }  
                      }
                    }
            ]
        )
    }
// alert that will pop up to the user. 
    }
  return (
    <SafeAreaView style={styles.container}>
        <ScrollView>
            <LinearGradient colors={['#2C3E50', '#000000', ]}>
                <View style={styles.reviews}>
                    <Icon name='thumbs-up' style={{paddingRight:'10%'}} color='white' size={45} type='font-awesome' onPress={() => wordFeedback([jsonData.name, 'good'])} />
                    <Icon name='thumbs-down' color='white' size={45} type='font-awesome' onPress={() => wordFeedback([jsonData.name, 'bad'])} />
                    {/* feedback icons */}
                </View>
                <View style={styles.center}>
                    <LinearGradient colors={['#de6262', '#ffb88c' ]} style={styles.linearGradientWord}>
                        <View style={styles.wordDiv}>
                            <Text style={styles.word} onPress={()=>{copyToClipboard(jsonData.name)}}>{jsonData.name}</Text>
                        </View>
                    </LinearGradient>
                </View>
                <View style={styles.center}>
                    <LinearGradient colors={['#de6262', '#ffb88c']} style={styles.linearGradientMeaning}>
                        <View style={styles.meaningDiv}>
                            <Text style={styles.meaningHeader}>Meaning</Text>
                            <Text style={styles.meaning} onPress={()=>{copyToClipboard(jsonData.Meaning)}}>{jsonData.meaning}</Text>
                        </View>
                    </LinearGradient>
                </View>
                {/* renders dictionary data that was passed to this component via the route.param in react navigation */}
                <View style={styles.center}>
                    <LinearGradient colors={['#de6262', '#ffb88c']} style={styles.linearGradientScripture}>
                        <View  style={styles.scripture}>
                            <Text style={styles.scriptureHeader}>📖 Reference 🔍</Text>
                            {jsonData.scripture === 'None' ?  <Text style={styles.scripture} > 📺 Video Coming Soon </Text> : <TouchableOpacity onPress={() => {scriptureReference(jsonData.scripture )}}><Text style={styles.scripture} > {jsonData.scripture}</Text></TouchableOpacity>}
                            {jsonData.backupScripture1 === 'None' ? null  : <TouchableOpacity onPress={() => {scriptureReference(jsonData.backupScripture1)}}><Text style={styles.scripture} > {jsonData.backupScripture1}</Text></TouchableOpacity>}
                            {jsonData.backupScripture2 === 'None' ?  null : <TouchableOpacity onPress={() => {scriptureReference(jsonData.backupScripture2)}}><Text style={styles.scripture} > {jsonData.backupScripture2}</Text></TouchableOpacity>}
                            {/* condiional rendering if scripture1, scripture2. or scripture 3 exist */}
                        </View>
                    </LinearGradient>
                </View>
            </LinearGradient>
        </ScrollView>
    </SafeAreaView>

  )
}

export default SelectedWord

const styles = StyleSheet.create({
    container:{
        flexDirection: 'column',
        justifyContent: 'space-between',
        flex: 1,
    },
    center:{
        alignItems:'center', justifyContent: 'center',
    },
    reviews:{
        flexDirection: 'row',
        alignItems:'center', justifyContent: 'center',
    },
    linearGradientWord:{
        alignItems:'center', justifyContent: 'center',
        borderRadius: '20',
        width: '70%',
        marginTop: '5%',
        marginBottom: '5%'
    },
    wordDiv:{
        alignItems:'center', justifyContent: 'center',
        paddingTop: '8%', paddingBottom: '8%', marginBottom: 5,
    },
    word:{
        fontSize: '30%', fontWeight:'900',
        color: 'black'
    },
    linearGradientMeaning:{
        alignItems:'center', justifyContent: 'center',
        borderRadius: '20',
        width: '90%', 
        margin: '5%',
    },
    meaningDiv:{
        fontSize: '30%', fontWeight:'450',
        paddingTop: '10%', paddingBottom: '10%', paddingLeft: '5%', paddingRight: '5%',
        marginBottom: 5, marginTop: 5,        
        alignItems:'center', justifyContent: 'center',
    },
    meaningHeader:{
        fontSize: '30%', fontWeight:'500',
        paddingLeft:'10%', paddingRight: '10%', paddingTop: '5%', 
    },
    meaning:{
        fontSize: '25%',
        paddingTop:'5%',
        textAlign: 'center',
    },
    linearGradientScripture:{
        borderRadius: '20',
        width: '90%',
        marginBottom: '45%',
    },
    scriptureDiv:{
        fontSize: '30%', fontWeight:'450',
        paddingLeft: '5%', paddingRight: '5%',
    },
    scriptureHeader:{
        fontSize: '30%', fontWeight:'500',
        paddingLeft:'10%', paddingRight: '10%', paddingTop: '5%',  paddingBottom: '5%'
    },
    scripture:{
        alignItems:'center', justifyContent: 'center',
        fontSize: '25%', fontWeight:'450',
        marginBottom: '5%',
        textDecorationLine: 'underline', textDecorationColor: 'black'
    },
})