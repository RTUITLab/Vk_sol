import React, { useEffect, useState } from 'react'
import { Avatar, Button, CardGrid, Group, Panel, PanelHeader, PanelHeaderContent, PanelProps, Search, SimpleCell, Spacing, Spinner } from '@vkontakte/vkui'


export const WalletConnect: React.FC<PanelProps> = ({ nav }: PanelProps) => {

  return (
    <Panel nav={nav}>
      <PanelHeader><PanelHeaderContent>Подключение кошелька</PanelHeaderContent></PanelHeader>
      <Spacing />
      <Group mode='plain'>
        Идет подключение кошелька
      </Group>
    </Panel>
  )
}
