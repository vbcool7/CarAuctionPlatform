
import React from 'react';
import { NavLink } from 'react-router-dom';

const linkCls = ({ isActive }) =>
    `wrap-break-word transition-all duration-300 ${isActive ? 'text-gray-300' : 'text-[#94A3B8] hover:text-[#F8FAFC]'}`;

// links = [{ to: '/path', label: 'Text' }]
function FooterColumn({ title, links }) {
    return (
        <div className="text-[15px] min-w-0 space-y-6">
            <h2 className="text-xl font-bold leading-tight text-gray-200">{title}</h2>

            <div className="flex min-w-0 flex-col gap-3">
                {links.map((l) => (
                    <NavLink key={l.to} to={l.to} className={linkCls}>
                        {l.label}
                    </NavLink>
                ))}
            </div>
        </div>
    );
}

export default FooterColumn;