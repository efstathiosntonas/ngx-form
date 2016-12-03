export class User {
  constructor(public email: string, public password: string, public currentPassword?: string, public newPassword?: string) {
  }
}
