import SignupForm from '@/components/auth/SignupForm'

export default function SignupPage({
    searchParams,
}: {
    searchParams: { message: string }
}) {
    return <SignupForm message={searchParams.message} />
}
