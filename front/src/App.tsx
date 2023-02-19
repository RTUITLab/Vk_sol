import React, { useEffect } from 'react'
import {
  AdaptivityProvider,
  AppRoot,
  ConfigProvider,
  PlatformType,
  SplitCol,
  SplitLayout
} from '@vkontakte/vkui'
import '@vkontakte/vkui/dist/vkui.css'
import { useCurrentState, View } from '@cteamdev/router'
import { Home } from './pages'
import { Navigation } from './components/navigation'
import { getPlatform } from './utils'
import { useAtomValue, useSetAtomState } from '@mntm/precoil'
import { userAtom, vkUserAtom } from './store'
import bridge, { UserInfo } from '@vkontakte/vk-bridge'
import Events from './pages/Events'
import Favorites from './pages/Favorites'
import Profile from './pages/Profile'
import Tickets from './pages/Tickets'
import Collections from './pages/Collections'
import Requests from './pages/Requests'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import EventPage from './pages/EventPage/EventPage'
import { WalletConnect } from './pages/WalletConnect'

const queryClient = new QueryClient()

export const App: React.FC = () => {
  const platform: PlatformType = getPlatform()
  const setVkUser = useSetAtomState(vkUserAtom)
  const user = useAtomValue(userAtom)
  const setUser = useSetAtomState(userAtom)

  useEffect(() => {
    const load = async () => {
      const vkUser: UserInfo = await bridge.send('VKWebAppGetUserInfo')
      setVkUser(vkUser)
      bridge.send('VKWebAppStorageGet', {
        keys: [
          'address'
        ] })
        .then((data) => { 
          if (data.keys) {
            console.log('walletAddress successfully restored')
            setUser({ ...user, walletAddress: data.keys[0].value.toString() })
          }
        })
        .catch((error) => {
          // Ошибка
          console.log(error)
        })
    }
    load()
  }, [])

  return (
    <QueryClientProvider client={queryClient}>
      <ConfigProvider platform={platform}>
        <AdaptivityProvider>
          <AppRoot>
            <Navigation >
              <View nav='/'>
                <Home nav='/' />
              </View>
              <View nav={'/current_event'}>
                <EventPage
                  nav='/'
                />
              </View>
              <View nav='/events'>
                <Events nav='/' />
              </View>
              <View nav='/favorite'>
                <Favorites nav='/' />
              </View>
              <View nav='/tickets'>
                <Tickets nav='/' />
              </View>
              <View nav='/profile'>
                <Profile nav='/' />
              </View>
              <View nav='/collections'>
                <Collections nav='/' />
              </View>
              <View nav='/requests'>
                <Requests nav='/' />
              </View>
              <View nav='/walletconnect'>
                <WalletConnect nav='/' />
              </View>
            </Navigation>
          </AppRoot>
        </AdaptivityProvider>
      </ConfigProvider>
    </QueryClientProvider>
  )
}
