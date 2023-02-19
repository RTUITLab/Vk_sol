import { useAtomValue } from "@mntm/precoil"
import { Button, Cell, Div, Group, Header, Panel, PanelHeader, PanelHeaderContent, PanelProps, Separator, Spacing, Spinner } from "@vkontakte/vkui"
import { userAtom } from "../store"
import React from "react"
import { useMutation, useQuery } from "@tanstack/react-query"
import { api, ExchangeRequest } from "../api"
import Ticket from "../components/Ticket/Ticket"

function Requests({ nav }: PanelProps) {
  const user = useAtomValue(userAtom)
  const exchanges = useQuery({ queryKey: ['UserExchanges'], queryFn: () => api.getUserExchanges(user.walletAddress) })
  const events = useQuery({ queryKey: ['AllEvents'], queryFn: api.getAllEvents })
  const tickets = useQuery({ queryKey: ['AllTickets'], queryFn: api.getAllTickets })

  const discardMutation = useMutation({ mutationFn: api.discardExchange, mutationKey: ['AddExchange'], onSuccess: refetchAll, onError: refetchAll })
  const approveMutation = useMutation({ mutationFn: api.approveExchange, mutationKey: ['AddExchange'], onSuccess: refetchAll, onError: refetchAll })

  function refetchAll() {
    exchanges.refetch()
    events.refetch()
    tickets.refetch()
  }

  return (
    <Panel nav={nav}>
      <PanelHeader><PanelHeaderContent>Заявки</PanelHeaderContent></PanelHeader>

      {exchanges.isLoading || tickets.isLoading || events.isLoading
        ? <Spinner size={'large'} style={{ margin: '20px 0' }} />
        : exchanges.data.length === 0
          ? <div style={{ textAlign: 'center', margin: 20 }}>{'Заявки на обмен билетами отсутствуют'}</div>
          : (
            <>
              {exchanges.data.filter((item: ExchangeRequest) => item.users[0].id === user.walletAddress || item.users[1].id === user.walletAddress).map((item: ExchangeRequest) => {
                return (
                  <Group key={item._id}>
                    <Header>{item.user_id !== user.walletAddress ? 'Входящяя' : 'Исходящяя'}</Header>

                    {item.users.find((u) => u.id === user.walletAddress)!.tickets.map((ticket_id: any) => {
                      const ticket = tickets.data.find((i: any) => ticket_id === i._id)
                      const t_event = events.data.find((i: any) => i._id === ticket.event_id)
                      return (
                        <React.Fragment key={ticket._id}>
                          <Cell>
                            <Ticket
                              with_qr={false}
                              image={ticket.url}
                              eventName={t_event.name}
                              date={t_event.date.split('T')[0]}
                              time={t_event.date.split('T')[1]}
                              address={t_event.place}
                            />
                          </Cell>
                          <Spacing size={16} />
                        </React.Fragment>
                      )
                    })
                    }

                    <Spacing size={24}>
                      <Separator />
                    </Spacing>
                    <Spacing size={16} />

                    {item.users.find((u) => u.id !== user.walletAddress)!.tickets.map((ticket_id: any) => {
                      const ticket = tickets.data.find((i: any) => ticket_id === i._id)
                      const t_event = events.data.find((i: any) => i._id === ticket.event_id)
                      return (
                        <React.Fragment key={ticket._id}>
                          <Cell>
                            <Ticket
                              with_qr={false}
                              image={ticket.url}
                              eventName={t_event.name}
                              date={t_event.date.split('T')[0]}
                              time={t_event.date.split('T')[1]}
                              address={t_event.place}
                            />
                          </Cell>
                          <Spacing size={16} />
                        </React.Fragment>
                      )
                    })
                    }

                    <Div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <Button size="l" mode="outline" onClick={() => discardMutation.mutate(item._id!)}>Отклонить</Button>
                      {item.users[0].id === user.walletAddress ? <Button size="l" onClick={() => approveMutation.mutate(item._id!)}>Принять</Button> : <></>}
                    </Div>
                  </Group>
                )
              })}
            </>
          )
      }
    </Panel>
  )
}

export default Requests
