import { useAuth } from "../../hooks/Auth/isLogged";
import AuthService from "../../utils/services/Auth";
import { showToast } from "../../utils/toast/toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Eye, EyeOff, User, Mail, Phone, Lock } from "lucide-react";
import { useState } from "react";

const AuthModal = ({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) => {
    const [isLogin, setIsLogin] = useState(true);
    const { login } = useAuth();
    const [showPassword, setShowPassword] = useState(false);
    const [formData, setFormData] = useState({
        email: "",
        password: "",
        name: "",
        phoneNumber: "",
        passwordConfirmation: "",
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        isLogin ? await handleLogin() : await handleRegister();
    };

    const handleLogin = async () => {
        try {
            const auth = await AuthService.login(formData);
            if (!auth) throw new Error("Erro ao realizar o login");

            login({ email: auth.email, name: auth.name, phoneNumber: auth.phoneNumber }, auth.accessToken);
            localStorage.setItem("token", auth.accessToken);
            localStorage.setItem("user", JSON.stringify(auth));
            onClose();
        } catch (error: any) {
            showToast("Erro ao realizar o login, verifique suas credenciais", "error");
        }
    };

    const handleRegister = async () => {
        if (formData.password !== formData.passwordConfirmation) {
            showToast("As senhas não coincidem", "error");
            return;
        }
        try {
            const auth = await AuthService.register({ ...formData });
            if (!auth) throw new Error("Erro ao registrar");
            setIsLogin(true);
            showToast("Cadastro realizado com sucesso!", "success");
        } catch (error: any) {
            showToast("Erro ao registrar", "error");
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[425px] bg-white dark:bg-gray-900 rounded-lg shadow-lg">
                <div className="flex flex-col gap-4 p-6">
                    <DialogHeader>
                        <DialogTitle className="text-xl font-bold text-center">{isLogin ? "Entrar" : "Criar Conta"}</DialogTitle>
                    </DialogHeader>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        {!isLogin && (
                            <Input
                                icon={<User className="w-5 h-5 text-gray-400" />}
                                name="name"
                                placeholder="Nome Completo"
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            />
                        )}
                        <Input
                            icon={<Mail className="w-5 h-5 text-gray-400" />}
                            type="email"
                            name="email"
                            placeholder="E-mail"
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        />
                        {!isLogin && (
                            <Input
                                icon={<Phone className="w-5 h-5 text-gray-400" />}
                                name="phoneNumber"
                                placeholder="Telefone"
                                value={formData.phoneNumber}
                                onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
                            />
                        )}
                        <Input
                            icon={<Lock className="w-5 h-5 text-gray-400" />}
                            type={showPassword ? "text" : "password"}
                            name="password"
                            placeholder="Senha"
                            value={formData.password}
                            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                            endIcon={
                                showPassword ? (
                                    <EyeOff className="w-5 h-5 cursor-pointer" onClick={() => setShowPassword(false)} />
                                ) : (
                                    <Eye className="w-5 h-5 cursor-pointer" onClick={() => setShowPassword(true)} />
                                )
                            }
                        />
                        {!isLogin && (
                            <Input
                                icon={<Lock className="w-5 h-5 text-gray-400" />}
                                type={showPassword ? "text" : "password"}
                                name="passwordConfirmation"
                                placeholder="Confirmar Senha"
                                value={formData.passwordConfirmation}
                                onChange={(e) => setFormData({ ...formData, passwordConfirmation: e.target.value })}
                            />
                        )}
                        <Button type="submit" className="w-full">
                            {isLogin ? "Entrar" : "Criar Conta"}
                        </Button>
                    </form>
                    <DialogFooter>
                        <p className="text-center text-sm">
                            {isLogin ? "Não tem conta? " : "Já tem uma conta? "}
                            <button className="text-blue-600 hover:underline" onClick={() => setIsLogin(!isLogin)}>
                                {isLogin ? "Cadastre-se" : "Entrar"}
                            </button>
                        </p>
                    </DialogFooter>
                </div>
            </DialogContent>
        </Dialog>
    );

};

export default AuthModal;
