import { useFileCreator } from '../hooks/useFileCreator'

export default function NewFile() {
  const {
    fileName,
    content,
    isCreating,
    setFileName,
    setContent,
    handleCreate,
    handleCancel,
    applyTemplate,
    templates,
    fileNameError,
  } = useFileCreator()
  

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <button onClick={handleCancel} style={styles.cancelButton}>
          ← Cancel
        </button>
        <span style={styles.title}>New File</span>
        <button 
          onClick={handleCreate} 
          style={{
            ...styles.createButton,
            opacity: isCreating ? 0.5 : 1,
            cursor: isCreating ? 'not-allowed' : 'pointer',
          }}
          disabled={isCreating}
        >
          {isCreating ? '作成中...' : '作成'}
        </button>
      </div>
      
      <div style={styles.templates}>
        <h3>Templates:</h3>
        <div style={styles.templateButtons}>
          {templates.map((template) => (
            <button 
              key={template.type}
              onClick={() => applyTemplate(template.type)} 
              style={styles.templateButton}
            >
              {template.name}
            </button>
          ))}
        </div>
      </div>
      
      <div style={styles.form}>
        <div style={styles.formGroup}>
          <label htmlFor="fileName" style={styles.label}>
            File Path:
          </label>
          <input
            id="fileName"
            type="text"
            value={fileName}
            onChange={(e) => setFileName(e.target.value)}
            placeholder="e.g., daily/2024-01-15.md or notes/my-idea.md"
            style={{
              ...styles.input,
              borderColor: fileNameError ? '#dc3545' : '#ddd'
            }}
            disabled={isCreating}
          />
          {fileNameError && (
            <div style={styles.errorText}>{fileNameError}</div>
          )}
          <small style={styles.hint}>
            Folders will be created automatically. Extension .md will be added if missing.
          </small>
        </div>
        
        <div style={styles.formGroup}>
          <label htmlFor="content" style={styles.label}>
            Initial Content:
          </label>
          <textarea
            id="content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Start typing your content here..."
            style={styles.textarea}
            disabled={isCreating}
          />
        </div>
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
  cancelButton: {
    padding: '8px 16px',
    backgroundColor: '#6c757d',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '14px',
  },
  title: {
    fontSize: '18px',
    fontWeight: 'bold',
  },
  createButton: {
    padding: '8px 20px',
    backgroundColor: '#28a745',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '14px',
  },
  templates: {
    padding: '20px',
    borderBottom: '1px solid #e0e0e0',
    backgroundColor: '#f8f9fa',
  },
  templateButtons: {
    display: 'flex',
    gap: '10px',
    marginTop: '10px',
    flexWrap: 'wrap',
  },
  templateButton: {
    padding: '8px 16px',
    backgroundColor: 'white',
    border: '1px solid #007bff',
    color: '#007bff',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '14px',
    transition: 'all 0.2s',
  },
  form: {
    flex: 1,
    padding: '20px',
    overflow: 'auto',
  },
  formGroup: {
    marginBottom: '25px',
  },
  label: {
    display: 'block',
    marginBottom: '8px',
    fontWeight: 'bold',
    fontSize: '14px',
  },
  input: {
    width: '100%',
    padding: '10px',
    fontSize: '14px',
    border: '1px solid #ddd',
    borderRadius: '4px',
    boxSizing: 'border-box',
  },
  textarea: {
    width: '100%',
    minHeight: '300px',
    padding: '10px',
    fontSize: '14px',
    fontFamily: 'monospace',
    border: '1px solid #ddd',
    borderRadius: '4px',
    boxSizing: 'border-box',
    resize: 'vertical',
  },
  hint: {
    display: 'block',
    marginTop: '5px',
    fontSize: '12px',
    color: '#666',
  },
  errorText: {
    color: '#dc3545',
    fontSize: '12px',
    marginTop: '5px',
  },
}