import {SafeAreaView, StyleSheet, Text, TouchableOpacity, Alert} from 'react-native'
import React, {useContext} from 'react'
import {LinearGradient} from 'expo-linear-gradient';
import * as Linking from 'expo-linking';
import {PremiumUsers} from '../context/Premium';


const Homepage = ({navigation}) => {
  const [isPremiumUser, setPremiumUser] = useContext(PremiumUsers)
  const selectedView = (e) => {
    if (!isPremiumUser && e === 'Community' || !isPremiumUser && e === 'Teachings'){
      Alert.alert(
        //title
        'One time cost',
        //body
        'Join the dreamers🤠🤠?',
        [
          { text: 'Yes', onPress: () => console.warn('Yes Pressed')},
          {text: 'No', onPress: () => console.warn('No Pressed'), style: 'cancel'},
        ],
        { cancelable: false }
        //clicking out side of alert will not cancel
      );
    }else{
      navigation.navigate(e)
    }
}
  const donationPage = () => {
    Linking.openURL('https://givebutter.com/tech-faith');
  }

  return (
    <SafeAreaView>
      <LinearGradient colors={['#de6262', '#ffb88c']} style={styles.center}>
          <TouchableOpacity onPress={() => selectedView('Dictionary')}>
              <LinearGradient colors={['#2C3E50', '#000000']}  style={styles.fullSectionButton}>
                  <Text style={styles.fullSectionWord}>Dictionary</Text>
              </LinearGradient>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => selectedView('Dreams')}>
              <LinearGradient colors={['#2C3E50', '#000000']} style={styles.fullSectionButton}>
                  <Text style={styles.fullSectionWord}>Dreams</Text>
              </LinearGradient>
          </TouchableOpacity>
          {/* <TouchableOpacity onPress={() => selectedView('Community')}>
            <LinearGradient colors={['#de6262', '#ffb88c']} style={styles.fullSectionButton}>
              <Text style={styles.fullSectionWord}>Community</Text>
            </LinearGradient>
          </TouchableOpacity> */}
          <TouchableOpacity  onPress={() => selectedView('Teachings')}>
              <LinearGradient colors={['#2C3E50', '#000000']}  style={styles.fullSectionButton}>
                <Text style={styles.fullSectionWord}>Teachings</Text>
              </LinearGradient>
          </TouchableOpacity>
          <TouchableOpacity  onPress={() => selectedView('Friends')}>
              <LinearGradient colors={['#2C3E50', '#000000']}  style={styles.fullSectionButton}>
                <Text style={styles.fullSectionWord}>Friends</Text>
              </LinearGradient>
          </TouchableOpacity>
          <TouchableOpacity  onPress={donationPage}>
            <LinearGradient colors={['#2C3E50', '#000000']} style={styles.fullSectionButton}>
              <Text style={styles.fullSectionWord}>Partner with us</Text>
            </LinearGradient>
          </TouchableOpacity>
      </LinearGradient>
    </SafeAreaView>
  )
}

export default Homepage

const styles = StyleSheet.create({
  center:{
    height: '100%',
    flex: 1, flex: 'row',
    justifyContent: 'space-around',
    alignItems:'center',
    backgroundColor: 'black',
  },
  fullSectionButton:{
    fontSize: '30%', fontWeight:'500',
    width: '100%',
    paddingLeft:'10%', paddingRight: '10%', paddingTop: '10%', paddingBottom: '10%',
    borderRadius: '20%'
  },
  fullSectionWord:{
    fontWeight:'900',
    color: 'white', 
    fontSize: '30%',
    borderRadius: '20',
  },
  loadingData:{
    alignContent: 'center',
    justifyContent: 'center',
    margin: '20%',
    fontWeight:'900',
    color: 'black', 
    fontSize: '30%',
    borderRadius: '20',
  }
})