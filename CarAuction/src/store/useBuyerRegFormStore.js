
import { create } from 'zustand';

const initialFormData = {
    firstName: '', lastName: '', email: '', mobile: '', password: '', confirmPassword: '',
    isEmailVerified: false,
    dob: '', nationality: '', country: '', emirate: '', city: '', address: '', pincode: '', buyerType: '', companyName: '', registrationNumber: '', vatNumber: '',
    identityDocType: '', addressDocType: '',
    frontImage: null, backImage: null, selfieImage: null,
    documentFile: null, landlordIdFile: null,
    paymentMethod: '',
    termsAccepted: false,
};

const TOTAL_STEPS = 6;

const useBuyerRegFormStore = create((set) => ({
    currentStep: 1,
    formData: { ...initialFormData },

    setField: (key, value) =>
        set((state) => ({ formData: { ...state.formData, [key]: value } })),

    nextStep: () => set((state) => ({ currentStep: Math.min(TOTAL_STEPS, state.currentStep + 1) })),
    prevStep: () => set((state) => ({ currentStep: Math.max(1, state.currentStep - 1) })),
    goToStep: (step) => set({ currentStep: Math.min(TOTAL_STEPS, Math.max(1, step)) }),

    reset: () => set({ currentStep: 1, formData: { ...initialFormData } }),
}));

export default useBuyerRegFormStore;