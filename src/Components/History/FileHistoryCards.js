"use client";
import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { BASE_URL, buildCadConverterOutputUrl, toCadOutputCdnUrl, CAD_CONVERTER_EVENT } from '@/config';
import styles from './FileHistory.module.css';
import Pagenation from '../CommonJsx/Pagenation';
import { sendClarityEvent, sendGAtagEvent } from "@/common.helper";
import ConvertedFileUploadPopup from '../CommonJsx/ConvertedFileUploadPopup';
import { contextState } from '../CommonJsx/ContextProvider';
import EmailOTP from '../CommonJsx/EmailOTP';
import PublishCadPopUp from '../CommonJsx/PublishCadPopUp';
import { useRouter } from "next/navigation";
import ProfilePage from './ProfilePage'
import CadViewerFiles from './CadViewerFiles';
import CadConvertorFiles from './CadConvertorFiles';
import CadPublishedFiles from './CadPublishedFiles';
import UserLoginPupUp from '../CommonJsx/UserLoginPupUp';
import { toast } from 'react-toastify';
import { checkConverterDownload, redeemConverterCredit } from '@/api/converterPaymentApi';
import { ensureConverterDownloadAccess, ensureConverterPackPurchase } from './converterPayment';
import ConverterDownloadFlow from './ConverterDownloadFlow';
import ConverterCreditPlansPopup from './ConverterCreditPlansPopup';
import {
  fetchConverterPricingInfo,
  getConverterPacksFromInfo,
  getSinglePriceLabelFromInfo,
  buildConverterPricingDisplay,
} from '@/lib/converterPricing';

let cachedCadHistory = {};

