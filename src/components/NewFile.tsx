import { Box, Flex, Button, Text, Input, Textarea, VStack, Heading } from '@chakra-ui/react'
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
    <Box minH="100vh" display="flex" flexDirection="column">
      <Flex
        p={3}
        borderBottom="1px solid"
        borderColor="gray.200"
        justify="space-between"
        align="center"
      >
        <Button onClick={handleCancel} background="#718096" color="white" size="sm" px={3} _hover={{ background: "#4a5568" }}>
          ← Cancel
        </Button>
        <Text fontSize="lg" fontWeight="bold">
          New File
        </Text>
        <Button 
          onClick={handleCreate} 
          background="#38a169"
          color="white"
          size="sm"
          px={3}
          loading={isCreating}
          _hover={{ background: "#2f855a" }}
        >
          作成
        </Button>
      </Flex>
      
      <Box p={5} borderBottom="1px solid" borderColor="gray.200" bg="gray.50">
        <Heading as="h3" size="sm" mb={3}>
          Templates:
        </Heading>
        <Flex gap={3} flexWrap="wrap">
          {templates.map((template) => (
            <Button 
              key={template.type}
              onClick={() => applyTemplate(template.type)} 
              background="transparent"
              border="1px solid #3182ce"
              color="#3182ce"
              size="sm"
              px={3}
              _hover={{ background: "#ebf8ff" }}
            >
              {template.name}
            </Button>
          ))}
        </Flex>
      </Box>
      
      <Box flex={1} p={5} overflowY="auto">
        <VStack gap={6} align="stretch">
          <Box>
            <Text fontSize="sm" fontWeight="bold" mb={2}>
              File Path:
            </Text>
            <Input
              value={fileName}
              onChange={(e) => setFileName(e.target.value)}
              placeholder="e.g., daily/2024-01-15.md or notes/my-idea.md"
              disabled={isCreating}
              borderColor={fileNameError ? 'red.300' : undefined}
            />
            {fileNameError && (
              <Box bg="red.100" color="red.800" p={2} mt={2} borderRadius="md">
                <Text fontSize="sm">{fileNameError}</Text>
              </Box>
            )}
            <Text fontSize="xs" color="gray.500" mt={1}>
              Folders will be created automatically. Extension .md will be added if missing.
            </Text>
          </Box>
          
          <Box>
            <Text fontSize="sm" fontWeight="bold" mb={2}>
              Initial Content:
            </Text>
            <Textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Start typing your content here..."
              minH="300px"
              fontFamily="mono"
              fontSize="sm"
              resize="vertical"
              disabled={isCreating}
            />
          </Box>
        </VStack>
      </Box>
    </Box>
  )
}

