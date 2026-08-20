
// addmin - add seller
export const buildWelcomeEmail = (email, rawPassword) => {
    const subject = "Welcome to BidDrive - Your Seller Account";
    const html = `
    <div style="
        max-width: 550px;
        margin: 0 auto;
        background: #ffffff;
        border: 1px solid #e2e8f0;
        border-radius: 10px;
        overflow: hidden;
    ">

        <!-- Header -->
        <div style="
            background-color: #0B1E3D;
            padding: 22px;
            text-align: center;
        ">
            <h1 style="
                margin: 0;
                color: #ffffff;
                font-size: 26px;
            ">
                Bid<span style="color: #D97706;">Drive</span>
            </h1>
        </div>

        <!-- Content -->
        <div style="padding: 30px;">

            <h2 style="
                margin: 0 0 15px;
                font-size: 22px;
                color: #0B1E3D;
            ">
                Welcome to BidDrive!
            </h2>

            <p style="
                margin: 0 0 20px;
                color: #64748b;
                font-size: 14px;
                line-height: 1.6;
            ">
                Your seller account has been successfully created.
                You can now log in to your BidDrive seller account.
            </p>

            <!-- Login Details -->
            <div style="
                background-color: #f8fafc;
                border: 1px solid #e2e8f0;
                border-radius: 8px;
                padding: 18px;
                margin-bottom: 25px;
            ">

                <p style="
                    margin: 0 0 12px;
                    font-size: 13px;
                    font-weight: bold;
                    color: #475569;
                ">
                    YOUR LOGIN DETAILS
                </p>

                <p style="
                    margin: 8px 0;
                    font-size: 14px;
                    color: #475569;
                ">
                    <strong>Email:</strong> ${email}
                </p>

                <p style="
                    margin: 8px 0;
                    font-size: 14px;
                    color: #475569;
                ">
                    <strong>Password:</strong>
                    <span style="
                        color: #D97706;
                        font-weight: bold;
                    ">
                        ${rawPassword}
                    </span>
                </p>

            </div>

            <!-- Login Button -->
            <div style="text-align: center; margin-bottom: 25px;">
                <a
                    href="${process.env.LOGIN_URL}"
                    style="
                        display: inline-block;
                        background-color: #D97706;
                        color: #ffffff;
                        text-decoration: none;
                        padding: 12px 25px;
                        border-radius: 6px;
                        font-size: 14px;
                        font-weight: bold;
                    "
                >
                    Login to Seller Panel
                </a>
            </div>

            <p style="
                margin: 22px 0 0;
                color: #475569;
                font-size: 13px;
            ">
                Regards,<br />
                <strong>BidDrive Team</strong>
            </p>

        </div>

        <!-- Footer -->
        <div style="
            padding: 15px;
            text-align: center;
            background-color: #f8fafc;
            border-top: 1px solid #e2e8f0;
        ">
            <p style="
                margin: 0;
                color: #94a3b8;
                font-size: 11px;
            ">
                © ${new Date().getFullYear()} BidDrive. All rights reserved.
            </p>
        </div>

    </div>
`;
    return { subject, html };
};

export const buildPendingActivationEmail = () => {
    const subject = "BidDrive Seller Account Created - Pending Activation";

    const html = `
        <div style="
            max-width: 550px;
            margin: 0 auto;
            background: #ffffff;
            border: 1px solid #e2e8f0;
            border-radius: 10px;
            overflow: hidden;
            font-family: Arial, Helvetica, sans-serif;
        ">

            <!-- Header -->
            <div style="
                background-color: #0B1E3D;
                padding: 22px;
                text-align: center;
            ">
                <h1 style="
                    margin: 0;
                    color: #ffffff;
                    font-size: 26px;
                ">
                    Bid<span style="color: #D97706;">Drive</span>
                </h1>
            </div>

            <!-- Content -->
            <div style="padding: 30px;">

                <h2 style="
                    margin: 0 0 15px;
                    font-size: 22px;
                    color: #0B1E3D;
                ">
                    Account Created
                </h2>

                <p style="
                    margin: 0 0 20px;
                    color: #64748b;
                    font-size: 14px;
                    line-height: 1.6;
                ">
                    Your BidDrive seller account has been created successfully
                    by an administrator.
                </p>

                <div style="
                    background-color: #fffbeb;
                    border: 1px solid #fde68a;
                    border-radius: 8px;
                    padding: 16px;
                    margin-bottom: 20px;
                ">
                    <p style="
                        margin: 0;
                        color: #92400e;
                        font-size: 14px;
                        font-weight: bold;
                    ">
                        Your account is pending activation.
                    </p>

                    <p style="
                        margin: 8px 0 0;
                        color: #78350f;
                        font-size: 13px;
                        line-height: 1.5;
                    ">
                        You will receive another email once your account
                        has been activated.
                    </p>
                </div>

                <p style="
                    margin: 0;
                    color: #475569;
                    font-size: 13px;
                ">
                    Regards,<br />
                    <strong>BidDrive Team</strong>
                </p>

            </div>

            <!-- Footer -->
            <div style="
                padding: 15px;
                text-align: center;
                background-color: #f8fafc;
                border-top: 1px solid #e2e8f0;
            ">
                <p style="
                    margin: 0;
                    color: #94a3b8;
                    font-size: 11px;
                ">
                    © ${new Date().getFullYear()} BidDrive. All rights reserved.
                </p>
            </div>

        </div>
    `;

    return { subject, html };
};

