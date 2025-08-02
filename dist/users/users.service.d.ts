import { Model } from 'mongoose';
import { User, UserDocument } from '../auth/schemas/user.schema';
import { CreateUserDto } from './dto/create-user.dto';
export declare class UsersService {
    private userModel;
    constructor(userModel: Model<UserDocument>);
    findAllUsers(): Promise<User[]>;
    createUser(createUserDto: CreateUserDto): Promise<User>;
}
