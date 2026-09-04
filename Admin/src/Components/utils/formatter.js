
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

export const formatPrice = (price) => {
    if (price === null || price === undefined || price === "") {
        return "—";
    }

    return new Intl.NumberFormat("en-AE", {
        style: "currency",
        currency: "AED",
        maximumFractionDigits: 0,
    }).format(price);
};

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