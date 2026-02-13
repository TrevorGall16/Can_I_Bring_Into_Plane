/**
 * SEO.JS - All SEO, Schema, and Meta Tag Functions
 * Extracted from ui.js
 */

import { AppState, toSlug } from './state.js';

function updateMetaTag(property, content) {
    let meta = document.querySelector(`meta[property="${property}"]`) ||
               document.querySelector(`meta[name="${property}"]`);
    if (meta) {
        meta.setAttribute('content', content);
    }
}

function updatePageSEO(title, queryParams) {
    document.title = title;

    let canonical = document.querySelector('link[rel="canonical"]');
    if (!canonical) {
        canonical = document.createElement('link');
        canonical.setAttribute('rel', 'canonical');
        document.head.appendChild(canonical);
    }
    const finalUrl = window.location.origin + window.location.pathname + (queryParams || '');
    canonical.setAttribute('href', finalUrl);

    let metaDesc = document.querySelector('meta[name="description"]');
    if (!metaDesc) {
        metaDesc = document.createElement('meta');
        metaDesc.setAttribute('name', 'description');
        document.head.appendChild(metaDesc);
    }

    let descText = "Check TSA and airline carry-on rules for 150+ items. Avoid confiscation and fines.";
    const currentYear = new Date().getFullYear();

    if (title.includes('Can I bring')) {
        descText = `Official ${currentYear} travel rules: ${title} Find out if it is allowed in Carry-On or Checked bags. Avoid airport security issues.`;
    } else if (title.includes('Rules')) {
        descText = `Flying to ${title.split(' ')[0]}? See the full list of BANNED items, medication rules, and duty-free limits before you pack.`;
    }

    metaDesc.setAttribute('content', descText);

    const setMeta = (prop, val) => {
        let el = document.querySelector(`meta[property="${prop}"]`) || document.querySelector(`meta[name="${prop}"]`);
        if (el) el.setAttribute('content', val);
    };

    setMeta('og:title', title);
    setMeta('twitter:title', title);
    setMeta('og:description', descText);
    setMeta('og:url', finalUrl);
}

function updateSocialMeta(item) {
    const title = `Can I bring ${item.name} on a plane? - Airport Checker`;
    const description = `Find out if ${item.name} is allowed in carry-on or checked luggage. ${item.note.replace(/[✅❌⚠️💡]/g, '').substring(0, 150)}...`;

    document.title = title;

    const setMeta = (name, content, isProperty = false) => {
        const attr = isProperty ? 'property' : 'name';
        let el = document.querySelector(`meta[${attr}="${name}"]`);
        if (!el) {
            el = document.createElement('meta');
            el.setAttribute(attr, name);
            document.head.appendChild(el);
        }
        el.setAttribute('content', content);
    };

    setMeta('description', description);
    setMeta('og:title', title, true);
    setMeta('og:description', description, true);
    const slug = toSlug(item.name);
    setMeta('og:url', `https://www.canibringonplane.com/?item=${slug}`, true);

    let canonical = document.querySelector('link[rel="canonical"]');
    if (!canonical) {
        canonical = document.createElement('link');
        canonical.setAttribute('rel', 'canonical');
        document.head.appendChild(canonical);
    }
    canonical.setAttribute('href', `https://www.canibringonplane.com/?item=${slug}`);
}

