import React from 'react'

export type UploadFileProps = {
    value: File | null
    setValue: React.Dispatch<React.SetStateAction<File | null>>
}
