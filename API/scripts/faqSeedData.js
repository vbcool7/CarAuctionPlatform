
// FAQs.jsx ka purana hardcoded data, jaisa tha waisa. Seed script isi ko DB me daalti hai.
// "All Categories" yahan nahi hai, wo frontend par fixed tab hai.
// Icon keys utils/faqIcons.js se match hone chahiye.
export const seedCategories = [
    {
        name: 'Bidding & Auctions',
        icon: 'gavel',
        faqs: [
            { q: 'How do I place a bid?', a: 'Go to the car listing and enter your amount in the bid box.' },
            { q: 'What is a proxy bid?', a: 'It allows the system to bid automatically up to your maximum limit.' },
            { q: 'Can I cancel a bid?', a: 'Bids are binding and cannot be canceled once placed.' },
            { q: 'How do I know if I won?', a: 'You will receive an email and notification in your dashboard.' },
            { q: 'What is the reserve price?', a: 'It is the minimum price the seller is willing to accept.' },
            { q: 'Are inspections allowed?', a: 'Yes, you can schedule an inspection before bidding.' },
        ],
    },
    {
        name: 'Payments & Fees',
        icon: 'credit-card',
        faqs: [
            { q: 'What are the payment methods?', a: 'We accept Credit/Debit cards, Bank Transfer, and Wire transfers.' },
            { q: 'Are there any hidden fees?', a: 'No, all fees are clearly listed in the invoice.' },
            { q: 'When is the payment due?', a: 'Payment must be cleared within 48 hours of winning the auction.' },
            { q: 'Can I pay in installments?', a: 'Currently, we do not offer installment plans.' },
            { q: 'Is VAT included?', a: 'VAT is calculated based on local regulations at checkout.' },
            { q: 'Is online payment secure?', a: 'Yes, we use encrypted payment gateways for security.' },
        ],
    },
    {
        name: 'Shipping & Pickup',
        icon: 'truck',
        faqs: [
            { q: 'How do I schedule pickup?', a: "Use the 'Schedule Pickup' button in your won items section." },
            { q: 'Do you offer international shipping?', a: 'Yes, we ship to major international ports.' },
            { q: 'What documents are needed for pickup?', a: 'Please bring your ID and the winning notification.' },
            { q: 'Can someone else pick up for me?', a: 'Yes, with a signed authorization letter from you.' },
            { q: 'What are the storage charges?', a: 'Storage fees apply after 7 days of non-pickup.' },
            { q: 'Is vehicle insurance included?', a: 'Transport insurance is optional during checkout.' },
        ],
    },
    {
        name: 'Account & Profile',
        icon: 'user',
        faqs: [
            { q: 'How do I reset my password?', a: "Click 'Forgot Password' on the login page." },
            { q: 'Can I change my email?', a: 'Yes, go to Account Settings > Profile.' },
            { q: 'How do I verify my account?', a: 'Upload your Emirates ID or Passport in the verification tab.' },
            { q: 'Is my data private?', a: 'We strictly adhere to data protection laws.' },
            { q: 'How to delete my account?', a: 'Contact support for permanent account closure.' },
            { q: 'Can I have multiple accounts?', a: 'No, one verified user per account.' },
        ],
    },
    {
        name: 'Returns & Refunds',
        icon: 'refresh',
        faqs: [
            { q: 'What is the return policy?', a: "All auction sales are 'as-is' and generally non-returnable." },
            { q: 'How do I request a refund?', a: 'Contact support if the car condition is misrepresented.' },
            { q: 'How long for a refund?', a: 'Refunds typically take 7-10 working days.' },
            { q: 'What if the car is damaged?', a: 'Report it immediately upon delivery with photos.' },
            { q: 'Are deposits refundable?', a: "Deposits are refundable if you haven't won any bid." },
            { q: 'Can I exchange a vehicle?', a: 'Exchanges are not supported in auction sales.' },
        ],
    },
    {
        name: 'Invoices & Documents',
        icon: 'file',
        faqs: [
            { q: 'Where can I download invoices?', a: "In your Dashboard under 'My Invoices'." },
            { q: 'How do I get the car registration?', a: 'We provide the ownership transfer documents post-payment.' },
            { q: 'Is the invoice tax-deductible?', a: 'Please consult your tax advisor.' },
            { q: 'Can I get a copy of the contract?', a: 'Contracts are available upon request.' },
            { q: 'Are documents digital?', a: 'Most are digital, but originals will be handed over.' },
            { q: 'How to correct invoice info?', a: 'Contact support before the final payment.' },
        ],
    },
    {
        name: 'Other Topics',
        icon: 'more',
        faqs: [
            { q: 'How to contact support?', a: 'Use Live Chat, email, or call our hotline.' },
            { q: 'Are you open on weekends?', a: 'Yes, we are open as per our contact page timings.' },
            { q: 'Do you have a mobile app?', a: 'Yes, available on iOS and Android stores.' },
            { q: 'How to become a partner?', a: "Visit the 'Partner with Us' page at the footer." },
            { q: 'Where is your office?', a: 'Our HQ is in Business Bay, Dubai.' },
            { q: 'How to report a bug?', a: "Use the 'Feedback' link in the footer." },
        ],
    },
];