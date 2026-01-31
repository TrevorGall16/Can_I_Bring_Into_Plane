/**
 * CONFIG.JS - Airport Carry-On Checker
 * Contains: AFFILIATE_MAP, countryRules, countrySources
 *
 * ES6 Module - Use: import { AFFILIATE_MAP, countryRules, countrySources } from './config.js'
 */

// ---------------------------------------------------------
// HIGH-MARGIN AFFILIATE MAPPING
// Strategy: eSIM, Insurance, Specialized Travel Gear
// ---------------------------------------------------------
export const AFFILIATE_MAP = {
    'electronics': [
        { name: 'eSIM Data Plan', icon: 'fa-wifi', query: 'international esim data plan travel', note: 'Avoid roaming fees' },
        { name: 'Tech Insurance', icon: 'fa-shield-halved', query: 'travel insurance electronics protection' }
    ],
    'medication': [
        { name: 'Medical Insurance', icon: 'fa-user-nurse', query: 'travel medical insurance international' },
        { name: 'Insulin Cooler', icon: 'fa-temperature-low', query: 'insulin cooler travel case tsa approved' }
    ],
    'liquids': [
        { name: 'Leakproof Bottles', icon: 'fa-bottle-water', query: 'tsa approved travel bottles leak proof' },
        { name: 'Toiletry Bag', icon: 'fa-bag-shopping', query: 'tsa approved quart size bags clear' }
    ],
    'toiletries': [
        { name: 'Leakproof Bottles', icon: 'fa-bottle-water', query: 'tsa approved travel bottles leak proof' },
        { name: 'Toiletry Bag', icon: 'fa-bag-shopping', query: 'hanging toiletry bag travel waterproof' }
    ],
    'baby': [
        { name: 'Family Travel Insurance', icon: 'fa-shield-heart', query: 'family travel insurance kids baby' },
        { name: 'Diaper Bag', icon: 'fa-baby', query: 'travel diaper bag backpack airplane' }
    ],
    'sports': [
        { name: 'Sports Gear Insurance', icon: 'fa-shield-halved', query: 'travel insurance sports equipment protection' },
        { name: 'Equipment Bag', icon: 'fa-dumbbell', query: 'sports equipment travel bag airline' }
    ],
    'customs': [
        { name: 'Travel Insurance', icon: 'fa-shield-heart', query: 'comprehensive travel insurance international' },
        { name: 'eSIM Data Plan', icon: 'fa-wifi', query: 'international esim data plan travel' }
    ],
    'default': [
        { name: 'Travel Insurance', icon: 'fa-shield-heart', query: 'comprehensive travel insurance safetywing' },
        { name: 'Universal Adapter', icon: 'fa-earth-americas', query: 'universal travel power adapter worldwide' }
    ]
};