function injectSchema(item) {
    document.querySelectorAll('[data-dynamic-schema]').forEach(el => el.remove());

    const cleanNote = item.note.replace(/[✅❌⚠️💡🚨📞]/g, '').trim();
    const slug = toSlug(item.name);
    const pageUrl = `https://www.canibringonplane.com/?item=${slug}`;

    const dest = AppState.currentDestination;
    const destCode = AppState.currentDestinationCode;
    const isDestBanned = destCode && item.customs_restricted?.includes(destCode);

    const carryOnStatus = item.carryOn === 'allowed' ? 'Yes, allowed' :
                          item.carryOn === 'prohibited' ? 'No, prohibited' : 'Restricted';
    const checkedStatus = item.checked === 'allowed' ? 'Yes, allowed' :
                          item.checked === 'prohibited' ? 'No, prohibited' : 'Restricted';

    let answerText = `Carry-on: ${carryOnStatus}. Checked luggage: ${checkedStatus}. ${cleanNote}`;
    if (dest && isDestBanned) {
        answerText = `WARNING: ${item.name} is BANNED in ${dest.name}. Do not pack this item when traveling to ${dest.name}. ${answerText}`;
    } else if (dest) {
        answerText = `When traveling to ${dest.name}: ${answerText}`;
    }

    const faqSchema = {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        "mainEntity": [
            {
                "@type": "Question",
                "name": dest
                    ? `Can I bring ${item.name} on a plane to ${dest.name}?`
                    : `Can I bring ${item.name} on a plane?`,
                "acceptedAnswer": {
                    "@type": "Answer",
                    "text": answerText
                }
            },
            {
                "@type": "Question",
                "name": `Is ${item.name} allowed in carry-on luggage?`,
                "acceptedAnswer": {
                    "@type": "Answer",
                    "text": `${carryOnStatus}. ${item.carryOn === 'allowed'
                        ? `You can pack ${item.name} in your carry-on bag.`
                        : item.carryOn === 'prohibited'
                        ? `${item.name} is not allowed in the cabin. You must check it or leave it at home.`
                        : `${item.name} has restrictions. Check with your airline for specific rules.`}`
                }
            },
            {
                "@type": "Question",
                "name": `Can I put ${item.name} in checked baggage?`,
                "acceptedAnswer": {
                    "@type": "Answer",
                    "text": `${checkedStatus}. ${item.checked === 'allowed'
                        ? `You can pack ${item.name} in your checked luggage.`
                        : item.checked === 'prohibited'
                        ? `${item.name} is prohibited in checked bags due to safety regulations.`
                        : `${item.name} may be allowed with certain conditions. Verify with your airline.`}`
                }
            }
        ]
    };

    if (dest && isDestBanned) {
        faqSchema.mainEntity.push({
            "@type": "Question",
            "name": `Is ${item.name} legal in ${dest.name}?`,
            "acceptedAnswer": {
                "@type": "Answer",
                "text": `No. ${item.name} is prohibited by ${dest.name} customs and border control. Attempting to bring this item may result in confiscation, fines, or legal penalties.`
            }
        });
    }

    const category = Array.isArray(item.category) ? item.category[0] : item.category;
    const breadcrumbSchema = {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        "itemListElement": [
            {
                "@type": "ListItem",
                "position": 1,
                "name": "Home",
                "item": "https://www.canibringonplane.com/"
            },
            {
                "@type": "ListItem",
                "position": 2,
                "name": category ? category.charAt(0).toUpperCase() + category.slice(1) : "Items",
                "item": `https://www.canibringonplane.com/?category=${category || 'all'}`
            },
            {
                "@type": "ListItem",
                "position": 3,
                "name": item.name,
                "item": pageUrl
            }
        ]
    };

    const webPageSchema = {
        "@context": "https://schema.org",
        "@type": "WebPage",
        "name": dest
            ? `Can I bring ${item.name} to ${dest.name}? - Airport Security Rules`
            : `Can I bring ${item.name} on a plane? - Airport Security Rules`,
        "description": `Find out if ${item.name} is allowed in carry-on or checked luggage. ${cleanNote.substring(0, 150)}`,
        "url": pageUrl,
        "inLanguage": "en-US",
        "isPartOf": {
            "@type": "WebSite",
            "name": "Can I Bring On Plane",
            "url": "https://www.canibringonplane.com/"
        },
        "about": {
            "@type": "Thing",
            "name": item.name,
            "description": `Travel security information for ${item.name}`
        },
        "dateModified": new Date().toISOString().split('T')[0]
    };

    let howToSchema = null;
    if (item.carryOn === 'restricted' || item.checked === 'restricted') {
        howToSchema = {
            "@context": "https://schema.org",
            "@type": "HowTo",
            "name": `How to pack ${item.name} for air travel`,
            "description": `Step-by-step guide for traveling with ${item.name}`,
            "step": [
                {
                    "@type": "HowToStep",
                    "name": "Check airline policy",
                    "text": `Contact your airline to confirm their specific policy for ${item.name}.`
                },
                {
                    "@type": "HowToStep",
                    "name": "Review TSA guidelines",
                    "text": `Verify current TSA rules as they may change. ${cleanNote.substring(0, 100)}`
                },
                {
                    "@type": "HowToStep",
                    "name": "Pack appropriately",
                    "text": item.carryOn === 'allowed'
                        ? `Place ${item.name} in your carry-on bag for easy screening.`
                        : `Pack ${item.name} in checked luggage if allowed, or consider alternatives.`
                }
            ]
        };
    }

    const schemas = [faqSchema, breadcrumbSchema, webPageSchema];
    if (howToSchema) schemas.push(howToSchema);

    schemas.forEach((schema, index) => {
        const script = document.createElement('script');
        script.type = 'application/ld+json';
        script.setAttribute('data-dynamic-schema', 'true');
        script.id = `dynamic-schema-${index}`;
        script.text = JSON.stringify(schema);
        document.head.appendChild(script);
    });
}

