import {useState, createContext } from 'react'
//importing the required modules
export const PremiumUsers = createContext()
// creates the context that will be used in the component file
export const PremiumUsersProvider = (props) => {
    const [isPremiumUser, setPremiumUser] = useState(true)
//state value that will be called in the components
    return <PremiumUsers.Provider value={[isPremiumUser, setPremiumUser]}><>{props.children}</>
</PremiumUsers.Provider>
}

