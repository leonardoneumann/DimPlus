import React from 'react'
import '@pages/sidepanel/SidePanel.css'
//import useStorage from '@src/shared/hooks/useStorage';
//import exampleThemeStorage from '@src/shared/storages/exampleThemeStorage'
import withSuspense from '@src/shared/hoc/withSuspense'
import withErrorBoundary from '@src/shared/hoc/withErrorBoundary'
import { useState } from 'react'
import { useEffect } from 'react'
import { MsgAddItemInfoToSidepanel, MsgBase, MsgNames } from '@root/src/shared/messaging/eventMessages'
import WeaponList from './components/WeaponList'
import { ConfigProvider, theme } from 'antd'

const SidePanel: React.FC = () => {
  const [items, setItems] = useState([])
  const [loadingItem, setLoadingItem] = useState(false)

  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const messageHandler = (msg: MsgBase, sender, sendResponse) => {
      switch (msg.name) {
        case MsgNames.AddItemInfoToSidepanel:
          setLoadingItem(false)
          setItems(prevItems => [(msg as MsgAddItemInfoToSidepanel).itemInfo, ...prevItems])
          break
        case MsgNames.InventoryItemClick:
          setLoadingItem(true)
          break
      }
      return false
    }

    chrome.runtime.onMessage.addListener(messageHandler)

    // Clean up the event listener when the component unmounts
    return () => {
      chrome.runtime.onMessage.addListener(messageHandler)
    }
  }, []) // Empty dependency array ensures the effect runs only once

  return (
    <ConfigProvider
      theme={{
        // 1. Use dark algorithm
        //algorithm: theme.darkAlgorithm,

        // 2. Combine dark algorithm and compact algorithm
        algorithm: [theme.darkAlgorithm, theme.compactAlgorithm],
      }}>
      <div className="App">
        <WeaponList items={items} loading={loadingItem} />
      </div>
    </ConfigProvider>
  )
}

export default withErrorBoundary(withSuspense(SidePanel, <div> Loading ... </div>), <div> Error </div>)
