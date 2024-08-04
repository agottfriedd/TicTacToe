import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import User from 'App/Models/User'
import Hash from '@ioc:Adonis/Core/Hash'

export default class AuthController {
    public async login ({auth, request, response}: HttpContextContract){
        const {user, password} = request.only(['user', 'password'])

        try{
            const userModel = await User.query()
            .where ("username", user)
            .orWhere("email", user)
            .firstOrFail()

            const isPasswordCorrect = await Hash.verify(userModel.password, password);
            if (!isPasswordCorrect) {
                return response.badRequest({message: "Email, username o contraseña incorrectos"});
            }
            
            //Esto de abajo es para generar el token
            const token = await auth.use('api').generate(userModel)
            return response.json({token: token.token})
        } catch (error) {
            if (error.code === 'E_ROW_NOT_FOUND') {
                return response.badRequest({message: "Email, username o contraseña incorrectos"});
            }
            return response.badRequest ("Contacte a Sistemas")
        }
    }

    public async logout({ auth, response }: HttpContextContract) {
        await auth.use('api').revoke()
        return response.status(200).json({ message: 'Logout exitoso' })
    }
}
