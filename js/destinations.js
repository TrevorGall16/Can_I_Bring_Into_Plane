/**
 * DESTINATIONS.JS - Strict Country Rules Database
 * Central source of truth for high-risk travel compliance.
 */
export const DESTINATIONS = {
    'JP': {
        name: 'Japan',
        flag: '🇯🇵',
        risk: 'High',
        intro: 'Strict anti-stimulant laws. Common US meds (Adderall/Vicks) are ILLEGAL.',
        banned: ['Adderall', 'Pseudoephedrine', 'Codeine (>1%)'],
        dutyFree: { alcohol: '3 Bottles (760ml each)', tobacco: '400 Cigarettes' }
    },
    'TH': {
        name: 'Thailand',
        flag: '🇹🇭',
        risk: 'High',
        intro: 'Vapes/E-Cigarettes are STRICTLY BANNED. Fines up to 30,000 THB or jail time.',
        banned: ['E-Cigarettes', 'Vapes', 'Sex Toys', 'Pornography'],
        dutyFree: { alcohol: '1 Liter', tobacco: '200 Cigarettes' }
    },
    'FR': {
        name: 'France',
        flag: '🇫🇷',
        risk: 'Medium',
        intro: 'EU Liquids Rule applies. Strict customs on luxury goods (fake designer items).',
        banned: ['Counterfeit Goods', 'Meat/Dairy (Non-EU)', 'Ivory'],
        dutyFree: { alcohol: '1 Liter (Spirits)', tobacco: '200 Cigarettes' }
    },
    'IT': {
        name: 'Italy',
        flag: '🇮🇹',
        risk: 'Medium',
        intro: 'Strict on sand/shells from beaches. Counterfeit fashion fines are high.',
        banned: ['Beach Sand/Shells', 'Counterfeit Fashion', 'Meat/Dairy'],
        dutyFree: { alcohol: '1 Liter', tobacco: '200 Cigarettes' }
    }
};
