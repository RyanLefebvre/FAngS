import { FormControl } from '@angular/forms';
import { ValidateEmail } from './email-validator';
import { ValidatePassword } from './password-validator';
import { getTextValidation } from './text-validator';

describe('Shared Validators', () => {
  let control: FormControl;

  describe('ValidateEmail', () => {
    it('should return null when email is null', () => {
      control = new FormControl(null);
      expect(ValidateEmail(control)).toBe(null);
    });

    it('should return { INVALID_EMAIL: true } when email is not a string', () => {
      const email = 1;
      control = new FormControl(email);
      expect(ValidateEmail(control)).toEqual({ INVALID_EMAIL: true });
    });

    it('should return { INVALID_EMAIL: true } when email has an invalid length', () => {
      let email = 'test@';
      for (let i = 0; i < 255; i++) {
        email += 'e';
      }
      control = new FormControl(email);
      expect(ValidateEmail(control)).toEqual({ INVALID_EMAIL: true });
    });

    it('should return { INVALID_EMAIL: true } when email does not contain an "@" symbol', () => {
      const email = 'testexample.com';
      control = new FormControl(email);
      expect(ValidateEmail(control)).toEqual({ INVALID_EMAIL: true });
    });

    it('should return { INVALID_EMAIL: true } when email contains whitespace', () => {
      const email = 'test@ examplel.com';
      control = new FormControl(email);
      expect(ValidateEmail(control)).toEqual({ INVALID_EMAIL: true });
    });

    it('should return null when the email is valid ( less than 256 characters, inclues and @ symbol and does not have whitespace', () => {
      const email = 'test@example.com';
      control = new FormControl(email);
      expect(ValidateEmail(control)).toBe(null);
    });
  });

  describe('ValidatePassword', () => {
    it('should return { invalidPassword: true } when password is null', () => {
      control = new FormControl(null);
      expect(ValidatePassword(control)).toEqual({ invalidPassword: true });
    });

    it('should return { invalidPassword: true } if the trimmed password is an empty string "" ', () => {
      const password = '  ';
      control = new FormControl(password);
      expect(ValidatePassword(control)).toEqual({ invalidPassword: true });
    });

    it('should return { invalidPassword: true } if password is an invalid length', () => {
      const password = 'pass';
      control = new FormControl(password);
      expect(ValidatePassword(control)).toEqual({ invalidPassword: true });
    });

    it('should return { invalidPassword: true } if password contains whitespace', () => {
      const password = 'bad password';
      control = new FormControl(password);
      expect(ValidatePassword(control)).toEqual({ invalidPassword: true });
    });

    it('should return  { invalidPassword: true } if password does not contain a number', () => {
      const password = 'alongpasswordwithoutanumber';
      control = new FormControl(password);
      expect(ValidatePassword(control)).toEqual({ invalidPassword: true });
    });

    it('should return null if password is valid', () => {
      const password = 'avalidpassword69';
      control = new FormControl(password);
      expect(ValidatePassword(control)).toBe(null);
    });
  });

  describe('ValidateUsername', () => {
    it('should return null when username is null', () => {
      control = new FormControl(null);
      expect(getTextValidation()(control)).toBe(null);
    });
    it('should return { usernameInvalid : true } when username is not a string', () => {
      const username = 1;
      control = new FormControl(username);
      expect(getTextValidation()(control)).toEqual({ INVALID_TEXT: true });
    });
    it('should return { usernameInvalid : true } when username has an invalid length', () => {
      let username = 'user';
      for (let i = 0; i < 25; i++) {
        username += 'er';
      }
      control = new FormControl(username);
      expect(getTextValidation()(control)).toEqual({ INVALID_TEXT: true });
    });
    it('should return null when the username is valid', () => {
      const username = 'username';
      control = new FormControl(username);
      expect(getTextValidation()(control)).toBe(null);
    });
  });
});
