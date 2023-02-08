import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useContext } from 'react';
import Homepage from '../components/Homepage';
import LoginView from '../components/Authenticate/LoginView';
import CreateAccount from '../components/Authenticate/CreateAccount';
import { LoginStatus } from '../context/LoginStatus';
import { PremiumUsers } from '../context/Premium';
import {DictionaryMainStackNavigation, CommunityMainStackNavigation, DreamsMainStackNavigation,  FriendsMainStackNavigation} from './MainStackNavigation';
import Icon from 'react-native-vector-icons/Ionicons';  


const Tab = createBottomTabNavigator();

const MainTabNavigation = () => {

    const [isSignedIn, setIsSignedIn] = useContext(LoginStatus)
    // used to control isSignedIn state for variables
    const [isPremiumUser, setPremiumUser] = useContext(PremiumUsers)
    // used to confirm if user is premium or not
    return (
        <Tab.Navigator screenOptions={{headerShown: false}}>
            {/* used to wrap the tab navigators screens */}
    {isSignedIn ?
    // if signed in is true the following will be returned
         (
            isPremiumUser ? (
                <>
                    <Tab.Screen name="Homepage" component={Homepage} options={{ tabBarStyle: { display: 'none' }, tabBarIcon: ({ color, size }) => (
                        <Icon name="ios-home" color={'black'} size={25}/>)}}/>
                    <Tab.Screen name="Dictionary" component={DictionaryMainStackNavigation}options={{tabBarIcon: ({ color, size }) => (
                        <Icon name="book-outline" color={'black'} size={25}/>)}}/>
                    {/* <Tab.Screen name="Community" component={CommunityMainStackNavigation}options={{tabBarIcon: ({ color, size }) => (
                        <Icon name="people-sharp" color={'black'} size={25}/>)}}/> */}
                    <Tab.Screen name="Dreams" component={DreamsMainStackNavigation}options={{tabBarIcon: ({ color, size }) => (
                        <Icon name="pencil-outline" color={'black'} size={25}/>)}}/>
                    <Tab.Screen name="Friends" component={FriendsMainStackNavigation}options={{tabBarIcon: ({ color, size }) => (
                        <Icon name="people" color={'black'} size={25}/>)}}/>
                </>
                
         ) : (
            <>
                    <Tab.Screen name="Homepage" component={Homepage} options={{ tabBarStyle: { display: 'none' }, tabBarIcon: ({ color, size }) => (
                        <Icon name="ios-home" color={'black'} size={25}/>)}}/>
                    <Tab.Screen name="Dictionary" component={DictionaryMainStackNavigation}options={{tabBarIcon: ({ color, size }) => (
                        <Icon name="book-outline" color={'black'} size={25}/>)}}/>
                    <Tab.Screen name="Dreams" component={DreamsMainStackNavigation}options={{tabBarIcon: ({ color, size }) => (
                        <Icon name="pencil-outline" color={'black'} size={25}/>)}}/>
            </>
         )
        ) : (
            // if signed in is false
            <>
                <Tab.Screen name="Login" component={LoginView} options={{title:"Login", tabBarStyle: { display: 'none' }, headerStyle: {backgroundColor: 'black'}}}/>
                <Tab.Screen name="CreateAccount" component={CreateAccount} options={{title:"CreateAccount", tabBarStyle: { display: 'none' }, headerStyle: {backgroundColor: 'black'}}}/>
            </>
            )
    }
        </Tab.Navigator>
        )}

export default MainTabNavigation