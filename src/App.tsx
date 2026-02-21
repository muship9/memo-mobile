import { useNb } from './hooks/useNb'
import SetupScreen from './components/SetupScreen'
import FileList from './components/FileList'
import Editor from './components/Editor'
import NewFile from './components/NewFile'
import './App.css'

function App() {
  const { currentScreen, error, loading } = useNb()

  return (
    <div className="app">
      {loading && (
        <div style={styles.loadingOverlay}>
          <div style={styles.spinner}>Loading...</div>
        </div>
      )}
      
      {error && (
        <div style={styles.errorBar}>
          {error}
        </div>
      )}
      
      {currentScreen === 'setup' && <SetupScreen />}
      {currentScreen === 'list' && <FileList />}
      {currentScreen === 'edit' && <Editor />}
      {currentScreen === 'new' && <NewFile />}
    </div>
  )
}

const styles: Record<string, React.CSSProperties> = {
  loadingOverlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 9999,
  },
  spinner: {
    backgroundColor: 'white',
    padding: '20px 40px',
    borderRadius: '8px',
    fontSize: '16px',
  },
  errorBar: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    padding: '10px 20px',
    backgroundColor: '#dc3545',
    color: 'white',
    fontSize: '14px',
    zIndex: 1000,
  },
}

export default App
