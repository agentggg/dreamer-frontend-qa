import {useState, createContext } from 'react'
//importing the required modules
export const CommentStatus = createContext()
// creates the context that will be used in the component file
export const CommentStatusProvider = (props) => {
    const [communityComment, setCommunityComment] = useState(0)
//state value that will be called in the components
    return <CommentStatusProvider.Provider value={[onlineComment, setOnlineComment]}><>{props.children}</>
</CommentStatusProvider.Provider>
}

