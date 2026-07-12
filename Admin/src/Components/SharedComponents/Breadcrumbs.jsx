
import React from 'react';
import { IoChevronForward } from 'react-icons/io5';

const Breadcrumbs = ({ items }) => {
  return (
    <section className="w-full">
      <div className="max-w-6xl mx-auto flex items-center text-sm pt-2 pb-4 capitalize overflow-x-auto scrollbar-hide">
        {items.map((item, index) => {
          const isLast = index === items.length - 1;

          return (
            <div key={index} className="flex items-center whitespace-nowrap shrink-0 gap-1 text-[12px] md:text-sm">
              {!isLast && item.onClick ? (
                <button
                  onClick={item.onClick}
                  className="text-gray-500 hover:text-[#D97706] transition-colors"
                >
                  {item.label}
                </button>
              ) : (
                <span className={`${isLast ? "text-[#D97706] truncate max-w-37.5 md:max-w-none" : "text-gray-500"}`}>
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