import { back, useParams } from '@cteamdev/router'
import { useAtomValue } from '@mntm/precoil'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { Button, Cell, Div, Group, List, ModalCard, ModalCardProps, ModalPage, ModalPageHeader, ModalPageProps, Spacing, Spinner } from '@vkontakte/vkui'
import React, { useEffect, useState } from 'react'
import { api } from '../api'
import Ticket from '../components/Ticket/Ticket'
import { userAtom } from '../store'
import './exchange.css'

let timer: string | number | NodeJS.Timeout | undefined

export const QRModal: React.FC<ModalPageProps> = ({ nav }: ModalPageProps) => {
  const query = useParams()
  const user = useAtomValue(userAtom)
  const queryClient = useQueryClient()
  const { data: qrData } = useQuery({ queryKey: ['ticketQr', { id: query.ticket }], queryFn: () => api.getQr(user.walletAddress, query.ticket) })

  useEffect(()=>{
    timer = setInterval(()=>{
      queryClient.invalidateQueries(['ticketQr', { id: query.ticket }])
    }, 5000)
    
    return () => clearInterval(timer)
  }, [])
  
  return (
    <ModalPage nav={nav} style={{ width:'fit-content' }} onClose={back} header={<ModalPageHeader>QR код для валидации</ModalPageHeader>}>
      {qrData && <img src={`https://chart.googleapis.com/chart?cht=qr&chs=500x500&chl=${qrData}`} />}
    </ModalPage>
  )
}
