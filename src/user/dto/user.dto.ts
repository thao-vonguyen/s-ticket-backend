export enum Gender {
    MALE = 'male',
    FEMALE = 'female',
    OTHER = 'other',
}

export enum UserRole {
    USER = 'User',
    ADMIN = 'Admin'
}

// dto/validate-email.dto.ts
export class ValidateEmailDto {
    email: string;
}
