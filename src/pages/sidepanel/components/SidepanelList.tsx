import React from 'react'
import { List } from 'antd'
import { ItemInfo } from '@root/src/shared/d2items/itemInfo'
import SidePanelListItem from './SidePanelListItem'

interface SidePanelListProps {
  items: ItemInfo[]
}

const SidePanelList: React.FC<SidePanelListProps> = ({ items }) => {
  return <List dataSource={items} renderItem={item => <SidePanelListItem item={item} />} />
}

export default SidePanelList
