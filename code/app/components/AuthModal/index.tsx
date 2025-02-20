import { useAuth } from '@/app/hooks/Auth/isLogged';
import AuthService from '@/app/utils/services/Auth';
import { Eye, EyeOff, Github, Lock, Mail, Phone, Twitter, User, X } from 'lucide-react';
import { useState } from 'react';

const AuthModal = ({ isOpen, onClose }: any) => {
    const [isLogin, setIsLogin] = useState(true);
    const { isLoggedIn, user, login, logout } = useAuth();
    const [showPassword, setShowPassword] = useState(false);
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        name: '',
        phoneNumber: '',
        passwordConfirmation: ''
    });

    if (!isOpen) return null;

    const handleSubmit = async (e: any) => {
        e.preventDefault();
        if (isLogin) {
            await handleLogin(formData);
        } else {
            await handleRegister(formData);
        }
    };

    const handleLogin = async (formData: any) => {
        try {
            const auth = await AuthService.login(formData);
            login({
                email: auth.email,
                name: auth.name,
                phoneNumber: auth.phoneNumber,
            },
                auth.accessToken
            );

            if (!auth) {
                console.log('Auth error');
                return;
            }
            localStorage.setItem('token', auth.accessToken);
            delete auth.accessToken;
            localStorage.setItem('user', JSON.stringify(auth));
        } catch (error: any) {
            console.error('Login error:', error.message);
        }
    }

    const handleRegister = async (formData: any) => {
        try {
            if (formData.password !== formData.passwordConfirmation) {
                console.log('Senhas Não são iguais');
                return;
            }
            delete formData.passwordConfirmation;
            const auth = await AuthService.register(formData);
            if (!auth) {
                console.log('Auth error');
                return;
            }
        } catch (error: any) {
            console.error('Login error:', error.message);
        }
    }

    const handleInputChange = (e: any) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    return (
        <div className="fixed inset-0 z-50 overflow-y-auto">
            <div
                className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm transition-opacity"
                onClick={onClose}
            />

            <div className="flex min-h-screen items-center justify-center p-4">
                <div className="relative w-full max-w-xl bg-white rounded-2xl shadow-2xl transform transition-all">
                    <button
                        onClick={onClose}
                        className="absolute right-4 top-4 text-gray-400 hover:text-gray-600 transition-colors"
                    >
                        <X className="w-6 h-6" />
                    </button>

                    <div className="p-8">
                        <div className="text-center mb-8">
                            <h2 className="text-3xl text-gray-800 font-bold mb-2">
                                {isLogin ? 'Bem-Vindo de Volta' : 'Criar Conta'}
                            </h2>
                            <p className="text-gray-600">
                                {isLogin
                                    ? 'Please enter your details to sign in'
                                    : 'Enter your details to get started'
                                }
                            </p>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-6">
                            {!isLogin && (
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-gray-700">Full Name</label>
                                    <div className="relative">
                                        <input
                                            type="text"
                                            name="name"
                                            value={formData.name}
                                            onChange={handleInputChange}
                                            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-600 focus:border-transparent pl-10 transition-all duration-300"
                                            placeholder="Enter your full name"
                                        />
                                        <User className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                                    </div>
                                </div>
                            )}

                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-700">Email</label>
                                <div className="relative">
                                    <input
                                        type="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleInputChange}
                                        className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-600 focus:border-transparent pl-10 transition-all duration-300"
                                        placeholder="Enter your email"
                                    />
                                    <Mail className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                                </div>
                            </div>
                            {!isLogin && (
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-gray-700">Telefone</label>
                                    <div className="relative">
                                        <input
                                            type="text"
                                            name="phoneNumber"
                                            value={formData.phoneNumber}
                                            onChange={handleInputChange}
                                            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-600 focus:border-transparent pl-10 transition-all duration-300"
                                            placeholder="Digite seu Número de Telefone"
                                        />
                                        <Phone className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                                    </div>
                                </div>
                            )}

                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-700">Senha</label>
                                <div className="relative">
                                    <input
                                        type={showPassword ? 'text' : 'password'}
                                        name="password"
                                        value={formData.password}
                                        onChange={handleInputChange}
                                        className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-600 focus:border-transparent pl-10 pr-10 transition-all duration-300"
                                        placeholder="insira uma senha"
                                    />
                                    <Lock className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                    >
                                        {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                    </button>
                                </div>
                            </div>
                            {!isLogin && (
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-gray-700">Confirmar Senha</label>
                                    <div className="relative">
                                        <input
                                            type={showPassword ? 'text' : 'password'}
                                            name="passwordConfirmation"
                                            value={formData.passwordConfirmation}
                                            onChange={handleInputChange}
                                            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-600 focus:border-transparent pl-10 pr-10 transition-all duration-300"
                                            placeholder="Confirme sua Senha"
                                        />
                                        <Lock className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                                        <button
                                            type="button"
                                            onClick={() => setShowPassword(!showPassword)}
                                            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                        >
                                            {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                        </button>
                                    </div>
                                </div>
                            )}

                            {isLogin && (
                                <div className="flex items-center justify-between text-sm">
                                    <label className="flex items-center">
                                        <input type="checkbox" className="rounded border-gray-300 text-blue-600 focus:ring-blue-600" />
                                        <span className="ml-2 text-gray-600">Remember me</span>
                                    </label>
                                    <a href="#" className="text-blue-600 hover:text-blue-700 font-medium">
                                        Forgot password?
                                    </a>
                                </div>
                            )}

                            <button
                                type="submit"
                                className="w-full bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors duration-300"
                            >
                                {isLogin ? 'Sign In' : 'Create Account'}
                            </button>
                        </form>

                        {/* Divider */}
                        <div className="my-8 flex items-center">
                            <div className="flex-grow border-t border-gray-300"></div>
                            <span className="px-4 text-gray-500 text-sm">OR</span>
                            <div className="flex-grow border-t border-gray-300"></div>
                        </div>

                        {/* Social Login */}
                        <div className="space-y-4">
                            {[
                                { icon: Github, text: 'Continue with Github' },
                                { icon: Twitter, text: 'Continue with Twitter' }
                            ].map((social, index) => (
                                <button
                                    key={index}
                                    className="w-full flex items-center justify-center px-4 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors duration-300"
                                >
                                    <social.icon className="w-5 h-5 mr-3" />
                                    {social.text}
                                </button>
                            ))}
                        </div>

                        {/* Toggle Login/Signup */}
                        <p className="mt-8 text-center text-gray-600">
                            {isLogin ? "Don't have an account? " : "Already have an account? "}
                            <button
                                onClick={() => setIsLogin(!isLogin)}
                                className="text-blue-600 hover:text-blue-700 font-medium"
                            >
                                {isLogin ? 'Sign up' : 'Sign in'}
                            </button>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AuthModal;