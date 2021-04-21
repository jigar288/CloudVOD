import React from 'react'
import { chakra, Box, Select, Heading, Stack, FormControl, FormLabel, Input, InputGroup, FormHelperText, Textarea, Icon, Button, VisuallyHidden } from '@chakra-ui/react'
import { useAppSelector } from '../state'
import { useState } from 'react'
import { Category } from '../types'
import { UploadFile } from '../components/UploadFile'

export const UploadPage = () => {
    const [categories, setCategories] = useState<Category[]>([])
    const { data } = useAppSelector((state) => state)
    const [file, setFile] = useState<File | null>(null)

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
                            <UploadFile value={file} setValue={setFile} />
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
