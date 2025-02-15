import { browser } from '$app/environment';

class AuthService {
  private dispatchCookieChange() {
    if (browser) {
      document.dispatchEvent(new Event('cookie-change'));
    }
  }

  private getAuthToken(): string | null {
    if (!browser) return null;
    
    const cookies = document.cookie.split(';');
    const authCookie = cookies.find(cookie => 
      cookie.trim().startsWith('authToken=')
    );
    
    if (!authCookie) return null;
    
    return authCookie.split('=')[1];
  }

  getAccessToken(): string | null {
    return this.getAuthToken();
  }

  clearTokens() {
    if (!browser) return;
    
    document.cookie = 'authToken=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
    document.cookie = 'userRoles=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
    this.dispatchCookieChange();
  }

  isAuthenticated(): boolean {
    return !!this.getAuthToken();
  }

  getUserRoles(): string[] {
    if (!browser) return [];
    
    const cookies = document.cookie.split(';');
    const userRolesCookie = cookies.find(cookie => 
      cookie.trim().startsWith('userRoles=')
    );
    
    if (!userRolesCookie) return [];
    
    try {
      const rolesString = userRolesCookie.split('=')[1];
      return JSON.parse(decodeURIComponent(rolesString));
    } catch (e) {
      console.error('Error parsing user roles:', e);
      return [];
    }
  }
}

export const authService = new AuthService();