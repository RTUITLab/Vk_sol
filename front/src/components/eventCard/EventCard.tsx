import { push, replace, useCurrentState } from '@cteamdev/router'
import { useAtomState, useAtomValue, useSetAtomState } from '@mntm/precoil'
import { eventIdAtom } from '../../store'
import { Icon16Add, Icon16ClockCircleFill, Icon16ClockOutline, Icon16DonateOultine, Icon16Location, Icon20CalendarCircleFillRed, Icon28CalendarOutline, Icon28Delete, Icon28DeleteOutline, Icon28EditOutline, Icon28HeartCircleOutline, Icon28Like, Icon28LikeCircleFillRed, Icon28LikeFillRed, Icon28LikeOutline, Icon28ShareOutline } from '@vkontakte/icons'
import bridge from '@vkontakte/vk-bridge'
import { Button, Caption, Card, Cell, Group, IconButton, MiniInfoCell, SimpleCell, SplitCol, Text, Title } from '@vkontakte/vkui'
import React, { useEffect, useState } from 'react'
import './eventcard.css'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { api } from '../../api'
type EventCardprops = {
  image?: string,
  eventName: string,
  description: string,
  date: string,
  time: string,
  address: string,
  owner?: boolean
  id: string
}

function EventCard(props: EventCardprops) {

  const queryClient = useQueryClient()
  const viewedMutations = useMutation({ mutationFn: api.addView, mutationKey: ['AddExchange'], onSuccess: () => { }, onError: () => { } })


  const { data } = useQuery({
    queryKey: ['like', { id: props.id }], queryFn:
      () => bridge.send('VKWebAppStorageGet', {
        keys: ['liked' + props.id.toString()]
      })
        .then((data) =>
          (data.keys[0].value.toString() === 'true')
        )
  })

  const { mutate } = useMutation({
    mutationFn: () => bridge.send('VKWebAppStorageSet', {
      key: 'liked' + props.id,
      value: (!data).toString()
    }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['allLikes'] })
      queryClient.invalidateQueries({ queryKey: ['like', { id: props.id }] })
    }
  })

  function handleEdit() {
    return undefined
  }

  function handleDelete() {
    return undefined
  }

  function handleMore() {
    viewedMutations.mutate(props.id)
    push(`/current_event?id=${props.id}`)
  }
  function handleShare() {
    bridge.send('VKWebAppShare', {
      link: 'https://vk.com/app6909581'
    })
  }
  console.log(props.image, props.eventName);
  return (
    <Card mode='shadow'>
      <div className='event-card'>
        <img className='event-card__image' src={props.image ? 'https://levandrovskiy.ru' + props.image : 'http://levandrovskiy.ru/img/MJGSJ7cysAs.jpg'} />
        <div className='event-card__info'>
          <Title level={'2'} weight='medium'>
            {props.eventName}
          </Title>
          <Caption
            level='1' weight='regular'
            style={{ color: '#818C99' }}
          >
            {props.description}
          </Caption>
          <div className='event-card__date'>
            <MiniInfoCell
              before={<Icon16DonateOultine />}
              style={{ display: 'flex', alignItems: 'center', padding: '0' }}
            >
              {props.date}
            </MiniInfoCell>
            <MiniInfoCell
              before={<Icon16ClockOutline />}
              style={{ display: 'flex', alignItems: 'center', padding: '0' }}
            >
              {props.time}
            </MiniInfoCell>
          </div>
          <MiniInfoCell
            before={<Icon16Location />}
            style={{ display: 'flex', alignItems: 'center', padding: '0' }}
          >
            <a
              className='event-card__location'
              target={'_blank'}
              href={`https://yandex.ru/maps/213/moscow/search/${props.address}`} rel='noreferrer'
            >
              <Text weight='semibold'>
                {props.address}
              </Text>

            </a>

          </MiniInfoCell>
        </div>

        <div className='event-card__buttons'>
          <div className='owner__buttons'>
            {props.owner && <IconButton onClick={handleDelete}>
              <Icon28DeleteOutline />
            </IconButton>}
            {props.owner && <IconButton onClick={handleEdit}>
              <Icon28EditOutline />
            </IconButton>}
            <IconButton onClick={() => { mutate() }}>
              {data ? <Icon28LikeFillRed /> : <Icon28LikeOutline />}
            </IconButton>
            {!props.owner && <IconButton onClick={handleShare}>
              <Icon28ShareOutline />
            </IconButton>}
          </div>
          {props.image ? <Button size='l' mode='outline' onClick={handleMore}>
            Подробнее
            </Button> : null}

        </div>
      </div>


    </Card>
  )
}

export default EventCard