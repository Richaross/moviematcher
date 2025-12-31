export const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]).{6,}$/;

export type ValidationResult = {
    emailsMatch: boolean;
    passwordsMatch: boolean;
    passwordValid: boolean;
    isFormValid: boolean;
};

export function validateSignupInput(
    email: string,
    confirmEmail: string,
    password: string,
    confirmPassword: string
): ValidationResult {
    const emailsMatch = email.length > 0 && confirmEmail.length > 0 && email === confirmEmail;
    const passwordsMatch = password.length > 0 && confirmPassword.length > 0 && password === confirmPassword;
    const passwordValid = passwordRegex.test(password);

    return {
        emailsMatch,
        passwordsMatch,
        passwordValid,
        isFormValid: emailsMatch && passwordsMatch && passwordValid
    };
}
