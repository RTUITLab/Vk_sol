import React, { useEffect, useState } from 'react'
import { Avatar, Button, CardGrid, Group, Panel, PanelHeader, PanelHeaderContent, PanelProps, Search, SimpleCell, Spacing, Spinner } from '@vkontakte/vkui'
import {
  Icon28BillheadOutline,
  Icon28ChevronRightOutline,
  Icon28CheckCircleOutline,
  Icon28CancelCircleOutline,
  Icon28PawOutline,
  Icon28WarningTriangleOutline,
  Icon28ArticleOutline,
  Icon20TicketOutline
} from '@vkontakte/icons'
import bridge, { UserInfo } from '@vkontakte/vk-bridge'
import { useAtomValue, useSetAtomState } from '@mntm/precoil'
import { userAtom, vkUserAtom } from '../store'
import { setDoneSnackbar, setErrorSnackbar } from '../hooks'
import { push, replace } from '@cteamdev/router'
import EventCard from '../components/eventCard/EventCard'
import Ticket from '../components/Ticket/Ticket'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { api, APIEventType } from '../api'


export const Home: React.FC<PanelProps> = ({ nav }: PanelProps) => {
  const { data, isLoading } = useQuery<APIEventType[]>({ queryKey: ['AllEvents'], queryFn: api.getAllEvents })

  const [searchInput, setSearchInput] = useState('')

  const handleSearch = (e) => {
    const search = e.target.value
    setSearchInput(search)
  }

  return (
    <Panel nav={nav}>
      <PanelHeader><PanelHeaderContent>Главная</PanelHeaderContent></PanelHeader>
      <Search
        onChange={handleSearch}
        value={searchInput}
      />
      <Spacing />
      <Group mode='plain'>
        <CardGrid size='l'>
          {isLoading ? <Spinner size={'large'} style={{ margin: '20px 0' }} /> :
            data?.filter(item => item.name.includes(searchInput) || item.description.includes(searchInput))
              .map((e) =>
                <EventCard
                  id={e._id}
                  time={e.date.split('T')[1]}
                  image={e.cover}
                  date={e.date.split('T')[0]}
                  description={e.description}
                  eventName={e.name} address={e.place}
                  key={e._id}
                />
              )}
        </CardGrid>
      </Group>
    </Panel>
  )
}
