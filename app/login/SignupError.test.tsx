import { render, screen } from '@testing-library/react'
import { expect, test, vi } from 'vitest'
import AuthForm from '../../components/auth/AuthForm'

// Mock actions
vi.mock('@/app/login/actions', () => ({
    login: vi.fn(),
    signup: vi.fn()
}))

test('AuthForm displays error message when provided', () => {
    render(<AuthForm message="User already registered" />)

    const errorMsg = screen.getByText(/User already registered/i)
    expect(errorMsg).toBeDefined()
})
