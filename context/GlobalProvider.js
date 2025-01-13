import {createContext} from "react"

const GlobalContext = createContext()

export const useGlobalContext = () => useContext(GlobalContext)

const GlobalProvider = ({children}) => {
    return (
        <GlobalContext.Provider
            value = {{
            }}
        >
            {children}
        </GlobalContext.Provider>
    )
}
export default GlobalProvider