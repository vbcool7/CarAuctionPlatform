
import React from 'react'
import SellCar from '../Components/SellCar';
import SellCarSteps from '../Components/SellCarSteps';
import SellCarFeatures from '../Components/SellCarFeatures';
import SellCarSellers from '../Components/SellCarSellers';
import SellCarFooter from '../Components/SellCarFooter';

function SellCarPage() {
    return (
        <>
            <SellCar />
            <SellCarSteps />
            <SellCarFeatures />
            <SellCarSellers />
            <SellCarFooter />
        </>
    )
}

export default SellCarPage;