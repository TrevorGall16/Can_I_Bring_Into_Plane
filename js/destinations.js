export const DESTINATIONS = {
    // --- EUROPE ---
    'FR': {
        name: 'France', flag: '🇫🇷', risk: 'Medium',
        intro: 'EU Liquids Rule applies. Strict customs on luxury goods.',
        banned: ['Counterfeit Goods', 'Meat/Dairy (Non-EU)'],
        dutyFree: { alcohol: '1 Liter', tobacco: '200 Cigs' },
        theme: { color: '#1e40af', bg: '#eff6ff', border: '#bfdbfe' } // 🔵 Navy Blue
    },
    'IT': {
        name: 'Italy', flag: '🇮🇹', risk: 'Medium',
        intro: 'Strict on sand/shells. Counterfeit fines are high.',
        banned: ['Beach Sand', 'Counterfeit Fashion'],
        dutyFree: { alcohol: '1 Liter', tobacco: '200 Cigs' },
        theme: { color: '#16a34a', bg: '#f0fdf4', border: '#bbf7d0' } // 🟢 Italian Green
    },
    'UK': {
        name: 'UK', flag: '🇬🇧', risk: 'Medium',
        intro: 'Strict laws on offensive weapons (pepper spray, knives).',
        banned: ['Pepper Spray', 'Knives'],
        dutyFree: { alcohol: '1 Liter', tobacco: '200 Cigs' },
        theme: { color: '#2563eb', bg: '#eff6ff', border: '#bfdbfe' } // 🔵 Royal Blue
    },

    // --- ASIA ---
    'JP': {
        name: 'Japan', flag: '🇯🇵', risk: 'High',
        intro: 'Strict anti-stimulant laws. Adderall/Vicks are ILLEGAL.',
        banned: ['Adderall', 'Pseudoephedrine', 'Codeine'],
        dutyFree: { alcohol: '3 Bottles', tobacco: '400 Cigs' },
        theme: { color: '#dc2626', bg: '#fef2f2', border: '#fca5a5' } // 🔴 Japan Red
    },
    'TH': {
        name: 'Thailand', flag: '🇹🇭', risk: 'High',
        intro: 'Vapes/E-Cigarettes are STRICTLY BANNED. Jail time possible.',
        banned: ['E-Cigarettes', 'Vapes', 'Sex Toys'],
        dutyFree: { alcohol: '1 Liter', tobacco: '200 Cigs' },
        theme: { color: '#0ea5e9', bg: '#f0f9ff', border: '#bae6fd' } // 🔵 Thai Light Blue
    },
    'CN': {
        name: 'China', flag: '🇨🇳', risk: 'High',
        intro: 'Strict checks on batteries. Power banks must be <160Wh.',
        banned: ['Power Banks >160Wh', 'Lighters'],
        dutyFree: { alcohol: '1.5L', tobacco: '400 Cigs' },
        theme: { color: '#b91c1c', bg: '#fef2f2', border: '#fca5a5' } // 🔴 China Red
    },
    'SG': {
        name: 'Singapore', flag: '🇸🇬', risk: 'High',
        intro: 'Chewing gum is banned. Death penalty for drug trafficking.',
        banned: ['Chewing Gum', 'E-Cigs'],
        dutyFree: { alcohol: '1L', tobacco: 'None' },
        theme: { color: '#e11d48', bg: '#fff1f2', border: '#fda4af' } // 🔴 Rose Red
    },
    'IN': {
        name: 'India', flag: '🇮🇳', risk: 'Medium',
        intro: 'Satellite phones need license. Gold strictly regulated.',
        banned: ['Satellite Phones', 'Drones', 'Gold Bars'],
        dutyFree: { alcohol: '2L', tobacco: '100 Cigs' },
        theme: { color: '#ea580c', bg: '#fff7ed', border: '#fdba74' } // 🟠 India Orange
    },

    // --- MIDDLE EAST & AMERICAS ---
    'AE': {
        name: 'UAE (Dubai)', flag: '🇦🇪', risk: 'Very High',
        intro: 'Zero tolerance for drugs. Codeine/Tramadol = Jail.',
        banned: ['Codeine', 'Tramadol', 'Poppy Seeds'],
        dutyFree: { alcohol: '4L', tobacco: '400 Cigs' },
        theme: { color: '#059669', bg: '#ecfdf5', border: '#6ee7b7' } // 🟢 Emerald Green (Pan-Arab color)
    },
    'MX': {
        name: 'Mexico', flag: '🇲🇽', risk: 'High',
        intro: 'Vapes are ILLEGAL. Customs will confiscate them.',
        banned: ['Vapes', 'E-Cigarettes'],
        dutyFree: { alcohol: '3L', tobacco: '10 Packs' },
        theme: { color: '#15803d', bg: '#f0fdf4', border: '#bbf7d0' } // 🟢 Mexico Green
    }
};