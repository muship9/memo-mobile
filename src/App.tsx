import { Box, Flex, Text, Spinner } from '@chakra-ui/react'
import { useNb } from './hooks/useNb'
import SetupScreen from './components/SetupScreen'
import FileList from './components/FileList'
import Editor from './components/Editor'
import NewFile from './components/NewFile'

function App() {
  const { currentScreen, error, loading } = useNb()

  return (
    <Box minH="100vh" bg="gray.50">
      {loading && (
        <Flex
          position="fixed"
          top={0}
          left={0}
          right={0}
          bottom={0}
          bg="blackAlpha.500"
          justify="center"
          align="center"
          zIndex={9999}
        >
          <Box bg="white" p={6} borderRadius="md">
            <Flex align="center" gap={3}>
              <Spinner size="md" />
              <Text>Loading...</Text>
            </Flex>
          </Box>
        </Flex>
      )}
      
      {error && (
        <Box
          position="fixed"
          top={0}
          left={0}
          right={0}
          p={4}
          bg="red.500"
          color="white"
          fontSize="sm"
          zIndex={1000}
        >
          {error}
        </Box>
      )}
      
      {currentScreen === 'setup' && <SetupScreen />}
      {currentScreen === 'list' && <FileList />}
      {currentScreen === 'edit' && <Editor />}
      {currentScreen === 'new' && <NewFile />}
    </Box>
  )
}


export default App
