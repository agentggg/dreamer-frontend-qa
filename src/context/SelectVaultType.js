import {useState, createContext } from 'react'
//importing the required modules
export const SelectVaultType = createContext()
// creates the context that will be used in the component file
export const SelectVaultTypeProvider = (props) => {
    const [selectVault, setSelectVault] = useState('')
//state value that will be called in the components
    return <SelectVaultType.Provider value={[selectVault, setSelectVault]}><>{props.children}</>
</SelectVaultType.Provider>
}

