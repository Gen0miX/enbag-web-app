export class User {
  company: string
  constructor(public id:string, public firstName: string, public lastName: string,
              public email: string, public address: string, public postCode: string,
              public city: string, public phoneNumber: string, public location: string,
              public role: string) {
  }
}
