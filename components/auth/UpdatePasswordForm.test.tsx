import { render, screen } from '@testing-library/react'
import { expect, test, vi } from 'vitest'
import UpdatePasswordForm from './UpdatePasswordForm'

// Mock server action
vi.mock('@/app/login/actions', () => ({
    updatePassword: vi.fn(),
    resetPassword: vi.fn(),
    login: vi.fn(),
    signup: vi.fn(),
    logout: vi.fn()
}))

test('UpdatePasswordForm renders password inputs and button', () => {
    render(<UpdatePasswordForm />)

    const passwordInput = screen.getByLabelText(/^new password:/i)
    const confirmInput = screen.getByLabelText(/^confirm password:/i)
    const button = screen.getByRole('button', { name: /update password/i })

    expect(passwordInput).toBeDefined()
    expect(confirmInput).toBeDefined()
    expect(button).toBeDefined()
})
