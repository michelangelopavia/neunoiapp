import { useQuery, useQueryClient } from '@tanstack/react-query';
import { neunoi } from '@/api/neunoiClient';

export function useAuth() {
    const queryClient = useQueryClient();

    const normalizeUserRoles = (u) => {
        if (!u) return null;
        let roles = u.roles;
        if (typeof roles === 'string') {
            try {
                roles = JSON.parse(roles);
            } catch (e) {
                roles = [roles];
            }
        }
        if (!Array.isArray(roles)) {
            roles = roles ? [roles] : [];
        }
        // Fallback to single 'role' if roles array is empty
        if (roles.length === 0 && u.role) {
            roles = [u.role];
        }
        return { ...u, roles };
    };

    const { data: user, isLoading, error, refetch } = useQuery({
        queryKey: ['auth_user'],
        queryFn: async () => {
            try {
                const token = localStorage.getItem('auth_token');
                if (!token) return null;
                const userData = await neunoi.auth.me();
                return normalizeUserRoles(userData);
            } catch (err) {
                console.error('Auth error:', err);
                return null;
            }
        },
        staleTime: 1000 * 60 * 5, // 5 minutes
        retry: false
    });

    const logout = () => {
        neunoi.auth.logout();
        queryClient.setQueryData(['auth_user'], null);
        queryClient.invalidateQueries();
    };

    return {
        user,
        isLoading,
        error,
        logout,
        refetch,
        isAuthenticated: !!user,
        isAdmin: user?.roles?.includes('admin') || user?.roles?.includes('super_admin') || user?.role === 'admin' || user?.role === 'super_admin',
        isSuperAdmin: user?.roles?.includes('super_admin') || user?.role === 'super_admin'
    };
}