// ---------------------------------------------------------
// COUNTRY RULES DATA
// ---------------------------------------------------------
export const countryRules = {
    'USA': {
        title: 'Important TSA Rules (United States)',
        rules: [
            { title: '3-1-1 Liquids Rule', description: 'Carry-on liquids must be in containers of 3.4 oz (100ml) or less, all fitting in one quart-sized clear plastic bag.' },
            { title: 'Lithium Batteries', description: 'Spare lithium batteries and power banks must be in carry-on luggage only. Maximum 100Wh without approval.' },
            { title: 'Sharp Objects', description: 'Scissors under 4 inches allowed in carry-on. All knives must be checked. Tools under 7 inches generally allowed.' }
        ]
    },
    'China': {
        title: 'Important CAAC Rules (China)',
        rules: [
            { title: 'Liquids Restriction', description: 'Maximum 100ml per container, total 1 liter allowed in carry-on.' },
            { title: 'Power Banks (Critical!)', description: 'Power banks MUST have clear capacity marking and manufacturer logo. Unmarked power banks will be confiscated.' },
            { title: 'Lighters & Matches', description: 'Lighters and matches are PROHIBITED in both carry-on and checked luggage in China.' }
        ]
    },
    'EU': {
        title: 'Important EASA Rules (European Union)',
        rules: [
            { title: 'Liquids, Aerosols & Gels', description: 'Maximum 100ml per container in a single 1-liter transparent bag.' },
            { title: 'Lithium Batteries', description: 'Spare batteries in carry-on only. Power banks up to 100Wh allowed. 100-160Wh requires airline approval.' },
            { title: 'Sharp Objects', description: 'Knives and scissors with blades over 6cm prohibited in carry-on. Must be in checked luggage.' }
        ]
    },
    'UK': {
        title: 'Important UK Aviation Rules',
        rules: [
            { title: 'Liquids Rule', description: 'Maximum 100ml per container in a single transparent bag.' },
            { title: 'Electronic Devices', description: 'All electronic devices larger than phones must be screened separately.' },
            { title: 'Prohibited Items', description: 'All knives, razor blades, and tools over 6cm prohibited in carry-on.' }
        ]
    },
    'Canada': {
        title: 'Important CATSA Rules (Canada)',
        rules: [
            { title: 'Liquids & Gels', description: 'Maximum 100ml per container in a single 1-liter clear, resealable bag. Exceptions for medications and baby formula.' },
            { title: 'Lithium Batteries', description: 'Spare lithium batteries must be in carry-on.' },
            { title: 'Tools', description: 'Tools must be less than 6cm from pivot point for carry-on.' }
        ]
    },
    'Australia': {
        title: 'Important Australian Aviation Rules',
        rules: [
            { title: 'Liquids, Aerosols & Gels', description: 'Maximum 100ml per container.' },
            { title: 'Quarantine Rules', description: 'Strict quarantine on food, plants, and animal products. Heavy fines.' }
        ]
    },
    'Japan': {
        title: 'Important Japanese Aviation Rules',
        rules: [
            { title: 'Liquids Rule', description: 'Maximum 100ml per container in a transparent bag.' },
            { title: 'Lithium Batteries', description: 'Spare batteries and power banks in carry-on only.' }
        ]
    },
    'International': {
        title: 'General International Aviation Rules',
        rules: [
            { title: 'Universal Liquids Rule', description: 'Most countries follow 100ml rule.' },
            { title: 'Lithium Batteries', description: 'Globally: spare lithium batteries in carry-on only.' },
            { title: 'Dangerous Goods', description: 'Flammable liquids, compressed gases, explosives prohibited everywhere.' }
        ]
    }
};

// ---------------------------------------------------------
// OFFICIAL SOURCE LINKS BY COUNTRY
// ---------------------------------------------------------
export const countrySources = {
    'USA': { name: 'TSA.gov', url: 'https://www.tsa.gov/travel/security-screening/whatcanibring/all' },
    'China': { name: 'CAAC / Customs', url: 'http://www.caac.gov.cn/en/SY/' },
    'EU': { name: 'EASA / Europa.eu', url: 'https://europa.eu/youreurope/citizens/travel/carry/luggage-restrictions/index_en.htm' },
    'UK': { name: 'GOV.UK', url: 'https://www.gov.uk/hand-luggage-restrictions' },
    'Canada': { name: 'CATSA', url: 'https://www.catsa-acsta.gc.ca/en/search/site' },
    'Australia': { name: 'Home Affairs', url: 'https://www.abf.gov.au/entering-and-leaving-australia/can-you-bring-it-in' },
    'Japan': { name: 'Narita/Gov', url: 'https://www.narita-airport.jp/en/security/restricted/' },
    'International': { name: 'ICAO', url: 'https://www.icao.int/Security/SFP/Pages/Passenger-Bag-Security.aspx' },
    'Thailand': { name: 'Thai Customs', url: 'https://www.customs.go.th/list_strc_simple_neted.php?ini_content=individual_160526_01&lang=en' },
    'Singapore': { name: 'ICA Singapore', url: 'https://www.ica.gov.sg/enter-transit-depart/entering-singapore/what-you-can-bring' },
    'Mexico': { name: 'Government of Mexico', url: 'https://www.gob.mx/aduanas' },
    'UAE': { name: 'UAE Government', url: 'https://u.ae/en/information-and-services/health-and-fitness/drugs-and-controlled-medicines' }
};

console.log('⚙️ Config module loaded');
