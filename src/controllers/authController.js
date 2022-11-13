const authService = require('../services/authService');
const tokenService = require('../services/tokenService');
const sendToken = require('../utils/sendToken');
const sendEmailService = require('../services/sendEmailService');
class AuthController {
    async login(req, res, next) {
        try {
            console.log(req.body)
            const user = await authService.login(req.body.email, req.body.password);
            const accessToken = tokenService.generateAuthToken(user);

            sendToken(user, accessToken, 200, res);

        } catch (error) {
            next(error);
        }
    }

    async register(req, res, next) {
        try {
            const { email, name, password, phone } = req.body;
            
            const token = await authService.register(email, name, phone, password);
            const content =  `
                <div>
                    <h3>If you have not requested this email, then ignore it</h3>
                    <h3>Click the link bellow to confirm your email</h3>
                    <a href="${req.protocol}://${req.get('host')}/api/v1/email/confirm/${token}">Confirm Email</a>
                </div>
            `;

            sendEmailService.sendEmail({
                email,
                subject: 'Confirm Your Email',
                message: content
            });
            
            res.status(200).json({
                success: true,
                message: `Email sent to: ${email}`,
                confirmEmailToken: token,
            });
  
        } catch (error) {
            next(error);
        }
    }

    async confirmEmail(req, res, next) {
        try {
            const user = await authService.verifyEmail(req.params.token);
            const accessToken = tokenService.generateAuthToken(user);

            sendToken(user, accessToken, 200, res);
        } catch (error) {
            next(error);
        }
    }

    async forgotPassword(req, res, next) {
        try {
            const { email } = req.body;
            const resetToken = await tokenService.generateResetPasswordToken(email);
            const content =  `
                <div>
                    <h3>If you have not requested this email, then ignore it</h3>
                    <h3>Click the link bellow to reset your password</h3>
                    <a href="${req.protocol}://${req.get('host')}/api/v1/password/reset/${resetToken}">Rest password</a>
                </div>
            `;
           
            sendEmailService.sendEmail({
                email,
                subject: '5Job password recovery',
                message: content
            });
        
            res.status(200).json({
                success: true,
                message: `Email sent to: ${email}`,
                resetPasswordToken: resetToken
            });
        } catch (error) {
            next(error);
        }
    }

    async resetPassowrd(req, res, next) {
        try {
            const user = await authService.resetPassword(
                req.params.token,
                req.body.password,
                req.body.confirmPassword
            );
    
            const accessToken = tokenService.generateAuthToken(user);
    
            sendToken(user, accessToken, 200, res);
        } catch (error) {
            next(error);
        }
    }

    logout(req, res) {
        res.cookie('token', null, {
            httpOnly: true
        });
    
        res.status(200).json({
            success: true,
            message: 'Logged out'
        });
    }
}

module.exports = new AuthController;