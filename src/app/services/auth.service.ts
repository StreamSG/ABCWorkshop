import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { tap } from 'rxjs/operators';

/**
 * Auth service for managing user login/logout and storing JWT token.
 * @class
 */
@Injectable({
  providedIn: 'root',
})
export class AuthService {
  /**
   * @constructor
   * @param {HttpClient} http - The injected HttpClient.
   */
  constructor(private http: HttpClient) {}

  /**
   * Login the user and store the JWT token.
   * @param {string} username - The username of the user.
   * @param {string} password - The password of the user.
   * @returns An Observable resulting from the HttpClient request.
   */
  login(username: string, password: string) {
    return this.http.post<{ access_token: string }>('/api/login', {username, password})
      .pipe(tap(res => {
        localStorage.setItem('access_token', res.access_token);
      }));
  }

  /**
   * Logout the user and remove the JWT token from local storage.
   */
  logout() {
    localStorage.removeItem('access_token');
  }

  /**
   * Check if the user is logged in.
   * @returns A boolean indicating if the user is logged in.
   */
  public get loggedIn(): boolean {
    return localStorage.getItem('access_token') !==  null;
  }
}