function removeSchemas() {
    document.querySelectorAll('[data-dynamic-schema]').forEach(el => el.remove());
}

function injectCategorySchema(category, items) {
    removeSchemas();

    const displayName = category.charAt(0).toUpperCase() + category.slice(1);
    const pageUrl = `https://www.canibringonplane.com/?category=${category}`;
    const dest = AppState.currentDestination;

    const collectionSchema = {
        "@context": "https://schema.org",
        "@type": "CollectionPage",
        "name": dest
            ? `${displayName} Allowed on Planes to ${dest.name}`
            : `${displayName} Allowed on Planes - TSA Rules`,
        "description": `Complete guide to ${category} items allowed in carry-on and checked luggage. ${items.length} items with TSA rules.`,
        "url": pageUrl,
        "inLanguage": "en-US",
        "isPartOf": {
            "@type": "WebSite",
            "name": "Can I Bring On Plane",
            "url": "https://www.canibringonplane.com/"
        },
        "numberOfItems": items.length
    };

    const itemListSchema = {
        "@context": "https://schema.org",
        "@type": "ItemList",
        "name": `${displayName} - Airport Security Rules`,
        "description": `List of ${category} items and their carry-on/checked status`,
        "numberOfItems": Math.min(items.length, 10),
        "itemListElement": items.slice(0, 10).map((item, index) => ({
            "@type": "ListItem",
            "position": index + 1,
            "name": item.name,
            "url": `https://www.canibringonplane.com/?item=${toSlug(item.name)}`,
            "description": `Carry-on: ${item.carryOn}. Checked: ${item.checked}.`
        }))
    };

    const breadcrumbSchema = {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        "itemListElement": [
            {
                "@type": "ListItem",
                "position": 1,
                "name": "Home",
                "item": "https://www.canibringonplane.com/"
            },
            {
                "@type": "ListItem",
                "position": 2,
                "name": displayName,
                "item": pageUrl
            }
        ]
    };

    const categoryFAQs = {
        liquids: [
            { q: "What is the TSA 3-1-1 liquid rule?", a: "Liquids must be in containers of 3.4oz (100ml) or less, all fitting in one quart-sized clear bag." },
            { q: "Can I bring a water bottle through security?", a: "Empty water bottles are allowed. Full bottles must be emptied before the checkpoint." }
        ],
        electronics: [
            { q: "Do laptops need to be removed at security?", a: "Yes, laptops must be removed from bags and placed in a separate bin for X-ray screening." },
            { q: "Are power banks allowed on planes?", a: "Power banks under 100Wh are allowed in carry-on only. They are prohibited in checked bags." }
        ],
        medication: [
            { q: "Can I bring prescription medication on a plane?", a: "Yes, prescription medication is allowed in carry-on. Keep it in original containers with labels." },
            { q: "Is there a limit on liquid medication?", a: "Medically necessary liquids are exempt from the 3.4oz rule. Declare them at security." }
        ],
        food: [
            { q: "Can I bring food through airport security?", a: "Solid foods are generally allowed. Liquids, gels, and spreads must follow the 3-1-1 rule." },
            { q: "Can I bring snacks on the plane?", a: "Yes, most packaged snacks are allowed in carry-on luggage." }
        ],
        tools: [
            { q: "Are scissors allowed on planes?", a: "Scissors under 4 inches from the pivot point are allowed in carry-on." },
            { q: "Can I bring a screwdriver on a plane?", a: "Screwdrivers under 7 inches are allowed in carry-on. Larger tools must be checked." }
        ]
    };

    const faqs = categoryFAQs[category];
    let faqSchema = null;
    if (faqs && faqs.length > 0) {
        faqSchema = {
            "@context": "https://schema.org",
            "@type": "FAQPage",
            "mainEntity": faqs.map(faq => ({
                "@type": "Question",
                "name": faq.q,
                "acceptedAnswer": {
                    "@type": "Answer",
                    "text": faq.a
                }
            }))
        };
    }

    const schemas = [collectionSchema, itemListSchema, breadcrumbSchema];
    if (faqSchema) schemas.push(faqSchema);

    schemas.forEach((schema, index) => {
        const script = document.createElement('script');
        script.type = 'application/ld+json';
        script.setAttribute('data-dynamic-schema', 'true');
        script.id = `dynamic-schema-cat-${index}`;
        script.text = JSON.stringify(schema);
        document.head.appendChild(script);
    });
}

