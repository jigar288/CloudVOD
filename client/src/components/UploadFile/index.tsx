import { chakra, Flex, Icon, Stack, VisuallyHidden, Text } from '@chakra-ui/react'
import React from 'react'
import { UploadFileProps } from 'types/components/UploadFile'

export const UploadFile: React.FC<UploadFileProps> = (props) => {
    const [dragging, setDragging] = React.useState(false)

    const handleDragEnter: React.DragEventHandler<HTMLDivElement> = (ev) => {
        ev.preventDefault()
        ev.stopPropagation()

        if (ev.dataTransfer.items && ev.dataTransfer.items.length > 0) setDragging(true)
    }
    const handleDragLeave: React.DragEventHandler<HTMLDivElement> = (ev) => {
        ev.preventDefault()
        ev.stopPropagation()

        setDragging(false)
    }
    const handleDrop: React.DragEventHandler<HTMLDivElement> = (ev) => {
        ev.preventDefault()
        ev.stopPropagation()

        setDragging(false)
        if (ev.dataTransfer.files && ev.dataTransfer.files.length > 0) {
            props.setValue(ev.dataTransfer.files.item(ev.dataTransfer.files.length - 1))

            ev.dataTransfer.clearData()
        }
    }
    const handleDragOver: React.DragEventHandler<HTMLDivElement> = (ev) => {
        ev.preventDefault()
        ev.stopPropagation()
    }

    return (
        <Flex
            mt={1}
            justify="center"
            px={6}
            pt={5}
            pb={6}
            borderWidth={2}
            borderColor={'gray.500'}
            borderStyle="dashed"
            rounded="md"
            onDragEnter={handleDragEnter}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onDragOver={handleDragOver}
        >
            {dragging ? (
                <Stack spacing={1} textAlign="center">
                    <Flex fontSize="sm" color={'gray.400'} alignItems="center">
                        <chakra.label rounded="md" fontSize="md" color={'brand.200'} pos="relative">
                            <span>Drag it here</span>
                        </chakra.label>
                    </Flex>
                    <Text fontSize="xs" color={'gray.50'}>
                        MP4 or MOV File Only
                    </Text>
                </Stack>
            ) : props.value === null ? (
                <Stack spacing={1} textAlign="center">
                    <Flex fontSize="sm" color={'gray.400'} alignItems="center">
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
                                <input type="file" />
                            </VisuallyHidden>
                        </chakra.label>
                        <Text pl={1}>or drag and drop</Text>
                    </Flex>
                    <Text fontSize="xs" color={'gray.50'}>
                        MP4 or MOV File Only
                    </Text>
                </Stack>
            ) : (
                <Stack spacing={1} textAlign="center">
                    <Flex fontSize="sm" color={'gray.400'} alignItems="center">
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
                            <span>Upload successful</span>
                        </chakra.label>
                    </Flex>
                    <Text fontSize="xs" color={'gray.50'}>
                        {props.value.name}
                    </Text>
                </Stack>
            )}
        </Flex>
    )
}
