interface User {
    firstName: string,
    lastName: string,
    birthDate: Date,
    phone: string,
}

interface UserType {
    user: User
}
export default UserType;
export type {
    User
}