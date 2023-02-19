import { push } from '@cteamdev/router'
import { useAtomValue } from '@mntm/precoil'
import { useMutation, useQueries, useQuery, useQueryClient } from '@tanstack/react-query'
import { Icon16ClockOutline, Icon16DonateOultine, Icon16Location, Icon24Done, Icon24Error, Icon28QrCodeOutline } from '@vkontakte/icons'
import { Button, Caption, IconButton, MiniInfoCell, Snackbar, Text, Title } from '@vkontakte/vkui'
import React, { useEffect, useState } from 'react'
import { api } from '../../api'
import { userAtom } from '../../store'
import './ticket.css'

type TicketProps = {
  image: string,
  eventName: string,
  date: string,
  time: string,
  address: string,
  with_qr: boolean,
  ticket: string,
  id: string,
  forSell: boolean
}

function Ticket(props: TicketProps) {
  const queryClient = useQueryClient()

  const { error, mutate } = useMutation({ mutationKey: ['ticket_trade'], mutationFn: (status: boolean) => api.createTicketTrade(props.id, status), onError: handleError, onSuccess: handleSuccess })

  const [snackbar, setSnackbar] = useState<JSX.Element | null>(null)
  const successSnackbar = <Snackbar
    onClose={() => setSnackbar(null)}
    before={<Icon24Done />}
  >

    Билет успешно выставлен на обмен
  </Snackbar>
  const errorSnackbar = <Snackbar
    onClose={() => setSnackbar(null)}
    before={<Icon24Error />}
  >
    Ошибка при выставении на обмен
  </Snackbar>

  function handleError() {
    console.log(error);
    setSnackbar(errorSnackbar)
  }

  function handleSuccess() {
    queryClient.invalidateQueries(['AllTickets'])
    console.log('success');
    setSnackbar(successSnackbar)
  }

  function handleTrade() {
    mutate(true)
  }
  function handleClearTrade() {
    mutate(false)
  }

  return (
    <article className='ticket'>
      <div className='ticket__info'>
        <Title level={'2'} weight='medium'>
          {props.eventName}
        </Title>
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
        {props.with_qr ?
          (props.forSell ? <Button
            size='m'
            style={{ width: '150px' }}
            appearance='negative'
            mode='secondary'
            onClick={handleClearTrade}
          >
            Убрать с обмена
          </Button> :
            <Button
              size='m'
              style={{ width: '150px' }}
              appearance='accent'
              mode='secondary'
              onClick={handleTrade}
            >
              Обменять
            </Button>) : null}
      </div>
      <img className='ticket__image' src={props.image} />
      {props.with_qr &&
        <IconButton className='ticket__qr' onClick={() => push(`/tickets?modal=qr&ticket=${props.ticket}`)}>
          <Icon28QrCodeOutline fill='fff' />
        </IconButton>
      }
      {
        snackbar
      }
    </article>
  )
}

export default Ticket