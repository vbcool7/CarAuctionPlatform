
export const formatLabel = (value) => {
    if (value === null || value === undefined || value === "") {
        return "N/A";
    }

    return String(value)
        .replace(/_/g, " ")
        .replace(/-/g, " ")
        .replace(/\s+/g, " ")
        .trim()
        .replace(/\b\w/g, (char) => char.toUpperCase());
};