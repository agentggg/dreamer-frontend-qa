import {useState, createContext } from 'react'
//importing the required modules
export const ScrollLocationStatus = createContext()
// creates the context that will be used in the component file
export const ScrollLocationProvider = (props) => {
    const [currentScroll, setCurrentScroll] = useState(0)
//state value that will be called in the components
    return <ScrollLocationStatus.Provider value={[currentScroll, setCurrentScroll]}><>{props.children}</>
</ScrollLocationStatus.Provider>
}

