
import SupportCallRequest from "../models/supportCallRequestModel.js";
import { getNextCallRequestId } from "../utils/counterHelper.js";

const TIME_SLOTS = [
    "9:00 AM to 12:00 PM",
    "1:00 PM to 3:00 PM",
    "4:00 PM to 6:00 PM",
];

// request a call
export const createSupportCallRequest = async (req, res) => {
    try {
        const userRole = String(req.user?.role || "").toLowerCase();

        const userTypeByRole = {
            buyer: "Buyer",
            seller: "Seller",
        };

        const userType = userTypeByRole[userRole];

        if (!req.user?.id || !userType) {
            return res.status(403).json({
                success: false,
                message: "Buyer or seller login required.",
            });
        }

        const {
            fullName,
            contactNumber,
            preferredDate,
            preferredTimeSlot,
            topic,
            description = "",
        } = req.body;

        if (
            !fullName?.trim() ||
            !contactNumber?.trim() ||
            !preferredDate?.trim() ||
            !preferredTimeSlot?.trim() ||
            !topic?.trim()
        ) {
            return res.status(400).json({
                success: false,
                message: "Please fill all required fields.",
            });
        }

        const normalizedContactNumber =
            typeof contactNumber === "string" ? contactNumber.trim() : "";

        if (!/^(05\d{8}|\+9715\d{8})$/.test(normalizedContactNumber)) {
            return res.status(400).json({
                success: false,
                message: "Enter a valid UAE mobile number (05XXXXXXXX or +9715XXXXXXXX).",
            });
        }

        const normalizedDescription =
            typeof description === "string" ? description.trim() : "";

        // Check that preferredDate is a real YYYY-MM-DD date.
        const date = new Date(`${preferredDate}T00:00:00.000Z`);
        if (
            !/^\d{4}-\d{2}-\d{2}$/.test(preferredDate) ||
            Number.isNaN(date.getTime()) ||
            date.toISOString().slice(0, 10) !== preferredDate
        ) {
            return res.status(400).json({
                success: false,
                message: "Please provide a valid preferred date.",
            });
        }

        if (!TIME_SLOTS.includes(preferredTimeSlot)) {
            return res.status(400).json({
                success: false,
                message: "Please select a valid time slot.",
            });
        }

        const callRequestId = await getNextCallRequestId();

        const callRequest = await SupportCallRequest.create({
            callRequestId,
            userId: req.user.id,
            userType,
            fullName: fullName.trim(),
            contactNumber: normalizedContactNumber,
            preferredDate,
            preferredTimeSlot,
            topic: topic.trim(),
            description: normalizedDescription,
        });

        return res.status(201).json({
            success: true,
            message: "Call request submitted successfully.",
            callRequest,
        });
    } catch (err) {
        console.log("createSupportCallRequest error:", err);

        return res.status(500).json({
            success: false,
            message: "Server error occurred.",
        });
    }
};

// get all call req
export const getMyCallRequests = async (req, res) => {
    try {
        const userId = req.user?.id;
        const role = String(req.user?.role || "").toLowerCase();

        const userTypeByRole = {
            buyer: "Buyer",
            seller: "Seller",
        };

        const userType = userTypeByRole[role];

        if (!userId || !userType || !["Buyer", "Seller"].includes(userType)) {
            return res.status(403).json({
                success: false,
                message: "Only buyers and sellers can access their call requests.",
            });
        }

        const status = String(req.query.status || "").trim().toLowerCase();
        const search = String(req.query.search || "").trim();
        const sortBy = String(req.query.sortBy || "newest").toLowerCase();

        const pageNumber = Math.max(1, Number.parseInt(req.query.page, 10) || 1);
        const limitNumber = Math.max(
            1,
            Math.min(100, Number.parseInt(req.query.limit, 10) || 10)
        );

        if (!["newest", "oldest"].includes(sortBy)) {
            return res.status(400).json({
                success: false,
                message: "sortBy must be newest or oldest.",
            });
        }

        const allowedStatuses = ["pending", "contacted", "completed", "cancelled"];

        if (status && status !== "all" && !allowedStatuses.includes(status)) {
            return res.status(400).json({
                success: false,
                message: "Invalid call request status.",
            });
        }

        const baseFilter = { userId, userType };
        const filter = { ...baseFilter };

        if (status && status !== "all") {
            filter.status = status;
        }

        if (search) {
            const safeSearch = search.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

            filter.$or = [
                { callRequestId: { $regex: safeSearch, $options: "i" } },
                { topic: { $regex: safeSearch, $options: "i" } },
                { description: { $regex: safeSearch, $options: "i" } },
            ];
        }
        const sort = sortBy === 'oldest'
            ? { createdAt: 1 }
            : { createdAt: -1 };

        const [callRequests, filteredTotal, totalRequests, pendingRequests, contactedRequests, completedRequests] =
            await Promise.all([
                SupportCallRequest.find(filter)
                    .sort(sort)
                    .skip((pageNumber - 1) * limitNumber)
                    .limit(limitNumber)
                    .lean(),

                SupportCallRequest.countDocuments(filter),

                SupportCallRequest.countDocuments(baseFilter),
                SupportCallRequest.countDocuments({ ...baseFilter, status: "pending" }),
                SupportCallRequest.countDocuments({ ...baseFilter, status: "contacted" }),
                SupportCallRequest.countDocuments({ ...baseFilter, status: "completed" }),
            ]);

        return res.status(200).json({
            success: true,
            message: 'Call requests fetched successfully.',
            callRequests,
            pagination: {
                total: filteredTotal,
                page: pageNumber,
                limit: limitNumber,
                totalPages: Math.ceil(filteredTotal / limitNumber),
            },
            stats: {
                totalRequests,
                pendingRequests,
                contactedRequests,
                completedRequests,
            },
        });
    } catch (error) {
        console.error('Get My Call Requests Error:', error);
        return res.status(500).json({
            success: false,
            message: 'Failed to fetch call requests.',
        });
    }
};