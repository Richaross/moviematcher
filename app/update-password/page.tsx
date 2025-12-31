import UpdatePasswordForm from '@/components/auth/UpdatePasswordForm'

interface UpdatePasswordPageProps {
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}

export default async function UpdatePasswordPage({ searchParams }: UpdatePasswordPageProps) {
    const params = await searchParams
    const message = typeof params.message === 'string' ? params.message : undefined

    return <UpdatePasswordForm message={message} />
}
