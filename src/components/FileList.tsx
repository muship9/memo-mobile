import { useNb } from '../hooks/useNb'
import { useFileTree } from '../hooks/useFileTree'
import type { FileTreeItem } from '../types'

export default function FileList() {
  const { error, fileTree } = useNb()
  const {
    refreshing,
    refreshFileTree,
    handleFileClick,
    handleNewFile,
    handleLogout,
    buildTree,
  } = useFileTree()
  
  const { rootItems, folderMap, isExpanded } = buildTree()
  
  const renderItem = (item: FileTreeItem, level: number = 0): React.JSX.Element => {
    const expanded = isExpanded(item.path)
    const children = folderMap.get(item.path) || []
    
    return (
      <div key={item.path}>
        <div 
          onClick={() => handleFileClick(item)}
          style={{
            ...styles.item,
            paddingLeft: `${20 + level * 20}px`,
          }}
        >
          <span style={styles.icon}>
            {item.type === 'folder' ? (expanded ? '📂' : '📁') : '📄'}
          </span>
          <span style={styles.name}>{item.name}</span>
          {item.size !== undefined && (
            <span style={styles.size}>
              {(item.size / 1024).toFixed(1)} KB
            </span>
          )}
        </div>
        {item.type === 'folder' && expanded && (
          <div>
            {children.map((child: FileTreeItem) => renderItem(child, level + 1))}
          </div>
        )}
      </div>
    )
  }


  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h1 style={styles.title}>Files</h1>
        <div style={styles.actions}>
          <button onClick={handleNewFile} style={styles.button}>
            + New
          </button>
          <button onClick={refreshFileTree} style={styles.button} disabled={refreshing}>
            {refreshing ? '更新中...' : '🔄'}
          </button>
          <button onClick={handleLogout} style={styles.logoutButton}>
            Logout
          </button>
        </div>
      </div>
      
      {error && (
        <div style={styles.error}>
          {error}
        </div>
      )}
      
      <div style={styles.list}>
        {fileTree.length === 0 ? (
          <div style={styles.empty}>
            <p>No files found</p>
            <button onClick={handleNewFile} style={styles.button}>
              Create your first file
            </button>
          </div>
        ) : (
          rootItems.map(item => renderItem(item, 0))
        )}
      </div>
    </div>
  )
}

const styles: Record<string, React.CSSProperties> = {
  container: {
    height: '100vh',
    display: 'flex',
    flexDirection: 'column',
  },
  header: {
    padding: '15px 20px',
    borderBottom: '1px solid #e0e0e0',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    margin: 0,
    fontSize: '20px',
  },
  actions: {
    display: 'flex',
    gap: '10px',
  },
  button: {
    padding: '8px 16px',
    backgroundColor: '#007bff',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '14px',
  },
  logoutButton: {
    padding: '8px 16px',
    backgroundColor: '#6c757d',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '14px',
  },
  error: {
    padding: '10px 20px',
    backgroundColor: '#f8d7da',
    color: '#721c24',
    borderBottom: '1px solid #f5c6cb',
  },
  list: {
    flex: 1,
    overflow: 'auto',
    padding: '10px 0',
  },
  item: {
    padding: '10px 20px',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    transition: 'background-color 0.2s',
  },
  icon: {
    marginRight: '10px',
    fontSize: '16px',
  },
  name: {
    flex: 1,
    fontSize: '14px',
  },
  size: {
    fontSize: '12px',
    color: '#666',
  },
  empty: {
    padding: '40px',
    textAlign: 'center',
    color: '#666',
  },
}
