
import React, { useState } from 'react';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import { Calendar, ChevronDown, Download } from 'lucide-react';
import Stats from './Stats';
import SalesOverviewGraph from './SalesOverviewGraph';
import AuctionPerformanceGraph from './AuctionPerformanceGraph';
import RecentActivities from './RecentActivities';
import TopCategories from './TopCategories';
import SystemOverview from './SystemOverview';

function Dashboard() {

    const [dateRange, setDateRange] = useState([new Date(), new Date()]);
    const [startDate, endDate] = dateRange;

    return (
        <div className='space-y-8 pb-6'>

            {/* header */}
            <div className='w-full flex flex-col md:flex-row justify-between items-start md:items-center gap-4 md:gap-0'>

                <div className='flex flex-col'>
                    <h1 className='text-xl md:text-2xl font-bold'>Dashboard</h1>
                    <p className='text-xs md:text-sm text-gray-600 p-px'>
                        Welcome back, Admin! Here's what's happening with BidDrive today.
                    </p>
                </div>

                <div className='flex flex-col md:flex md:flex-row w-full md:w-auto gap-3'>
                    <div className='flex flex-1 md:flex-none items-center justify-center gap-2 px-3 py-2 font-semibold border border-gray-300 text-gray-700 rounded-lg text-[13px] bg-white hover:bg-gray-50 transition-colors cursor-pointer'>
                        <Calendar className='w-4 h-4' />
                        <span className='whitespace-nowrap'>May 14 - May 20, 2024</span>
                    </div>

                    <button className='flex flex-1 md:flex-none items-center justify-center gap-2 px-3 py-2 font-semibold border border-gray-300 text-gray-700 rounded-lg text-[13px] bg-white hover:bg-gray-50 transition-colors whitespace-nowrap'>
                        <Download className='w-4 h-4' />
                        Export
                    </button>
                </div>
            </div>

            {/* stats */}
            <Stats />

            {/* charts */}
            <div className='grid grid-cols-1 xl:grid-cols-2 gap-5'>
                <SalesOverviewGraph />
                <AuctionPerformanceGraph />
            </div>

            {/* bottom section */}
            <div className='grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5'>
                <RecentActivities />
                <TopCategories />
                <SystemOverview />
            </div>
        </div>
    )
}

export default Dashboard;