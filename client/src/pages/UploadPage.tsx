import React from 'react'
import {
    chakra,
    Box,
    Select,
    Heading,
    Stack,
    FormControl,
    FormLabel,
    Input,
    FormHelperText,
    Textarea,
    Button,
    Spinner,
    Alert,
    AlertDescription,
    AlertIcon,
    AlertTitle,
    CloseButton,
    Flex,
} from '@chakra-ui/react'
import { useAppSelector } from '../state'
import { useState } from 'react'
import { Category } from '../types'
import { UploadFile } from '../components/UploadFile'

export const UploadPage = () => {
    const { data, loading, error } = useAppSelector((state) => state)

    const [name, setName] = useState('')
    const [description, setDescription] = useState('')
    const [categories, setCategories] = useState<Category[]>([])
    const [file, setFile] = useState<File | null>(null)

    const handleCategoryChange: React.ChangeEventHandler<HTMLSelectElement> = (event) => {
        event.preventDefault()

        const c: Category = JSON.parse(event.target.value)

        setCategories([...categories, c])
    }

    const handleSubmit: React.FormEventHandler<HTMLFormElement> = (ev) => {
        ev.preventDefault()

        alert(JSON.stringify({ name, description, categories: categories.map((x) => x.id), file }))
    }

    return (
        <Box p={10}>
            <Box>
                <Heading color="white" pb={5}>
                    Upload a new Video
                </Heading>
                <chakra.form rounded={[null, 'md']} overflow={{ sm: 'hidden' }} onSubmit={handleSubmit}>
                    {error.UPLOAD_VIDEO && (
                        <Alert status="error">
                            <AlertIcon />
                            <AlertTitle mr={2}>Error while uploading video</AlertTitle>
                            <AlertDescription>{error.UPLOAD_VIDEO}</AlertDescription>
                        </Alert>
                    )}

                    <Stack px={4} py={5} bg={'gray.700'} spacing={6} p={{ sm: 6 }}>
                        <FormControl>
                            <FormLabel fontSize="sm" fontWeight="md" color={'gray.50'}>
                                Name
                            </FormLabel>
                            <Input focusBorderColor="brand.400" rounded="md" value={name} onChange={(ev) => setName(ev.target.value)} />
                            <FormHelperText>Please keep it less than 45 characters.</FormHelperText>
                        </FormControl>

                        <FormControl>
                            <FormLabel fontSize="sm" fontWeight="md" color={'gray.50'}>
                                Categories
                            </FormLabel>

                            <Select focusBorderColor="brand.400" rounded="md" onChange={handleCategoryChange} value={undefined}>
                                {data.categories
                                    .filter((c) => categories.find((_c) => _c.id === c.id) === undefined)
                                    .map((c, idx) => (
                                        <option value={JSON.stringify(c)} key={idx}>
                                            {c.name}
                                        </option>
                                    ))}
                            </Select>
                        </FormControl>

                        <FormControl id="email" mt={1}>
                            <FormLabel fontSize="sm" fontWeight="md" color={'gray.50'}>
                                Description
                            </FormLabel>
                            <Textarea mt={1} rows={3} shadow="sm" focusBorderColor="brand.400" fontSize={{ sm: 'sm' }} value={description} onChange={(ev) => setDescription(ev.target.value)} />
                            <FormHelperText>Brief description for your video.</FormHelperText>
                        </FormControl>

                        <FormControl>
                            <FormLabel fontSize="sm" fontWeight="md" color={'gray.50'}>
                                Video
                            </FormLabel>
                            <UploadFile value={file} setValue={setFile} />
                        </FormControl>

                        <FormControl>
                            <Button type="submit" _focus={{ shadow: 'none' }} fontWeight="md" disabled={loading.UPLOAD_VIDEO}>
                                {loading.UPLOAD_VIDEO ? <Spinner /> : 'Upload'}
                            </Button>
                        </FormControl>
                    </Stack>
                </chakra.form>
            </Box>
        </Box>
    )
}
