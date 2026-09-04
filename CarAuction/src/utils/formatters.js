
// label formatter
export const formatLabel = (value) => {
    if (value === null || value === undefined || value === "") {
        return "-";
    }

    return value
        .replace(/_/g, " ")
        .replace(/\b\w/g, (char) => char.toUpperCase());
};

// price formatter
export const formatPrice = (value) => {
    if (value === null || value === undefined || value === "") {
        return "----";
    }

    return `AED ${Number(value).toLocaleString("en-AE")}`;
};

// date/time formatter
export const formatDateTime = (date) => {
    if (!date) return '—';

    return new Date(date).toLocaleString('en-AE', {
        timeZone: 'Asia/Dubai',
        day: '2-digit',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        hour12: true,
    });
};