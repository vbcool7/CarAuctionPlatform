
import React from 'react';
import { Car, Gavel, Truck, Shield } from 'lucide-react';

const categories = [
  { id: 1, name: "SUV", percentage: 45, icon: Car, color: "bg-blue-500", theme: "bg-blue-50 text-blue-700", },
  { id: 2, name: "Sedan", percentage: 30, icon: Gavel, color: "bg-purple-500", theme: "bg-purple-50 text-purple-700", },
  { id: 3, name: "Trucks", percentage: 15, icon: Truck, color: "bg-green-500", theme: "bg-green-50 text-green-700", },
  { id: 4, name: "Others", percentage: 10, icon: Shield, color: "bg-orange-500", theme: "bg-orange-50 text-orange-700", },
];

function TopCategories() {
  return (
    <div className="bg-white p-4 md:p-5 rounded-2xl border border-gray-100 shadow-sm w-full max-w-md">
      
       <h2 className="text-[15px] md:text-lg font-bold text-gray-900 mb-5 md:mb-6">
        Top Performing categories
        </h2>

      <div className="space-y-7">
        {categories.map((cat) => {
          const Icon = cat.icon;
          return (
            <div
              key={cat.id}
              className="flex items-center gap-2 md:gap-4">

              <div className={`p-2 rounded-full ${cat.theme}`}>
                  <Icon className="w-4 h-4" />
                </div>
              <span className="w-10 md:w-16 font-medium text-[13px] md:text-sm">
                {cat.name}
              </span>

              <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full ${cat.color}`}
                  style={{ width: `${cat.percentage}%` }}
                />
              </div>

              <span className="w-10 text-right text-[13px] md:text-sm font-bold">
                {cat.percentage}%
              </span>
            </div>
          )
        })}
      </div>

      <button className="w-full mt-8 py-3 text-[13px] md:text-sm font-semibold text-[#D97706] border border-gray-100 rounded-lg hover:bg-gray-50">
        View All Categories
      </button>
    </div>
  );
}

export default TopCategories;