import { cleanup } from '@testing-library/react'

describe('Basic Checks', () => {
    afterAll(cleanup)

    it('Sanity Check', () => {
        expect(true).toEqual(true)
    })
})
