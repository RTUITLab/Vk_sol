import {
  Avatar,
  Banner,
  Card,
  Div,
  Group,
  Header,
  Headline,
  InfoRow,
  Panel,
  PanelHeader,
  PanelHeaderContent,
  SimpleCell,
  Spacing,
  Subhead,
  Switch,
  Text,
  Title
} from '@vkontakte/vkui'
import React from 'react'
import { useAtomValue, useSetAtomState } from '@mntm/precoil'
import { userAtom, vkUserAtom } from '../store'
import { Icon28AddOutline, Icon28AddSquareOutline, Icon28RemoveCircleOutline } from '@vkontakte/icons'
import bridge, { UserInfo } from '@vkontakte/vk-bridge'
import { v4 as uuidv4 } from 'uuid'
import { api } from '../api'

type ProfileProps = {
  nav: string | undefined
}

function Profile({ nav }: ProfileProps) {
  const vkUser: UserInfo = useAtomValue(vkUserAtom)
  const user = useAtomValue(userAtom)
  const setUser = useSetAtomState(userAtom)

  function handleChange() {
    setUser({
      ...user,
      isAdmin: !user.isAdmin
    })
  }

  function handleAddWallet() {

    const uuid = uuidv4()

    //console.log(window.location)
    const newWindow = window.open(window.location.href, 'NFT', 'left=10000,top=100,width=300,height=500,popup')
    newWindow?.addEventListener('load', async () => {
      try {
        const provider = await newWindow?.phantom?.solana.connect()
        const address = await provider.publicKey.toString()
        await api.authorize(uuid, address)
          .then(() => {
            api.getAddress(uuid)
              .then(data => {
                setUser({ ...user, walletAddress: data.address })
                bridge.send('VKWebAppStorageSet', {
                  key: 'address',
                  value: data.address
                })
                  .catch(() => console.log('err saving address in storage'))
              })
          })
          .then(() => newWindow?.close())
      }  catch {
        newWindow.document.body.innerHTML=('Ошибка. Установите кошелек Phantom, войдите в devnet блокчейн или обновите страницу. Это окно закроется через 5 секунд')
        setTimeout(()=>{newWindow?.close();window.open('https://phantom.app/', '_blank')},5000)
      }})
  
  }
  
  function handleRemoveWallet() {
    setUser({ ...user, walletAddress: '' })
    bridge.send('VKWebAppStorageSet', {
      key: 'address',
      value: ''
    })
  }

  return (
    <Panel nav={nav}>
      <PanelHeader><PanelHeaderContent>Профиль</PanelHeaderContent></PanelHeader>
      <Group>
        <SimpleCell before={<Avatar size={72} src={vkUser.photo_200} />}>
          {vkUser.first_name} {vkUser.last_name}
        </SimpleCell>

        <SimpleCell onClick={handleChange} before={<Switch checked={user.isAdmin} onClick={(e)=>{e.stopPropagation();handleChange}} />}>
          Я администратор
        </SimpleCell>
      </Group>

      <Group>
        <Header>Криптокошелёк</Header>
        {user.walletAddress !== '' &&
          <Group>
            <SimpleCell style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-around', flexWrap: 'nowrap' }}>
              <Div>
                <div>Кошелёк подключен</div>
                <Spacing size={16} />
                <InfoRow header={'Phantom'}><img width={50} src='https://upload.wikimedia.org/wikipedia/en/b/b9/Solana_logo.png' />
                </InfoRow>
              </Div>
              <Div><Headline level='1'>{user.walletAddress}</Headline></Div>
            </SimpleCell>
          </Group>}

        {user.walletAddress === '' ? <SimpleCell onClick={handleAddWallet} before={<Icon28AddSquareOutline />}>
          Подключить кошелёк
        </SimpleCell> : <SimpleCell onClick={handleRemoveWallet} before={<Icon28RemoveCircleOutline />}>
          Отключить кошелёк
        </SimpleCell>}
        <Banner
          header='Поддерживаемые кошельки:'
          asideMode='expand'
          onClick={()=>window.open('https://phantom.app/','Phantom')}
          actions={<Text>Phantom (devnet)</Text>}
        />
      </Group>
    </Panel>
  )
}

export default Profile
