import React from 'react'
import { ItemInfo } from '@root/src/shared/d2items/itemInfo'
import { Avatar, Card, List } from 'antd'
import Meta from 'antd/es/card/Meta'
import WeaponPlugMetaGrid from './WeaponPlugMetaGrid'

interface WeaponListProps {
  items: ItemInfo[]
}

interface WeaponListItemProps {
  item: ItemInfo
}

const WeaponList: React.FC<WeaponListProps> = ({ items }) => {
  return <List dataSource={items} size="large" renderItem={item => <WeaponListItem item={item} />} />
}

const WeaponListItem: React.FC<WeaponListItemProps> = ({ item }) => {
  return (
    <List.Item key={item.instanceId}>
      <Card>
        <Meta title={item.displayName} avatar={<Avatar src={item.icon} size={48} shape="square" />} />
        <WeaponPlugMetaGrid plugs={item.plugDisplayData} />
      </Card>
    </List.Item>
  )
}

export default WeaponList