// admin - add buyer
export const buildBuyerWelcomeEmail = (email, rawPassword) => {
    const subject = "Welcome to BidDrive - Your Buyer Account";

    const html = `
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="UTF-8" />
            <meta name="viewport" content="width=device-width, initial-scale=1.0" />
            <title>Welcome to BidDrive</title>
        </head>

        <body style="margin:0; padding:0; background-color:#f5f7fa; font-family:Arial, Helvetica, sans-serif; color:#1e293b;">

            <table width="100%" cellpadding="0" cellspacing="0" style="padding:40px 15px;">
                <tr>
                    <td align="center">

                        <table
                            width="600"
                            cellpadding="0"
                            cellspacing="0"
                            style="max-width:600px; width:100%; background:#ffffff; border-radius:16px; overflow:hidden; border:1px solid #e2e8f0;"
                        >

                            <!-- Header -->
                            <tr>
                                <td style="background:#0B1E3D; padding:28px 35px; text-align:center;">
                                    <h1 style="margin:0; color:#ffffff; font-size:28px;">
                                        Bid<span style="color:#D97706;">Drive</span>
                                    </h1>
                                    <p style="margin:8px 0 0; color:#cbd5e1; font-size:14px;">
                                        Premium Vehicle Auction Marketplace
                                    </p>
                                </td>
                            </tr>

                            <!-- Content -->
                            <tr>
                                <td style="padding:35px;">

                                    <div style="text-align:center; margin-bottom:25px;">
                                        <div
                                            style="
                                                display:inline-block;
                                                width:55px;
                                                height:55px;
                                                line-height:55px;
                                                background:#fff7ed;
                                                border-radius:50%;
                                                color:#D97706;
                                                font-size:25px;
                                            "
                                        >
                                            🚗
                                        </div>
                                    </div>

                                    <h2 style="margin:0 0 12px; text-align:center; color:#0B1E3D; font-size:23px;">
                                        Welcome to BidDrive!
                                    </h2>

                                    <p style="font-size:15px; line-height:1.7; color:#475569; margin:0 0 20px;">
                                        Your buyer account has been successfully created by a BidDrive administrator.
                                        You can now access the platform and explore vehicles available for auction.
                                    </p>

                                    <!-- Account Details -->
                                    <div
                                        style="
                                            background:#f8fafc;
                                            border:1px solid #e2e8f0;
                                            border-radius:12px;
                                            padding:20px;
                                            margin:25px 0;
                                        "
                                    >
                                        <p style="margin:0 0 12px; font-size:13px; color:#64748b;">
                                            YOUR ACCOUNT DETAILS
                                        </p>

                                        <p style="margin:8px 0; font-size:14px;">
                                            <strong>Email:</strong>
                                            ${email}
                                        </p>

                                        <p style="margin:8px 0; font-size:14px;">
                                            <strong>Password:</strong>
                                            ${rawPassword}
                                        </p>
                                    </div>

                                    <div style="text-align:center; margin:28px 0;">
                                        <a
                                            href="${process.env.LOGIN_URL}"
                                            style="
                                                display:inline-block;
                                                background:#D97706;
                                                color:#ffffff;
                                                text-decoration:none;
                                                padding:13px 28px;
                                                border-radius:8px;
                                                font-size:14px;
                                                font-weight:bold;
                                            "
                                        >
                                            Login to BidDrive
                                        </a>
                                    </div>

                                    <div
                                        style="
                                            background:#fff7ed;
                                            border-left:4px solid #D97706;
                                            padding:14px 16px;
                                            margin-top:25px;
                                        "
                                    >
                                        <p style="margin:0; font-size:13px; line-height:1.6; color:#7c2d12;">
                                            For your security, please change your password after your first login.
                                        </p>
                                    </div>

                                </td>
                            </tr>

                            <!-- Footer -->
                            <tr>
                                <td
                                    style="
                                        background:#f8fafc;
                                        border-top:1px solid #e2e8f0;
                                        padding:22px 35px;
                                        text-align:center;
                                    "
                                >
                                    <p style="margin:0 0 6px; font-size:13px; color:#64748b;">
                                        Thank you for choosing BidDrive.
                                    </p>

                                    <p style="margin:0; font-size:12px; color:#94a3b8;">
                                        © ${new Date().getFullYear()} BidDrive. All rights reserved.
                                    </p>
                                </td>
                            </tr>

                        </table>

                    </td>
                </tr>
            </table>

        </body>
        </html>
    `;

    return { subject, html };
};