function FileHistoryCards({ cad_type, currentPage, setCurrentPage, totalPages, 
  setTotalPages,creatorId, profilePageDetails }) {
  
  // const { user } = useContext(contextState);
  const [cadViewerFileHistory, setCadViewerFileHistory] = useState([]);
  const [downloading, setDownloading] = useState({});
  const [downloadingReport, setDownloadingReport] = useState({});
  const [cadConverterFileHistory, setConverterFileHistory] = useState([]);
  const [userCadFiles, setUserCadFiles] = useState([]);
  const [userDownloadFiles, setUserDownloadFiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [publishCad, setPublishCad] = useState(false);
  const [isEmailVerify, setIsEmailVerify] = useState(false);
  const [isUserVerified, setIsUserVerified] = useState(false);
  const [pendingAction, setPendingAction] = useState(null);
  const [publishCadPopUp, setPublishCadPopUp] = useState(null);
  const [openConverterBilling, setOpenConverterBilling] = useState(false);
  const [pendingConverterDownload, setPendingConverterDownload] = useState(null);
  const [converterBillingDetails, setConverterBillingDetails] = useState(null);
  const [showCreditPlans, setShowCreditPlans] = useState(false);
  const [creditPacks, setCreditPacks] = useState([]);
  const [singlePriceLabel, setSinglePriceLabel] = useState('');
  const [pendingPack, setPendingPack] = useState(null);
  // const [publishCadPopUp, setPublishCadPopUp] = useState(null);
  const [editDetails, serEditDetails] = useState(null);
  const { user, setUser, cadDetailsUpdate } = useContext(contextState);
  // console.log(viewer,user)
  const limit = 12;
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');
  const [selectedFilter, setSelectedFilter] = useState({ id: 'All', label: 'All' }); // Initialize as object

  // Debounce search term to avoid too many API calls
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 500);

    return () => clearTimeout(timer);
  }, [searchTerm]);

  useEffect(() => {
    let cancelled = false;
    fetchConverterPricingInfo()
      .then((info) => {
        if (cancelled) return;
        setCreditPacks(getConverterPacksFromInfo(info));
        setSinglePriceLabel(getSinglePriceLabelFromInfo(info));
        if (info?.credits != null) {
          setUser((prev) => ({ ...prev, converter_credits: Number(info.credits) || 0 }));
        }
      })
      .catch(() => {
        if (!cancelled) {
          setCreditPacks([]);
          setSinglePriceLabel('');
        }
      });
    return () => {
      cancelled = true;
    };
  }, [setUser]);



  const handlePublishCad=()=>{
    if(!localStorage.getItem('is_verified')){
      setIsUserVerified(true)
    }else{
      if(!user.name){
        toast.info('Please complete your profile to publish CAD files.', {
          position: "top-right",
          autoClose: 5000,
      });
      }else{
        setPublishCadPopUp(true)
      }
      
    }
  }
  // Reset to page 1 when search term changes
  useEffect(() => {
    if (debouncedSearchTerm !== '') {
      setCurrentPage(1);
    }
  }, [debouncedSearchTerm, setCurrentPage]);

  useEffect(() => {
    if (cad_type === 'USER_PROFILE') {
      return;
    }
    let isMounted = true;

    const fetchFileHistory = async () => {
      if (!isMounted) return;

      try {
        // Updated API call with search parameter and tag filter
        const apiParams = { 
          type: cad_type, 
          username:creatorId&&creatorId,
          page: currentPage, 
          limit,
          search: debouncedSearchTerm,
          profile_page:profilePageDetails?true:false
        };

        // Add tag parameter only if it's not 'All' and we're dealing with CAD files
        if (selectedFilter && selectedFilter.id !== 'All' && (cad_type === 'USER_CADS' || cad_type === 'USER_DOWNLOADS')) {
          apiParams.tags = selectedFilter.id; // Send the tag ID
        }

        console.log('API Params:', apiParams); // Debug log

        const response = await axios.get(`${BASE_URL}/v1/cad/get-file-history`, {
          params: apiParams,
          headers: {
            "user-uuid": localStorage.getItem("uuid"),
          },
        });

        if (!isMounted) return;  // Don't update state if component unmounted

        if (response.data.meta.success) {
          const cad_viewer_files = response.data.data.cad_viewer_files.map(file => ({
            ...file,
            createdAtFormatted: formatDate(file.createdAt),
          }));

          const cad_converter_files = response.data.data.cad_converter_files.map(file => ({
            ...file,
            createdAtFormatted: formatDate(file.createdAt),
          }));

          const my_cad_files = response.data.data.my_cad_files.map(file => ({
            ...file,
            createdAtFormatted: formatDate(file.createdAt),
          }));

          const my_download_files = response.data.data.user_download_files.map(file => ({
            ...file,
            createdAtFormatted: formatDate(file.createdAt),
          }));

          const page = response.data.data.pagination.page;
          const totalPages = response.data.data.pagination.cadFilesPages;

          // Update all states at once
          setCadViewerFileHistory(cad_viewer_files);
          setConverterFileHistory(cad_converter_files);
          setUserCadFiles(my_cad_files);
          setUserDownloadFiles(my_download_files);
          setCurrentPage(page);
          setTotalPages(totalPages);

          // Cache for reuse
          cachedCadHistory[cad_type] = {
            cad_viewer_files,
            cad_converter_files,
            my_cad_files,
            page,
            totalPages
          };
        }

        if (isMounted) {
          setLoading(false);
        }
      } catch (err) {
        console.error('Error fetching file history:', err);
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchFileHistory();

    // Cleanup function
    return () => {
      isMounted = false;
    };
  }, [cad_type, currentPage, debouncedSearchTerm, selectedFilter, creatorId,cadDetailsUpdate]); // Add selectedFilter to dependencies

  // Reset to page 1 when filter changes
  useEffect(() => {
    if (selectedFilter.id !== 'All') {
      setCurrentPage(1);
    }
  }, [selectedFilter, setCurrentPage]);

  // Helper function to format date (e.g., "April 30, 2025")
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const handleViewDesign = (file) => {
    if (!localStorage.getItem("is_verified")) {
      setPendingAction({ action: 'view', file });
      setIsEmailVerify(true);
      return;
    }
    
    if (cad_type === 'USER_CADS') {
      router.push(`/library/${file.route}`);
    } else {
      const glb = Boolean(file.glb_url);
      router.push(`/tools/cad-renderer?fileId=${file._id}&glb=${glb}`);
    }
  };

  const performConverterFileDownload = async (file, index) => {
    const url = buildCadConverterOutputUrl(file._id, file.base_name, file.output_format);

    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const blob = await response.blob();
    const downloadUrl = window.URL.createObjectURL(blob);
    const a = document.createElement('a');

    a.href = downloadUrl;
    a.download = `${file?.file_name?.slice(0, file.file_name.lastIndexOf(".")) || 'design'}_converted.${file.output_format}`;

    document.body.appendChild(a);
    a.click();

    document.body.removeChild(a);
    window.URL.revokeObjectURL(downloadUrl);

    sendGAtagEvent({ event_name: 'converter_file_upload_download', event_category: CAD_CONVERTER_EVENT });
    setDownloading(prev => ({ ...prev, [index]: false }));
  };

  /** Quality report PDF is always free — no payment check. */
  const handleReportDownload = async (file, index) => {
    try {
      if (!localStorage.getItem("is_verified")) {
        setPendingAction({ action: 'report', file, index });
        setIsEmailVerify(true);
        return;
      }

      const rawUrl = file.report_pdf_url;
      if (!rawUrl) {
        toast.info('Quality report is not available for this conversion.');
        return;
      }

      setDownloadingReport(prev => ({ ...prev, [index]: true }));
      const url = toCadOutputCdnUrl(rawUrl) || rawUrl;
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const blob = await response.blob();
      const downloadUrl = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      const stem =
        file?.file_name?.slice(0, file.file_name.lastIndexOf('.')) ||
        file?.base_name ||
        'conversion';
      a.href = downloadUrl;
      a.download = `${stem}_quality_report.pdf`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(downloadUrl);

      sendGAtagEvent({
        event_name: 'converter_quality_report_download',
        event_category: CAD_CONVERTER_EVENT,
      });
    } catch (error) {
      console.error('Report download error:', error);
      toast.error('Report download failed. Please try again.');
    } finally {
      setDownloadingReport(prev => ({ ...prev, [index]: false }));
    }
  };

  const handleConverterPayment = async (billingId) => {
    const pending = pendingConverterDownload;
    if (!pending) throw new Error('No converter download is selected.');

    sendClarityEvent("converter_billing_address_completed", {
      converter_funnel: "billing_completed",
    });

    const { file, index } = pending;
    setDownloading(prev => ({ ...prev, [index]: true }));

    let paymentResult;
    try {
      paymentResult = await ensureConverterDownloadAccess({
        converterFileId: file._id,
        fileName: file.file_name,
        userEmail: user.email,
        billingId,
      });
    } catch (payErr) {
      if (payErr?.message === 'Payment cancelled') {
        toast.info('Payment cancelled.');
      }
      setDownloading(prev => ({ ...prev, [index]: false }));
      throw payErr;
    }

    // Payment is done — kick off the download in the background (do NOT await it)
    // so the payment-success popup shows immediately instead of staying on the
    // "Download your file" screen until the file finishes downloading.
    performConverterFileDownload(file, index).catch((downloadErr) => {
      console.error('Converter download after payment failed:', downloadErr);
      toast.error('Payment successful. Your download will retry — use "Download again".');
      setDownloading(prev => ({ ...prev, [index]: false }));
    });

    return paymentResult;
  };

  const closeConverterDownloadFlow = () => {
    sendClarityEvent("converter_billing_address_closed", {
      converter_funnel: "billing_closed",
    });
    setOpenConverterBilling(false);
    setPendingConverterDownload(null);
    setConverterBillingDetails(null);
  };

  const downloadConverterFileAgain = async () => {
    const pending = pendingConverterDownload;
    if (!pending) return;
    const { file, index } = pending;
    setDownloading(prev => ({ ...prev, [index]: true }));
    try {
      await performConverterFileDownload(file, index);
    } catch (error) {
      toast.error(error?.message || 'Download failed. Please try again.');
      setDownloading(prev => ({ ...prev, [index]: false }));
    }
  };

  const handleDownload = async (file, index) => {
    try {
      if (!localStorage.getItem("is_verified")) {
        setPendingAction({ action: 'download', file, index });
        setIsEmailVerify(true);
        return;
      }
      if (!user.email) {
        router.push('/dashboard?cad_type=USER_PROFILE');
        return;
      }

      setDownloading(prev => ({ ...prev, [index]: true }));

      const access = await checkConverterDownload(file._id);
      if (access.credits != null) {
        setUser((prev) => ({ ...prev, converter_credits: Number(access.credits) || 0 }));
      }
      if (access.can_download && access.reason === 'credits') {
        const redeemed = await redeemConverterCredit(file._id);
        if (redeemed?.credits != null) {
          setUser((prev) => ({ ...prev, converter_credits: Number(redeemed.credits) || 0 }));
        }
        await performConverterFileDownload(file, index);
        return;
      }
      if (access.can_download) {
        await performConverterFileDownload(file, index);
        return;
      }

      setDownloading(prev => ({ ...prev, [index]: false }));
      setPendingConverterDownload({ file, index });
      setConverterBillingDetails({
        title: `CAD Converter (${file.input_format} → ${file.output_format})`,
        description: file.file_name || 'Converted CAD file download',
        price: access.pricing?.base_price ?? access.price,
        pricing: access.pricing,
      });
      if (Array.isArray(access.packs) && access.packs.length) {
        setCreditPacks(access.packs);
      }
      if (access.pricing) {
        const label = buildConverterPricingDisplay(access.pricing).totalLabel;
        if (label) setSinglePriceLabel(label);
      } else if (access.single_price_label) {
        setSinglePriceLabel(access.single_price_label);
      }
      setShowCreditPlans(true);
    } catch (error) {
      console.error('Download error:', error);
      toast.error('Download failed. Please try again.');
      setDownloading(prev => ({ ...prev, [index]: false }));
    }
  };

  const closeCreditPlans = () => {
    setShowCreditPlans(false);
  };

  const openBillingFromPlans = () => {
    setShowCreditPlans(false);
    setPendingPack(null);
    if (!pendingConverterDownload) return;
    sendClarityEvent("converter_billing_address_opened", {
      converter_funnel: "billing_opened",
    });
    setOpenConverterBilling(true);
  };

  const handleSelectPack = (pack) => {
    setShowCreditPlans(false);
    setPendingPack(pack);
  };

  const handlePackPayment = async (billingId) => {
    if (!pendingPack) throw new Error('No pack selected.');
    const result = await ensureConverterPackPurchase({
      packId: pendingPack.id,
      packName: pendingPack.name,
      userEmail: user.email,
      billingId,
    });
    if (result?.credits != null) {
      setUser((prev) => ({ ...prev, converter_credits: Number(result.credits) || 0 }));
    }
    return result;
  };

  const handlePostVerificationAction = () => {
    if (pendingAction) {
      if (pendingAction.action === 'download') {
        handleDownload(pendingAction.file, pendingAction.index);
      } else if (pendingAction.action === 'report') {
        handleReportDownload(pendingAction.file, pendingAction.index);
      } else if (pendingAction.action === 'view') {
        handleViewDesign(pendingAction.file);
      }
      setPendingAction(null);
    }
    setIsEmailVerify(false);
  };

  const getFileHref = (file) => {
    if (file.status !== "COMPLETED") return undefined;
    const glb = Boolean(file.glb_url);
    return `/tools/cad-renderer?fileId=${file._id}&glb=${glb}`;
  };
  return (
    <>
      <div className={styles.cadViewerContainer} style={{ width: '100%' }}>
        {cad_type === 'CAD_VIEWER' && (
          <CadViewerFiles 
            loading={loading} 
            cadViewerFileHistory={cadViewerFileHistory}
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            getFileHref={getFileHref}
            setIsEmailVerify={setIsEmailVerify}
          />
        )}
        {cad_type === 'CAD_CONVERTER' && (
          <CadConvertorFiles 
            loading={loading} 
            cadConverterFileHistory={cadConverterFileHistory} 
            downloading={downloading}
            downloadingReport={downloadingReport}
            handleDownload={handleDownload}
            handleReportDownload={handleReportDownload}
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            converterCredits={user?.converter_credits}
          />
        )}
        {cad_type === 'USER_CADS' && (
          <CadPublishedFiles 
          handlePublishCad={handlePublishCad}
          setIsEmailVerify={setIsEmailVerify}
            loading={loading} 
            userCadFiles={userCadFiles}
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            selectedFilter={selectedFilter}
            setSelectedFilter={setSelectedFilter}
            setPublishCadPopUp={setPublishCadPopUp}
            creatorId={creatorId}
          />
        )}
        {cad_type === 'USER_DOWNLOADS' && (
          <CadPublishedFiles 
          handlePublishCad={handlePublishCad}
            loading={loading} 
            userCadFiles={userDownloadFiles} 
            type='downloads'
            creatorId={creatorId}
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            selectedFilter={selectedFilter}
            setSelectedFilter={setSelectedFilter}
            setPublishCadPopUp={setPublishCadPopUp}
          />
        )}
        {cad_type === 'USER_PROFILE' && (
          <ProfilePage type='profile' />
        )}
        <div style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          {totalPages > 1 && <Pagenation currentPage={currentPage} setCurrentPage={setCurrentPage} totalPages={totalPages} />}
        </div>
      </div>
      {isUserVerified && <UserLoginPupUp type='dashboard'
       onClose={() => setIsUserVerified(false)} />}
      {publishCad && <ConvertedFileUploadPopup setPublishCad={setPublishCad} />}
      {isEmailVerify && <EmailOTP setIsEmailVerify={setIsEmailVerify} email={user.email} saveDetails={handlePostVerificationAction} />}
      {publishCadPopUp && <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, zIndex: 9999 }}>
        <PublishCadPopUp onClose={() => setPublishCadPopUp(false)} editedDetails={editDetails} />
      </div>}
      {openConverterBilling && pendingConverterDownload && (
        <ConverterDownloadFlow
          file={pendingConverterDownload.file}
          pricing={converterBillingDetails?.pricing || {
            price: converterBillingDetails?.price,
            currency: 'USD',
          }}
          user={user}
          onClose={closeConverterDownloadFlow}
          onPay={handleConverterPayment}
          onDownloadAgain={downloadConverterFileAgain}
        />
      )}
      {showCreditPlans && (
        <ConverterCreditPlansPopup
          packs={creditPacks}
          singlePriceLabel={singlePriceLabel}
          onClose={closeCreditPlans}
          onSelectPack={handleSelectPack}
          onSelectSingle={openBillingFromPlans}
        />
      )}
      {pendingPack && (
        <ConverterDownloadFlow
          mode="pack"
          pack={pendingPack}
          user={user}
          onClose={() => setPendingPack(null)}
          onPay={handlePackPayment}
        />
      )}
    </>
  );
}

export default FileHistoryCards;
