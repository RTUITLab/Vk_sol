import { back, push, replace, useCurrentState, useParams } from '@cteamdev/router'
import { useAtomValue } from '@mntm/precoil'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { Icon16ClockOutline, Icon16DonateOultine, Icon16Location, Icon24Done, Icon24Error, Icon28AddOutline, Icon28CopyOutline, Icon28LikeFillRed, Icon28LikeOutline, Icon28UserOutline } from '@vkontakte/icons'
import bridge from '@vkontakte/vk-bridge'
import { Banner, Button, Cell, CellButton, Counter, Div, Group, Header, Headline, IconButton, MiniInfoCell, Panel, PanelHeader, PanelHeaderBack, SimpleCell, Snackbar, Spinner, SplitCol, SplitLayout, TabsItem, Title } from '@vkontakte/vkui'
import { func } from 'prop-types'
import React, { useEffect, useRef, useState } from 'react'
import { api, APIEventType } from '../../api'
import { eventIdAtom, userAtom } from '../../store'
import './eventpage.css'

type EventPagetypes = {
  nav: string
}

function EventPage(props: EventPagetypes) {
  const eventId = useParams().id
  const user = useAtomValue(userAtom)
  const queryClient = useQueryClient()
  const [buy, setBuy] = useState(false)

  const { data, isLoading } = useQuery<APIEventType>({ queryKey: ['current_event', eventId], queryFn: () => api.getEventById(eventId) })
  const { mutate, error } = useMutation({ mutationKey: ['create_ticket'], mutationFn: () => api.createTicket(eventId, user.walletAddress), onSuccess: handleSuccess, onError: handleError })
  const { data: isLiked, isLoading: loadLike } = useQuery({
    queryKey: ['like', { id: data?._id }], queryFn: () => bridge.send('VKWebAppStorageGet', {
      keys: ['liked' + data?._id.toString()]
    })
      .then((data) =>
        (data.keys[0].value.toString() === 'true')
      ), enabled: !!data
  })

  const [snackbar, setSnackbar] = useState<JSX.Element | null>(null)
  const successSnackbar = <Snackbar
    onClose={() => setSnackbar(null)}
    before={<Icon24Done />}
  >
    Билет успешно приобретён
  </Snackbar>
  const errorSnackbar = <Snackbar
    onClose={() => setSnackbar(null)}
    before={<Icon24Error />}
  >
    Ошибка при приобретении билета
  </Snackbar>


  const { mutate: changeFav } = useMutation({
    mutationFn: () => bridge.send('VKWebAppStorageSet', {
      key: 'liked' + data?._id,
      value: (!isLiked).toString()
    }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['allLikes'] })
      queryClient.invalidateQueries({ queryKey: ['like', { id: data?._id }] })
    }
  })

  function handleError() {
    setSnackbar(errorSnackbar)
    console.log('error', error)
  }
  function handleSuccess() {
    queryClient.invalidateQueries(['current_event'])
    setSnackbar(successSnackbar)
    console.log('success')
  }

  function handleCreateTicket() {
    mutate()
  }

  function copy(e) {
    navigator.clipboard.writeText(e.target.value).then(() =>
      setSnackbar(<Snackbar
        onClose={() => setSnackbar(null)}
        before={<Icon24Done />}
      >
        Адрес успешно скопирован
      </Snackbar>)
    )
  }

  return (
    <Panel nav={props.nav}>
      <PanelHeader
        before={<PanelHeaderBack onClick={() => replace('/')} />}
      >
        {data && data.name}
      </PanelHeader>
      {isLoading || loadLike ? <Spinner size='large' /> : data &&
        <Group>
          <div className='event-page'>
            <img className='event-page__image' src={data.cover ? `https://levandrovskiy.ru${data.cover}` : 'http://levandrovskiy.ru/img/MJGSJ7cysAs.jpg'} />
            <div className='event-page__info'>
              <Headline size={3} >
                {data.description}
              </Headline>
              <div className='event-card__date'>
                <MiniInfoCell
                  before={<Icon16DonateOultine />}
                  style={{ display: 'flex', alignItems: 'center', padding: '0' }}
                >
                  {data.date.split('T')[0]}
                </MiniInfoCell>
                <MiniInfoCell
                  before={<Icon16ClockOutline />}
                  style={{ display: 'flex', alignItems: 'center', padding: '0' }}
                >
                  {data.date.split('T')[1]}
                </MiniInfoCell>


              </div>
              <MiniInfoCell
                before={<Icon16Location fill='#2688EB' />}
                style={{ display: 'flex', alignItems: 'center', padding: '0' }}
              >
                <a
                  className='event-card__location'
                  target={'_blank'}
                  href={`https://yandex.ru/maps/213/moscow/search/${data.place}`} rel='noreferrer'
                >
                  <Headline style={{ color: '#2688EB', maxWidth: '100px' }} weight='semibold'>
                    {data.place}
                  </Headline>

                </a>

              </MiniInfoCell>
              {
                (data.white_list.includes(user.walletAddress) && !user.isAdmin) ?
                  <Button
                    size='l'
                    appearance='accent'
                    mode='secondary'
                    onClick={handleCreateTicket}
                  >
                    Получить билет
                  </Button>
                  : buy ? <>Подождите, пока обработается платёж</> :
                    ((user.walletAddress) ? user.isAdmin ? null : <Button
                      size='l'
                      appearance='positive'
                      mode='outline'
                      onClick={() => { setBuy(!buy) }}
                    >
                      Купить билет
                    </Button> : <Banner size='s' header='Для покупки необходимо подключить кошелёк'></Banner>)
              }


            </div>
            <div className='event-card__secondary'>
              <IconButton onClick={() => { changeFav() }}>
                {isLiked ? <Icon28LikeFillRed /> : <Icon28LikeOutline />}
              </IconButton>
              <Cell indicator={<Counter>{`${'0' || data.minted}/${data.amount}`}</Counter>}>
                Билетов
              </Cell>
            </div>
          </div>
        </Group>
      }{console.log(data)}

      {
        user.isAdmin && <Group>
          <Div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
            <Title>Вайтлист</Title>
            {data && (data.user_id === user.walletAddress && user.isAdmin === true) ? <CellButton
              onClick={() => push(`/events/?modal=wallet&id=${eventId}`)}
              before={<Icon28AddOutline />}
            >Добавить</CellButton> : null}
          </Div>
          {
            data && data.white_list.map((item, index) => <SimpleCell key={index} onClick={copy} after={<Icon28CopyOutline />}>
              {item}
            </SimpleCell>)
          }
          {
            data && data.white_list.length === 0 && <SimpleCell>Вайтлист пока пуст</SimpleCell>
          }
        </Group>}
      {
        snackbar
      }
    </Panel >
  )
}

export default EventPage