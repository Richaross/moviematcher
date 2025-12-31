import { render, screen, fireEvent } from '@testing-library/react'
import { expect, test, vi } from 'vitest'
import LogoutButton from './LogoutButton'

// Mock the server action
const mockLogout = vi.fn()

// Mock the submodule import to return our mock action
vi.mock('@/app/login/actions', () => ({
    logout: () => mockLogout()
}))

test('LogoutButton renders and calls logout action on click', () => {
    render(<LogoutButton />)

    const button = screen.getByRole('button', { name: /log out/i })
    expect(button).toBeDefined()

    fireEvent.click(button)
    expect(mockLogout).toHaveBeenCalled()
})
