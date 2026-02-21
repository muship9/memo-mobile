import { useGitHubSetup } from '../hooks/useGitHubSetup'

export default function SetupScreen() {
  const {
    token,
    repo,
    isValidating,
    setToken,
    setRepo,
    handleSave,
    tokenError,
    repoError,
  } = useGitHubSetup()

  return (
    <div className="setup-screen" style={styles.container}>
      <h1 style={styles.title}>nb Mobile Setup</h1>
      
      <div style={styles.formGroup}>
        <label htmlFor="token" style={styles.label}>
          GitHub Token:
        </label>
        <input
          id="token"
          type="password"
          value={token}
          onChange={(e) => setToken(e.target.value)}
          placeholder="ghp_xxxxxxxxxxxx"
          style={{
            ...styles.input,
            borderColor: tokenError ? '#dc3545' : '#ddd'
          }}
          disabled={isValidating}
        />
        {tokenError && (
          <div style={styles.errorText}>{tokenError}</div>
        )}
      </div>

      <div style={styles.formGroup}>
        <label htmlFor="repo" style={styles.label}>
          Repository:
        </label>
        <input
          id="repo"
          type="text"
          value={repo}
          onChange={(e) => setRepo(e.target.value)}
          placeholder="username/repository-name"
          style={{
            ...styles.input,
            borderColor: repoError ? '#dc3545' : '#ddd'
          }}
          disabled={isValidating}
        />
        {repoError && (
          <div style={styles.errorText}>{repoError}</div>
        )}
      </div>

      <button 
        onClick={handleSave}
        style={{
          ...styles.button,
          opacity: isValidating ? 0.6 : 1,
          cursor: isValidating ? 'not-allowed' : 'pointer',
        }}
        disabled={isValidating}
      >
        {isValidating ? '確認中...' : '保存'}
      </button>

      <div style={styles.help}>
        <h3>GitHub Token の作成方法：</h3>
        <ol>
          <li>GitHub Settings → Developer settings</li>
          <li>Personal access tokens → Tokens (classic)</li>
          <li>「Generate new token (classic)」</li>
          <li>「repo」スコープにチェック</li>
          <li>「Generate token」をクリック</li>
        </ol>
      </div>
    </div>
  )
}

const styles: Record<string, React.CSSProperties> = {
  container: {
    padding: '20px',
    maxWidth: '500px',
    margin: '0 auto',
  },
  title: {
    fontSize: '24px',
    marginBottom: '30px',
    textAlign: 'center',
  },
  formGroup: {
    marginBottom: '20px',
  },
  label: {
    display: 'block',
    marginBottom: '8px',
    fontWeight: 'bold',
  },
  input: {
    width: '100%',
    padding: '10px',
    fontSize: '16px',
    border: '1px solid #ddd',
    borderRadius: '4px',
    boxSizing: 'border-box',
  },
  button: {
    width: '100%',
    padding: '12px',
    fontSize: '16px',
    backgroundColor: '#007bff',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    marginTop: '10px',
  },
  help: {
    marginTop: '40px',
    padding: '20px',
    backgroundColor: '#f8f9fa',
    borderRadius: '8px',
    fontSize: '14px',
    lineHeight: '1.6',
  },
  errorText: {
    color: '#dc3545',
    fontSize: '12px',
    marginTop: '5px',
  },
}