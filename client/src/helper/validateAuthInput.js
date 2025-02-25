export const validateInput = ({ email, password }) => {
    const errors = {};
    if(!email.trim().toLowerCase() || !password.trim()) errors.missingFields = "Missing fields";
    if(!/\S+@\S+\.\S+/.test(email.trim())) errors.email = "Invalid Email";
    if(password.length < 8) errors.password = "Invalid Password";
    return errors;
}