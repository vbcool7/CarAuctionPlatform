
export function buildFormData(formData) {
    const fd = new FormData();

    const fieldMap = {
        frontImage: 'frontImageUrl',
        backImage: 'backImageUrl',
        selfieImage: 'selfieImageUrl',
        documentFile: 'documentUrl',
        landlordIdFile: 'landlordIdUrl',
    };

    Object.entries(formData).forEach(([key, value]) => {
        if (value === null || value === undefined) return;
        const targetKey = fieldMap[key] || key;
        fd.append(targetKey, value);
    });

    return fd;
}