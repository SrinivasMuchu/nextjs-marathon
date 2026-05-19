import React from 'react'
import styles from './SampleParts.module.css'
import { BASE_URL } from '@/config';
import Link from 'next/link';

function formatSlugAsLabel(slug) {
    if (!slug) return ''
    return slug
        .split('-')
        .filter(Boolean)
        .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
        .join(' ')
}

/** First word of label, lowercased — e.g. "Medical & Healthcare" → "medical" */
function subtitleIndustryWord(industryLabel, industrySlug) {
    const label = (industryLabel || '').trim()
    if (label) {
        const first = label.split('&')[0].trim().split(/\s+/)[0]
        if (first) return first.toLowerCase()
    }
    const fromSlug = formatSlugAsLabel(industrySlug).split(/\s+/)[0]
    return fromSlug ? fromSlug.toLowerCase() : 'industry'
}

async function SampleParts({ industry, part_name, industryLabel }) {
    const displayIndustry =
        (industryLabel && industryLabel.trim()) || formatSlugAsLabel(industry)
    const industryWord = subtitleIndustryWord(industryLabel, industry)

    try {
        const response = await fetch(
            `${BASE_URL}/v1/cad/get-industry-part-data?industry=${industry}`,
            {
                method: 'GET',
                cache: 'no-store',
            }
        );

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const result = await response.json();
        let data = result.data || [];

        if (part_name) {
            data = data.filter(item =>
                !item.route?.toLowerCase().includes(part_name.toLowerCase()) &&
                !item.id?.toLowerCase().includes(part_name.toLowerCase()) &&
                !item.part_name?.toLowerCase().includes(part_name.toLowerCase())
            );
        }

        if (!data.length) {
            return null
        }

        return (
            <section className={styles.section} aria-labelledby="sample-parts-heading">
                <div className={styles.inner}>
                    <h2 id="sample-parts-heading" className={styles.title}>
                        Sample {displayIndustry} Parts
                    </h2>
                    <p className={styles.subtitle}>
                        Browse and preview common {industryWord} CAD models instantly.
                    </p>
                    <div className={styles.pillWrap}>
                        {data.map((item, index) => (
                            <Link
                                href={`/industry/${industry}/${item.route}`}
                                key={item.id || index}
                                className={styles.pill}
                            >
                                {item.part_name || `Part ${index + 1}`}
                            </Link>
                        ))}
                    </div>
                </div>
            </section>
        );
    } catch (error) {
        console.error("Failed to fetch sample parts:", error);
        return null
    }
}

export default SampleParts;
