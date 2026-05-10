const Validators = {
    isValidEmail(email) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    },

    isNotEmpty(str) {
        return str && str.trim().length > 0;
    }
};
