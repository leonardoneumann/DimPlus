import React from 'react'
import { ItemInfo } from '@root/src/shared/d2items/itemInfo'
import { Avatar, Card, Collapse, CollapseProps, Divider, List } from 'antd'
import Meta from 'antd/es/card/Meta'
import PlugMetaGrid from './PlugMetaGrid'
import MasterworkMetaGrid from './MasterworkMetaGrid'
import ModMetaGrid from './ModMetaGrid'
import PlugComboMetaGrid from './PlugComboMetaGrid'

interface WeaponListProps {
  items: ItemInfo[]
  loading: boolean
}

interface WeaponListItemProps {
  item: ItemInfo
}

const WeaponList: React.FC<WeaponListProps> = ({ items, loading = false }) => {
  return <List dataSource={items} loading={loading} size="large" renderItem={item => <WeaponListItem item={item} />} />
}

const WeaponListItem: React.FC<WeaponListItemProps> = ({ item }) => {
  const collapsableItems: CollapseProps['items'] = []

  if (item.metaCombos?.combos?.[0]) {
    collapsableItems.push({
      key: 'combos',
      label: 'Popular Roll Combos',
      children: <PlugComboMetaGrid metaCombos={item.metaCombos} />,
    })
  }

  if (item.metaCombos?.masterwork?.[0]) {
    collapsableItems.push({
      key: 'masterwork',
      label: 'Masterwork Popularity',
      children: <MasterworkMetaGrid metaCombos={item.metaCombos} />,
    })
  }

  if (item.metaCombos?.mods?.[0]) {
    collapsableItems.push({
      key: 'mods',
      label: 'Mod Popularity',
      children: <ModMetaGrid metaCombos={item.metaCombos} />,
    })
  }

  return (
    <List.Item key={item.instanceId}>
      <Card>
        <Meta title={item.displayName} avatar={<Avatar src={item.icon} size={48} shape="square" />} />
        <PlugMetaGrid plugs={item.plugDisplayData} />
        <Divider></Divider>
        <Collapse items={collapsableItems} defaultActiveKey={'combos'} />
      </Card>
    </List.Item>
  )
}

export default WeaponList
