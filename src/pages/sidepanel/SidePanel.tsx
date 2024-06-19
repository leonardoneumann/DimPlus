import React from 'react'
import '@pages/sidepanel/SidePanel.css'
//import useStorage from '@src/shared/hooks/useStorage';
//import exampleThemeStorage from '@src/shared/storages/exampleThemeStorage'
import withSuspense from '@src/shared/hoc/withSuspense'
import withErrorBoundary from '@src/shared/hoc/withErrorBoundary'
import { useState } from 'react'
import { useEffect } from 'react'
import { MsgAddItemInfoToSidepanel, MsgNames } from '@root/src/shared/messaging/eventMessages'

const SidePanel = () => {
  const [items, setItems] = useState([])

  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const handleAddItem = (msg: MsgAddItemInfoToSidepanel, sender, sendResponse) => {
      if (msg.name !== MsgNames.AddItemInfoToSidepanel) return false
      console.log(`[DIM+ Sidepanel] recieved message ${msg.name} from ${sender.tab}`)
      // Add the item to the list
      setItems(prevItems => [msg.itemIID, ...prevItems])
      return false
    }

    chrome.runtime.onMessage.addListener(handleAddItem)

    // Clean up the event listener when the component unmounts
    return () => {
      chrome.runtime.onMessage.addListener(handleAddItem)
    }
  }, []) // Empty dependency array ensures the effect runs only once

  return (
    <div className="App">
      <header className="App-header">
        <p>Community usage data from light.gg</p>
      </header>
      <div>
        <p>{items[0]}</p>
      </div>
    </div>
  )
}

export default withErrorBoundary(withSuspense(SidePanel, <div> Loading ... </div>), <div> Error </div>)
