import { TokenService } from "./token.service";

/**
 * Khi logout từ component, cần dispatch action logout của Redux:
 * ```
 * import { logout } from '@/modules/auth/slice.auth';
 * dispatch(logout());
 * AuthService.logout();
 * ```
 */
export const AuthService = {
  logout: () => {
    TokenService.clear();
    window.location.href = "/dang-nhap";
  },
};
