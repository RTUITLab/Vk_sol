import { back, useParams } from "@cteamdev/router";
import { useAtomValue } from "@mntm/precoil";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Button, Cell, Div, Group, List, ModalPage, ModalPageHeader, ModalPageProps, Spacing, Spinner } from "@vkontakte/vkui";
import React, { useState } from "react";
import { api } from "../api";
import Ticket from "../components/Ticket/Ticket";
import { userAtom } from "../store";
import './exchange.css'

export const ExchangeModal: React.FC<ModalPageProps> = ({ nav }: ModalPageProps) => {
  const currentUser = useAtomValue(userAtom)
  const { ticket, user } = useParams<{ ticket: string, user: string }>()
  const tickets = useQuery({ queryKey: ['AllTickets'], queryFn: api.getAllTickets })
  const events = useQuery({ queryKey: ['AllEvents'], queryFn: api.getAllEvents })
  const [selectedTickets, setTickets] = useState([] as string[])
  const { mutate, isLoading } = useMutation({ mutationFn: api.createExchange, mutationKey: ['AddExchange'], onSuccess: handleSuccess, onError: handleError })

  function handleSuccess() {
    back()
  }

  function handleError() { }

  function handleCreate() {
    if (selectedTickets.length !== 0) {
      mutate({
        user_id: currentUser.walletAddress,
        users: [
          { id: user, tickets: [ticket] },
          { id: currentUser.walletAddress, tickets: selectedTickets }
        ]
      })
    }
  }

  return (
    <ModalPage nav={nav} onClose={back} header={<ModalPageHeader>Выбор билетов для обмена</ModalPageHeader>}>
      {tickets.isLoading || events.isLoading
        ? <Spinner size={'large'} style={{ margin: '20px 0' }} />
        : <Group>
          <List>
            {tickets.data.filter((item: any) => item.user_id === currentUser.walletAddress).map((e: any) => {
              const t_event = events.data.find((i: any) => i._id === e.event_id)
              return (
                <>
                  <Cell key={e._id} mode='selectable' onClick={(event: any) => {
                    console.log(selectedTickets, event.target.checked, e._id)
                    if (event.target.checked) {
                      setTickets([...selectedTickets, e._id])
                    } else {
                      setTickets(selectedTickets.filter((item) => item !== e._id))
                    }
                  }}>
                    <Ticket
                      with_qr={false}
                      image={e.url}
                      eventName={t_event.name}
                      date={t_event.date.split('T')[0]}
                      time={t_event.date.split('T')[1]}
                      address={t_event.place}
                    />
                  </Cell>
                  <Spacing size={16} />
                </>
              )
            })}
          </List>
        </Group>}

      <Div style={{ textAlign: 'end' }}>
        <Button style={{ marginLeft: 'auto' }} size='l' mode='primary' onClick={() => handleCreate()}>
          Предложить обмен
        </Button>
      </Div>
    </ModalPage>
  )
}