function injectDestinationSchema(dest, code) {
    removeSchemas();

    const pageUrl = `https://www.canibringonplane.com/?dest=${code}`;

    const travelGuideSchema = {
        "@context": "https://schema.org",
        "@type": "Article",
        "headline": `${dest.name} Travel Rules - What You Can and Cannot Bring`,
        "description": dest.intro,
        "url": pageUrl,
        "inLanguage": "en-US",
        "author": {
            "@type": "Organization",
            "name": "Can I Bring On Plane",
            "url": "https://www.canibringonplane.com/"
        },
        "publisher": {
            "@type": "Organization",
            "name": "Can I Bring On Plane",
            "url": "https://www.canibringonplane.com/"
        },
        "dateModified": new Date().toISOString().split('T')[0],
        "about": {
            "@type": "Country",
            "name": dest.name
        }
    };

    const faqSchema = {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        "mainEntity": [
            {
                "@type": "Question",
                "name": `What items are banned in ${dest.name}?`,
                "acceptedAnswer": {
                    "@type": "Answer",
                    "text": `${dest.name} strictly prohibits: ${dest.banned.join(', ')}. Attempting to bring these items may result in confiscation, fines, or legal action.`
                }
            },
            {
                "@type": "Question",
                "name": `What are the duty-free limits for ${dest.name}?`,
                "acceptedAnswer": {
                    "@type": "Answer",
                    "text": `Duty-free limits for ${dest.name}: Alcohol - ${dest.dutyFree.alcohol}. Tobacco - ${dest.dutyFree.tobacco}. Exceeding these limits may incur customs duties.`
                }
            },
            {
                "@type": "Question",
                "name": `Is ${dest.name} strict about customs enforcement?`,
                "acceptedAnswer": {
                    "@type": "Answer",
                    "text": `${dest.name} has a ${dest.risk} risk level for customs enforcement. ${dest.intro}`
                }
            }
        ]
    };

    const breadcrumbSchema = {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        "itemListElement": [
            {
                "@type": "ListItem",
                "position": 1,
                "name": "Home",
                "item": "https://www.canibringonplane.com/"
            },
            {
                "@type": "ListItem",
                "position": 2,
                "name": `${dest.name} Travel Rules`,
                "item": pageUrl
            }
        ]
    };

    const schemas = [travelGuideSchema, faqSchema, breadcrumbSchema];

    schemas.forEach((schema, index) => {
        const script = document.createElement('script');
        script.type = 'application/ld+json';
        script.setAttribute('data-dynamic-schema', 'true');
        script.id = `dynamic-schema-dest-${index}`;
        script.text = JSON.stringify(schema);
        document.head.appendChild(script);
    });
}

export { updateMetaTag, updatePageSEO, updateSocialMeta, injectSchema, removeSchemas, injectCategorySchema, injectDestinationSchema };
