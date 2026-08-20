
import React, { useState } from 'react';
import { ArrowLeft, CheckCircle2, ChevronRight, XCircle, Check, X, FileText, Info, ZoomIn, X as CloseIcon } from 'lucide-react';
import { verificationData } from '../Data';
import toast from 'react-hot-toast';
import { useGetSellerById } from '../../hooks/useSeller';

function SellerKycVerificationDetail({sellerKycId, setCurrentPage}) {

    const { data: buyerData, isLoading, isError } = useGetSellerById(buyerKycId);

  return (
    <div>SellerKycVerificationDetail</div>
  )
}

export default SellerKycVerificationDetail