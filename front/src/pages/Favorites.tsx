import { useQuery } from '@tanstack/react-query'
import bridge from '@vkontakte/vk-bridge'
import { Group, Panel, PanelHeader, PanelHeaderContent, PanelProps, Spacing } from '@vkontakte/vkui'
import React from 'react'
import EventCard from '../components/eventCard/EventCard'

function Favorites({ nav }: PanelProps) {
  const { data } = useQuery({
    queryKey: ['allLikes'], queryFn: async () => {
      const likesKeys = await bridge.send('VKWebAppStorageGetKeys', {
        count: 30, offset: 0
      })
        .then((data) => {
          if (data.keys) {
            return data.keys.filter((e) => e.startsWith('liked')) || ['']
          }
        })
        .catch() || ['']

      const ids = await bridge.send('VKWebAppStorageGet', {
        keys: likesKeys
      })
        .then((data) => {
          if (data.keys) {
            return data.keys.filter(e => e.value === 'true').map(e => e.key).map(e => e.slice(5))
          }
        })
        .catch()

      const cards = ids?.map((id) => fetch(`https://levandrovskiy.ru/api/event/${id}`).then(data => data.json())) || []

      return await Promise.all(cards)
    }
  })

  return (
    <Panel nav={nav}>
      <PanelHeader><PanelHeaderContent>Избранное</PanelHeaderContent></PanelHeader>
      <Spacing />

      {data?.map(card => (
        <>
          <EventCard image={card.cover} eventName={card.name} description={card.description} date={card.date.split('T')[0]} time={card.date.split('T')[1]} address={card.place} id={card._id} key={card._id}></EventCard>
          <Spacing></Spacing>
        </>
      ))}

    </Panel>
  )
}

export default Favorites