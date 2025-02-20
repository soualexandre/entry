export const getInitials = (name: string): string => {
    if (!name) return "";

    const words = name.trim().split(" ");
    if (words.length === 1) {
        return words[0][0].toUpperCase();
    }

    return (words[0][0] + words[words.length - 1][0]).toUpperCase();
};



export function cn(...classes: (string | undefined)[]) {
    return classes.filter(Boolean).join(" ");
}
