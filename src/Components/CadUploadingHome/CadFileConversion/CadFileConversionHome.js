import React from 'react'
import ConverterFaq from './ConverterFaq'
import Footer from '@/Components/HomePages/Footer/Footer'
import CadFileConversionHeader from './CadFileConversionHeader'
import CadFileConversionHowItWorksServer from './CadFileConversionHowItWorksServer'
import ConverterPricingSectionServer from './ConverterPricingSectionServer'
import TrustPrivacy from '../CadUpload/TrustPrivacy'
import CadConverterTypes from './CadConverterTypes'
import CadConversionToolLinks from './CadConversionToolLinks'
import SupportedCadFormats from './SupportedCadFormats'
import ConverterGuidance from './ConverterGuidance'
import CadViewerCrossLink from '../CadUpload/CadViewerCrossLink'
import ConverterResources from './ConverterResources'
import CadConverterFormateText from './CadConverterFormateText'
import ActiveLastBreadcrumb from '@/Components/CommonJsx/BreadCrumbs'
import DesignHub from '@/Components/HomePages/DesignHub/DesignHub'
import FaqPageJsonLd from '@/Components/JsonLdSchemas/FaqPageJsonLd'
import { getConverterFaqQuestions } from '@/data/cadToolFaqs'
import { CONVERTER_HUB_PAGE } from '@/data/converterHubPage'
import ToolsPageBanner from '@/Components/CadServicesBanners/ToolsPageBanner'

// Page heading structure: 1 h1 (CadFileConversionHeader); h2 (Pricing, HowItWorks, CadConverterTypes, ConverterFaq); rest h3.

const converterTrustItems = [
    { title: 'Encrypted upload', description: 'Secure transfer and processing for every supported format.' },
    { title: '7-day deletion', description: 'Uploaded and converted files are removed automatically.' },
    { title: 'You retain ownership', description: 'Your CAD files and intellectual property remain yours.' },
];

function CadFileConversionHome({
    convert,
    conversionParams,
    skipPageJsonLd = false,
    skipBreadcrumbSchema = false,
    converterDirectoryParams = {},
}) {
    const faqQuestions = convert && conversionParams
        ? getConverterFaqQuestions(conversionParams)
        : CONVERTER_HUB_PAGE.faqs;
    const faqDescription = convert && conversionParams
        ? `Find answers about converting files with Marathon OS ${conversionParams.replace(/-/g, ' ')} converter.`
        : CONVERTER_HUB_PAGE.faqIntro;

    return (
        <>
            {!skipPageJsonLd ? <FaqPageJsonLd faqSchemaData={faqQuestions} /> : null}
            {!convert && (
                <ActiveLastBreadcrumb
                    variant="dark"
                    links={[
                        { label: 'Tools', href: '/tools' },
                        { label: '3D CAD File Converter', href: '/tools/3d-cad-file-converter' },
                    ]}
                    skipSchema={skipBreadcrumbSchema}
                />
            )}
            {convert && (
                <ActiveLastBreadcrumb
                    variant="dark"
                    links={[
                        { label: 'tools', href: '/tools' },
                        { label: '3D CAD File Converter', href: '/tools/3d-cad-file-converter' },
                        { label: `${conversionParams}`, href: `/tools/convert-${conversionParams}` },
                    ]}
                    skipSchema={skipBreadcrumbSchema}
                />
            )}
            <CadFileConversionHeader convert={convert} conversionParams={conversionParams} />
            <ConverterPricingSectionServer />
            {!convert ? (
              <>
                <CadConversionToolLinks />
                <SupportedCadFormats />
                <CadFileConversionHowItWorksServer />
                <ConverterGuidance />
                <CadConverterTypes />
                <ConverterResources />
              </>
            ) : (
              <>
                <CadViewerCrossLink />
                <ConverterResources />
                <ConverterGuidance />
                <TrustPrivacy
                  variant="converterBanner"
                  title="Secure conversion without giving up file ownership"
                  description="Files are encrypted during upload, processed securely and removed automatically after 7 days."
                  items={converterTrustItems}
                />
                <CadConverterTypes
                  activeFormat={converterDirectoryParams.activeFormat}
                  query={converterDirectoryParams.query}
                />
              </>
            )}
            <ConverterFaq
                faqQuestions={faqQuestions}
                title={convert ? undefined : CONVERTER_HUB_PAGE.faqHeading}
                description={faqDescription}
            />
            <ToolsPageBanner
                variant="converter"
                title={convert ? undefined : CONVERTER_HUB_PAGE.designerTitle}
                description={convert ? undefined : CONVERTER_HUB_PAGE.designerBody}
                primaryLabel={convert ? undefined : 'Hire a CAD designer'}
                secondaryLabel={convert ? undefined : CONVERTER_HUB_PAGE.designerSecondary}
            />
          
            {convert ? (
              <CadFileConversionHowItWorksServer conversionParams={conversionParams} />
            ) : null}
            {conversionParams ? <CadConverterFormateText conversionParams={conversionParams} /> : null}
            <DesignHub
              headingLevel={3}
              variant="converter"
              heading={convert ? undefined : CONVERTER_HUB_PAGE.designHubHeading}
              description={convert ? undefined : CONVERTER_HUB_PAGE.designHubIntro}
              nosnippet={!convert}
            />
            <Footer />
        </>

    )
}

export default CadFileConversionHome