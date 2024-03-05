export enum Role {
  Provider = 'provider',
  Consumer = 'consumer',
}

export enum membership {
  Platinum = 'platinum',
  Gold = 'gold',
  Silver = 'silver',
  Bronze = 'bronze',
}

export class User {
  id: string;

  username: string;

  email: string;

  password: string;

  role?: Role;

  membership?: membership;

  createdAt: Date;

  updatedAt: Date;
}
