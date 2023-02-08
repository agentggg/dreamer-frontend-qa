import {useState, createContext } from 'react'
import {View, Text} from 'react-native'
//importing the required modules
export const GetDreamInfoContext = createContext()
// creates the context that will be used in the component file
export const GetDreamInfoProvider = (props) => {
    const [apiDataCallData, setApiDataCallData] = useState()
//state value that will be called in the components
    return <GetDreamInfoContext.Provider value={[apiDataCallData, setApiDataCallData]}><>{props.children}</>
</GetDreamInfoContext.Provider>
}

