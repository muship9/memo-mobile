import { Box, Flex, Button, Text, Textarea, Badge } from '@chakra-ui/react'
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
    <Box minH="100vh" display="flex" flexDirection="column">
      <Flex
        p={3}
        borderBottom="1px solid"
        borderColor="gray.200"
        justify="space-between"
        align="center"
      >
        <Button onClick={handleBack} colorScheme="gray" size="sm">
          ← Back
        </Button>
        <Text fontSize="lg" fontWeight="bold" flex={1} textAlign="center">
          {getFileName()}
        </Text>
        <Button 
          onClick={handleSave} 
          colorScheme="green"
          size="sm"
          disabled={!canSave}
          loading={isSaving}
        >
          {hasChanges ? '保存 *' : '保存'}
        </Button>
      </Flex>
      
      <Box p={2} bg="gray.50" borderBottom="1px solid" borderColor="gray.200">
        <Text fontSize="xs" color="gray.600" fontFamily="mono">
          {getFilePath()}
        </Text>
      </Box>
      
      <Box flex={1} display="flex">
        <Textarea
          value={editedContent}
          onChange={(e) => setEditedContent(e.target.value)}
          placeholder="Type your content here..."
          spellCheck={false}
          disabled={isSaving}
          flex={1}
          fontFamily="mono"
          fontSize="sm"
          lineHeight={1.6}
          resize="none"
          border="none"
          borderRadius={0}
          _focus={{ boxShadow: 'none' }}
          p={5}
        />
      </Box>
      
      <Flex
        p={3}
        borderTop="1px solid"
        borderColor="gray.200"
        bg="gray.50"
        fontSize="xs"
        color="gray.600"
        gap={5}
      >
        <Text>{editedContent.length} characters</Text>
        <Text>{editedContent.split('\n').length} lines</Text>
        {hasChanges && (
          <Badge colorScheme="red" ml="auto">
            ● Unsaved changes
          </Badge>
        )}
      </Flex>
    </Box>
  )
}

