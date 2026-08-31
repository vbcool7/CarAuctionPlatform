
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
export const formatDateTime = (date, time) => {
    if (!date) return "----";

    const formattedDate = new Date(date);

    if (isNaN(formattedDate.getTime())) return "----";

    const datePart = formattedDate.toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
        timeZone: "UTC",
    });

    return time
        ? `${datePart}, ${time}`
        : datePart;
};