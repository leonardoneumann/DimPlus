import React from 'react'
import '@pages/popup/Popup.css'
//import useStorage from '@src/shared/hooks/useStorage';
//import exampleThemeStorage from '@src/shared/storages/exampleThemeStorage';
import withSuspense from '@src/shared/hoc/withSuspense'
import withErrorBoundary from '@src/shared/hoc/withErrorBoundary'

const Popup = () => {
  //const theme = useStorage(exampleThemeStorage)

  return (
    <div className="App">
      <header className="App-header">
        <p>This is the popup</p>
      </header>
    </div>
  )
}

export default withErrorBoundary(withSuspense(Popup, <div> Loading ... </div>), <div> Error </div>)
