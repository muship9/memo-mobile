import { Box, Flex, Heading, Button, Text } from '@chakra-ui/react'
import { useNb } from '../hooks/useNb'
import { useFileTree } from '../hooks/useFileTree'
import type { FileTreeItem } from '../types'

export default function FileList() {
  const { error, fileTree } = useNb()
  const {
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
      <Box key={item.path}>
        <Flex
          onClick={() => handleFileClick(item)}
          p={3}
          pl={`${20 + level * 20}px`}
          cursor="pointer"
          align="center"
          _hover={{ bg: 'gray.100' }}
          transition="background-color 0.2s"
        >
          <Text mr={3} fontSize="lg">
            {item.type === 'folder' ? (expanded ? '📂' : '📁') : '📄'}
          </Text>
          <Text flex={1} fontSize="sm">
            {item.name}
          </Text>
          {item.size !== undefined && (
            <Text fontSize="xs" color="gray.500">
              {(item.size / 1024).toFixed(1)} KB
            </Text>
          )}
        </Flex>
        {item.type === 'folder' && expanded && (
          <Box>
            {children.map((child: FileTreeItem) => renderItem(child, level + 1))}
          </Box>
        )}
      </Box>
    )
  }


  return (
    <Box minH="100vh" display="flex" flexDirection="column">
      <Flex
        p={4}
        borderBottom="1px solid"
        borderColor="gray.200"
        justify="space-between"
        align="center"
      >
        <Heading as="h1" size="md">
          Files
        </Heading>
        <Flex gap={3}>
          <Button onClick={handleNewFile} background="#3182ce" color="white" size="sm" px={3} _hover={{ background: "#2c5282" }}>
            + New
          </Button>
          <Button onClick={handleLogout} background="#e53e3e" color="white" size="sm" px={3} _hover={{ background: "#c53030" }}>
            Logout
          </Button>
        </Flex>
      </Flex>
      
      {error && (
        <Box bg="red.100" color="red.800" p={3}>
          <Text>{error}</Text>
        </Box>
      )}
      
      <Box 
        flex={1} 
        overflowY="auto" 
        py={2}
        css={{
          WebkitOverflowScrolling: 'touch',
          overscrollBehavior: 'contain'
        }}
      >
        {fileTree.length === 0 ? (
          <Box p={10} textAlign="center">
            <Text color="gray.500" mb={4}>No files found</Text>
            <Button onClick={handleNewFile} background="#3182ce" color="white" _hover={{ background: "#2c5282" }}>
              Create your first file
            </Button>
          </Box>
        ) : (
          rootItems.map(item => renderItem(item, 0))
        )}
      </Box>
    </Box>
  )
}

