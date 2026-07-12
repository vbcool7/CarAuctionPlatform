
import React from 'react';
import { Radio, TrendingDown, Clock, Trophy, XCircle, MessageSquare, Tag, CreditCard, ShieldCheck } from 'lucide-react';

export const categories = [
    { name: 'Sedan', image: 'https://images.hindustantimes.com/auto/auto-images/mg/rc6/exterior_mg-rc6_front-left-side_600x400.jpg?imwidth=640' },
    { name: 'SUV', image: 'https://stimg.cardekho.com/images/carexteriorimages/630x420/Tata/Sierra/12271/1765181428462/front-left-side-47.jpg?impolicy=resize&imwidth=360' },
    { name: 'Truck', image: 'https://5.imimg.com/data5/SELLER/Default/2024/8/444303282/EO/TR/EQ/3199782/car-carrier-trailer-500x500.jpg' },
    { name: 'Van', image: 'https://img.magnific.com/free-photo/blue-delivery-van-wet-highway-with-motion-blur-shipping-motion_169016-69815.jpg?semt=ais_hybrid&w=740&q=80' },
    { name: 'Luxury', image: 'https://cdn.pixabay.com/photo/2017/03/27/14/56/auto-2179220_1280.jpg' },
    { name: 'Electric', image: 'https://asset.autocarindia.com/static/models/colors/20260528_112849_33cf9aa0.jpg?w=640&q=75' },
    { name: 'Sports', image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQU4GG02EPc9WgEaj0VbPEyheMQ8TFfPAUNWQ&s' },
    { name: 'Motorcycle', image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQtL2PxqYbsojD04UtZPA_OoZczdsA8daQbgA&s' },
];

export const buyerProfile = {
    // Personal Information
    firstName: "John",
    lastName: "Doe",
    username: "johndoe_buyer",
    email: "john.doe@example.com",
    dateOfBirth: "15 / 08 / 1987",
    phone: "+971 50 123 4567",
    preferredLanguage: "English",
    nationality: "American",
    country: "United Arab Emirates",

    // Account Information
    accountType: "Buyer",
    memberSince: "10 May 2024",
    timezone: "(GMT +04:00) Dubai, UAE",

    // Buyer Type — "Individual" | "Dealer" | "Business"
    buyerType: "Dealer",

    // Business Info — only used when buyerType is "Dealer" or "Business"
    companyName: "Al Faris Auto Trading LLC",
    registrationNumber: "REG-2024-98231",
    vatNumber: "VAT-AE-100234567",

    // About You
    buyingInterests: ["SUV", "Sedan", "Luxury Cars", "Trucks"],
    preferredPriceRange: { min: 10000, max: 500000 },
    preferredBrands: ["BMW", "Mercedes-Benz", "Toyota"],
    preferredLocations: ["UAE", "Dubai", "Sharjah", "Abu Dhabi"],
    preferredFuelType: "All", // "All" | "Petrol" | "Diesel" | "Hybrid" | "Electric"
    receiveOffers: true,

    // Profile photo
    profileImage: null,

    // Profile Completion
    completionPercent: 80,
    completionItems: [
        { label: "Personal Information", done: true },
        { label: "Verify Email", done: true },
        { label: "Add Phone Number", done: true },
        { label: "Add Payment Method", done: true },
        { label: "Add Address", done: false },
    ],

    // Account Status
    isVerified: true,
    lastLogin: "May 20, 2024  10:30 AM GST",

    password: "John@123",
};


export const notificationSettings = [
    // ── Auction Notifications ──
    {
        id: 'live-auction-alerts',
        group: 'Auction Notifications',
        label: 'Live Auction Alerts',
        description: 'Get notified when a live auction is about to start.',
        channels: { email: true, push: true, sms: false, inApp: true },
        icon: <Radio size={16} className="text-[#D97706]" />,
    },
    {
        id: 'outbid-alerts',
        group: 'Auction Notifications',
        label: 'Outbid Alerts',
        description: 'Get notified when you are outbid on an auction.',
        channels: { email: true, push: true, sms: true, inApp: true },
        icon: <TrendingDown size={16} className="text-red-400" />
    },
    {
        id: 'auction-ending-soon',
        group: 'Auction Notifications',
        label: 'Auction Ending Soon',
        description: 'Get reminded when an auction you are watching is ending soon.',
        channels: { email: true, push: true, sms: false, inApp: true },
        icon: <Clock size={16} className="text-amber-400" />
    },
    {
        id: 'won-auction',
        group: 'Auction Notifications',
        label: 'Won Auction',
        description: 'Receive notifications when you win an auction.',
        channels: { email: true, push: true, sms: true, inApp: true },
        icon: <Trophy size={16} className="text-green-500" />
    },
    {
        id: 'lost-auction',
        group: 'Auction Notifications',
        label: 'Lost Auction',
        description: 'Receive notifications when you lose an auction.',
        channels: { email: false, push: true, sms: false, inApp: true },
        icon: <XCircle size={16} className="text-red-400" />
    },

    // ── Account & Activity Notifications ──
    {
        id: 'new-messages',
        group: 'Account & Activity Notifications',
        label: 'New Messages',
        description: 'Get notified when you receive a new message.',
        channels: { email: true, push: true, sms: false, inApp: true },
        icon: <MessageSquare size={16} className="text-blue-400" />
    },
    {
        id: 'offers-updates',
        group: 'Account & Activity Notifications',
        label: 'Offers & Updates',
        description: 'Receive updates about offers on your vehicles.',
        channels: { email: true, push: true, sms: false, inApp: true },
        icon: <Tag size={16} className="text-amber-400" />
    },
    {
        id: 'payments-invoices',
        group: 'Account & Activity Notifications',
        label: 'Payments & Invoices',
        description: 'Receive payment confirmations and invoice updates.',
        channels: { email: true, push: false, sms: true, inApp: true },
        icon: <CreditCard size={16} className="text-green-500" />
    },
    {
        id: 'account-security',
        group: 'Account & Activity Notifications',
        label: 'Account Security',
        description: 'Get important alerts about your account security.',
        channels: { email: true, push: true, sms: true, inApp: true },
        icon: <ShieldCheck size={16} className="text-[#D97706]" />,
    },
];

export const paymentMethods = [
    {
        id: 'pm-1',
        brand: 'visa',
        last4: '4242',
        holder: 'John Doe',
        expires: '08/27',
        isDefault: true,
        isVerified: true,
    },
    {
        id: 'pm-2',
        brand: 'mastercard',
        last4: '5555',
        holder: 'John Doe',
        expires: '11/26',
        isDefault: false,
        isVerified: true,
    },
    {
        id: 'pm-3',
        brand: 'amex',
        last4: '1005',
        holder: 'John Doe',
        expires: '03/26',
        isDefault: false,
        isVerified: true,
    },
    {
        id: 'pm-4',
        brand: 'bank',
        last4: '6789',
        holder: 'John Doe',
        expires: null,
        bankName: 'Wells Fargo Bank',
        isDefault: false,
        isVerified: true,
    },
];

export const paymentTransactions = [
    {
        id: 'txn-1',
        date: 'May 20, 2024',
        description: 'Auction Payment – Lot #245679',
        brand: 'visa',
        last4: '4242',
        amount: 120000,
        status: 'Completed',
    },
    {
        id: 'txn-2',
        date: 'May 15, 2024',
        description: 'Deposit Added',
        brand: 'mastercard',
        last4: '5555',
        amount: 50000,
        status: 'Completed',
    },
    {
        id: 'txn-3',
        date: 'May 10, 2024',
        description: 'Buyer Fee – Lot #245612',
        brand: 'amex',
        last4: '1005',
        amount: 1500,
        status: 'Completed',
    },
    {
        id: 'txn-4',
        date: 'May 05, 2024',
        description: 'Deposit Added',
        brand: 'bank',
        last4: '6789',
        amount: 25000,
        status: 'Completed',
    },
    {
        id: 'txn-5',
        date: 'Apr 28, 2024',
        description: 'Auction Payment – Lot #244955',
        brand: 'visa',
        last4: '4242',
        amount: 98000,
        status: 'Completed',
    },
];

export const addressBook = [
    {
        id: "addr_1",
        type: "Home",
        label: "Home Address",
        name: "John Doe",
        phone: "+971 50 123 4567",
        line1: "Villa 23, Al Wasl Road",
        line2: "Al Safa 2, Dubai",
        city: "Dubai",
        state: "",
        country: "United Arab Emirates",
        zip: "12345",
        isDefault: true,
    },
    {
        id: "addr_2",
        type: "Work",
        label: "Office Address",
        name: "John Doe",
        phone: "+971 50 123 4567",
        line1: "Office 501, Business Bay",
        line2: "P.O. Box 98765",
        city: "Dubai",
        state: "",
        country: "United Arab Emirates",
        zip: "98765",
        isDefault: false,
    },
    {
        id: "addr_3",
        type: "Shipping",
        label: "Shipping Warehouse",
        name: "John Doe",
        phone: "+971 50 123 4567",
        line1: "Warehouse No. 12, Jebel Ali Free Zone",
        line2: "P.O. Box 112233",
        city: "Dubai",
        state: "",
        country: "United Arab Emirates",
        zip: "112233",
        isDefault: false,
    },
    {
        id: "addr_4",
        type: "Billing",
        label: "Mailing Address",
        name: "John Doe",
        phone: "+971 50 123 4567",
        line1: "PO Box 234567",
        line2: "",
        city: "Dubai",
        state: "",
        country: "United Arab Emirates",
        zip: "234567",
        isDefault: false,
    },
    {
        id: "addr_5",
        type: "Other",
        label: "International Address",
        name: "John Doe",
        phone: "+1 415 123 4567",
        line1: "350 5th Avenue, Suite 501",
        line2: "",
        city: "New York",
        state: "NY",
        country: "United States of America",
        zip: "10118",
        isDefault: false,
    },
];

export const faqData = [
    {
        category: "Bidding & Auctions",
        questions: [
            { q: "How can I cancel my bid?", a: "Bidding is a binding contract. Once a bid is confirmed, it cannot be canceled to maintain security and fairness." },
            { q: "What does 'Reserve Price' mean?", a: "The reserve price is the minimum price the seller has decided to accept. If bidding does not reach this price, the item will not be sold." },
            { q: "How will I know if I have been outbid?", a: "You will be immediately informed via email and a dashboard notification." },
            { q: "What is proxy bidding?", a: "In proxy bidding, you set your maximum amount. The system automatically bids on your behalf until your maximum amount is reached." },
            { q: "What happens after the auction ends?", a: "The winning bidder receives an email notification within 24 hours with instructions to process the payment." },
            { q: "How will I know if I have been outbid?", a: "You will be immediately informed via email and a dashboard notification." },
        ]
    },
    {
        category: "Payments & Fees",
        questions: [
            { q: "Which payment methods are accepted?", a: "We accept Visa, Mastercard, and bank transfers." },
            { q: "Are my payment details safe?", a: "Yes, we use SSL encryption and PCI DSS compliant gateways; your card details are not stored by us." },
            { q: "Are there any hidden charges on payments?", a: "No, all applicable charges are clearly shown in the breakdown during the bidding process." },
            { q: "What is the time limit for payment?", a: "After winning an auction, you must complete the payment within 48 hours." },
            { q: "How can I download my invoice?", a: "You can download it from the 'My Orders' or 'Invoices' section by visiting your Profile." }
        ]
    },
    {
        category: "Shipping & Pickup",
        questions: [
            { q: "Can I pick up the item myself?", a: "Yes, you can pick up the item from the specified warehouse by scheduling an appointment." },
            { q: "How long does delivery take?", a: "Delivery typically takes 3-7 business days depending on the location." },
            { q: "How are shipping charges calculated?", a: "Charges depend on the item's weight, size, and the distance to your delivery address." },
            { q: "Can I change my shipping address?", a: "Yes, you can update your address in 'Profile Settings' before the item is shipped." },
            { q: "How will I get shipment tracking?", a: "You will receive a tracking ID via your registered email and mobile number as soon as the item is shipped." }
        ]
    },
    {
        category: "Account & Profile",
        questions: [
            { q: "How can I change my email address?", a: "You can update it in your Profile settings under 'Account Details'. An OTP will be required for verification." },
            { q: "Why is account verification necessary?", a: "KYC verification is required for a secure bidding experience and fraud prevention." },
            { q: "I forgot my password, what should I do?", a: "You can reset it via email by clicking 'Forgot Password' on the login page." },
            { q: "Can I deactivate my account?", a: "Yes, you can request to deactivate your account by contacting customer support." },
            { q: "Can I have more than one account?", a: "No, according to our policy, a user can only have one registered account." }
        ]
    },
    {
        category: "Returns & Refunds",
        questions: [
            { q: "What is your return policy?", a: "If an item does not match the description or is damaged, you can initiate a return within 7 days." },
            { q: "How long does it take to get a refund?", a: "It may take 5-10 working days for the refund to be processed and credited to your bank account." },
            { q: "Are shipping fees refundable?", a: "Shipping fees are only refunded in the case of a damaged or incorrect item." },
            { q: "What condition should the item be in for a return?", a: "The item must be in its original packaging with all tags attached." },
            { q: "How will I receive the refund?", a: "The refund will be transferred back to the original payment method (card or bank) used." }
        ]
    },
    {
        category: "Other Topics",
        questions: [
            { q: "Is a mobile app available?", a: "Yes, our app is available for download on both iOS and Android." },
            { q: "Can I provide feedback?", a: "Yes, you can provide feedback to the support team after every transaction." },
            { q: "How can I do bulk bidding for business?", a: "You can contact our 'Corporate Support' team for assistance with bulk bidding." },
            { q: "What happens during site maintenance?", a: "Bidding may be temporarily paused during scheduled maintenance, which will be notified in advance." },
            { q: "Where can I read the privacy policy?", a: "A link to the 'Privacy Policy' is always available in the website footer." }
        ]
    }
];

export const liveBids = [
    {
        id: 1,
        bidder: "John M.",
        amount: 245000,
        time: "2 min ago",
        isHighest: true,
    },
    {
        id: 2,
        bidder: "Ali Hassan",
        amount: 242500,
        time: "4 min ago",
        isHighest: false,
    },
    {
        id: 3,
        bidder: "Sarah K.",
        amount: 240000,
        time: "7 min ago",
        isHighest: false,
    },
    {
        id: 4,
        bidder: "Omar Farooq",
        amount: 237500,
        time: "9 min ago",
        isHighest: false,
    },
    {
        id: 5,
        bidder: "Michael D.",
        amount: 235000,
        time: "12 min ago",
        isHighest: false,
    },
    {
        id: 6,
        bidder: "Sarah K.",
        amount: 240000,
        time: "7 min ago",
        isHighest: false,
    },
    {
        id: 7,
        bidder: "Omar Farooq",
        amount: 237500,
        time: "9 min ago",
        isHighest: false,
    },
    {
        id: 8,
        bidder: "Michael D.",
        amount: 235000,
        time: "12 min ago",
        isHighest: false,
    },
    {
        id: 9,
        bidder: "Sarah K.",
        amount: 240000,
        time: "7 min ago",
        isHighest: false,
    },
    {
        id: 10,
        bidder: "Omar Farooq",
        amount: 237500,
        time: "9 min ago",
        isHighest: false,
    },
    {
        id: 11,
        bidder: "Michael D.",
        amount: 235000,
        time: "12 min ago",
        isHighest: false,
    }
];

export const vehicles = [
    // LIVE AUCTIONS
    {
        id: 1,
        name: "2021 Mercedes-Benz S-Class",
        model: "S 500 4MATIC",
        category: "Sedan",

        status: "live",
        wonStatus: "payment-pending",
        offerStatus: "active",
        paymentStatus: "payment-pending",

        bid: "AED 245,000",
        totalBids: 23,
        timer: "00:10:45",
        year: 2021,
        vehicleType: "Luxury Sedan",
        bodyStyle: "Sedan",
        engine: "3.0L Inline-6 Turbo",
        engineSize: "3.0L",
        cylinders: "6",
        transmission: "Automatic",
        fuelType: "Petrol",
        driveType: "AWD",
        color: "Black",
        damage: "Minor Front Bumper Scratch",
        location: "Dubai, UAE",
        source: "Insurance Auction",
        vin: "W1K6G6DB5MA123456",
        endTime: new Date(Date.now() + 10 * 60 * 60 * 1000 + 45 * 60 * 1000),
        image: "https://images.hindustantimes.com/auto/auto-images/mg/rc6/exterior_mg-rc6_front-left-side_600x400.jpg?imwidth=640",
        images: [
            "https://images.hindustantimes.com/auto/auto-images/mg/rc6/exterior_mg-rc6_front-left-side_600x400.jpg?imwidth=640",
            "https://stimg.cardekho.com/images/carexteriorimages/630x420/Tata/Sierra/12271/1765181428462/front-left-side-47.jpg?impolicy=resize&imwidth=360",
            "https://5.imimg.com/data5/SELLER/Default/2024/8/444303282/EO/TR/EQ/3199782/car-carrier-trailer-500x500.jpg",
            "https://images.unsplash.com/photo-1542362567-b07e54358753?auto=format&fit=crop&q=80&w=600",
        ],
    },

    {
        id: 2,
        name: "2020 Range Rover Sport",
        model: "HSE Dynamic",
        year: 2020,
        category: "SUV",
        vehicleType: "Luxury SUV",
        bodyStyle: "SUV",

        status: "live",
        wonStatus: "payment-completed",
        offerStatus: "accepted",
        paymentStatus: "payment-completed",

        bid: "AED 185,500",
        totalBids: 18,
        timer: "00:15:30",
        mileage: "28,750 km",
        odometer: "28,750 km",
        engine: "V6 Supercharged",
        engineSize: "3.0L",
        cylinders: "6",
        transmission: "Automatic",
        fuelType: "Petrol",
        driveType: "AWD",
        color: "Fuji White",
        damage: "No Reported Damage",
        location: "Abu Dhabi, UAE",
        source: "Dealer Auction",
        sellerType: "Dealer",
        vin: "SALWR2RV5LA123456",
        endTime: new Date(Date.now() + 10 * 60 * 60 * 1000 + 45 * 60 * 1000),
        image: "https://stimg.cardekho.com/images/carexteriorimages/630x420/Tata/Sierra/12271/1765181428462/front-left-side-47.jpg?impolicy=resize&imwidth=360",
        images: [
            "https://stimg.cardekho.com/images/carexteriorimages/630x420/Tata/Sierra/12271/1765181428462/front-left-side-47.jpg?impolicy=resize&imwidth=360",
            "https://stimg.cardekho.com/images/carexteriorimages/630x420/Tata/Sierra/12271/1765181428462/front-left-side-47.jpg?impolicy=resize&imwidth=360",
            "https://5.imimg.com/data5/SELLER/Default/2024/8/444303282/EO/TR/EQ/3199782/car-carrier-trailer-500x500.jpg",
            "https://images.unsplash.com/photo-1542362567-b07e54358753?auto=format&fit=crop&q=80&w=600",
        ],
    },

    {
        id: 3,
        name: "2019 Ford Mustang GT",
        model: "5.0L V8",
        year: 2019,
        category: "Sports",
        vehicleType: "Sports Coupe",
        bodyStyle: "Coupe",

        status: "live",
        wonStatus: "ready-for-pickup",
        offerStatus: "rejected",
        paymentStatus: "refunded",

        bid: "AED 78,000",
        totalBids: 31,
        timer: "00:20:15",
        mileage: "42,300 km",
        odometer: "42,300 km",
        engine: "Naturally Aspirated V8",
        engineSize: "5.0L",
        cylinders: "8",
        transmission: "Automatic",
        fuelType: "Petrol",
        driveType: "RWD",
        color: "Race Red",
        damage: "Minor Rear Bumper Scratch",
        location: "Dubai, UAE",
        source: "Private Seller",
        sellerType: "Private Seller",
        vin: "1FA6P8CF6K5123456",
        endTime: new Date(Date.now() + 10 * 60 * 60 * 1000 + 45 * 60 * 1000),
        image: "https://5.imimg.com/data5/SELLER/Default/2024/8/444303282/EO/TR/EQ/3199782/car-carrier-trailer-500x500.jpg",
        images: [
            "https://5.imimg.com/data5/SELLER/Default/2024/8/444303282/EO/TR/EQ/3199782/car-carrier-trailer-500x500.jpg",
            "https://stimg.cardekho.com/images/carexteriorimages/630x420/Tata/Sierra/12271/1765181428462/front-left-side-47.jpg?impolicy=resize&imwidth=360",
            "https://5.imimg.com/data5/SELLER/Default/2024/8/444303282/EO/TR/EQ/3199782/car-carrier-trailer-500x500.jpg",
            "https://images.unsplash.com/photo-1542362567-b07e54358753?auto=format&fit=crop&q=80&w=600",
        ],

    },
    {
        id: 4,
        name: "2022 Audi Q7",
        model: "55 TFSI Quattro",
        year: 2022,
        category: "SUV",
        vehicleType: "Luxury SUV",
        bodyStyle: "SUV",

        status: "live",
        offerStatus: "expired",
        paymentStatus: "payment-pending",

        bid: "AED 165,000",
        totalBids: 16,
        timer: "00:25:50",
        mileage: "18,900 km",
        odometer: "18,900 km",
        engine: "Turbocharged V6",
        engineSize: "3.0L",
        cylinders: "6",
        transmission: "Automatic",
        fuelType: "Petrol",
        driveType: "AWD",
        color: "Daytona Gray",
        location: "Sharjah, UAE",
        source: "Dealer Auction",
        sellerType: "Dealer",
        vin: "WA1VXAF77ND123456",
        endTime: new Date(Date.now() + 10 * 60 * 60 * 1000 + 45 * 60 * 1000),
        damageReport: [
            { area: "Front Bumper", severity: "minor", description: "Small scratches on the lower left corner due to parking." },
            { area: "Rear Passenger Door", severity: "major", description: "Deep dent visible near the door handle; requires professional body work." },
            { area: "Roof", severity: "minor", description: "Faded paint patch near the sunroof area." }
        ],
        maintenanceHistory: [
            { service: "Full Service Inspection", date: "Jan 15, 2026", mileageAtService: 18500, notes: "Oil change, filter replacement, and brake pad check." },
            { service: "Tire Rotation", date: "Nov 02, 2025", mileageAtService: 12000, notes: "All-season tires rotated and balanced." },
            { service: "General Maintenance", date: "May 20, 2025", mileageAtService: 5000, notes: "Complimentary first service by dealer." }
        ],
        inspectionNotes: [
            { title: "Engine Performance", description: "Smooth acceleration, no abnormal noises.", status: "pass" },
            { title: "Brake System", description: "Pads at 70% life, rotors in good condition.", status: "pass" },
            { title: "Tire Condition", description: "Rear tires show minor wear.", status: "warning" },
            { title: "Electrical System", description: "Dashboard warning light persists.", status: "fail" }
        ],
        exteriorRating: 8,
        interiorRating: 9.0,
        mechanicalRating: 3,
        bidHistory: [
            {
                bidder: "Ali Rashid",
                amount: 248000,
                time: "2 mins ago",
            },
            {
                bidder: "Omar Khan",
                amount: 245000,
                time: "5 mins ago",
            },
            {
                bidder: "Ahmed Noor",
                amount: 242000,
                time: "8 mins ago",
            },
            {
                bidder: "Sarah Malik",
                amount: 240000,
                time: "11 mins ago",
            },
        ],
        documents: [
            {
                name: "Vehicle Registration",
                type: "PDF",
                size: "2.4 MB",
            },
            {
                name: "Insurance Certificate",
                type: "PDF",
                size: "1.8 MB",
            },
            {
                name: "Inspection Report",
                type: "PDF",
                size: "3.1 MB",
            },
            {
                name: "Service History",
                type: "PDF",
                size: "1.2 MB",
            },
        ],
        shipping: {
            pickupLocation: "Dubai, UAE",
            shippingAvailable: "Worldwide",
            estimatedDelivery: "5-10 Business Days"
        },

        payment: {
            acceptedMethods: "Bank Transfer, Credit Card",
            buyerPremium: "5%",
            taxesFees: "Applicable as per region"
        },
        image: "https://images.unsplash.com/photo-1542362567-b07e54358753?auto=format&fit=crop&q=80&w=600",
        images: [
            "https://images.unsplash.com/photo-1542362567-b07e54358753?auto=format&fit=crop&q=80&w=600",
            "https://stimg.cardekho.com/images/carexteriorimages/630x420/Tata/Sierra/12271/1765181428462/front-left-side-47.jpg?impolicy=resize&imwidth=360",
            "https://5.imimg.com/data5/SELLER/Default/2024/8/444303282/EO/TR/EQ/3199782/car-carrier-trailer-500x500.jpg",
            "https://images.unsplash.com/photo-1542362567-b07e54358753?auto=format&fit=crop&q=80&w=600",
            "https://images.unsplash.com/photo-1542362567-b07e54358753?auto=format&fit=crop&q=80&w=600",
            "https://stimg.cardekho.com/images/carexteriorimages/630x420/Tata/Sierra/12271/1765181428462/front-left-side-47.jpg?impolicy=resize&imwidth=360",
            "https://5.imimg.com/data5/SELLER/Default/2024/8/444303282/EO/TR/EQ/3199782/car-carrier-trailer-500x500.jpg",
            "https://images.unsplash.com/photo-1542362567-b07e54358753?auto=format&fit=crop&q=80&w=600",
        ],
    },
    {
        id: 5,
        name: "2023 Porsche 911",
        model: "Carrera S",
        year: 2023,
        category: "Sports",
        vehicleType: "Sports Coupe",
        bodyStyle: "Coupe",
        status: "live",
        offerStatus: "expired",
        wonStatus: "payment-pending",
        paymentStatus: "payment-pending",
        bid: "AED 410,000",
        totalBids: 45,
        timer: "01:05:20",
        mileage: "6,850 km",
        odometer: "6,850 km",
        engine: "Twin-Turbo Flat-6",
        engineSize: "3.0L",
        cylinders: "6",
        transmission: "PDK Automatic",
        fuelType: "Petrol",
        driveType: "RWD",
        color: "Guards Red",
        damage: "No Reported Damage",
        location: "Dubai, UAE",
        source: "Premium Dealer Auction",
        sellerType: "Dealer",
        vin: "WP0AB2A99PS123456",
        endTime: new Date(Date.now() + 10 * 60 * 60 * 1000 + 45 * 60 * 1000),
        image: "https://img.magnific.com/free-photo/blue-delivery-van-wet-highway-with-motion-blur-shipping-motion_169016-69815.jpg?semt=ais_hybrid&w=740&q=80",
        images: [
            "https://img.magnific.com/free-photo/blue-delivery-van-wet-highway-with-motion-blur-shipping-motion_169016-69815.jpg?semt=ais_hybrid&w=740&q=80",
            "https://stimg.cardekho.com/images/carexteriorimages/630x420/Tata/Sierra/12271/1765181428462/front-left-side-47.jpg?impolicy=resize&imwidth=360",
            "https://5.imimg.com/data5/SELLER/Default/2024/8/444303282/EO/TR/EQ/3199782/car-carrier-trailer-500x500.jpg",
            "https://images.unsplash.com/photo-1542362567-b07e54358753?auto=format&fit=crop&q=80&w=600",
        ],

    },
    {

        id: 6,
        name: "2022 BMW M4",
        model: "Competition Coupe",
        year: 2022,
        category: "Sports",
        vehicleType: "Performance Coupe",
        bodyStyle: "Coupe",
        status: "live",
        offerStatus: "expired",
        wonStatus: "payment-completed",
        paymentStatus: "payment-pending",
        bid: "AED 325,000",
        totalBids: 28,
        timer: "00:45:10",
        mileage: "14,200 km",
        odometer: "14,200 km",
        engine: "Twin-Turbo Inline-6",
        engineSize: "3.0L",
        cylinders: "6",
        transmission: "8-Speed Automatic",
        fuelType: "Petrol",
        driveType: "RWD",
        color: "Brooklyn Grey",
        damage: "No Reported Damage",
        location: "Dubai, UAE",
        source: "Premium Dealer Auction",
        sellerType: "Dealer",
        vin: "WBS43AZ08NFK12345",
        endTime: new Date(Date.now() + 10 * 60 * 60 * 1000 + 45 * 60 * 1000),
        image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ79eLAxBTQBdv40ghQ7M19bjm6ahHDnsiSmg&s",
        images: [
            "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ79eLAxBTQBdv40ghQ7M19bjm6ahHDnsiSmg&s",
            "https://stimg.cardekho.com/images/carexteriorimages/630x420/Tata/Sierra/12271/1765181428462/front-left-side-47.jpg?impolicy=resize&imwidth=360",
            "https://5.imimg.com/data5/SELLER/Default/2024/8/444303282/EO/TR/EQ/3199782/car-carrier-trailer-500x500.jpg",
            "https://images.unsplash.com/photo-1542362567-b07e54358753?auto=format&fit=crop&q=80&w=600",
        ],
    },
    {
        id: 7,
        name: "2021 Toyota Land Cruiser",
        model: "VX-R V6",
        year: 2021,
        category: "SUV",
        vehicleType: "Full-Size SUV",
        bodyStyle: "SUV",
        status: "live",
        offerStatus: "expired",
        wonStatus: "ready-for-pickup",
        paymentStatus: "payment-pending",
        bid: "AED 295,000",
        totalBids: 52,
        timer: "00:12:05",
        mileage: "38,500 km",
        odometer: "38,500 km",
        engine: "V6 Twin-Turbo",
        engineSize: "3.5L",
        cylinders: "6",
        transmission: "10-Speed Automatic",
        fuelType: "Petrol",
        driveType: "4WD",
        color: "Pearl White",
        damage: "No Reported Damage",
        location: "Abu Dhabi, UAE",
        source: "Dealer Auction",
        sellerType: "Dealer",
        vin: "JTMAA7BJ5M4123456",
        endTime: new Date(Date.now() + 10 * 60 * 60 * 1000 + 45 * 60 * 1000),
        image: "https://cdn.pixabay.com/photo/2017/03/27/14/56/auto-2179220_1280.jpg",
        images: [
            "https://cdn.pixabay.com/photo/2017/03/27/14/56/auto-2179220_1280.jpg",
            "https://stimg.cardekho.com/images/carexteriorimages/630x420/Tata/Sierra/12271/1765181428462/front-left-side-47.jpg?impolicy=resize&imwidth=360",
            "https://5.imimg.com/data5/SELLER/Default/2024/8/444303282/EO/TR/EQ/3199782/car-carrier-trailer-500x500.jpg",
            "https://images.unsplash.com/photo-1542362567-b07e54358753?auto=format&fit=crop&q=80&w=600",
        ],
    },
    {
        id: 8,
        name: "2020 Tesla Model 3",
        model: "Long Range AWD",
        year: 2020,
        category: "Electric",
        vehicleType: "Electric Sedan",
        bodyStyle: "Sedan",
        status: "live",
        offerStatus: "expired",
        wonStatus: "payment-pending",
        paymentStatus: "payment-pending",
        bid: "AED 115,000",
        totalBids: 19,
        timer: "00:35:40",
        mileage: "46,800 km",
        odometer: "46,800 km",
        engine: "Dual Electric Motors",
        engineSize: "N/A",
        cylinders: "N/A",
        transmission: "Single-Speed Automatic",
        fuelType: "Electric",
        driveType: "AWD",
        color: "Midnight Silver Metallic",
        damage: "Minor Rear Quarter Panel Repair",
        location: "Sharjah, UAE",
        source: "Insurance Auction",
        sellerType: "Insurance Company",
        vin: "5YJ3E1EB8LF123456",
        endTime: new Date(Date.now() + 10 * 60 * 60 * 1000 + 45 * 60 * 1000),
        image: "https://images.unsplash.com/photo-1560958089-b8a1929cea89?auto=format&fit=crop&q=80&w=600",
        images: [
            "https://images.unsplash.com/photo-1560958089-b8a1929cea89?auto=format&fit=crop&q=80&w=600",
            "https://stimg.cardekho.com/images/carexteriorimages/630x420/Tata/Sierra/12271/1765181428462/front-left-side-47.jpg?impolicy=resize&imwidth=360",
            "https://5.imimg.com/data5/SELLER/Default/2024/8/444303282/EO/TR/EQ/3199782/car-carrier-trailer-500x500.jpg",
            "https://images.unsplash.com/photo-1542362567-b07e54358753?auto=format&fit=crop&q=80&w=600",
        ],
    },

    // RECENTLY SOLD
    {
        id: 9,
        name: "2021 Lexus LX 570",
        model: "LX 570",
        year: 2021,
        category: "SUV",
        vehicleType: "Luxury SUV",
        bodyStyle: "SUV",

        status: "sold",
        wonStatus: "payment-pending",
        paymentStatus: "payment-pending",
        endedDate: "28 June 2026",
        endedTime: "01:00 PM",
        views: "2390",

        soldPrice: "AED 310,000",
        winner: "Omar Al Mansoori",
        soldOn: "20 May 2024",
        mileage: "29,400 km",
        odometer: "29,400 km",
        engine: "Naturally Aspirated V8",
        engineSize: "5.7L",
        cylinders: "8",
        transmission: "8-Speed Automatic",
        fuelType: "Petrol",
        driveType: "4WD",
        color: "Black Onyx",
        damage: "No Reported Damage",
        location: "Dubai, UAE",
        source: "Dealer Auction",
        sellerType: "Dealer",
        vin: "JTJHY7AX4M4123456",
        endTime: new Date(Date.now() + 10 * 60 * 60 * 1000 + 45 * 60 * 1000),
        image: "https://images.unsplash.com/photo-1560958089-b8a1929cea89?auto=format&fit=crop&q=80&w=600",
        images: [
            "https://images.unsplash.com/photo-1560958089-b8a1929cea89?auto=format&fit=crop&q=80&w=600",
            "https://stimg.cardekho.com/images/carexteriorimages/630x420/Tata/Sierra/12271/1765181428462/front-left-side-47.jpg?impolicy=resize&imwidth=360",
            "https://5.imimg.com/data5/SELLER/Default/2024/8/444303282/EO/TR/EQ/3199782/car-carrier-trailer-500x500.jpg",
            "https://images.unsplash.com/photo-1542362567-b07e54358753?auto=format&fit=crop&q=80&w=600",
        ],
    },
    {
        id: 10,
        name: "2020 BMW 7 Series",
        model: "740Li",
        year: 2020,
        category: "Luxury",
        vehicleType: "Luxury Sedan",
        bodyStyle: "Sedan",

        status: "sold",
        wonStatus: "payment-completed",
        endedDate: "28 June 2026",
        endedTime: "01:00 PM",
        views: "2390",

        soldPrice: "AED 198,500",
        winner: "Ahmed Hassan",
        soldOn: "19 May 2024",
        mileage: "41,200 km",
        odometer: "41,200 km",
        engine: "Turbocharged Inline-6",
        engineSize: "3.0L",
        cylinders: "6",
        transmission: "8-Speed Automatic",
        fuelType: "Petrol",
        driveType: "RWD",
        color: "Alpine White",
        damage: "No Reported Damage",
        location: "Abu Dhabi, UAE",
        source: "Bank Auction",
        sellerType: "Bank Repossession",
        vin: "WBA7T2C07LGM12345",
        endTime: new Date(Date.now() + 10 * 60 * 60 * 1000 + 45 * 60 * 1000),
        image: "https://cdn.pixabay.com/photo/2017/03/27/14/56/auto-2179220_1280.jpg",
        images: [
            "https://cdn.pixabay.com/photo/2017/03/27/14/56/auto-2179220_1280.jpg",
            "https://stimg.cardekho.com/images/carexteriorimages/630x420/Tata/Sierra/12271/1765181428462/front-left-side-47.jpg?impolicy=resize&imwidth=360",
            "https://5.imimg.com/data5/SELLER/Default/2024/8/444303282/EO/TR/EQ/3199782/car-carrier-trailer-500x500.jpg",
            "https://images.unsplash.com/photo-1542362567-b07e54358753?auto=format&fit=crop&q=80&w=600",
        ],
    },
    {
        id: 11,
        name: "2019 Toyota Land Cruiser",
        model: "GXR V8",
        year: 2019,
        category: "SUV",
        vehicleType: "Full-Size SUV",
        bodyStyle: "SUV",

        status: "sold",
        wonStatus: "ready-for-pickup",
        endedDate: "28 June 2026",
        endedTime: "01:00 PM",
        views: "2390",

        soldPrice: "AED 152,000",
        winner: "Khalid Al Neyadi",
        soldOn: "18 May 2024",
        mileage: "86,500 km",
        odometer: "86,500 km",
        engine: "Naturally Aspirated V8",
        engineSize: "4.6L",
        cylinders: "8",
        transmission: "6-Speed Automatic",
        fuelType: "Petrol",
        driveType: "4WD",
        color: "Pearl White",
        damage: "Minor Front Fender Repair",
        location: "Sharjah, UAE",
        source: "Insurance Auction",
        sellerType: "Insurance Company",
        vin: "JTMHV05J8K4123456",
        endTime: new Date(Date.now() + 10 * 60 * 60 * 1000 + 45 * 60 * 1000),
        image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ79eLAxBTQBdv40ghQ7M19bjm6ahHDnsiSmg&s",
        images: [
            "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ79eLAxBTQBdv40ghQ7M19bjm6ahHDnsiSmg&s",
            "https://stimg.cardekho.com/images/carexteriorimages/630x420/Tata/Sierra/12271/1765181428462/front-left-side-47.jpg?impolicy=resize&imwidth=360",
            "https://5.imimg.com/data5/SELLER/Default/2024/8/444303282/EO/TR/EQ/3199782/car-carrier-trailer-500x500.jpg",
            "https://images.unsplash.com/photo-1542362567-b07e54358753?auto=format&fit=crop&q=80&w=600",
        ],
    },
    {
        id: 12,
        name: "2021 Porsche 911 Carrera",
        model: "Carrera",
        year: 2021,
        category: "Sports",
        vehicleType: "Sports Coupe",
        bodyStyle: "Coupe",

        status: "sold",
        endedDate: "28 June 2026",
        endedTime: "01:00 PM",
        views: "2390",

        soldPrice: "AED 420,000",
        winner: "Yousef Sharif",
        soldOn: "17 May 2024",
        mileage: "18,700 km",
        odometer: "18,700 km",
        engine: "Twin-Turbo Flat-6",
        engineSize: "3.0L",
        cylinders: "6",
        transmission: "PDK Automatic",
        fuelType: "Petrol",
        driveType: "RWD",
        color: "Carrara White",
        damage: "No Reported Damage",
        location: "Dubai, UAE",
        source: "Premium Dealer Auction",
        sellerType: "Dealer",
        vin: "WP0AA2A91MS123456",
        endTime: new Date(Date.now() + 10 * 60 * 60 * 1000 + 45 * 60 * 1000),
        image: "https://img.magnific.com/free-photo/blue-delivery-van-wet-highway-with-motion-blur-shipping-motion_169016-69815.jpg?semt=ais_hybrid&w=740&q=80",
        images: [
            "https://img.magnific.com/free-photo/blue-delivery-van-wet-highway-with-motion-blur-shipping-motion_169016-69815.jpg?semt=ais_hybrid&w=740&q=80",
            "https://stimg.cardekho.com/images/carexteriorimages/630x420/Tata/Sierra/12271/1765181428462/front-left-side-47.jpg?impolicy=resize&imwidth=360",
            "https://5.imimg.com/data5/SELLER/Default/2024/8/444303282/EO/TR/EQ/3199782/car-carrier-trailer-500x500.jpg",
            "https://images.unsplash.com/photo-1542362567-b07e54358753?auto=format&fit=crop&q=80&w=600",
        ],
    },
    {
        id: 13,
        name: "2022 Audi Q7",
        model: "55 TFSI Quattro",
        year: 2022,
        category: "SUV",
        vehicleType: "Luxury SUV",
        bodyStyle: "SUV",

        status: "sold",
        endedDate: "28 June 2026",
        endedTime: "01:00 PM",
        views: "2390",

        soldPrice: "AED 165,000",
        winner: "Fatima Al Mazrouei",
        soldOn: "16 May 2024",
        mileage: "22,400 km",
        odometer: "22,400 km",
        engine: "Turbocharged V6",
        engineSize: "3.0L",
        cylinders: "6",
        transmission: "8-Speed Automatic",
        fuelType: "Petrol",
        driveType: "AWD",
        color: "Daytona Gray",
        damage: "No Reported Damage",
        location: "Abu Dhabi, UAE",
        source: "Dealer Auction",
        sellerType: "Dealer",
        vin: "WA1VXAF76ND123456",
        endTime: new Date(Date.now() + 10 * 60 * 60 * 1000 + 45 * 60 * 1000),
        image: "https://images.unsplash.com/photo-1542362567-b07e54358753?auto=format&fit=crop&q=80&w=600",
        images: [
            "https://images.unsplash.com/photo-1542362567-b07e54358753?auto=format&fit=crop&q=80&w=600",
            "https://stimg.cardekho.com/images/carexteriorimages/630x420/Tata/Sierra/12271/1765181428462/front-left-side-47.jpg?impolicy=resize&imwidth=360",
            "https://5.imimg.com/data5/SELLER/Default/2024/8/444303282/EO/TR/EQ/3199782/car-carrier-trailer-500x500.jpg",
            "https://images.unsplash.com/photo-1542362567-b07e54358753?auto=format&fit=crop&q=80&w=600",
        ],
    },
    {
        id: 14,
        name: "2020 Tesla Model 3",
        model: "Long Range AWD",
        year: 2020,
        category: "Electric",
        vehicleType: "Electric Sedan",
        bodyStyle: "Sedan",

        status: "sold",
        endedDate: "28 June 2026",
        endedTime: "01:00 PM",
        views: "2390",

        soldPrice: "AED 118,000",
        winner: "Mohammed Saleh",
        soldOn: "15 May 2024",
        mileage: "52,100 km",
        odometer: "52,100 km",
        engine: "Dual Electric Motors",
        engineSize: "N/A",
        cylinders: "N/A",
        transmission: "Single-Speed Automatic",
        fuelType: "Electric",
        driveType: "AWD",
        color: "Midnight Silver Metallic",
        damage: "Minor Rear Bumper Repair",
        location: "Sharjah, UAE",
        source: "Insurance Auction",
        sellerType: "Insurance Company",
        vin: "5YJ3E1EB2LF123456",
        endTime: new Date(Date.now() + 10 * 60 * 60 * 1000 + 45 * 60 * 1000),
        image: "https://5.imimg.com/data5/SELLER/Default/2024/8/444303282/EO/TR/EQ/3199782/car-carrier-trailer-500x500.jpg",
        images: [
            "https://5.imimg.com/data5/SELLER/Default/2024/8/444303282/EO/TR/EQ/3199782/car-carrier-trailer-500x500.jpg",
            "https://stimg.cardekho.com/images/carexteriorimages/630x420/Tata/Sierra/12271/1765181428462/front-left-side-47.jpg?impolicy=resize&imwidth=360",
            "https://5.imimg.com/data5/SELLER/Default/2024/8/444303282/EO/TR/EQ/3199782/car-carrier-trailer-500x500.jpg",
            "https://images.unsplash.com/photo-1542362567-b07e54358753?auto=format&fit=crop&q=80&w=600",
        ],
    },
    {
        id: 15,
        name: "2021 Mercedes-Benz S-Class",
        model: "S 500 4MATIC",
        year: 2021,
        category: "Sedan",
        vehicleType: "Luxury Sedan",
        bodyStyle: "Sedan",

        status: "sold",
        endedDate: "28 June 2026",
        endedTime: "01:00 PM",
        views: "2390",

        soldPrice: "AED 248,000",
        winner: "Ali Rashid",
        soldOn: "14 May 2024",
        mileage: "24,800 km",
        odometer: "24,800 km",
        engine: "Inline-6 Turbo",
        engineSize: "3.0L",
        cylinders: "6",
        transmission: "9-Speed Automatic",
        fuelType: "Petrol",
        driveType: "AWD",
        color: "Obsidian Black",
        damage: "No Reported Damage",
        location: "Dubai, UAE",
        source: "Dealer Auction",
        sellerType: "Dealer",
        vin: "W1K6G6DB5MA123456",
        endTime: new Date(Date.now() + 10 * 60 * 60 * 1000 + 45 * 60 * 1000),
        image: "https://stimg.cardekho.com/images/carexteriorimages/630x420/Tata/Sierra/12271/1765181428462/front-left-side-47.jpg?impolicy=resize&imwidth=360",
        images: [
            "https://stimg.cardekho.com/images/carexteriorimages/630x420/Tata/Sierra/12271/1765181428462/front-left-side-47.jpg?impolicy=resize&imwidth=360",
            "https://stimg.cardekho.com/images/carexteriorimages/630x420/Tata/Sierra/12271/1765181428462/front-left-side-47.jpg?impolicy=resize&imwidth=360",
            "https://5.imimg.com/data5/SELLER/Default/2024/8/444303282/EO/TR/EQ/3199782/car-carrier-trailer-500x500.jpg",
            "https://images.unsplash.com/photo-1542362567-b07e54358753?auto=format&fit=crop&q=80&w=600",
        ],
    },
    {
        id: 16,
        name: "2020 Range Rover Sport",
        model: "HSE Dynamic",
        year: 2020,
        category: "SUV",
        vehicleType: "Luxury SUV",
        bodyStyle: "SUV",

        status: "sold",
        endedDate: "28 June 2026",
        endedTime: "01:00 PM",
        views: "2390",

        soldPrice: "AED 188,000",
        winner: "Sarah Al Suwaidi",
        soldOn: "13 May 2024",
        mileage: "35,600 km",
        odometer: "35,600 km",
        engine: "V6 Supercharged",
        engineSize: "3.0L",
        cylinders: "6",
        transmission: "8-Speed Automatic",
        fuelType: "Petrol",
        driveType: "AWD",
        color: "Fuji White",
        damage: "Minor Rear Bumper Repair",
        location: "Abu Dhabi, UAE",
        source: "Dealer Auction",
        sellerType: "Dealer",
        vin: "SALWR2RV5LA123456",
        endTime: new Date(Date.now() + 10 * 60 * 60 * 1000 + 45 * 60 * 1000),
        image: "https://images.hindustantimes.com/auto/auto-images/mg/rc6/exterior_mg-rc6_front-left-side_600x400.jpg?imwidth=640",
        images: [
            "https://images.hindustantimes.com/auto/auto-images/mg/rc6/exterior_mg-rc6_front-left-side_600x400.jpg?imwidth=640",
            "https://stimg.cardekho.com/images/carexteriorimages/630x420/Tata/Sierra/12271/1765181428462/front-left-side-47.jpg?impolicy=resize&imwidth=360",
            "https://5.imimg.com/data5/SELLER/Default/2024/8/444303282/EO/TR/EQ/3199782/car-carrier-trailer-500x500.jpg",
            "https://images.unsplash.com/photo-1542362567-b07e54358753?auto=format&fit=crop&q=80&w=600",
        ],
    },
    {
        id: 17,
        name: "2023 BMW X5",
        model: "xDrive40i",
        year: 2023,
        category: "SUV",
        vehicleType: "Luxury SUV",
        bodyStyle: "SUV",

        status: "upcoming",
        startTime: new Date(Date.now() + 2 * 60 * 60 * 1000),
        estValue: "AED 285,000",
        estDuration: "5 Days",
        startingBid: "AED 248,000",
        biddingDate: "27 June 2026, 09:00 PM",

        timeCategory: "today",
        condition: "Excellent",
        shopName: "Al Yousuf Motors – Premium Collection",
        seller: "Al Yousuf Motors",
        description: "Premium cars from leading brands. Well maintained and thoroughly inspected.",
        date: "May 20, 2024",
        time: "11:00 AM GST",
        lots: "85 Lots",
        startsIn: "2h 15m",
        isVerified: true,

        bid: "AED 248,000",
        totalBids: 11,
        timer: "01:45:30",
        mileage: "14,500 km",
        odometer: "14,500 km",
        engine: "Turbocharged Inline-6",
        engineSize: "3.0L",
        cylinders: "6",
        transmission: "Automatic",
        fuelType: "Petrol",
        driveType: "AWD",
        color: "Mineral White",
        location: "Dubai, UAE",
        source: "Dealer Auction",
        sellerType: "Dealer",
        vin: "WBAXX11020D567891",

        endTime: new Date(Date.now() + 72 * 60 * 60 * 1000),

        exteriorRating: 9,
        interiorRating: 9,
        mechanicalRating: 8.5,

        damageReport: [
            {
                area: "Front Fender",
                severity: "minor",
                description: "Light scratch near wheel arch."
            }
        ],

        maintenanceHistory: [
            {
                service: "Oil Change",
                date: "Feb 10, 2026",
                mileageAtService: 14000,
                notes: "Routine service completed."
            }
        ],

        inspectionNotes: [
            {
                title: "Engine",
                description: "Excellent performance.",
                status: "pass"
            }
        ],

        bidHistory: [
            {
                bidder: "Ahmed Ali",
                amount: 248000,
                time: "2 mins ago"
            },
            {
                bidder: "Omar Hassan",
                amount: 245000,
                time: "7 mins ago"
            }
        ],
        image: "https://images.unsplash.com/photo-1542362567-b07e54358753?auto=format&fit=crop&q=80&w=600",
        images: [
            "https://5.imimg.com/data5/SELLER/Default/2024/8/444303282/EO/TR/EQ/3199782/car-carrier-trailer-500x500.jpg",
            "https://stimg.cardekho.com/images/carexteriorimages/630x420/Tata/Sierra/12271/1765181428462/front-left-side-47.jpg?impolicy=resize&imwidth=360",
            "https://5.imimg.com/data5/SELLER/Default/2024/8/444303282/EO/TR/EQ/3199782/car-carrier-trailer-500x500.jpg",
            "https://images.unsplash.com/photo-1542362567-b07e54358753?auto=format&fit=crop&q=80&w=600",
        ],
    },

    {
        id: 18,
        name: "2022 Mercedes-Benz GLE 450",
        model: "4MATIC",
        year: 2022,
        category: "SUV",
        vehicleType: "Luxury SUV",
        bodyStyle: "SUV",

        status: "upcoming",
        startTime: new Date(Date.now() + 4 * 60 * 60 * 1000),
        estValue: "AED 310,000",
        estDuration: "7 Days",
        startingBid: "AED 248,000",
        biddingDate: "28 June 2026, 01:00 PM",

        timeCategory: "this-week",
        shopName: "Al Yousuf Motors – Premium Collection",
        seller: "Al Yousuf Motors",
        description: "Premium cars from leading brands. Well maintained and thoroughly inspected.",
        date: "May 20, 2024",
        time: "11:00 AM GST",
        lots: "85 Lots",
        startsIn: "2h 15m",
        isVerified: true,

        bid: "AED 275,000",
        totalBids: 19,
        timer: "03:25:18",
        mileage: "19,200 km",
        odometer: "19,200 km",
        engine: "Turbocharged Inline-6",
        engineSize: "3.0L",
        cylinders: "6",
        transmission: "Automatic",
        fuelType: "Petrol",
        driveType: "AWD",
        color: "Obsidian Black",
        location: "Abu Dhabi, UAE",
        source: "Private Seller",
        sellerType: "Individual",
        vin: "WDC1671591A345678",

        endTime: new Date(Date.now() + 96 * 60 * 60 * 1000),

        exteriorRating: 8.5,
        interiorRating: 9.5,
        mechanicalRating: 8,

        damageReport: [
            {
                area: "Rear Bumper",
                severity: "minor",
                description: "Small parking dent."
            }
        ],

        maintenanceHistory: [
            {
                service: "Brake Inspection",
                date: "Jan 18, 2026",
                mileageAtService: 18000,
                notes: "Brake pads replaced."
            }
        ],

        inspectionNotes: [
            {
                title: "Suspension",
                description: "Working properly.",
                status: "pass"
            }
        ],

        bidHistory: [
            {
                bidder: "Khalid Noor",
                amount: 275000,
                time: "1 min ago"
            },
            {
                bidder: "Ali Rashid",
                amount: 272000,
                time: "5 mins ago"
            }
        ],
        image: "https://stimg.cardekho.com/images/carexteriorimages/630x420/Tata/Sierra/12271/1765181428462/front-left-side-47.jpg?impolicy=resize&imwidth=360",
        images: [
            "https://stimg.cardekho.com/images/carexteriorimages/630x420/Tata/Sierra/12271/1765181428462/front-left-side-47.jpg?impolicy=resize&imwidth=360",
            "https://stimg.cardekho.com/images/carexteriorimages/630x420/Tata/Sierra/12271/1765181428462/front-left-side-47.jpg?impolicy=resize&imwidth=360",
            "https://5.imimg.com/data5/SELLER/Default/2024/8/444303282/EO/TR/EQ/3199782/car-carrier-trailer-500x500.jpg",
            "https://images.unsplash.com/photo-1542362567-b07e54358753?auto=format&fit=crop&q=80&w=600",
        ],
    },

    {
        id: 19,
        name: "2021 Porsche Cayenne",
        model: "S",
        year: 2021,
        category: "SUV",
        vehicleType: "Performance SUV",
        bodyStyle: "SUV",

        status: "upcoming",
        startTime: new Date(Date.now() + 6 * 60 * 60 * 1000),
        estValue: "AED 355,000",
        estDuration: "4 Days",
        startingBid: "AED 250,000",
        biddingDate: "27 June 2026, 01:00 PM",

        timeCategory: "next-week",
        shopName: "Al Yousuf Motors – Premium Collection",
        seller: "Al Yousuf Motors",
        description: "Premium cars from leading brands. Well maintained and thoroughly inspected.",
        date: "May 20, 2024",
        time: "11:00 AM GST",
        lots: "85 Lots",
        startsIn: "2h 15m",
        isVerified: true,

        bid: "AED 318,000",
        totalBids: 24,
        timer: "04:18:45",
        mileage: "22,700 km",
        odometer: "22,700 km",
        engine: "Twin-Turbo V6",
        engineSize: "2.9L",
        cylinders: "6",
        transmission: "Automatic",
        fuelType: "Petrol",
        driveType: "AWD",
        color: "Carrara White",
        location: "Sharjah, UAE",
        source: "Dealer Auction",
        sellerType: "Dealer",
        vin: "WP1ZZZ9YZMDA45678",

        endTime: new Date(Date.now() + 120 * 60 * 60 * 1000),

        exteriorRating: 9,
        interiorRating: 8.5,
        mechanicalRating: 9,

        damageReport: [
            {
                area: "Driver Door",
                severity: "minor",
                description: "Light paint scratch."
            }
        ],

        maintenanceHistory: [
            {
                service: "Major Service",
                date: "Dec 15, 2025",
                mileageAtService: 21000,
                notes: "Full dealer inspection completed."
            }
        ],

        inspectionNotes: [
            {
                title: "Transmission",
                description: "Shifts smoothly.",
                status: "pass"
            }
        ],

        bidHistory: [
            {
                bidder: "Sarah Malik",
                amount: 318000,
                time: "3 mins ago"
            },
            {
                bidder: "Ahmed Noor",
                amount: 315000,
                time: "6 mins ago"
            }
        ],
        image: "https://images.hindustantimes.com/auto/auto-images/mg/rc6/exterior_mg-rc6_front-left-side_600x400.jpg?imwidth=640",
        images: [
            "https://images.hindustantimes.com/auto/auto-images/mg/rc6/exterior_mg-rc6_front-left-side_600x400.jpg?imwidth=640",
            "https://stimg.cardekho.com/images/carexteriorimages/630x420/Tata/Sierra/12271/1765181428462/front-left-side-47.jpg?impolicy=resize&imwidth=360",
            "https://5.imimg.com/data5/SELLER/Default/2024/8/444303282/EO/TR/EQ/3199782/car-carrier-trailer-500x500.jpg",
            "https://images.unsplash.com/photo-1542362567-b07e54358753?auto=format&fit=crop&q=80&w=600",
        ],
    },
    {
        id: 20,
        name: "2023 BMW X5",
        model: "xDrive40i",
        year: 2023,
        category: "SUV",
        vehicleType: "Luxury SUV",
        bodyStyle: "SUV",

        status: "unsold",
        startTime: new Date(Date.now() + 2 * 60 * 60 * 1000),
        endedDate: "28 June 2026",
        endedTime: "01:00 PM",
        estValue: "AED 285,000",
        estDuration: "5 Days",
        startingBid: "AED 248,000",
        biddingDate: "27 June 2026, 09:00 PM",
        views: "2390",
        highestBid: "AED 555,000",
        reservePrice: "AED 650,000",

        bid: "AED 248,000",
        totalBids: 11,
        timer: "01:45:30",
        mileage: "14,500 km",
        odometer: "14,500 km",
        engine: "Turbocharged Inline-6",
        engineSize: "3.0L",
        cylinders: "6",
        transmission: "Automatic",
        fuelType: "Petrol",
        driveType: "AWD",
        color: "Mineral White",
        location: "Dubai, UAE",
        source: "Dealer Auction",
        sellerType: "Dealer",
        vin: "WBAXX11020D567891",

        endTime: new Date(Date.now() + 72 * 60 * 60 * 1000),

        exteriorRating: 9,
        interiorRating: 9,
        mechanicalRating: 8.5,

        damageReport: [
            {
                area: "Front Fender",
                severity: "minor",
                description: "Light scratch near wheel arch."
            }
        ],

        maintenanceHistory: [
            {
                service: "Oil Change",
                date: "Feb 10, 2026",
                mileageAtService: 14000,
                notes: "Routine service completed."
            }
        ],

        inspectionNotes: [
            {
                title: "Engine",
                description: "Excellent performance.",
                status: "pass"
            }
        ],

        bidHistory: [
            {
                bidder: "Ahmed Ali",
                amount: 248000,
                time: "2 mins ago"
            },
            {
                bidder: "Omar Hassan",
                amount: 245000,
                time: "7 mins ago"
            }
        ],
        image: "https://images.unsplash.com/photo-1542362567-b07e54358753?auto=format&fit=crop&q=80&w=600",
        images: [
            "https://5.imimg.com/data5/SELLER/Default/2024/8/444303282/EO/TR/EQ/3199782/car-carrier-trailer-500x500.jpg",
            "https://stimg.cardekho.com/images/carexteriorimages/630x420/Tata/Sierra/12271/1765181428462/front-left-side-47.jpg?impolicy=resize&imwidth=360",
            "https://5.imimg.com/data5/SELLER/Default/2024/8/444303282/EO/TR/EQ/3199782/car-carrier-trailer-500x500.jpg",
            "https://images.unsplash.com/photo-1542362567-b07e54358753?auto=format&fit=crop&q=80&w=600",
        ],
    },

    {
        id: 21,
        name: "2022 Mercedes-Benz GLE 450",
        model: "4MATIC",
        year: 2022,
        category: "SUV",
        vehicleType: "Luxury SUV",
        bodyStyle: "SUV",

        status: "unsold",
        startTime: new Date(Date.now() + 4 * 60 * 60 * 1000),
        endedDate: "28 June 2026",
        endedTime: "01:00 PM",
        estValue: "AED 310,000",
        estDuration: "7 Days",
        startingBid: "AED 248,000",
        biddingDate: "28 June 2026, 01:00 PM",
        views: "2390",
        highestBid: "AED 555,000",
        reservePrice: "AED 650,000",

        bid: "AED 275,000",
        totalBids: 19,
        timer: "03:25:18",
        mileage: "19,200 km",
        odometer: "19,200 km",
        engine: "Turbocharged Inline-6",
        engineSize: "3.0L",
        cylinders: "6",
        transmission: "Automatic",
        fuelType: "Petrol",
        driveType: "AWD",
        color: "Obsidian Black",
        location: "Abu Dhabi, UAE",
        source: "Private Seller",
        sellerType: "Individual",
        vin: "WDC1671591A345678",

        endTime: new Date(Date.now() + 96 * 60 * 60 * 1000),

        exteriorRating: 8.5,
        interiorRating: 9.5,
        mechanicalRating: 8,

        damageReport: [
            {
                area: "Rear Bumper",
                severity: "minor",
                description: "Small parking dent."
            }
        ],

        maintenanceHistory: [
            {
                service: "Brake Inspection",
                date: "Jan 18, 2026",
                mileageAtService: 18000,
                notes: "Brake pads replaced."
            }
        ],

        inspectionNotes: [
            {
                title: "Suspension",
                description: "Working properly.",
                status: "pass"
            }
        ],

        bidHistory: [
            {
                bidder: "Khalid Noor",
                amount: 275000,
                time: "1 min ago"
            },
            {
                bidder: "Ali Rashid",
                amount: 272000,
                time: "5 mins ago"
            }
        ],
        image: "https://stimg.cardekho.com/images/carexteriorimages/630x420/Tata/Sierra/12271/1765181428462/front-left-side-47.jpg?impolicy=resize&imwidth=360",
        images: [
            "https://stimg.cardekho.com/images/carexteriorimages/630x420/Tata/Sierra/12271/1765181428462/front-left-side-47.jpg?impolicy=resize&imwidth=360",
            "https://stimg.cardekho.com/images/carexteriorimages/630x420/Tata/Sierra/12271/1765181428462/front-left-side-47.jpg?impolicy=resize&imwidth=360",
            "https://5.imimg.com/data5/SELLER/Default/2024/8/444303282/EO/TR/EQ/3199782/car-carrier-trailer-500x500.jpg",
            "https://images.unsplash.com/photo-1542362567-b07e54358753?auto=format&fit=crop&q=80&w=600",
        ],
    },

    {
        id: 22,
        name: "2021 Porsche Cayenne",
        model: "S",
        year: 2021,
        category: "SUV",
        vehicleType: "Performance SUV",
        bodyStyle: "SUV",

        status: "unsold",
        startTime: new Date(Date.now() + 6 * 60 * 60 * 1000),
        endedDate: "28 June 2026",
        endedTime: "01:00 PM",
        estValue: "AED 355,000",
        estDuration: "4 Days",
        startingBid: "AED 250,000",
        biddingDate: "27 June 2026, 01:00 PM",
        views: "2390",
        highestBid: "AED 555,000",
        reservePrice: "AED 650,000",

        bid: "AED 318,000",
        totalBids: 24,
        timer: "04:18:45",
        mileage: "22,700 km",
        odometer: "22,700 km",
        engine: "Twin-Turbo V6",
        engineSize: "2.9L",
        cylinders: "6",
        transmission: "Automatic",
        fuelType: "Petrol",
        driveType: "AWD",
        color: "Carrara White",
        location: "Sharjah, UAE",
        source: "Dealer Auction",
        sellerType: "Dealer",
        vin: "WP1ZZZ9YZMDA45678",

        endTime: new Date(Date.now() + 120 * 60 * 60 * 1000),

        exteriorRating: 9,
        interiorRating: 8.5,
        mechanicalRating: 9,

        damageReport: [
            {
                area: "Driver Door",
                severity: "minor",
                description: "Light paint scratch."
            }
        ],

        maintenanceHistory: [
            {
                service: "Major Service",
                date: "Dec 15, 2025",
                mileageAtService: 21000,
                notes: "Full dealer inspection completed."
            }
        ],

        inspectionNotes: [
            {
                title: "Transmission",
                description: "Shifts smoothly.",
                status: "pass"
            }
        ],

        bidHistory: [
            {
                bidder: "Sarah Malik",
                amount: 318000,
                time: "3 mins ago"
            },
            {
                bidder: "Ahmed Noor",
                amount: 315000,
                time: "6 mins ago"
            }
        ],
        image: "https://images.hindustantimes.com/auto/auto-images/mg/rc6/exterior_mg-rc6_front-left-side_600x400.jpg?imwidth=640",
        images: [
            "https://images.hindustantimes.com/auto/auto-images/mg/rc6/exterior_mg-rc6_front-left-side_600x400.jpg?imwidth=640",
            "https://stimg.cardekho.com/images/carexteriorimages/630x420/Tata/Sierra/12271/1765181428462/front-left-side-47.jpg?impolicy=resize&imwidth=360",
            "https://5.imimg.com/data5/SELLER/Default/2024/8/444303282/EO/TR/EQ/3199782/car-carrier-trailer-500x500.jpg",
            "https://images.unsplash.com/photo-1542362567-b07e54358753?auto=format&fit=crop&q=80&w=600",
        ],
    }
];