import { logout } from '@/app/login/actions'
import { useMovieStore } from '@/store/useMovieStore'

export default function LogoutButton() {
    return (
        <button
            onClick={() => {
                useMovieStore.getState().resetStore();
                logout();
            }}
            className="bg-neutral-800 hover:bg-neutral-700 text-neutral-300 text-sm font-medium py-2 px-4 rounded transition-colors"
        >
            Log out
        </button>
    )
}
