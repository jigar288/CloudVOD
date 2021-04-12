import React from 'react'

export type AppRoute = { path: string; exact?: boolean; component?: React.ComponentType; authenticated?: boolean; dependent?: boolean }