export const buildPendingBuyerActivationEmail = () => {
    const subject = "BidDrive Buyer Account - Pending Activation";

    const html = `
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="UTF-8" />
            <meta name="viewport" content="width=device-width, initial-scale=1.0" />
            <title>Account Pending Activation</title>
        </head>

        <body style="margin:0; padding:0; background:#f5f7fa; font-family:Arial, Helvetica, sans-serif; color:#1e293b;">

            <table width="100%" cellpadding="0" cellspacing="0" style="padding:40px 15px;">
                <tr>
                    <td align="center">

                        <table
                            width="600"
                            cellpadding="0"
                            cellspacing="0"
                            style="max-width:600px; width:100%; background:#ffffff; border-radius:16px; overflow:hidden; border:1px solid #e2e8f0;"
                        >

                            <!-- Header -->
                            <tr>
                                <td style="background:#0B1E3D; padding:28px 35px; text-align:center;">
                                    <h1 style="margin:0; color:#ffffff; font-size:28px;">
                                        Bid<span style="color:#D97706;">Drive</span>
                                    </h1>
                                    <p style="margin:8px 0 0; color:#cbd5e1; font-size:14px;">
                                        Buyer Account
                                    </p>
                                </td>
                            </tr>

                            <!-- Content -->
                            <tr>
                                <td style="padding:40px 35px; text-align:center;">

                                    <div
                                        style="
                                            display:inline-block;
                                            width:65px;
                                            height:65px;
                                            line-height:65px;
                                            background:#fff7ed;
                                            border-radius:50%;
                                            font-size:30px;
                                            margin-bottom:20px;
                                        "
                                    >
                                        ⏳
                                    </div>

                                    <h2 style="margin:0 0 15px; color:#0B1E3D; font-size:23px;">
                                        Account Pending Activation
                                    </h2>

                                    <p
                                        style="
                                            margin:0 auto 20px;
                                            max-width:480px;
                                            font-size:15px;
                                            line-height:1.7;
                                            color:#475569;
                                        "
                                    >
                                        Your BidDrive buyer account has been created by an administrator.
                                        However, your account is currently pending activation.
                                    </p>

                                    <!-- Status -->
                                    <div
                                        style="
                                            display:inline-block;
                                            background:#fffbeb;
                                            border:1px solid #fde68a;
                                            color:#92400e;
                                            padding:10px 20px;
                                            border-radius:30px;
                                            font-size:13px;
                                            font-weight:bold;
                                            margin:10px 0 25px;
                                        "
                                    >
                                        ● Pending Activation
                                    </div>

                                    <p
                                        style="
                                            margin:0 auto;
                                            max-width:480px;
                                            font-size:14px;
                                            line-height:1.7;
                                            color:#64748b;
                                        "
                                    >
                                        You will receive another email once your account has been
                                        activated and is ready to use.
                                    </p>

                                    <div
                                        style="
                                            margin-top:30px;
                                            padding:18px;
                                            background:#f8fafc;
                                            border:1px solid #e2e8f0;
                                            border-radius:12px;
                                        "
                                    >
                                        <p style="margin:0; font-size:13px; color:#64748b; line-height:1.6;">
                                            No action is required from you at this time.
                                            Please wait for the activation confirmation from BidDrive.
                                        </p>
                                    </div>

                                </td>
                            </tr>

                            <!-- Footer -->
                            <tr>
                                <td
                                    style="
                                        background:#f8fafc;
                                        border-top:1px solid #e2e8f0;
                                        padding:22px 35px;
                                        text-align:center;
                                    "
                                >
                                    <p style="margin:0 0 6px; font-size:13px; color:#64748b;">
                                        Thank you for choosing BidDrive.
                                    </p>

                                    <p style="margin:0; font-size:12px; color:#94a3b8;">
                                        © ${new Date().getFullYear()} BidDrive. All rights reserved.
                                    </p>
                                </td>
                            </tr>

                        </table>

                    </td>
                </tr>
            </table>

        </body>
        </html>
    `;

    return { subject, html };
};

