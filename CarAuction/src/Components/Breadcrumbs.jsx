
import React from 'react';
import { Link } from 'react-router-dom';
import { IoChevronForward } from 'react-icons/io5';

const Breadcrumbs = ({ items }) => {
    return (
        <section className="w-full ">

            {/* Parent container - scrollable */}
            <div className="max-w-6xl mx-auto flex items-center text-sm py-4 capitalize overflow-x-auto scrollbar-hide">
                {items.map((item, index) => {
                    const isLast = index === items.length - 1;

                    return (
                        <div key={index} className="flex items-center whitespace-nowrap shrink-0 gap-1 text-[12px] md:text-sm">
                            {!isLast && item.path ? (
                                <Link
                                    to={item.path}
                                    className="text-gray-500 hover:text-[#0B1E3D] transition-colors"
                                >
                                    {item.label}
                                </Link>
                            ) : (
                                <span className={`${isLast ? "text-gray-800 font-semibold truncate max-w-37.5 md:max-w-none" : "text-gray-500"}`}>
                                    {item.label}
                                </span>
                            )}

                            {!isLast && <IoChevronForward className="text-gray-400 text-[10px] shrink-0 mx-1" />}
                        </div>
                    );
                })}
            </div>
        </section>
    );
};

export default Breadcrumbs;