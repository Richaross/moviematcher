import { render, screen } from '@testing-library/react'
import { expect, test, vi } from 'vitest'
import ForgotPasswordForm from './ForgotPasswordForm'

// Mock server action
vi.mock('@/app/login/actions', () => ({
    resetPassword: vi.fn(),
    login: vi.fn(),
    signup: vi.fn(),
    logout: vi.fn()
}))

test('ForgotPasswordForm renders input and button', () => {
    render(<ForgotPasswordForm />)

    const input = screen.getByLabelText(/email/i)
    const button = screen.getByRole('button', { name: /send reset link/i })

    expect(input).toBeDefined()
    expect(button).toBeDefined()
})
