import React from 'react'
import { chakra, Box, Select, Flex, Heading, Text, Stack, FormControl, FormLabel, Input, InputGroup, FormHelperText, Textarea, Icon, Button, VisuallyHidden } from '@chakra-ui/react'
import { useAppSelector } from '../state'
import { useState } from 'react'
import { Category } from '../types'

export const UploadPage = () => {
    const [categories, setCategories] = useState<Category[]>([])
    const { data } = useAppSelector((state) => state)

    const handleCategoryChange: React.ChangeEventHandler<HTMLSelectElement> = (event) => {
        event.preventDefault()

        const c: Category = JSON.parse(event.target.value)

        setCategories([...categories, c])
    }
    return (
        <Box p={10}>
            <Box>
                <Heading color="white" pb={5}>
                    Upload a new Video
                </Heading>
                <chakra.form action="#" method="POST" rounded={[null, 'md']} overflow={{ sm: 'hidden' }}>
                    <Stack px={4} py={5} bg={'gray.700'} spacing={6} p={{ sm: 6 }}>
                        <FormControl>
                            <FormLabel fontSize="sm" fontWeight="md" color={'gray.50'}>
                                Name
                            </FormLabel>
                            <InputGroup size="sm">
                                <Select focusBorderColor="brand.400" rounded="md" />
                            </InputGroup>
                        </FormControl>

                        <FormControl>
                            {JSON.stringify(categories)}
                            <FormLabel fontSize="sm" fontWeight="md" color={'gray.50'}>
                                Categories
                            </FormLabel>
                            <InputGroup size="sm">
                                <Select focusBorderColor="brand.400" rounded="md" onChange={handleCategoryChange} value={undefined}>
                                    {data.categories
                                        .filter((c) => categories.find((_c) => _c.id === c.id) === undefined)
                                        .map((c, idx) => (
                                            <option value={JSON.stringify(c)} key={idx}>
                                                {c.name}
                                            </option>
                                        ))}
                                </Select>
                            </InputGroup>
                        </FormControl>

                        <FormControl id="email" mt={1}>
                            <FormLabel fontSize="sm" fontWeight="md" color={'gray.50'}>
                                Description
                            </FormLabel>
                            <Textarea mt={1} rows={3} shadow="sm" focusBorderColor="brand.400" fontSize={{ sm: 'sm' }} />
                            <FormHelperText>Brief description for your video.</FormHelperText>
                        </FormControl>

                        <FormControl>
                            <FormLabel fontSize="sm" fontWeight="md" color={'gray.50'}>
                                Video
                            </FormLabel>
                            <Flex mt={1} justify="center" px={6} pt={5} pb={6} borderWidth={2} borderColor={'gray.500'} borderStyle="dashed" rounded="md">
                                <Stack spacing={1} textAlign="center">
                                    <Icon mx="auto" boxSize={12} color={'gray.500'} stroke="currentColor" fill="none" viewBox="0 0 48 48" aria-hidden="true">
                                        <path
                                            d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                                            strokeWidth="2"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                        />
                                    </Icon>
                                    <Flex fontSize="sm" color={'gray.400'} alignItems="baseline">
                                        <chakra.label
                                            htmlFor="file-upload"
                                            cursor="pointer"
                                            rounded="md"
                                            fontSize="md"
                                            color={'brand.200'}
                                            pos="relative"
                                            _hover={{
                                                color: 'brand.300',
                                            }}
                                        >
                                            <span>Upload a file</span>
                                            <VisuallyHidden>
                                                <input id="file-upload" name="file-upload" type="file" />
                                            </VisuallyHidden>
                                        </chakra.label>
                                        <Text pl={1}>or drag and drop</Text>
                                    </Flex>
                                    <Text fontSize="xs" color={'gray.50'}>
                                        PNG, JPG, GIF up to 10MB
                                    </Text>
                                </Stack>
                            </Flex>
                        </FormControl>
                    </Stack>
                    <Box px={{ base: 4, sm: 6 }} py={3} textAlign="right">
                        <Button type="submit" colorScheme="white" _focus={{ shadow: 'none' }} fontWeight="md">
                            Save
                        </Button>
                    </Box>
                </chakra.form>
            </Box>
        </Box>
    )
}
