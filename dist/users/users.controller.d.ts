import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
export declare class UsersController {
    private usersService;
    constructor(usersService: UsersService);
    getUsers(): Promise<import("../auth/schemas/user.schema").User[]>;
    createUser(createUserDto: CreateUserDto): Promise<import("../auth/schemas/user.schema").User>;
}
