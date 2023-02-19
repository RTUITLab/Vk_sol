import React, { ReactNode } from 'react'
import {
  PanelHeader,
  SplitCol,
  SplitLayout,
  useAdaptivity,
  ViewWidth
} from '@vkontakte/vkui'
import { NavigationMenu } from './NavigationMenu'
import { Icon28CalendarOutline, Icon28HeartCircleOutline, Icon28InfoOutline, Icon28MailOutline, Icon28NameTagOutline, Icon28Profile, Icon28SortOutline, Icon28TicketOutline, Icon28UserCircleOutline } from '@vkontakte/icons'
import { NavigationTabbar } from './NavigationTabbar'
import { Modals } from '../../modals'
import { NavigationItem } from '../../types'
import { CustomSnackbar } from '../snackbar/CustomSnackbar'
import { Structure, Epic } from '@cteamdev/router'
import { Popouts } from '../../popouts'
import { userAtom } from '../../store'
import { useAtomValue } from '@mntm/precoil'

const adminItems: NavigationItem[] = [
  { to: '/', text: 'Главная', icon: <Icon28NameTagOutline /> },
  { to: '/events', text: 'Мероприятия', icon: <Icon28CalendarOutline /> },
  { to: '/favorite', text: 'Избранное', icon: <Icon28HeartCircleOutline /> },
  { to: '/profile', text: 'Профиль', icon: <Icon28Profile /> }
]
const userItems: NavigationItem[] = [
  { to: '/', text: 'Главная', icon: <Icon28NameTagOutline /> },
  { to: '/tickets', text: 'Мои Билеты', icon: <Icon28TicketOutline /> },
  { to: '/favorite', text: 'Избранное', icon: <Icon28HeartCircleOutline /> },
  { to: '/collections', text: 'Коллекции', icon: <Icon28SortOutline /> },
  { to: '/requests', text: 'Заявки', icon: <Icon28MailOutline /> },
  { to: '/profile', text: 'Профиль', icon: <Icon28Profile /> }
]

type NavigationProps = {
  children: ReactNode,
}

export const Navigation: React.FC<NavigationProps> = ({ children }: NavigationProps) => {
  const { viewWidth } = useAdaptivity()
  const isDesktop: boolean = (viewWidth ?? 0) >= ViewWidth.SMALL_TABLET

  // const items = isAdmin ? adminItems : userItems
  const user = useAtomValue(userAtom)
  const items = user.isAdmin ? adminItems : userItems


  return (
    <Structure>
      <SplitLayout
        header={!isDesktop && <PanelHeader separator={false} />}
        style={{ justifyContent: 'center' }}
        modal={<Modals />}
        popout={<Popouts />}
      >
        <SplitCol
          animate={!isDesktop}
          width={isDesktop ? '550px' : '100%'}
          maxWidth={isDesktop ? '550px' : '100%'}
        >
          <Epic tabbar={!isDesktop && <NavigationTabbar items={items} />}>
            {children}
          </Epic>
          <CustomSnackbar isDesktop={isDesktop} />
        </SplitCol>
        {isDesktop && <NavigationMenu items={items} />}
      </SplitLayout>
    </Structure>
  )
}
