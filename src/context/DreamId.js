import {useState, createContext } from 'react'
//importing the required modules
export const DreamIdStatus = createContext()
// creates the context that will be used in the component file
export const DreamIdStatusProvider = (props) => {
    const [dreamId, setDreamId] = useState(false)
//state value that will be called in the components
    return <DreamIdStatus.Provider value={[dreamId, setDreamId]}><>{props.children}</>
</DreamIdStatus.Provider>
}

