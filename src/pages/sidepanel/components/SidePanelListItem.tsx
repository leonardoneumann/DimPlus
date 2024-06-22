import React from 'react'
import { Avatar, List } from 'antd'
import { ItemInfo } from '@root/src/shared/d2items/itemInfo'

interface SidePanelListItemProps {
  item: ItemInfo
}

const SidePanelListItem: React.FC<SidePanelListItemProps> = ({ item }) => {
  return (
    <List.Item key={item.instanceId}>
      <List.Item.Meta
        avatar={<Avatar src={item.icon} size={48} shape="square" />}
        title={item.displayName}
        description={`Level: ${item.level}`}
      />
      <div>Item Hash: {item.hash}</div>
    </List.Item>
  )
}

export default SidePanelListItem
