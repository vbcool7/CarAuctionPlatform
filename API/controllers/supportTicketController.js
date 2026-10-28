
import SupportTicket, { BUYER_CATEGORIES, SELLER_CATEGORIES } from "../models/supportTicketModelSchema.js";
import { getNextSupportId } from "../utils/counterHelper.js";
import { deleteCloudinaryFiles } from "../utils/cloudinaryUtils.js";

// ticket create
export const createSupportTicket = async (req, res) => {
    try {
        const { subject, category, priority = "medium", description } = req.body;

        if (!subject?.trim() || !category?.trim() || !description?.trim()) {
            await deleteCloudinaryFiles(req.file);
            return res.status(400).json({
                success: false,
                message: "Please fill required fields",
            });
        }

        const userRole = String(req.user?.role || "").toLowerCase();

        if (!req.user?.id || !["buyer", "seller"].includes(userRole)) {
            await deleteCloudinaryFiles(req.file);
            return res.status(403).json({
                success: false,
                message: "Login Required.",
            });
        }

        const userType = userRole === "buyer" ? "Buyer" : "Seller";

        const normalizedPriority = String(priority).toLowerCase();

        const allowedPriorities = ["low", "medium", "high"];

        if (!allowedPriorities.includes(normalizedPriority)) {
            await deleteCloudinaryFiles(req.file);
            return res.status(400).json({
                success: false,
                message: "Priority should be low, medium, or high.",
            });
        }

        const allowedCategories =
            userType === "Buyer"
                ? BUYER_CATEGORIES
                : SELLER_CATEGORIES;

        const normalizedCategory = String(category).trim().toLowerCase();

        if (!allowedCategories.includes(normalizedCategory)) {
            await deleteCloudinaryFiles(req.file);
            return res.status(400).json({
                success: false,
                message: "Invalid support category for this account.",
            });
        }

        const attachment = req.file
            ? {
                url: req.file.path,
                publicId: req.file.filename,
                fileName: req.file.originalname,
                fileType: req.file.mimetype,
            }
            : undefined;

        const supportId = await getNextSupportId();

        const ticket = await SupportTicket.create({
            supportId,
            userId: req.user.id,
            userType,
            subject: subject.trim(),
            category: normalizedCategory,
            priority: normalizedPriority,
            description: description.trim(),
            ...(attachment && { attachment }),
        });

        return res.status(201).json({
            success: true,
            message: "Support ticket submitted successfully.",
            ticket,
        });

    } catch (err) {
        await deleteCloudinaryFiles(req.file);
        console.log("createSupportTicket error :", err);
        return res.status(500).json({
            success: false,
            message: "Server Error Occured"
        });
    }
};

// get my tickets
export const getMySupportTickets = async (req, res) => {
    try {
        const userId = req.user?.id;
        const userRole = String(req.user?.role || "").toLowerCase();

        if (!userId || !["buyer", "seller"].includes(userRole)) {
            return res.status(403).json({
                success: false,
                message: "Login required.",
            });
        }

        const userType = userRole === "buyer" ? "Buyer" : "Seller";

        const status = String(req.query.status || "").trim().toLowerCase();
        const search = String(req.query.search || "").trim();
        const sortBy = String(req.query.sortBy || "newest").toLowerCase();

        const page = Math.max(1, Number.parseInt(req.query.page, 10) || 1);
        const limit = Math.min(
            50,
            Math.max(1, Number.parseInt(req.query.limit, 10) || 10)
        );

        if (!["newest", "oldest"].includes(sortBy)) {
            return res.status(400).json({
                success: false,
                message: "sortBy must be newest or oldest.",
            });
        }

        const baseFilter = { userId, userType };
        const filter = { ...baseFilter };

        const statusByTab = {
            open: "open",
            "in progress": "in_progress",
            in_progress: "in_progress",
            resolved: "resolved",
            closed: "closed",
        };

        if (status && status !== "all" && status !== "all tickets") {
            const normalizedStatus = statusByTab[status];

            if (!normalizedStatus) {
                return res.status(400).json({
                    success: false,
                    message: "Invalid ticket status.",
                });
            }

            filter.status = normalizedStatus;
        }

        if (search) {
            const safeSearch = search.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

            filter.$or = [
                { supportId: { $regex: safeSearch, $options: "i" } },
                { subject: { $regex: safeSearch, $options: "i" } },
                { category: { $regex: safeSearch, $options: "i" } },
            ];
        }

        const skip = (page - 1) * limit;
        const sortOrder = sortBy === "oldest" ? 1 : -1;

        const [
            tickets,
            filteredTotal,
            totalTickets,
            openTickets,
            inProgressTickets,
            resolvedTickets,
        ] = await Promise.all([
            SupportTicket.find(filter)
                .sort({ createdAt: sortOrder })
                .skip(skip)
                .limit(limit)
                .lean(),

            SupportTicket.countDocuments(filter),

            SupportTicket.countDocuments(baseFilter),
            SupportTicket.countDocuments({ ...baseFilter, status: "open" }),
            SupportTicket.countDocuments({
                ...baseFilter,
                status: "in_progress",
            }),
            SupportTicket.countDocuments({
                ...baseFilter,
                status: "resolved",
            }),
        ]);

        return res.status(200).json({
            success: true,
            tickets,
            pagination: {
                totalTickets: filteredTotal,
                currentPage: page,
                totalPages: Math.ceil(filteredTotal / limit),
                limit,
            },
            stats: {
                totalTickets,
                openTickets,
                inProgressTickets,
                resolvedTickets,
            },
        });
    } catch (err) {
        console.log("getMySupportTickets error:", err);

        return res.status(500).json({
            success: false,
            message: "Server error occurred.",
        });
    }
};