export interface IUser {
    _id: string,
    name: string,
    email: string,
    password: string,
    mobile: string,
    createdAt?: Date,  // ? => means this field is optional. optinal chaining
    updateAt?: Date,
}

export interface RegisterBody {
    name: string,
    email: string,
    password: string,
    mobile: string
}

export interface LoginBody {
    email: string,
    password: string,
}

export interface JwtPayload {
    userId: string,
    email?: string
}