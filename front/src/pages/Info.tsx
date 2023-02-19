import React from 'react'
import { Group, Panel, PanelHeader, PanelHeaderContent, PanelProps, Placeholder } from '@vkontakte/vkui'
import { Icon56GhostOutline } from '@vkontakte/icons'

export const Info: React.FC<PanelProps> = ({ nav }: PanelProps) => {
  return (
    <Panel nav={nav}>
      <PanelHeader><PanelHeaderContent>Инфо</PanelHeaderContent></PanelHeader>
      <Group>
        <Placeholder
          icon={<Icon56GhostOutline />}
        >
          Здесь ничего нет!
        </Placeholder>
      </Group>
    </Panel>
  )
}
