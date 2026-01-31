/**
 * DESTINATIONS.JS - Strict Country Rules Database
 * Central source of truth for high-risk travel compliance.
 * Phase UX: Added theme colors for dynamic styling.
 */
export const DESTINATIONS = {
    'JP': {
        name: 'Japan',
        flag: '🇯🇵',
        risk: 'High',
        intro: 'Strict anti-stimulant laws. Common US meds (Adderall/Vicks) are ILLEGAL.',
        banned: ['Adderall', 'Pseudoephedrine', 'Codeine (>1%)'],
        dutyFree: { alcohol: '3 Bottles (760ml each)', tobacco: '400 Cigarettes' },
        theme: { color: '#dc2626', bg: '#fef2f2', border: '#fca5a5' } // Red
    },
    'TH': {
        name: 'Thailand',
        flag: '🇹🇭',
        risk: 'High',
        intro: 'Vapes/E-Cigarettes are STRICTLY BANNED. Fines up to 30,000 THB or jail time.',
        banned: ['E-Cigarettes', 'Vapes', 'Sex Toys', 'Pornography'],
        dutyFree: { alcohol: '1 Liter', tobacco: '200 Cigarettes' },
        theme: { color: '#2563eb', bg: '#eff6ff', border: '#bfdbfe' } // Blue
    },
    'FR': {
        name: 'France',
        flag: '🇫🇷',
        risk: 'Medium',
        intro: 'EU Liquids Rule applies. Strict customs on luxury goods (fake designer items).',
        banned: ['Counterfeit Goods', 'Meat/Dairy (Non-EU)', 'Ivory'],
        dutyFree: { alcohol: '1 Liter (Spirits)', tobacco: '200 Cigarettes' },
        theme: { color: '#1e3a8a', bg: '#f0f9ff', border: '#bae6fd' } // Navy
    },
    'IT': {
        name: 'Italy',
        flag: '🇮🇹',
        risk: 'Medium',
        intro: 'Strict on sand/shells from beaches. Counterfeit fashion fines are high.',
        banned: ['Beach Sand/Shells', 'Counterfeit Fashion', 'Meat/Dairy'],
        dutyFree: { alcohol: '1 Liter', tobacco: '200 Cigarettes' },
        theme: { color: '#15803d', bg: '#f0fdf4', border: '#bbf7d0' } // Green
    },
    'CN': {
        name: 'China',
        flag: '🇨🇳',
        risk: 'High',
        intro: 'Strict on batteries & political media. VPNs may not work.',
        banned: ['Power Banks >160Wh', 'Lighters', 'Political Materials'],
        dutyFree: { alcohol: '1.5 Liters', tobacco: '400 Cigarettes' },
        theme: { color: '#dc2626', bg: '#fef2f2', border: '#fca5a5' } // Red
    },
    'MX': {
        name: 'Mexico',
        flag: '🇲🇽',
        risk: 'High',
        intro: 'Vapes are ILLEGAL. Don\'t bring them. Strict on cash declarations.',
        banned: ['Vapes', 'E-Cigarettes', 'Undeclared Cash >$10K'],
        dutyFree: { alcohol: '3 Liters', tobacco: '10 Packs' },
        theme: { color: '#059669', bg: '#ecfdf5', border: '#6ee7b7' } // Green/Teal
    },
    'AE': {
        name: 'UAE (Dubai)',
        flag: '🇦🇪',
        risk: 'Very High',
        intro: 'Zero tolerance for drugs/medications. Many common meds are BANNED.',
        banned: ['Codeine', 'Tramadol', 'Poppy Seeds', 'CBD Products'],
        dutyFree: { alcohol: '4 Liters', tobacco: '400 Cigarettes' },
        theme: { color: '#d97706', bg: '#fffbeb', border: '#fcd34d' } // Amber
    },
    'SG': {
        name: 'Singapore',
        flag: '🇸🇬',
        risk: 'High',
        intro: 'Strict laws with heavy fines. Death penalty for drug trafficking.',
        banned: ['Chewing Gum', 'E-Cigarettes', 'Vapes'],
        dutyFree: { alcohol: '1 Liter', tobacco: 'None (Duty applies)' },
        theme: { color: '#be123c', bg: '#fff1f2', border: '#fda4af' } // Rose
    },
    'UK': {
        name: 'United Kingdom',
        flag: '🇬🇧',
        risk: 'Medium',
        intro: 'Strict on offensive weapons. Post-Brexit customs rules apply.',
        banned: ['Pepper Spray', 'Knives', 'Self-Defense Weapons'],
        dutyFree: { alcohol: '1 Liter (Spirits)', tobacco: '200 Cigarettes' },
        theme: { color: '#2563eb', bg: '#eff6ff', border: '#bfdbfe' } // Blue
    },
    'IN': {
        name: 'India',
        flag: '🇮🇳',
        risk: 'Medium',
        intro: 'Satellite phones need license. Gold imports heavily regulated.',
        banned: ['Satellite Phones', 'Drones', 'Gold >50g'],
        dutyFree: { alcohol: '2 Liters', tobacco: '200 Cigarettes' },
        theme: { color: '#ea580c', bg: '#fff7ed', border: '#fdba74' } // Orange
    }
};
