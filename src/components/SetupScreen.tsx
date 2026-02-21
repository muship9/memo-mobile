import { Box, Heading, VStack, Input, Button, Text } from '@chakra-ui/react'
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
    <Box p={6} maxW="500px" mx="auto" minH="100vh">
      <Heading as="h1" size="lg" textAlign="center" mb={8}>
        nb Mobile Setup
      </Heading>
      
      <VStack gap={6}>
        <Box>
          <Text fontSize="sm" fontWeight="bold" mb={2}>GitHub Token:</Text>
          <Input
            id="token"
            type="password"
            value={token}
            onChange={(e) => setToken(e.target.value)}
            placeholder="ghp_xxxxxxxxxxxx"
            disabled={isValidating}
            size="lg"
          />
          {tokenError && (
            <Box bg="red.100" color="red.800" p={2} mt={2} borderRadius="md">
              <Text fontSize="sm">{tokenError}</Text>
            </Box>
          )}
        </Box>

        <Box>
          <Text fontSize="sm" fontWeight="bold" mb={2}>Repository:</Text>
          <Input
            id="repo"
            type="text"
            value={repo}
            onChange={(e) => setRepo(e.target.value)}
            placeholder="username/repository-name"
            disabled={isValidating}
            size="lg"
          />
          {repoError && (
            <Box bg="red.100" color="red.800" p={2} mt={2} borderRadius="md">
              <Text fontSize="sm">{repoError}</Text>
            </Box>
          )}
        </Box>

        <Button 
          onClick={handleSave}
          background="#3182ce"
          color="white"
          size="lg"
          width="full"
          disabled={isValidating}
          _hover={{ background: "#2c5282" }}
        >
          {isValidating ? '確認中' : '保存'}
        </Button>

        <Box bg="gray.50" p={6} borderRadius="md" width="full">
          <Heading as="h3" size="md" mb={4}>
            GitHub Token の作成方法：
          </Heading>
          <VStack align="start" gap={1} fontSize="sm">
            <Text>1. GitHub Settings → Developer settings</Text>
            <Text>2. Personal access tokens → Tokens (classic)</Text>
            <Text>3. 「Generate new token (classic)」</Text>
            <Text>4. 「repo」スコープにチェック</Text>
            <Text>5. 「Generate token」をクリック</Text>
          </VStack>
        </Box>
      </VStack>
    </Box>
  )
}

