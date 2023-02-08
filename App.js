import { NavigationContainer } from "@react-navigation/native";
import MainTabNavigation from "./src/navigations/MainTabNavigation"
import {QueryClient, QueryClientProvider} from 'react-query'
import { LoginStatusProvider } from "./src/context/LoginStatus";
import { PremiumUsersProvider } from "./src/context/Premium";
import { DreamIdStatusProvider } from "./src/context/DreamId";
import { ScrollLocationProvider } from "./src/context/ScrollLocation";
import { SelectVaultTypeProvider } from "./src/context/SelectVaultType";
// import { CommentStatusProvider } from "./src/context/Comment";
const App = () => {
  const queryClient = new QueryClient()
  return (
      <SelectVaultTypeProvider>
      <ScrollLocationProvider>
      <DreamIdStatusProvider>
      <LoginStatusProvider>
      <PremiumUsersProvider>
        <QueryClientProvider client={queryClient}>
          <NavigationContainer>
            <MainTabNavigation/>
          </NavigationContainer>
        </QueryClientProvider>
      </PremiumUsersProvider>
      </LoginStatusProvider>
      </DreamIdStatusProvider>
      </ScrollLocationProvider>
      </SelectVaultTypeProvider>
  )
}

export default App;


