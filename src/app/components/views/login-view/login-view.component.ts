import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';

@Component({
  selector: 'app-login-view',
  templateUrl: './login-view.component.html',
  styleUrls: ['./login-view.component.scss']
})
export class LoginViewComponent implements OnInit {

  public uidForm!: FormGroup; // The form for logging in to ABC

  constructor(private cookieService: CookieService, private router: Router) { }

  ngOnInit(): void {

    this.uidForm = new FormGroup({
      'uid': new FormControl(null, [
        Validators.required,
        Validators.minLength(6),
        Validators.maxLength(6),
        Validators.pattern(/[a-z]+[a-z]+[0-9]+[0-9]+[0-9]+[a-z0-9]/) // standard UID formatting
      ]),
    });

    this.checkLogin()
  };

  /**
   * @description Saving login information when information is entered then kicks you home
   * @returns {void}
   */
  public onLogin(): void {
    const userLogin = this.uidForm?.get('uid')?.value;
    if (userLogin && this.uidForm.valid) {
      this.cookieService.set('user', userLogin);
      this.router.navigateByUrl('home');
  }
}

/**
 * @description If cookie exists, automatically forward to home page
 * @returns {void}
 */
public checkLogin(): void {
  if (this.cookieService.check('user')) {
    this.router.navigateByUrl('home');
  }
}};
