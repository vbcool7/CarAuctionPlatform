import React from 'react'
import Hero from '../Components/Hero';
import AuctionSearch from '../Components/AuctionSearch';
import HomeCategory from '../Components/HomeCategory';
import HowItWork from '../Components/HowItWork';
import HomeLiveAuctions from '../Components/HomeLiveAuctions';
import HomeRecentlySold from '../Components/HomeRecentlySold';
import HomeReviews from '../Components/HomeReviews';

function HomePage() {
    return (
        <>
            <Hero />
            <div className="-mt-18 relative z-20">
                <AuctionSearch />
            </div>
            <HomeCategory />
            <HowItWork />
            <HomeLiveAuctions />
            <HomeRecentlySold />
            <HomeReviews />
        </>
    )
}

export default HomePage;