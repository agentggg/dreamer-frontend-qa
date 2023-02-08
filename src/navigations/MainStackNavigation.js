import React from 'react'
import { createStackNavigator } from '@react-navigation/stack';
import Dictionary from '../components/Dictionary/Dictionary';
import SelectedWord from '../components/Dictionary/DictionarySelectedWord';
import PostReaction from '../components/Community/CommunityPostReaction';
import Community from '../components/Community/Community';
import DreamVault from '../components/PersonalDream/DreamVault';
import DreamView from '../components/PersonalDream/DreamView';
import DreamVaultEdit from '../components/PersonalDream/DreamVaultEdit';
import DreamFavorites from '../components/Favorites/DreamFavorites';
import SharedVault from '../components/Dream/SharedVault';
import Feedback from '../components/Dictionary/DictionaryFeedback';
import ManageFriends from '../components/Friends/ManangeFriends';
import DreamEntry from '../components/PersonalDream/DreamEntry';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/Ionicons';  


const Stack = createStackNavigator()
const Tab = createBottomTabNavigator();


function DictionaryMainStackNavigation() {
    return (
            <Stack.Navigator screenOptions={{headerShown: false}}>
                <Stack.Screen name="Search" component={Dictionary} options={{title:"Search", headerStyle: {backgroundColor: 'black'}}}/>
                <Stack.Screen name="Word" component={SelectedWord} options={{title:"Word", headerStyle: {backgroundColor: 'black'}}}/>
                <Stack.Screen name="Feedback" component={Feedback} options={{title:"Feedback", headerStyle: {backgroundColor: 'black'}}}/>
            </Stack.Navigator>        
    )
}

function FriendsMainStackNavigation() {
    return (
            <Stack.Navigator screenOptions={{headerShown: false}}>
                <Stack.Screen name="ManageFriends" component={ManageFriends} options={{title:"Manange Friends", headerStyle: {backgroundColor: 'black'}}}/>
            </Stack.Navigator>        
    )
}
// function CommunityMainStackNavigation() {
//     return (
//             <Stack.Navigator>
//                 <Stack.Screen name="Engage" component={Community} options={{title:"Community", headerStyle: {backgroundColor: 'white'}}}/>
//                 <Stack.Screen name="PostReaction" component={PostReaction} options={{title:"Engage", headerStyle: {backgroundColor: 'white'}}}/>
//                 <Stack.Screen name="CommunityDreamView" component={DreamView} options={{title:"Community Dream View",}}/>
//             </Stack.Navigator> 
//     )
// }

function DreamsMainStackNavigation() {
    return (
        <Tab.Navigator>
            <Tab.Screen name="DreamEdit" component={DreamEntry}  options={{title:"Jot the Dream", tabBarIcon: ({ color, size }) => (
                <Icon name="pencil-outline" color={'black'} size={25}/>)}}/>
            <Tab.Screen name="DreamVault" component={DreamVault} options={{title:"Vault", unmountOnBlur: true, tabBarIcon: ({ color, size }) => (
                <Icon name="lock-closed-outline" color={'black'} size={25}/>)}}/>
            <Tab.Screen name="DreamFavorites" component={DreamFavorites} options={{title:"Favorites", tabBarIcon: ({ color, size }) => (
                <Icon name="bookmark" color={'black'} size={25}/>)}}/>
            <Tab.Screen name="DreamView" component={DreamView} options={{title:"Dream View",unmountOnBlur: true, tabBarVisible: false, tabBarButton: () => null,}}/>
            {/* <Tab.Screen name="PostReaction" component={PostReaction} options={{title:"Engage", headerStyle: {backgroundColor: 'white'}, tabBarVisible: false, tabBarButton: () => null,}}/> */}
            {/* <Tab.Screen name="SharedVault" component={SharedVault} options={{title:"Shared Vault", headerStyle: {backgroundColor: 'white'},tabBarVisible: false, tabBarButton: () => null,}}/> */}
            <Tab.Screen name="DreamVaultEdit" component={DreamVaultEdit} options={{title:"Edit Dream", headerStyle: {backgroundColor: 'white'},tabBarVisible: false, tabBarButton: () => null,}}/>
        </Tab.Navigator> 
    )
}

// DreamEdit



export  {DictionaryMainStackNavigation, DreamsMainStackNavigation, FriendsMainStackNavigation} 