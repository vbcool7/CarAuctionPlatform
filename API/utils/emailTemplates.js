
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
                    href="${process.env.SELLER_PANEL_URL}"
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