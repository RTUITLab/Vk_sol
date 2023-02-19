import React from 'react'
import { CardGrid, Panel, PanelHeader, PanelHeaderButton, PanelHeaderContent, PanelProps, SimpleCell, Spacing, Spinner, View } from '@vkontakte/vkui'
import { Icon28AddSquareOutline, Icon28BillheadOutline } from '@vkontakte/icons'
import { push } from '@cteamdev/router'
import { useQuery } from '@tanstack/react-query'
import { api, APIEventType } from '../api'
import { useAtomValue } from '@mntm/precoil'
import { userAtom } from '../store'
import EventCard from '../components/eventCard/EventCard'


function Events({ nav }: PanelProps) {
  const user = useAtomValue(userAtom)
  const { data, isLoading } = useQuery<APIEventType[]>({ queryKey: ['events', { admin: user.walletAddress }], queryFn: () => api.getEventsById(user.walletAddress) })
  return (
    <Panel nav={nav}>
      <PanelHeader
        before={
          <PanelHeaderButton
            aria-label='Создать мероприятие'
            onClick={() => push('/events/?modal=modal')}
          >
            <Icon28AddSquareOutline />
          </PanelHeaderButton>
        }
      >
        <PanelHeaderContent>Мероприятия
        </PanelHeaderContent></PanelHeader>
      {!user.walletAddress ? <><div style={{ textAlign: 'center', margin: 20 }}>{'Подключите кошелек для создания мероприятий'}</div>
        <div style={{ textAlign: 'center', margin: 20 }}>{'Это можно сделать во вкладке "Профиль"'}</div></> : isLoading ? <Spinner size={'large'} style={{ margin: '20px 0' }} /> :
        <><Spacing />
          <CardGrid
            size='l'
          >
            {data ? data.map((item) => <EventCard
              id={item._id}
              key={item._id}
              eventName={item.name}
              description={item.description}
              image={item.cover}
              address={item.place}
              time={item.date.split('T')[1]}
              date={item.date.split('T')[0]}
              owner={true}
            />) : <div style={{ textAlign: 'center', margin: 20 }}>{'У вас пока нет созданных мероприятий'}</div>}
          </CardGrid></>}
    </Panel>
  )
}

export default Events