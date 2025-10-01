import { bcryptAdapter, envs, JwtAdapter } from "../../config";
import { UserModel } from "../../data";
import { CustomError, UserEntity, RegisterUserDto, LoginUserDto } from "../../domain";
import { EmailService } from "./email.service";


export class AuthService {

    constructor(
        private readonly emailService: EmailService,
    ) { }

    public async registerUser(registerUserDto: RegisterUserDto) {
        const existsUser = await UserModel.findOne({ email: registerUserDto.email });
        if (existsUser) throw CustomError.badRequest('Email already exists');

        try {
            const user = new UserModel(registerUserDto);

            // Encriptar la contraseña
            user.password = bcryptAdapter.hash(registerUserDto.password);

            await user.save();

            // Email de confirmación
            await this.sendEmailValidationLink(user.email);

            // Quitamos el password y nos quedamos con el resto
            const { password, ...userEntity } = UserEntity.fromObject(user);

            const token = await JwtAdapter.generateToken({ id: user.id, email: user.email }, 60 * 60 * 2);
            if (!token) throw CustomError.internalServer('Error while creating JWT');

            return {
                user: userEntity,
                token: token,
            };
        } catch (error) {
            throw CustomError.internalServer(`${error}`);
        }
    }

    public async loginUser(loginUserDto: LoginUserDto) {

        const user = await UserModel.findOne({ email: loginUserDto.email });
        if (!user) throw CustomError.badRequest('Email not exist')
        const isMatching = bcryptAdapter.comapre(loginUserDto.password, user.password);

        if (!isMatching) throw CustomError.badRequest('Password is not valid');
        const { password, ...userEntity } = UserEntity.fromObject(user);

        const token = await JwtAdapter.generateToken({ id: user.id, email: user.email }, 60 * 60 * 2);
        if (!token) throw CustomError.internalServer('Error while creating JWT');

        return {
            user: userEntity,
            token: token,
        };
    }

    private sendEmailValidationLink = async (email: string) => {
        const token = await JwtAdapter.generateToken({ email }, 60 * 15);
        if (!token) throw CustomError.internalServer('Error getting token');

        const link = `${envs.WEBSERVICE_URL}/auth/validate-email/${token}`;
        const html = `
        <h1>Validate your email</h1>
        <p>Click on the following link to validate your email</p>
        <a href="${link}">Validate your email: ${email}</a>
        `;
        const options = {
            to: email,
            subject: 'Validate your email',
            htmlBody: html,
        };
        const isSent = await this.emailService.sendEmail(options);

        if(!isSent) throw CustomError.internalServer('Error sending email');

        return true;
    }


    public validateEmail = async (token: string) => {

        const payload = await JwtAdapter.validateToken(token);
        if(!payload) throw CustomError.badRequest('Invalid token');

        const {email} = payload as {email: string}; // Como es tipo any se hace la conversion
        if(!email) throw CustomError.internalServer('Email not in token');

        const user = await UserModel.findOne({email});
        if(!user) throw CustomError.internalServer('Email not exist');

        user.emailValidated = true;
        await user.save();

        return true;


    }
}