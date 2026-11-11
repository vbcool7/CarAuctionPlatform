
export const DISPUTE_STAFF_ROOM = 'staff:disputes';

export const CHAT_OPEN_STATUSES = ['open', 'under_review'];
export const isDisputeChatOpen = (d) => CHAT_OPEN_STATUSES.includes(d?.status);

export const DISPUTE_MAX_TEXT = 1000;

export const partyRoleOf = (d, user) => {
    const typeOf = user?.role === 'buyer' ? 'Buyer' : user?.role === 'seller' ? 'Seller' : null;
    if (!typeOf || !d) return null;

    for (const p of [d.raisedBy, d.against]) {
        if (p && String(p.id) === String(user.id) && p.type === typeOf) return p.role;
    }
    return null;
};

export const partyIdsOf = (d) =>
    [d.raisedBy, d.against].filter(Boolean).map((p) => String(p.id));