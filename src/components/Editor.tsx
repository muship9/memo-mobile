import { useFileEditor } from '../hooks/useFileEditor'

export default function Editor() {
  const {
    editedContent,
    isSaving,
    hasChanges,
    setEditedContent,
    handleSave,
    handleBack,
    getFileName,
    getFilePath,
    canSave,
  } = useFileEditor()

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <button onClick={handleBack} style={styles.backButton}>
          ← Back
        </button>
        <span style={styles.fileName}>{getFileName()}</span>
        <button 
          onClick={handleSave} 
          style={{
            ...styles.saveButton,
            opacity: canSave ? 1 : 0.5,
            cursor: canSave ? 'pointer' : 'not-allowed',
          }}
          disabled={!canSave}
        >
          {isSaving ? '保存中...' : hasChanges ? '保存 *' : '保存'}
        </button>
      </div>
      
      <div style={styles.pathBar}>
        <span style={styles.path}>{getFilePath()}</span>
      </div>
      
      <div style={styles.editorWrapper}>
        <textarea
          value={editedContent}
          onChange={(e) => setEditedContent(e.target.value)}
          style={styles.editor}
          placeholder="Type your content here..."
          spellCheck={false}
          disabled={isSaving}
        />
      </div>
      
      <div style={styles.statusBar}>
        <span>{editedContent.length} characters</span>
        <span>{editedContent.split('\n').length} lines</span>
        {hasChanges && <span style={styles.unsaved}>● Unsaved changes</span>}
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
    padding: '10px 20px',
    borderBottom: '1px solid #e0e0e0',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  backButton: {
    padding: '8px 16px',
    backgroundColor: '#6c757d',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '14px',
  },
  fileName: {
    fontSize: '16px',
    fontWeight: 'bold',
    flex: 1,
    textAlign: 'center',
  },
  saveButton: {
    padding: '8px 20px',
    backgroundColor: '#28a745',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '14px',
  },
  pathBar: {
    padding: '8px 20px',
    backgroundColor: '#f8f9fa',
    borderBottom: '1px solid #e0e0e0',
  },
  path: {
    fontSize: '12px',
    color: '#666',
    fontFamily: 'monospace',
  },
  editorWrapper: {
    flex: 1,
    display: 'flex',
    overflow: 'hidden',
  },
  editor: {
    flex: 1,
    padding: '20px',
    border: 'none',
    outline: 'none',
    fontFamily: 'monospace',
    fontSize: '14px',
    lineHeight: '1.6',
    resize: 'none',
    backgroundColor: '#ffffff',
  },
  statusBar: {
    padding: '10px 20px',
    borderTop: '1px solid #e0e0e0',
    backgroundColor: '#f8f9fa',
    display: 'flex',
    gap: '20px',
    fontSize: '12px',
    color: '#666',
  },
  unsaved: {
    color: '#dc3545',
    marginLeft: 'auto',
  },
}