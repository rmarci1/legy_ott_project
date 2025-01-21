import {createContext, useContext, useState} from "react"

const GlobalContext = createContext()

export const useGlobalContext = () => useContext(GlobalContext)

const GlobalProvider = ({children}) => {
    const [formPart,setFormPart] = useState(null);
    return (
        <GlobalContext.Provider
            value = {{
                formPart,
                setFormPart
            }}
        >
            {children}
        </GlobalContext.Provider>
    )
}
export default GlobalProvider