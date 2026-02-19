import { Helmet } from 'react-helmet-async';

interface SEOProps {
    title: string;
    description?: string;
    image?: string;
    url?: string;
}

export const SEO = ({ title, description, image, url }: SEOProps) => {
    const siteTitle = 'Saree Sutra';
    const siteUrl = typeof window !== "undefined" ? window.location.origin : "https://sareesutra.com";
    const fullTitle = `${title} | ${siteTitle}`;
    const defaultDescription = 'Saree Sutra - Elegance in Every Drape. Discover our exclusive saree collection.';
    const resolvedUrl = url ? `${siteUrl}${url}` : siteUrl;
    const resolvedImage = image || `${siteUrl}/saree-sutra-logo.png`;

    return (
        <Helmet>
            <html lang="en-IN" />
            <title>{fullTitle}</title>
            <meta name="description" content={description || defaultDescription} />
            <meta name="robots" content="index, follow" />
            <link rel="canonical" href={resolvedUrl} />
            <meta name="keywords" content="saree, sarees online, silk saree, wedding saree, saree shop India, saree sutra" />

            {/* Open Graph / Facebook */}
            <meta property="og:type" content="website" />
            <meta property="og:site_name" content={siteTitle} />
            <meta property="og:title" content={fullTitle} />
            <meta property="og:description" content={description || defaultDescription} />
            <meta property="og:image" content={resolvedImage} />
            <meta property="og:url" content={resolvedUrl} />

            {/* Twitter */}
            <meta name="twitter:card" content="summary_large_image" />
            <meta name="twitter:title" content={fullTitle} />
            <meta name="twitter:description" content={description || defaultDescription} />
            <meta name="twitter:image" content={resolvedImage} />
        </Helmet>
    );
};