// doc re-upload 
export const reUploadDocumentEmail = (email, group, rejectionReason) => {
    const subject = "Action Required: Please Re-upload Your Document";
    const html = `
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="UTF-8" />
            <meta name="viewport" content="width=device-width, initial-scale=1.0" />
            <title>Document Re-upload Required</title>
        </head>

        <body style="margin:0; padding:0; background-color:#f8fafc; font-family:Arial, Helvetica, sans-serif; color:#334155;">

            <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:#f8fafc; padding:40px 15px;">
                <tr>
                    <td align="center">

                        <table width="100%" cellpadding="0" cellspacing="0" border="0"
                            style="max-width:600px; background-color:#ffffff; border:1px solid #e2e8f0; border-radius:12px; overflow:hidden;">

                            <!-- Header -->
                            <tr>
                                <td style="background-color:#0B1E3D; padding:24px 30px; text-align:center;">
                                    <h1 style="margin:0; color:#ffffff; font-size:22px;">
                                        BidDrive
                                    </h1>

                                    <p style="margin:8px 0 0; color:#cbd5e1; font-size:13px;">
                                        Document Verification
                                    </p>
                                </td>
                            </tr>

                            <!-- Content -->
                            <tr>
                                <td style="padding:35px 30px;">

                                    <h2 style="margin:0 0 15px; color:#0B1E3D; font-size:20px;">
                                        Document Re-upload Required
                                    </h2>

                                    <p style="margin:0 0 20px; font-size:14px; line-height:1.7;">
                                        Hello,
                                    </p>

                                    <p style="margin:0 0 20px; font-size:14px; line-height:1.7;">
                                        We reviewed your verification documents and found that
                                        one of the submitted documents could not be approved.
                                        Please re-upload a valid document to complete your verification.
                                    </p>

                                    <!-- Document Details -->
                                    <table width="100%" cellpadding="0" cellspacing="0" border="0"
                                        style="background-color:#fff7ed; border:1px solid #fed7aa; border-radius:8px; margin:20px 0;">

                                        <tr>
                                            <td style="padding:18px;">

                                                <p style="margin:0 0 8px; font-size:13px; color:#64748b;">
                                                    Document
                                                </p>

                                                <p style="margin:0 0 15px; font-size:15px; font-weight:bold; color:#0B1E3D;">
                                                    ${group}
                                                </p>

                                                <p style="margin:0 0 8px; font-size:13px; color:#64748b;">
                                                    Reason for rejection
                                                </p>

                                                <p style="margin:0; font-size:14px; line-height:1.6; color:#475569;">
                                                    ${rejectionReason}
                                                </p>

                                            </td>
                                        </tr>

                                    </table>

                                    <p style="margin:20px 0; font-size:14px; line-height:1.7;">
                                        Please re-submit the required document to complete your verification.
                                    </p>

                                    <!-- CTA -->
                                    <table width="100%" cellpadding="0" cellspacing="0" border="0">
                                        <tr>
                                            <td align="center" style="padding:10px 0 20px;">

                                                <a href="#"
                                                    style="display:inline-block; background-color:#D97706; color:#ffffff; text-decoration:none; padding:12px 24px; border-radius:7px; font-size:14px; font-weight:bold;">
                                                    Re-upload Document
                                                </a>

                                            </td>
                                        </tr>
                                    </table>

                                    <p style="margin:10px 0 0; font-size:13px; line-height:1.6; color:#64748b;">
                                        If you believe this rejection was made in error, please
                                        contact our support team.
                                    </p>

                                    <p style="margin:25px 0 0; font-size:14px; line-height:1.6;">
                                        Regards,<br />
                                        <strong style="color:#0B1E3D;">BidDrive Team</strong>
                                    </p>

                                </td>
                            </tr>

                            <!-- Footer -->
                            <tr>
                                <td style="background-color:#f8fafc; border-top:1px solid #e2e8f0; padding:18px 30px; text-align:center;">

                                    <p style="margin:0; font-size:11px; color:#94a3b8;">
                                        This is an automated email. Please do not reply directly to this email.
                                    </p>

                                    <p style="margin:8px 0 0; font-size:11px; color:#94a3b8;">
                                        © ${new Date().getFullYear()} BidDrive. All rights reserved.
                                    </p>

                                </td>
                            </tr>

                        </table>

                    </td>
                </tr>
            </table>

        </body>
        </html>
    `;
    return { subject, html };
};