
import React from 'react'

import HowWorks from '../Components/HowWorks';
import HowWorksProcess from '../Components/HowWorksProcess';
import HowWorksDetail from '../Components/HowWorksDetail';
import HowWorksFeaturebar from '../Components/HowWorksFeaturebar';
import HowWorksFooter from '../Components/HowWorksFooter';

function HowItWorkPage() {
    return (
        <>
            <HowWorks />
            <HowWorksProcess />
            <HowWorksDetail />
            <HowWorksFeaturebar />
            <HowWorksFooter />
        </>
    )
}

export default HowItWorkPage;