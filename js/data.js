/**
 * DATA.JS - Airport Carry-On Checker
 * Contains: ITEMS_DATA array
 *
 * ES6 Module - Use: import { ITEMS_DATA } from './data.js'
 */

export const ITEMS_DATA = [
    // --- LIQUIDS & DRINKS ---
    {
        id: 1,
        name: "Water Bottle (Empty)",
        carryOn: "allowed",
        checked: "allowed",
        note: "✅ Must be COMPLETELY EMPTY through security. Can refill at fountains after checkpoint. (Source: TSA.gov)",
        category: ["liquids", "containers"],
        keywords: ["water", "bottle", "flask", "hydroflask", "yeti"]
    },
    {
        id: 2,
        name: "Water Bottle (Full - under 100ml)",
        carryOn: "allowed",
        checked: "allowed",
        note: "✅ Allowed if container is 100ml (3.4oz) or less. Must fit in quart-sized bag. (Source: TSA 3-1-1 Rule)",
        category: ["liquids"],
        keywords: ["water", "drink", "juice", "small bottle"]
    },
    {
        id: 121,
        name: "Water Bottle (Full - over 100ml)",
        carryOn: "prohibited",
        checked: "allowed",
        note: "❌ Liquids that exceed the 100ml (3.4 oz) limit are the most common item confiscated at security. The volume is based on the container size, not the liquid level inside. You MUST empty this before entering the checkpoint, or it will be seized. Refill fountains are usually available after security. (Source: TSA 3-1-1 Rule)",
        category: ["liquids"],
        keywords: ["water", "drink", "soda", "coke", "large bottle"]
    },
    {
        id: 97,
        name: "Alcohol (Liquor/Wine)",
        carryOn: "restricted",
        checked: "allowed",
        note: "⚠️ CARRY-ON: Liquids (including alcohol) must be in containers of 100ml (3.4oz) or less and fit in your quart-sized bag. ✅ CHECKED: Allowed (up to 5 liters per person if between 24–70% alcohol by volume). ❌ Alcohol over 70% ABV (140 proof) is strictly PROHIBITED in both carry-on and checked luggage due to fire risk. (Source: FAA/TSA)",
        category: ["liquids", "alcohol"],
        keywords: ["alcohol", "wine", "beer", "vodka", "whiskey"]
    },

    // --- FRESH FOOD (FRUIT/VEG) ---
    {
        id: 96,
        name: "Fresh Fruit (General)",
        carryOn: "allowed",
        checked: "allowed",
        note: "✅ SECURITY: Allowed through checkpoint. 🚨 CUSTOMS: BANNED entering many countries (China, Aus, NZ, US, Japan) due to pests. Eat it on the plane or discard before landing. (Source: USDA/Biosecurity)",
        category: ["food", "customs"],
        keywords: ["fruit", "snack", "produce"],
        customs_restricted: ["China", "Australia", "New Zealand", "Japan", "USA", "EU", "Canada", "UK"]
    },
    {
        id: 200,
        name: "Apple",
        carryOn: "allowed",
        checked: "allowed",
        note: "✅ SECURITY: Allowed. 🚨 CUSTOMS: BANNED entering China, USA, Australia, NZ. Fruit flies hide inside apples. Fines apply ($300+). Discard before customs. (Source: USDA/Customs)",
        category: ["food", "customs"],
        keywords: ["apple", "fruit", "granny smith", "red delicious"],
        customs_restricted: ["China", "Australia", "New Zealand", "Japan", "USA", "EU", "Canada", "UK"]
    },
    {
        id: 201,
        name: "Banana",
        carryOn: "allowed",
        checked: "allowed",
        note: "✅ SECURITY: Allowed. 🚨 CUSTOMS: BANNED entering most countries. High risk for Panama disease/pests. Discard before landing. (Source: Biosecurity)",
        category: ["food", "customs"],
        keywords: ["banana", "fruit", "plantain"],
        customs_restricted: ["China", "Australia", "New Zealand", "Japan", "USA", "EU", "Canada", "UK"]
    },
    {
        id: 202,
        name: "Orange / Citrus",
        carryOn: "allowed",
        checked: "allowed",
        note: "✅ SECURITY: Allowed. 🚨 CUSTOMS: STRICTLY BANNED. Citrus carries invasive pests. High fines in USA and Australia. (Source: USDA APHIS)",
        category: ["food", "customs"],
        keywords: ["orange", "lemon", "lime", "citrus", "fruit"],
        customs_restricted: ["China", "Australia", "New Zealand", "Japan", "USA", "EU", "Canada", "UK"]
    },
    {
        id: 174,
        name: "Fresh Vegetables",
        carryOn: "allowed",
        checked: "allowed",
        note: "✅ SECURITY: Allowed. 🚨 CUSTOMS: BANNED in most international travel. Soil on potatoes/carrots is a major biosecurity risk. (Source: Customs)",
        category: ["food", "customs"],
        keywords: ["vegetables", "carrot", "potato", "lettuce", "salad"],
        customs_restricted: ["China", "Australia", "New Zealand", "Japan", "USA", "EU"]
    },

    // --- MEAT & DAIRY ---
    {
        id: 171,
        name: "Beef Jerky / Dried Meat",
        carryOn: "allowed",
        checked: "allowed",
        note: "✅ SECURITY: Allowed. 🚨 CUSTOMS: BANNED in China, Aus, NZ, EU. Pork products especially restricted (Swine Fever risk). Declare or discard. (Source: Customs)",
        category: ["food", "customs"],
        keywords: ["jerky", "meat", "beef", "pork", "snack"],
        customs_restricted: ["China", "Australia", "New Zealand", "Japan", "EU"]
    },
    {
        id: 172,
        name: "Fresh Meat / Seafood",
        carryOn: "allowed",
        checked: "allowed",
        note: "✅ SECURITY: Allowed with ice packs (frozen solid). 🚨 CUSTOMS: PROHIBITED internationally. Cannot bring fresh meat across borders. (Source: USDA/Customs)",
        category: ["food", "customs"],
        keywords: ["meat", "steak", "chicken", "fish", "pork", "raw"],
        customs_restricted: ["China", "Australia", "New Zealand", "Japan", "USA", "EU", "Canada", "UK"]
    },
    {
        id: 177,
        name: "Kinder Surprise Eggs",
        carryOn: "allowed",
        checked: "allowed",
        note: "✅ Allowed worldwide EXCEPT USA. 🚨 USA WARNING: Banned by FDA (choking hazard). Fines up to $2,500 per egg. 'Kinder Joy' (separate toy) is legal.",
        category: ["food", "customs"],
        keywords: ["kinder", "chocolate", "egg", "candy"],
        customs_restricted: ["USA"]
    },
    {
        id: 190,
        name: "Chewing Gum",
        carryOn: "allowed",
        checked: "allowed",
        note: "✅ Allowed generally. 🚨 SINGAPORE WARNING: Import of gum is banned (unless for medical use). Large quantities may be confiscated.",
        category: ["food", "customs"],
        keywords: ["gum", "chewing gum", "bubble gum"],
        customs_restricted: ["Singapore"]
    },
    {
        id: 128,
        name: "Cheese (Hard)",
        carryOn: "allowed",
        checked: "allowed",
        note: "✅ Cheddar, Parmesan, Swiss allowed. No restrictions. (Source: TSA)",
        category: ["food"],
        keywords: ["cheese", "cheddar", "block cheese"]
    },
    {
        id: 129,
        name: "Cheese (Soft/Creamy)",
        carryOn: "restricted",
        checked: "allowed",
        note: "⚠️ Considered a LIQUID/PASTE. Max 100ml in carry-on. Includes Brie, Camembert, Cream Cheese. (Source: TSA)",
        category: ["food", "liquids"],
        keywords: ["cheese", "brie", "cream cheese", "spread"]
    },

    // --- ELECTRONICS & BATTERIES ---
    {
        id: 3,
        name: "Laptop",
        carryOn: "allowed",
        checked: "allowed",
        note: "✅ CARRY-ON IS HIGHLY RECOMMENDED for expensive electronics to prevent damage and theft. Most passengers must remove their laptop from their bag at the security checkpoint for separate X-ray screening. Failure to remove it will result in your bag being pulled for inspection, slowing down the whole process. Always be prepared to power it on. (Source: TSA)",
        category: ["electronics"],
        keywords: ["laptop", "computer", "macbook", "dell", "pc"]
    },
    {
        id: 4,
        name: "Power Bank / Portable Charger",
        carryOn: "allowed",
        checked: "prohibited",
        note: "✅ CARRY-ON ONLY. This is a non-negotiable FAA safety rule because lithium batteries pose a significant fire risk (thermal runaway) in the cargo hold, where fires are difficult to extinguish. Power banks must be under 100 watt-hours (Wh). 🚨 CHINA WARNING: Security often confiscates chargers if the capacity label is missing or rubbed off. (Source: FAA/IATA)",
        category: ["electronics", "batteries"],
        keywords: ["power bank", "charger", "battery pack", "portable charger"]
    },
    {
        id: 39,
        name: "Spare Lithium Batteries",
        carryOn: "allowed",
        checked: "prohibited",
        note: "✅ CARRY-ON ONLY. Loose batteries are forbidden in checked baggage due to the extreme fire risk they pose in the cargo hold. You must protect the terminals from short circuits—use electrical tape or place each battery in its own protective case or plastic bag. Maximum individual capacity is 100Wh. (Source: FAA)",
        category: ["electronics", "batteries"],
        keywords: ["batteries", "lithium", "AA", "camera battery", "drone battery"]
    },
    {
        id: 20,
        name: "E-Cigarette / Vape",
        carryOn: "allowed",
        checked: "prohibited",
        note: "✅ CARRY-ON ONLY. This device contains a lithium battery and must be carried in the cabin, not checked. ❌ DO NOT USE ON PLANE. 🚨 CUSTOMS WARNING: Vaping is strictly ILLEGAL in many destinations (e.g., Thailand, Singapore, Mexico). Possession alone can lead to severe fines or ARREST. Always check local laws before traveling. (Source: FAA/Gov)",
        category: ["electronics", "smoking", "customs"],
        keywords: ["vape", "juul", "e-cig", "puff bar", "smoking"],
        customs_restricted: ["Thailand", "Singapore", "Mexico", "Taiwan"]
    },

    // --- TOILETRIES ---
    {
        id: 8,
        name: "Toothpaste",
        carryOn: "restricted",
        checked: "allowed",
        note: "⚠️ Liquid rule applies: Max 100ml (3.4oz). Large tubes prohibited in carry-on even if half empty. (Source: TSA)",
        category: ["toiletries", "liquids"],
        keywords: ["toothpaste", "colgate", "crest", "teeth"]
    },
    {
        id: 10,
        name: "Deodorant (Solid Stick)",
        carryOn: "allowed",
        checked: "allowed",
        note: "✅ Solid sticks have NO size limit. Allowed in any quantity. (Source: TSA)",
        category: ["toiletries"],
        keywords: ["deodorant", "stick", "old spice", "dove"]
    },
    {
        id: 11,
        name: "Deodorant (Spray/Gel)",
        carryOn: "restricted",
        checked: "allowed",
        note: "⚠️ Liquid rule applies: Max 100ml (3.4oz) in carry-on. (Source: TSA)",
        category: ["toiletries", "liquids"],
        keywords: ["deodorant", "spray", "axe", "gel"]
    },
    {
        id: 5,
        name: "Scissors (Small)",
        carryOn: "allowed",
        checked: "allowed",
        note: "✅ Allowed if blades are less than 4 inches (10cm) from the pivot point. (Source: TSA)",
        category: ["tools", "toiletries"],
        keywords: ["scissors", "cutters", "nail scissors"]
    },
    {
        id: 6,
        name: "Scissors (Large)",
        carryOn: "prohibited",
        checked: "allowed",
        note: "❌ Blades longer than 4 inches (10cm) must be checked. (Source: TSA)",
        category: ["tools"],
        keywords: ["scissors", "shears", "office scissors"]
    },
    {
        id: 7,
        name: "Pocket Knife / Swiss Army",
        carryOn: "prohibited",
        checked: "allowed",
        note: "❌ PROHIBITED. Security has a zero-tolerance policy for all knives, regardless of blade length or size. Do not attempt to bring small or novelty knives in your carry-on; they will be confiscated. This item MUST be packed securely in your checked luggage. (Source: TSA)",
        category: ["tools", "weapons"],
        keywords: ["knife", "blade", "swiss army", "leatherman"]
    },
    {
        id: 12,
        name: "Razor (Disposable/Cartridge)",
        carryOn: "allowed",
        checked: "allowed",
        note: "✅ Allowed in carry-on. (Source: TSA)",
        category: ["toiletries"],
        keywords: ["razor", "gillette", "shaving", "bic"]
    },
    {
        id: 13,
        name: "Razor (Safety/Straight)",
        carryOn: "prohibited",
        checked: "allowed",
        note: "❌ Safety razors with removable blades are BANNED in carry-on (unless blade is removed). Straight razors always banned. (Source: TSA)",
        category: ["toiletries", "weapons"],
        keywords: ["razor", "safety razor", "straight razor", "blade"]
    },

    // --- OTHER COMMON ITEMS ---
    {
        id: 18,
        name: "Lighter (Disposable)",
        carryOn: "allowed",
        checked: "prohibited",
        note: "✅ USA/EU: One allowed on person. ❌ CHINA/JAPAN: All lighters/matches are STRICTLY BANNED in both carry-on and checked. (Source: CAAC)",
        category: ["fire", "smoking"],
        keywords: ["lighter", "bic", "fire"],
        customs_restricted: ["China", "Thailand"]
    },
    {
        id: 91,
        name: "Coffee (Ground or Beans)",
        carryOn: "allowed",
        checked: "allowed",
        note: "✅ Allowed. Powders over 350ml (12oz) may require extra screening. 🚨 CUSTOMS: Australia/NZ restrict unroasted beans. (Source: TSA)",
        category: ["food"],
        keywords: ["coffee", "beans", "ground", "espresso"],
        customs_restricted: ["Australia", "New Zealand"]
    },
    {
        id: 14,
        name: "Prescription Medication (General)",
        carryOn: "allowed",
        checked: "allowed",
        note: "✅ Allowed. It is highly recommended to keep all medication in its original packaging and bring a copy of the prescription or a doctor's note, especially when traveling internationally. Liquids (e.g., insulin) that are medically necessary are EXEMPT from the 100ml rule. 🚨 JAPAN/UAE WARNING: Certain common narcotics and stimulants (like Adderall or codeine) are ILLEGAL narcotics without special permits. Check embassy lists BEFORE travel. (Source: TSA/Gov)",
        category: ["medication", "customs"],
        keywords: ["medicine", "pills", "drugs", "adderall", "ritalin", "codeine"],
        customs_restricted: ["Japan", "UAE"]
    },
    {
        id: 16,
        name: "Insulin and Syringes",
        carryOn: "allowed",
        checked: "allowed",
        note: "✅ Allowed in both carry-on and checked luggage. 💡 CRITICAL: Keep insulin in its original prescription packaging with your name clearly visible. Notify TSA officer at the start of screening. ✅ Insulin and other liquid medications are EXEMPT from the 100ml (3.4oz) rule. You may carry unlimited quantities of medically necessary liquids. 💉 Syringes and needles are permitted when accompanied by injectable medication. Declare all medical supplies at checkpoint. (Source: TSA.gov)",
        category: ["medication"],
        keywords: ["insulin", "diabetes", "diabetic", "needles", "syringes", "injection", "shots", "glucose"]
    },
    {
        id: 26,
        name: "Breast Milk / Formula",
        carryOn: "allowed",
        checked: "allowed",
        note: "✅ EXEMPT from 100ml rule. Allowed in reasonable quantities. Inform officer at start of screening. (Source: TSA)",
        category: ["baby", "liquids"],
        keywords: ["milk", "formula", "baby", "nursing"]
    },
    {
        id: 150,
        name: "Nail Clippers",
        carryOn: "allowed",
        checked: "allowed",
        note: "✅ Allowed. (Source: TSA)",
        category: ["toiletries"],
        keywords: ["clippers", "nails", "grooming"]
    },
    {
        id: 82,
        name: "Baby Wipes / Wet Wipes",
        carryOn: "allowed",
        checked: "allowed",
        note: "✅ Allowed. Not considered a liquid. (Source: TSA)",
        category: ["toiletries", "baby"],
        keywords: ["wipes", "wet wipes", "baby"]
    },
    {
        id: 9, name: "Shampoo / Conditioner", carryOn: "restricted", checked: "allowed",
        note: "⚠️ Liquid rule applies: Max 100ml (3.4oz) per bottle. Unlimited in checked bags. (Source: TSA)",
        category: ["toiletries", "liquids"], keywords: ["shampoo", "soap", "hair", "conditioner"]
    },
    {
        id: 41, name: "Sunscreen (Lotion/Spray)", carryOn: "restricted", checked: "allowed",
        note: "⚠️ Liquid rule applies: Max 100ml (3.4oz). Full-size bottles must be checked. (Source: TSA)",
        category: ["toiletries", "liquids"], keywords: ["sunscreen", "sunblock", "spf"]
    },
    {
        id: 43, name: "Makeup (Liquid/Cream)", carryOn: "restricted", checked: "allowed",
        note: "⚠️ Mascara, liquid foundation, and creams must be under 100ml. Powder makeup is unrestricted. (Source: TSA)",
        category: ["toiletries", "liquids"], keywords: ["makeup", "mascara", "foundation", "lipstick"]
    },
    {
        id: 35, name: "Headphones / Earbuds", carryOn: "allowed", checked: "allowed",
        note: "✅ Allowed. (Source: TSA)",
        category: ["electronics"], keywords: ["headphones", "earbuds", "airpods", "beats"]
    },
    {
        id: 36, name: "Tablet / iPad", carryOn: "allowed", checked: "allowed",
        note: "✅ Allowed. Must be removed from bag at security in most airports. (Source: TSA)",
        category: ["electronics"], keywords: ["tablet", "ipad", "kindle"]
    },
    {
        id: 32, name: "Camera (DSLR/Mirrorless)", carryOn: "allowed", checked: "allowed",
        note: "✅ Allowed. Recommended in carry-on to prevent theft/damage. (Source: TSA)",
        category: ["electronics"], keywords: ["camera", "dslr", "lens", "photography"]
    },
    {
        id: 25, name: "Baby Formula (Powder/Liquid)", carryOn: "allowed", checked: "allowed",
        note: "✅ EXEMPT from liquid rule. You can bring more than 100ml. Tell the TSA officer. (Source: TSA)",
        category: ["baby", "liquids", "food"], keywords: ["formula", "baby", "milk", "similac"]
    },
    {
        id: 21, name: "Snacks (Chips/Cookies)", carryOn: "allowed", checked: "allowed",
        note: "✅ Solid foods are allowed. (Source: TSA)",
        category: ["food"], keywords: ["chips", "cookies", "snacks", "food"]
    },
    {
        id: 22, name: "Sandwich / Burger", carryOn: "allowed", checked: "allowed",
        note: "✅ Allowed. If it has a lot of sauce/mayo, it might get flagged. (Source: TSA)",
        category: ["food"], keywords: ["sandwich", "burger", "lunch", "meal"]
    },
    {
        id: 75, name: "Electric Toothbrush", carryOn: "allowed", checked: "allowed",
        note: "✅ Allowed. (Source: TSA)",
        category: ["toiletries", "electronics"], keywords: ["toothbrush", "electric"]
    },

    // --- SPORTS EQUIPMENT ---
    {
        id: 300,
        name: "Baseball / Cricket Bat",
        carryOn: "prohibited",
        checked: "allowed",
        note: "❌ BANNED in the cabin. The security rule views this as a potential blunt force weapon. It MUST be placed in checked luggage. Note that most airlines charge an oversize fee for specialized sports equipment. Always declare it during check-in. (Source: TSA)",
        category: ["sports", "weapons"],
        keywords: ["bat", "baseball", "cricket", "softball", "club"]
    },
    {
        id: 301,
        name: "Golf Clubs",
        carryOn: "prohibited",
        checked: "allowed",
        note: "❌ BANNED in cabin. Must be checked. Clean clubs to avoid soil/customs issues internationally. (Source: TSA)",
        category: ["sports"],
        keywords: ["golf", "clubs", "driver", "putter"]
    },
    {
        id: 302,
        name: "Tennis / Badminton Racket",
        carryOn: "allowed",
        checked: "allowed",
        note: "✅ Allowed, but check airline size limits for overhead bins. If it doesn't fit, it must be checked. (Source: TSA)",
        category: ["sports"],
        keywords: ["tennis", "racket", "racquet", "badminton", "squash"]
    },
    {
        id: 303,
        name: "Ice Skates",
        carryOn: "allowed",
        checked: "allowed",
        note: "✅ Allowed by TSA in carry-on. ⚠️ Warning: Some international airlines (and UK/EU airports) may reject them as 'blades'. Check local rules. (Source: TSA)",
        category: ["sports", "sharp objects"],
        keywords: ["skates", "ice skates", "hockey", "blades"]
    },
    {
        id: 304,
        name: "Roller Skates / Blades",
        carryOn: "allowed",
        checked: "allowed",
        note: "✅ Allowed in carry-on and checked bags. (Source: TSA)",
        category: ["sports"],
        keywords: ["skates", "rollerblades", "roller"]
    },
    {
        id: 305,
        name: "Skateboard",
        carryOn: "allowed",
        checked: "allowed",
        note: "✅ Allowed if it fits under the seat or in overhead bin. Some budget airlines forced check-in. (Source: TSA)",
        category: ["sports"],
        keywords: ["skateboard", "skating", "penny board", "longboard"]
    },
    {
        id: 306,
        name: "Fishing Rod / Pole",
        carryOn: "allowed",
        checked: "allowed",
        note: "✅ Allowed if it fits airline size limits. ⚠️ Hooks must be securely sheathed/covered. Large tackle must be checked. (Source: TSA)",
        category: ["sports", "sharp objects"],
        keywords: ["fishing", "rod", "pole", "fish"]
    },
    {
        id: 307,
        name: "Bowling Ball",
        carryOn: "allowed",
        checked: "allowed",
        note: "✅ Allowed in carry-on. Be careful taking it out of overhead bins! (Source: TSA)",
        category: ["sports"],
        keywords: ["bowling", "ball"]
    },
    {
        id: 308,
        name: "Yoga Mat",
        carryOn: "allowed",
        checked: "allowed",
        note: "✅ Allowed. Counts as your carry-on or personal item depending on airline. (Source: TSA)",
        category: ["sports"],
        keywords: ["yoga", "mat", "pilates", "exercise"]
    },
    {
        id: 309,
        name: "Ski / Hiking Poles",
        carryOn: "prohibited",
        checked: "allowed",
        note: "❌ BANNED in cabin (sharp points). Must be checked. (Source: TSA)",
        category: ["sports", "sharp objects"],
        keywords: ["ski", "poles", "hiking", "trekking", "walking stick"]
    },
    {
        id: 310,
        name: "Boxing Gloves",
        carryOn: "allowed",
        checked: "allowed",
        note: "✅ Allowed. (Source: TSA)",
        category: ["sports"],
        keywords: ["boxing", "gloves", "fighting", "mma"]
    },
    {
        id: 311,
        name: "Helmet (Bike/Sports)",
        carryOn: "allowed",
        checked: "allowed",
        note: "✅ Allowed. Often clipped to outside of backpack. (Source: TSA)",
        category: ["sports"],
        keywords: ["helmet", "bike", "motorcycle", "protection"]
    },
    {
        id: 312,
        name: "Inflatable Balls (Soccer/Basketball)",
        carryOn: "allowed",
        checked: "allowed",
        note: "✅ Allowed. ⚠️ TIP: Deflate partially (to 50%) to prevent bursting/warping due to cabin pressure changes. (Source: TSA)",
        category: ["sports"],
        keywords: ["ball", "soccer", "basketball", "football", "volleyball"]
    },
    {
        id: 314,
        name: "Parachute",
        carryOn: "allowed",
        checked: "allowed",
        note: "✅ Allowed. Must be packed separately from other luggage. Security may open to inspect. (Source: TSA)",
        category: ["sports"],
        keywords: ["parachute", "skydive", "rig"]
    },
    {
        id: 315,
        name: "Dumbbells / Weights",
        carryOn: "restricted",
        checked: "allowed",
        note: "⚠️ Generally allowed, but security may reject heavy weights as 'blunt force weapons'. Best to check them. (Source: TSA)",
        category: ["sports"],
        keywords: ["weights", "dumbbells", "gym", "workout"]
    },
    {
        id: 316,
        name: "Billiards / Pool Cue",
        carryOn: "prohibited",
        checked: "allowed",
        note: "❌ BANNED in cabin. Must be checked. (Source: TSA)",
        category: ["sports"],
        keywords: ["pool", "cue", "billiards", "snooker"]
    },
    {
        id: 317,
        name: "Surfboard",
        carryOn: "prohibited",
        checked: "allowed",
        note: "❌ Too large for cabin. Must be checked (Oversize fees usually apply). Remove fins/wax. (Source: Airline Policies)",
        category: ["sports"],
        keywords: ["surf", "surfboard", "board"]
    },

    // --- TOOLS & HOME IMPROVEMENT ---
    {
        id: 400,
        name: "Power Drill",
        carryOn: "prohibited",
        checked: "allowed",
        note: "❌ Power tools are BANNED in the cabin. Must be checked. Spare lithium batteries for the drill must go in CARRY-ON. (Source: TSA)",
        category: ["tools", "electronics"],
        keywords: ["drill", "power tool", "driver"]
    },
    {
        id: 401,
        name: "Drill Bits",
        carryOn: "allowed",
        checked: "allowed",
        note: "✅ Allowed in carry-on (surprisingly!). But keeping them with the drill in checked bags is safer to avoid delays. (Source: TSA)",
        category: ["tools"],
        keywords: ["drill bits", "bit", "tool"]
    },
    {
        id: 402,
        name: "Hammer",
        carryOn: "prohibited",
        checked: "allowed",
        note: "❌ Bludgeoning tools are BANNED in cabin. Must be checked. (Source: TSA)",
        category: ["tools"],
        keywords: ["hammer", "mallet", "tool"]
    },
    {
        id: 403,
        name: "Screwdriver (Under 7 inches)",
        carryOn: "allowed",
        checked: "allowed",
        note: "✅ Allowed if overall length is UNDER 7 inches (18cm). (Source: TSA)",
        category: ["tools"],
        keywords: ["screwdriver", "tool", "flathead", "phillips"]
    },
    {
        id: 404,
        name: "Screwdriver (Over 7 inches)",
        carryOn: "prohibited",
        checked: "allowed",
        note: "❌ Tools longer than 7 inches (18cm) must be checked. (Source: TSA)",
        category: ["tools"],
        keywords: ["screwdriver", "tool", "large tool"]
    },
    {
        id: 405,
        name: "Wrenches / Pliers",
        carryOn: "allowed",
        checked: "allowed",
        note: "✅ Allowed if UNDER 7 inches (18cm). Larger ones must be checked. (Source: TSA)",
        category: ["tools"],
        keywords: ["wrench", "pliers", "tool", "spanner"]
    },
    {
        id: 406,
        name: "Saw / Saw Blades",
        carryOn: "prohibited",
        checked: "allowed",
        note: "❌ All saws and blades are BANNED in cabin. Must be checked. (Source: TSA)",
        category: ["tools", "sharp objects"],
        keywords: ["saw", "blade", "hacksaw", "chain saw"]
    },
    {
        id: 407,
        name: "Tape Measure",
        carryOn: "allowed",
        checked: "allowed",
        note: "✅ Allowed. (Source: TSA)",
        category: ["tools"],
        keywords: ["tape measure", "measuring tape"]
    },
    {
        id: 408,
        name: "Multitool (Leatherman)",
        carryOn: "prohibited",
        checked: "allowed",
        note: "❌ If it has a blade (almost all do), it must be checked. TSA will confiscate these! (Source: TSA)",
        category: ["tools", "sharp objects"],
        keywords: ["multitool", "leatherman", "swiss army", "utility"]
    },
    {
        id: 409,
        name: "Crowbar",
        carryOn: "prohibited",
        checked: "allowed",
        note: "❌ BANNED in cabin. Must be checked. (Source: TSA)",
        category: ["tools"],
        keywords: ["crowbar", "pry bar"]
    },

    // --- CAMPING & OUTDOOR ---
    {
        id: 420,
        name: "Camping Stove (Used)",
        carryOn: "allowed",
        checked: "allowed",
        note: "✅ Allowed ONLY if completely empty and cleaned of all fuel vapors. If it smells like gas, TSA will seize it. (Source: TSA)",
        category: ["camping", "fire"],
        keywords: ["stove", "camping", "burner", "jetboil"]
    },
    {
        id: 421,
        name: "Fuel Canister (Gas)",
        carryOn: "prohibited",
        checked: "prohibited",
        note: "❌ FLAMMABLE GAS BANNED everywhere. Do not bring. Buy fuel at destination. (Source: FAA/TSA)",
        category: ["camping", "fire", "hazardous"],
        keywords: ["fuel", "gas", "propane", "butane", "isopro"]
    },
    {
        id: 422,
        name: "Tent Spikes / Poles",
        carryOn: "prohibited",
        checked: "allowed",
        note: "❌ Metal spikes are considered potential weapons. Tent fabric can be carry-on, but poles/stakes must be checked. (Source: TSA)",
        category: ["camping"],
        keywords: ["tent", "spikes", "stakes", "poles"]
    },
    {
        id: 423,
        name: "Bear Spray",
        carryOn: "prohibited",
        checked: "prohibited",
        note: "❌ BANNED. It exceeds the 4oz limit for self-defense sprays and is considered a hazardous material. (Source: TSA/FAA)",
        category: ["camping", "weapons", "hazardous"],
        keywords: ["bear spray", "pepper spray", "mace"]
    },
    {
        id: 424,
        name: "Cast Iron Skillet",
        carryOn: "allowed",
        checked: "allowed",
        note: "✅ Allowed. It's just heavy! (Source: TSA)",
        category: ["camping", "cooking"],
        keywords: ["skillet", "pan", "cast iron", "cookware"]
    },
    {
        id: 425,
        name: "Cooler (Empty)",
        carryOn: "allowed",
        checked: "allowed",
        note: "✅ Allowed. If bringing ice packs, they must be FROZEN SOLID at security. Slushy ice packs will be confiscated. (Source: TSA)",
        category: ["camping", "food"],
        keywords: ["cooler", "ice chest", "yeti"]
    },

    // --- FLAMMABLES & DANGEROUS GOODS ---
    {
        id: 440,
        name: "Matches (Safety)",
        carryOn: "allowed",
        checked: "prohibited",
        note: "✅ ONE book of safety matches allowed on your person. ❌ Banned in checked bags. (Source: FAA)",
        category: ["fire"],
        keywords: ["matches", "safety matches"]
    },
    {
        id: 441,
        name: "Matches (Strike-Anywhere)",
        carryOn: "prohibited",
        checked: "prohibited",
        note: "❌ BANNED completely. They can ignite by friction. (Source: FAA)",
        category: ["fire", "hazardous"],
        keywords: ["matches", "strike anywhere"]
    },
    {
        id: 442,
        name: "Fireworks / Sparklers",
        carryOn: "prohibited",
        checked: "prohibited",
        note: "❌ EXPLOSIVES BANNED everywhere. Don't even try. (Source: TSA/FAA)",
        category: ["hazardous", "fire"],
        keywords: ["fireworks", "sparklers", "crackers", "explosive"]
    },
    {
        id: 443,
        name: "Spray Paint",
        carryOn: "prohibited",
        checked: "prohibited",
        note: "❌ BANNED. Aerosol paint is flammable and explosive. (Source: TSA)",
        category: ["art", "hazardous"],
        keywords: ["paint", "spray paint", "aerosol", "graffiti"]
    },
    {
        id: 444,
        name: "Bleach / Chlorine",
        carryOn: "prohibited",
        checked: "prohibited",
        note: "❌ BANNED. Hazardous chemical. (Source: TSA)",
        category: ["cleaning", "hazardous"],
        keywords: ["bleach", "chlorine", "pool chemicals"]
    },

    // --- SELF DEFENSE ---
    {
        id: 460,
        name: "Pepper Spray / Mace",
        carryOn: "prohibited",
        checked: "restricted",
        note: "⚠️ CHECKED ONLY (USA). One 4oz container allowed. 🚨 ILLEGAL in UK, China, Singapore, and many EU countries. (Source: TSA)",
        category: ["weapons", "self-defense"],
        keywords: ["pepper spray", "mace", "spray"],
        customs_restricted: ["UK", "China", "Singapore", "Japan", "Thailand", "EU"]
    },
    {
        id: 461,
        name: "Brass Knuckles",
        carryOn: "prohibited",
        checked: "allowed",
        note: "❌ BANNED in cabin. Allowed in checked bags, but verify local laws at destination (illegal in many states/countries). (Source: TSA)",
        category: ["weapons"],
        keywords: ["brass knuckles", "knuckles", "weapon"]
    },
    {
        id: 462,
        name: "Taser / Stun Gun",
        carryOn: "prohibited",
        checked: "allowed",
        note: "⚠️ CHECKED ONLY. Battery must be removed or rendered inoperable. 🚨 Illegal in many countries. (Source: TSA)",
        category: ["weapons", "electronics"],
        keywords: ["taser", "stun gun", "shock"]
    },
    {
        id: 463,
        name: "Pocket Knife",
        carryOn: "prohibited",
        checked: "allowed",
        note: "❌ All knives are BANNED in cabin. Must be checked. (Source: TSA)",
        category: ["weapons", "tools"],
        keywords: ["knife", "blade", "pen knife"]
    },

    // --- MISCELLANEOUS / HOUSEHOLD ---
    {
        id: 480,
        name: "Cremated Remains (Ashes)",
        carryOn: "allowed",
        checked: "allowed",
        note: "✅ Allowed. Must pass through X-ray. Container must be wood/plastic (not metal/lead) so X-ray can see inside. TSA will NOT open the container. (Source: TSA)",
        category: ["household"],
        keywords: ["ashes", "cremation", "remains", "urn"]
    },
    {
        id: 481,
        name: "Snow Globe",
        carryOn: "restricted",
        checked: "allowed",
        note: "⚠️ Liquid rule applies! Only allowed in carry-on if smaller than a tennis ball. Larger ones must be checked. (Source: TSA)",
        category: ["liquids", "other"],
        keywords: ["snow globe", "souvenir", "gift"]
    },
    {
        id: 482,
        name: "Dry Ice",
        carryOn: "allowed",
        checked: "allowed",
        note: "✅ Allowed. Max 5.5 lbs (2.5 kg). Package must be vented (not airtight) to let gas escape. Airline approval usually required. (Source: FAA)",
        category: ["other", "hazardous"],
        keywords: ["dry ice", "ice", "frozen"]
    },
    {
        id: 483,
        name: "Christmas Crackers",
        carryOn: "prohibited",
        checked: "prohibited",
        note: "❌ BANNED by most airlines (Delta, American, United, etc.) because they contain tiny explosives. (Source: Airline Policies)",
        category: ["other", "holiday"],
        keywords: ["crackers", "christmas", "party poppers"]
    },
    {
        id: 484,
        name: "Knitting Needles",
        carryOn: "allowed",
        checked: "allowed",
        note: "✅ Allowed. Circular needles recommended. Thread cutter blades must be covered. (Source: TSA)",
        category: ["hobbies", "tools"],
        keywords: ["knitting", "needles", "yarn", "crochet"]
    },
    {
        id: 485,
        name: "Paint (Artist - Acrylic/Water)",
        carryOn: "allowed",
        checked: "allowed",
        note: "✅ Non-flammable paints allowed. Liquid rule (100ml) applies for carry-on. (Source: TSA)",
        category: ["art", "liquids"],
        keywords: ["paint", "acrylic", "watercolor", "art"]
    },
    {
        id: 486,
        name: "Paint (Oil Based)",
        carryOn: "prohibited",
        checked: "prohibited",
        note: "❌ Often BANNED if flammable (check label for 'Flammable' symbol). Solvents like Turpentine are 100% prohibited. (Source: TSA)",
        category: ["art", "hazardous"],
        keywords: ["oil paint", "solvent", "turpentine"]
    },

    // --- HOUSEHOLD & KITCHEN ---
    {
        id: 500,
        name: "Blender",
        carryOn: "restricted",
        checked: "allowed",
        note: "⚠️ CARRY-ON: Allowed ONLY if the blade is removed. ❌ If the blade is attached, it must be checked. (Source: TSA)",
        category: ["household", "electronics", "sharp objects"],
        keywords: ["blender", "vitamix", "nutribullet", "smoothie"]
    },
    {
        id: 501,
        name: "Coffee Maker / Espresso Machine",
        carryOn: "allowed",
        checked: "allowed",
        note: "✅ Allowed. Please wrap the glass pot carefully if checking it! (Source: TSA)",
        category: ["household", "electronics"],
        keywords: ["coffee maker", "espresso", "keurig", "nespresso"]
    },
    {
        id: 502,
        name: "Pots and Pans",
        carryOn: "allowed",
        checked: "allowed",
        note: "✅ Allowed in both. Cast iron skillets are also allowed but may require additional screening due to density. (Source: TSA)",
        category: ["household", "cooking"],
        keywords: ["pot", "pan", "skillet", "wok", "cooking"]
    },
    {
        id: 503,
        name: "Kitchen Knives",
        carryOn: "prohibited",
        checked: "allowed",
        note: "❌ All knives, whether a small paring knife or a large chef's knife, are BANNED in the cabin. This rule is non-negotiable. They MUST be packed securely in checked baggage. Wrap the sharp edges safely (e.g., in cardboard or a sheath) to prevent injury to baggage handlers and TSA screeners. (Source: TSA)",
        category: ["household", "sharp objects", "weapons"],
        keywords: ["knife", "chef knife", "steak knife", "cutlery"]
    },
    {
        id: 504,
        name: "Forks and Spoons",
        carryOn: "allowed",
        checked: "allowed",
        note: "✅ Metal and plastic forks/spoons are allowed. (Source: TSA)",
        category: ["household", "cooking"],
        keywords: ["fork", "spoon", "silverware", "cutlery"]
    },
    {
        id: 505,
        name: "Corkscrew (No Blade)",
        carryOn: "allowed",
        checked: "allowed",
        note: "✅ Allowed if it does NOT have a small foil-cutting blade attached. (Source: TSA)",
        category: ["household", "tools"],
        keywords: ["corkscrew", "wine opener"]
    },
    {
        id: 506,
        name: "Corkscrew (With Blade)",
        carryOn: "prohibited",
        checked: "allowed",
        note: "❌ If it has a small knife/blade for foil, it must be checked. (Source: TSA)",
        category: ["household", "sharp objects"],
        keywords: ["corkscrew", "wine opener", "waiter's friend"]
    },
    {
        id: 507,
        name: "Clothes Iron / Steamer",
        carryOn: "allowed",
        checked: "allowed",
        note: "✅ Allowed. Empty all water before packing to avoid leaks and liquid rule issues. (Source: TSA)",
        category: ["household", "electronics"],
        keywords: ["iron", "steamer", "clothes"]
    },
    {
        id: 508,
        name: "Microwave / Small Appliances",
        carryOn: "allowed",
        checked: "allowed",
        note: "✅ Allowed if it fits in the overhead bin (good luck!). Checked is recommended. (Source: TSA)",
        category: ["household", "electronics"],
        keywords: ["microwave", "toaster", "appliance"]
    },
    {
        id: 509,
        name: "Light Bulbs",
        carryOn: "allowed",
        checked: "allowed",
        note: "✅ Allowed (LED, CFL, Incandescent). Pack carefully! (Source: TSA)",
        category: ["household"],
        keywords: ["light bulb", "lamp", "lights"]
    },
    {
        id: 510,
        name: "Extension Cord / Power Strip",
        carryOn: "allowed",
        checked: "allowed",
        note: "✅ Allowed. (Source: TSA)",
        category: ["household", "electronics"],
        keywords: ["extension cord", "power strip", "surge protector"]
    },
    {
        id: 511,
        name: "Flashlight",
        carryOn: "allowed",
        checked: "allowed",
        note: "✅ Allowed. If it's a large 'tactical' flashlight (over 7 inches), it might be considered a bludgeon (weapon) and require checking. (Source: TSA)",
        category: ["household", "tools", "camping"],
        keywords: ["flashlight", "torch", "light"]
    },
    {
        id: 512,
        name: "Sewing Kit",
        carryOn: "allowed",
        checked: "allowed",
        note: "✅ Allowed if scissors are smaller than 4 inches. Needles are allowed. (Source: TSA)",
        category: ["household", "tools"],
        keywords: ["sewing", "needle", "thread"]
    },
    {
        id: 513,
        name: "Glass Vase / Ceramics",
        carryOn: "allowed",
        checked: "allowed",
        note: "✅ Allowed. Carry-on is safer to prevent breakage. (Source: TSA)",
        category: ["household"],
        keywords: ["vase", "glass", "ceramic", "pottery"]
    },
    {
        id: 514,
        name: "Christmas Lights",
        carryOn: "allowed",
        checked: "allowed",
        note: "✅ Allowed. (Source: TSA)",
        category: ["household", "holiday"],
        keywords: ["lights", "christmas", "holiday", "decorations"]
    },
    {
        id: 515,
        name: "Vacuum Robot (Roomba)",
        carryOn: "allowed",
        checked: "allowed",
        note: "✅ Allowed. ⚠️ Lithium battery rules apply! If checking the robot, you usually must REMOVE the battery and take it in the cabin. (Source: FAA)",
        category: ["household", "electronics", "batteries"],
        keywords: ["vacuum", "roomba", "cleaning"]
    },
    {
        id: 516,
        name: "Detergent (Liquid)",
        carryOn: "restricted",
        checked: "allowed",
        note: "⚠️ Liquid rule applies: Max 3.4oz (100ml) in carry-on. Unlimited in checked bags. (Source: TSA)",
        category: ["household", "liquids", "cleaning"],
        keywords: ["detergent", "soap", "washing liquid"]
    },
    {
        id: 517,
        name: "Detergent (Pods/Powder)",
        carryOn: "allowed",
        checked: "allowed",
        note: "✅ Pods and Powder are allowed. Powders over 12oz (350ml) may require extra screening. (Source: TSA)",
        category: ["household", "cleaning"],
        keywords: ["detergent", "pods", "powder", "tide pods"]
    },

    // --- MUSICAL INSTRUMENTS ---
    {
        id: 600,
        name: "Cello",
        keywords: ["string instrument", "violoncello", "large instrument", "orchestra"],
        category: ["music"],
        carryOn: "restricted",
        checked: "allowed",
        note: "⚠️ <strong>Too Large for Cabin.</strong> Unless you purchase a separate 'Seat Baggage' ticket, this must be checked in a hard case. If buying a seat, it must be a bulkhead window seat."
    },
    {
        id: 601,
        name: "Violin",
        keywords: ["fiddle", "string instrument", "orchestra", "bow"],
        category: ["music"],
        carryOn: "allowed",
        checked: "allowed",
        note: "✅ <strong>Allowed.</strong> US Law (FAA Act 2012) allows this as free carry-on IF there is space when you board. Do not loosen strings completely."
    },
    {
        id: 602,
        name: "Guitar",
        keywords: ["acoustic", "electric", "fender", "gibson", "axe"],
        category: ["music"],
        carryOn: "restricted",
        checked: "allowed",
        note: "⚠️ <strong>Bin Space Roulette.</strong> Allowed if it fits in the overhead bin. If bins are full, you will be forced to gate-check it. Loosen strings to prevent neck warping in the cold cargo hold."
    },
    {
        id: 603,
        name: "Double Bass",
        keywords: ["upright bass", "contrabass", "bass viol"],
        category: ["music"],
        carryOn: "prohibited",
        checked: "restricted",
        note: "❌ <strong>Oversize Cargo.</strong> Exceeds all carry-on limits. Must be checked as oversized cargo. Check flight cargo door dimensions first."
    },
    {
        id: 604,
        name: "Trumpet",
        keywords: ["brass", "horn", "cornet", "bugle", "jazz"],
        category: ["music"],
        carryOn: "allowed",
        checked: "allowed",
        note: "✅ <strong>Allowed.</strong> Fits in standard overhead bins. Keep in a hard case to prevent denting."
    },
    {
        id: 605,
        name: "Cello Bow / Violin Bow",
        keywords: ["bow", "stick", "horsehair", "frog", "pernambuco"],
        category: ["music", "restricted"],
        carryOn: "allowed",
        checked: "allowed",
        note: "⚠️ <strong>CITES Risk.</strong> High-quality bows made of Pernambuco wood or Ivory tips require a 'Musical Instrument Certificate' to cross international borders."
    },

    // --- MEDICAL EQUIPMENT ---
    {
        id: 610,
        name: "CPAP Machine",
        keywords: ["sleep apnea", "bipap", "apap", "snoring", "breathing"],
        category: ["medication", "electronics"],
        carryOn: "allowed",
        checked: "allowed",
        note: "✅ <strong>Medical Device.</strong> Does NOT count against your carry-on bag limit. Remove from case for X-ray. Distilled water >3.4oz is allowed if declared."
    },
    {
        id: 611,
        name: "Nebulizer",
        keywords: ["asthma pump", "mist inhaler", "atomizer", "therapy"],
        category: ["medication", "electronics"],
        carryOn: "allowed",
        checked: "allowed",
        note: "✅ <strong>Allowed.</strong> Medical device. Liquid medication is exempt from the 100ml rule."
    },
    {
        id: 612,
        name: "Portable Oxygen Concentrator (POC)",
        keywords: ["oxygen", "O2", "copd", "air machine"],
        category: ["medication", "electronics"],
        carryOn: "allowed",
        checked: "allowed",
        note: "✅ <strong>Must be FAA Approved.</strong> Check for red manufacturer label. Battery must last 150% of flight duration. Liquid oxygen tanks are BANNED."
    },
    {
        id: 613,
        name: "Insulin Pump",
        keywords: ["diabetes", "medtronic", "tandem", "diabetic"],
        category: ["medication", "electronics"],
        carryOn: "allowed",
        checked: "allowed",
        note: "⚠️ <strong>DO NOT X-RAY.</strong> Radiation can corrupt the software. Request a 'Hand Inspection' or 'Pat Down' at the checkpoint."
    },
    {
        id: 614,
        name: "Continuous Glucose Monitor (CGM)",
        keywords: ["dexcom", "libre", "blood sugar", "sensor"],
        category: ["medication", "electronics"],
        carryOn: "allowed",
        checked: "allowed",
        note: "⚠️ <strong>DO NOT X-RAY.</strong> Wear it through the metal detector or request a pat-down. X-ray scanners can damage the sensor."
    },
    {
        id: 615,
        name: "Insulin Cooling Case",
        keywords: ["frio", "cooler", "ice pack", "medication"],
        category: ["medication", "liquids"],
        carryOn: "allowed",
        checked: "allowed",
        note: "✅ <strong>Exempt.</strong> Gel packs are allowed even if slushy or melted because they are 'Medically Necessary'. Declare them to TSA."
    },
    {
        id: 616,
        name: "EpiPen",
        keywords: ["epinephrine", "allergy", "anaphylaxis", "auto-injector"],
        category: ["medication", "liquids"],
        carryOn: "allowed",
        checked: "allowed",
        note: "✅ <strong>Allowed.</strong> Liquid rule exemption applies. Verification of prescription label may be requested."
    },
    {
        id: 617,
        name: "Wheelchair (Wet Cell Battery)",
        keywords: ["power chair", "mobility aid", "electric chair"],
        category: ["medication", "batteries"],
        carryOn: "restricted",
        checked: "restricted",
        note: "⚠️ <strong>Captain Notification Required.</strong> Battery must be disconnected, terminals protected, and stored upright in the hold. Arrive early."
    },
    {
        id: 618,
        name: "Liquid Nitrogen Dry Shipper",
        keywords: ["ivf", "embryo", "sperm tank", "cryo"],
        category: ["medication", "hazardous"],
        carryOn: "allowed",
        checked: "allowed",
        note: "✅ <strong>For IVF/Cryo.</strong> Nitrogen must be fully absorbed (no free liquid). Complies with IATA Special Provision A152."
    },

    // --- BABY & FAMILY ---
    {
        id: 630,
        name: "Stroller",
        keywords: ["pram", "buggy", "pushchair", "baby"],
        category: ["baby"],
        carryOn: "allowed",
        checked: "allowed",
        note: "✅ <strong>Gate Check Standard.</strong> Small travel strollers (e.g. Yoyo) fit in overhead. Large ones must be gate-checked before boarding."
    },
    {
        id: 631,
        name: "Car Seat",
        keywords: ["booster", "infant carrier", "child seat"],
        category: ["baby"],
        carryOn: "allowed",
        checked: "allowed",
        note: "✅ <strong>Allowed on Board.</strong> If you bought a seat for your child, you can use the car seat (must be FAA approved). Otherwise, gate-check it for free."
    },
    {
        id: 632,
        name: "Freeze-Dried Baby Snacks",
        keywords: ["yogurt melts", "puffs", "teething crackers"],
        category: ["baby", "food"],
        carryOn: "allowed",
        checked: "allowed",
        note: "✅ <strong>Allowed.</strong> No liquid restrictions. Great for keeping toddlers quiet."
    },
    {
        id: 633,
        name: "Diaper Cream",
        keywords: ["rash cream", "desitin", "ointment", "zinc"],
        category: ["baby", "liquids"],
        carryOn: "restricted",
        checked: "allowed",
        note: "⚠️ <strong>Liquid Rule Applies.</strong> Unless declared as 'Medically Necessary' (officer discretion), containers must be under 3.4oz (100ml)."
    },

    // --- HOBBIES & TECH ---
    {
        id: 640,
        name: "Drone (Consumer)",
        keywords: ["dji", "mavic", "quadcopter", "uav"],
        category: ["electronics", "batteries"],
        carryOn: "allowed",
        checked: "allowed",
        customs_restricted: ["Nicaragua", "Morocco", "Egypt"],
        note: "✅ <strong>Drone Body Allowed.</strong> 🚨 <strong>Batteries:</strong> MUST go in carry-on. ⚠️ <strong>Banned Countries:</strong> Nicaragua and Morocco confiscate drones at customs."
    },
    {
        id: 641,
        name: "LiPo Batteries (Spare)",
        keywords: ["drone battery", "rc", "lithium polymer"],
        category: ["electronics", "batteries"],
        carryOn: "allowed",
        checked: "prohibited",
        note: "🚨 <strong>FIRE RISK.</strong> Carry-on ONLY. Terminals must be taped. Max 2 spares if between 100-160Wh. Unlimited if under 100Wh."
    },
    {
        id: 642,
        name: "VR Headset",
        keywords: ["oculus", "meta quest", "vision pro", "goggles"],
        category: ["electronics"],
        carryOn: "allowed",
        checked: "allowed",
        note: "✅ <strong>Treat as Laptop.</strong> Remove from bag for X-ray screening. Protect lenses from sunlight."
    },
    {
        id: 643,
        name: "Desktop Computer / GPU",
        keywords: ["pc tower", "gaming rig", "nvidia", "graphics card"],
        category: ["electronics"],
        carryOn: "allowed",
        checked: "allowed",
        note: "✅ <strong>Allowed.</strong> High value items should go in carry-on. If checking, remove the GPU and CPU cooler to prevent structural damage."
    },
    {
        id: 644,
        name: "Soldering Iron",
        keywords: ["welding", "electronics tool", "heating"],
        category: ["tools"],
        carryOn: "allowed",
        checked: "allowed",
        note: "✅ <strong>Corded:</strong> Allowed. ⚠️ <strong>Butane/Cordless:</strong> Carry-on ONLY, and must have a safety cover securely fitted."
    },
    {
        id: 645,
        name: "Satellite Phone",
        keywords: ["iridium", "sat phone", "emergency"],
        category: ["electronics", "customs"],
        carryOn: "allowed",
        checked: "allowed",
        customs_restricted: ["India", "Cuba"],
        note: "✅ <strong>Allowed by Airline.</strong> 🚨 <strong>Illegal in India:</strong> Possession of a satellite phone in India without a specific permit is a criminal offense."
    },
    {
        id: 646,
        name: "AirTag / Tracker",
        keywords: ["apple tag", "tile", "smart tag", "luggage tracker"],
        category: ["electronics"],
        carryOn: "allowed",
        checked: "allowed",
        note: "✅ <strong>Allowed.</strong> The small lithium coin cell (CR2032) is exempt from the strict battery ban in checked luggage."
    },
    {
        id: 647,
        name: "Scuba Tank",
        keywords: ["dive cylinder", "air tank", "aluminum 80"],
        category: ["sports", "hazardous"],
        carryOn: "allowed",
        checked: "allowed",
        note: "⚠️ <strong>Valve Must Be Removed.</strong> The tank must be completely open for visual inspection of the interior. No compressed air allowed."
    },
    {
        id: 648,
        name: "Dive Knife",
        keywords: ["scuba knife", "sea knife", "underwater cutter"],
        category: ["sports", "weapons"],
        carryOn: "prohibited",
        checked: "allowed",
        note: "❌ <strong>Weapon.</strong> Checked baggage ONLY. Sheath securely to prevent injury to baggage handlers."
    },
    {
        id: 649,
        name: "Polymer Clay",
        keywords: ["fimo", "sculpey", "modeling clay"],
        category: ["art"],
        carryOn: "allowed",
        checked: "allowed",
        note: "⚠️ <strong>False Alarm Risk.</strong> Dense organic clay looks identical to C4 explosive on X-ray. Expect a bag search and swab test."
    },
    {
        id: 650,
        name: "Oil Paint Tubes",
        keywords: ["artist paint", "pigments", "art supplies"],
        category: ["art", "liquids"],
        carryOn: "allowed",
        checked: "allowed",
        note: "✅ <strong>Vegetable Oil Based:</strong> Allowed. ❌ <strong>Solvents/Turpentine:</strong> Strictly PROHIBITED in all luggage (Flammable)."
    },

    // --- FOOD & CUSTOMS ---
    {
        id: 660,
        name: "Manuka Honey",
        keywords: ["raw honey", "healing honey", "bee product"],
        category: ["food", "liquids", "customs"],
        carryOn: "restricted",
        checked: "allowed",
        customs_restricted: ["Australia", "New Zealand"],
        note: "⚠️ <strong>Liquid Rule:</strong> Jars >3.4oz must be checked. 🚨 <strong>Biosecurity:</strong> Banned from entering Western Australia or NZ due to bee disease risks."
    },
    {
        id: 661,
        name: "Jamon Iberico / Cured Ham",
        keywords: ["prosciutto", "serrano", "dry meat", "pork"],
        category: ["food", "customs"],
        carryOn: "allowed",
        checked: "allowed",
        customs_restricted: ["USA", "Australia", "New Zealand"],
        note: "🚨 <strong>Customs Warning:</strong> The US and Australia confiscate soft cured meats (ham, salami) from Europe due to Swine Fever regulations."
    },
    {
        id: 662,
        name: "Canned Surstromming",
        keywords: ["fermented herring", "rotten fish", "swedish fish"],
        category: ["food"],
        carryOn: "prohibited",
        checked: "prohibited",
        note: "❌ <strong>BANNED by Airlines.</strong> Air France, BA, and others forbid this due to the risk of pressurized can explosion and extreme odor."
    },
    {
        id: 663,
        name: "Durian Fruit",
        keywords: ["stinky fruit", "king of fruits", "thai fruit"],
        category: ["food"],
        carryOn: "prohibited",
        checked: "prohibited",
        note: "❌ <strong>BANNED.</strong> Most Asian airlines refuse Durian in the cabin or cargo due to the overwhelming smell."
    },
    {
        id: 664,
        name: "Fresh Eggs",
        keywords: ["raw eggs", "poultry", "baking"],
        category: ["food", "customs"],
        carryOn: "restricted",
        checked: "allowed",
        customs_restricted: ["USA", "Australia", "New Zealand", "Japan"],
        note: "⚠️ <strong>Gel Rule?</strong> Raw eggs are sometimes treated as liquids/gels. 🚨 <strong>Customs:</strong> High risk of Newcastle Disease. Usually confiscated at borders."
    },
    {
        id: 665,
        name: "Saffron",
        keywords: ["spice", "red gold", "crocus"],
        category: ["food"],
        carryOn: "allowed",
        checked: "allowed",
        note: "✅ <strong>Allowed.</strong> High value. Ensure it is commercially packaged to avoid agricultural inspection issues."
    },

    // --- HIGH-RISK MEDICATIONS ---
    {
        id: 700,
        name: "Adderall / Vyvanse",
        keywords: ["adhd", "amphetamine", "stimulant", "study drug", "focus"],
        category: ["medication", "restricted"],
        carryOn: "allowed",
        checked: "allowed",
        customs_restricted: ["Japan", "UAE", "Singapore", "Thailand", "China"],
        note: "🚨 <strong>STRICTLY BANNED in Japan & UAE.</strong> Contains amphetamines. Possession can lead to arrest/deportation. In other countries, you MUST have a doctor's prescription and keep it in the original bottle."
    },
    {
        id: 701,
        name: "Ritalin / Concerta",
        keywords: ["methylphenidate", "adhd", "focus", "meds"],
        category: ["medication", "restricted"],
        carryOn: "allowed",
        checked: "allowed",
        customs_restricted: ["Japan", "UAE", "Russia"],
        note: "⚠️ <strong>Restricted.</strong> Unlike Adderall, this is *sometimes* allowed in Japan but requires a 'Yunyu Kakunin-sho' (Import Certificate) approved in advance. Always carry a prescription."
    },
    {
        id: 702,
        name: "Codeine / Tylenol #3",
        keywords: ["painkiller", "cough syrup", "opioid", "tylenol 3"],
        category: ["medication", "restricted"],
        carryOn: "allowed",
        checked: "allowed",
        customs_restricted: ["UAE", "Japan", "Greece", "China"],
        note: "🚨 <strong>Banned in UAE & Japan.</strong> Codeine is considered a narcotic. Even over-the-counter cough syrups with codeine are illegal to bring into these countries without special government permission."
    },
    {
        id: 703,
        name: "Xanax / Valium",
        keywords: ["alprazolam", "benzodiazepine", "anxiety", "benzo", "diazepam"],
        category: ["medication", "restricted"],
        carryOn: "allowed",
        checked: "allowed",
        customs_restricted: ["UAE", "Japan", "Singapore", "Thailand"],
        note: "⚠️ <strong>Controlled Substance.</strong> Strictly regulated in UAE and Japan. You can usually bring a 30-day supply with a prescription, but bringing more requires prior approval."
    },
    {
        id: 704,
        name: "Tramadol",
        keywords: ["ultram", "pain relief", "opioid", "painkiller"],
        category: ["medication", "restricted"],
        carryOn: "allowed",
        checked: "allowed",
        customs_restricted: ["UAE", "Egypt", "Japan"],
        note: "🚨 <strong>Banned in UAE & Egypt.</strong> Tramadol is strictly controlled and often treated as a narcotic illegal drug in the Middle East. Do not bring it without strict government approval."
    },
    {
        id: 705,
        name: "Ambien / Lunesta",
        keywords: ["sleeping pill", "zolpidem", "insomnia", "sleep aid"],
        category: ["medication", "restricted"],
        carryOn: "allowed",
        checked: "allowed",
        customs_restricted: ["UAE", "Japan", "Singapore"],
        note: "⚠️ <strong>Controlled Substance.</strong> Allowed in most countries with a prescription (max 30-day supply). In UAE and Japan, it is a controlled psychotropic; carry documentation."
    },
    {
        id: 706,
        name: "Sudafed (Pseudoephedrine)",
        keywords: ["decongestant", "cold medicine", "sinus", "allergy"],
        category: ["medication", "restricted"],
        carryOn: "allowed",
        checked: "allowed",
        customs_restricted: ["Japan", "Mexico", "New Zealand"],
        note: "🚨 <strong>Banned in Japan.</strong> Sudafed contains pseudoephedrine, a stimulant banned in Japan. Use standard Sudafed PE (Phenylephrine) instead."
    },
    {
        id: 707,
        name: "Vicks Inhaler",
        keywords: ["nasal spray", "decongestant", "cold", "flu"],
        category: ["medication", "restricted"],
        carryOn: "allowed",
        checked: "allowed",
        customs_restricted: ["Japan"],
        note: "⚠️ <strong>Check Ingredients.</strong> US versions often contain Levomethamphetamine, which is BANNED in Japan. Check the label carefully before flying."
    },
    {
        id: 708,
        name: "CBD Oil / Gummies",
        keywords: ["cannabis", "hemp", "marijuana", "thc", "sleep"],
        category: ["medication", "restricted"],
        carryOn: "restricted",
        checked: "restricted",
        customs_restricted: ["UAE", "China", "Singapore", "Japan", "Russia"],
        note: "🚨 <strong>High Risk.</strong> Even if 'THC Free', CBD is illegal in many Asian and Middle Eastern countries. Possession can lead to jail time. Legal to fly *within* the US (if <0.3% THC)."
    },
    {
        id: 709,
        name: "Melatonin",
        keywords: ["sleep aid", "gummies", "jet lag", "supplement"],
        category: ["medication"],
        carryOn: "allowed",
        checked: "allowed",
        customs_restricted: ["UK", "EU", "Australia", "Japan"],
        note: "⚠️ <strong>Restricted.</strong> In the UK, EU, and Australia, Melatonin is prescription-only. You can bring it for personal use, but you cannot buy it over the counter there. Japan restricts imports."
    },
    {
        id: 710,
        name: "Syringes / Needles",
        keywords: ["injection", "diabetic", "sharp", "medication"],
        category: ["medication"],
        carryOn: "allowed",
        checked: "allowed",
        note: "✅ <strong>Allowed with Medication.</strong> You must have the injectable medication (e.g., Insulin, Epipen) with you to carry unused syringes. Tell the TSA officer."
    },
    {
        id: 711,
        name: "Medical Marijuana",
        keywords: ["weed", "cannabis", "thc", "edibles", "joint"],
        category: ["medication", "restricted"],
        carryOn: "restricted",
        checked: "restricted",
        customs_restricted: ["International", "UAE", "Singapore", "China", "Japan"],
        note: "🚨 <strong>Federally Illegal (USA).</strong> TSA is federal; technically they can confiscate it. ❌ <strong>International:</strong> DO NOT FLY INTERNATIONALLY with cannabis. It is a serious crime (drug trafficking) in many countries."
    },
    {
        id: 712,
        name: "Birth Control Pills",
        keywords: ["contraceptive", "the pill", "plan b", "hormones"],
        category: ["medication"],
        carryOn: "allowed",
        checked: "allowed",
        note: "✅ <strong>Allowed.</strong> No restrictions in US/Europe. ⚠️ <strong>Middle East:</strong> Plan B (Emergency Contraception) is banned or restricted in some UAE/Gulf states."
    },
    {
        id: 713,
        name: "Viagra / Cialis",
        keywords: ["sildenafil", "ed meds", "blue pill"],
        category: ["medication"],
        carryOn: "allowed",
        checked: "allowed",
        note: "✅ <strong>Allowed.</strong> Keep in original bottle with prescription label to avoid suspicion of counterfeit drug trafficking."
    },
    {
        id: 714,
        name: "Ozempic / Wegovy",
        keywords: ["semaglutide", "weight loss", "diabetes", "pen"],
        category: ["medication", "liquids"],
        carryOn: "allowed",
        checked: "allowed",
        note: "✅ <strong>Allowed.</strong> It is a liquid but exempt from the 3-1-1 rule as a prescription medicine. Keep it cool (ask flight attendant for ice if needed)."
    },
    {
        id: 715,
        name: "Testosterone (Gel/Injection)",
        keywords: ["hrt", "steroids", "trt", "hormone"],
        category: ["medication", "liquids"],
        carryOn: "allowed",
        checked: "allowed",
        note: "✅ <strong>Allowed.</strong> Controlled substance (anabolic steroid), so you MUST have your prescription label on the bottle/box. Exempt from liquid limits."
    },
    {
        id: 716,
        name: "NyQuil (Liquid)",
        keywords: ["cold medicine", "cough syrup", "flu", "sleep"],
        category: ["medication", "liquids"],
        carryOn: "restricted",
        checked: "allowed",
        note: "⚠️ <strong>Liquid Rule Applies.</strong> If the bottle is >3.4oz (100ml), it must be checked. Over-the-counter liquid meds are NOT exempt from the limit unless prescribed."
    },
    {
        id: 717,
        name: "Contact Lens Solution",
        keywords: ["saline", "eye drops", "renu", "opti-free"],
        category: ["toiletries", "liquids"],
        carryOn: "allowed",
        checked: "allowed",
        note: "✅ <strong>Allowed >3.4oz.</strong> Contact solution is considered 'Medically Necessary'. You can bring a full-size bottle, but you must declare it to TSA for separate screening."
    },
    {
        id: 718,
        name: "Nicotine Gum / Patches",
        keywords: ["smoking cessation", "nicorette", "tobacco"],
        category: ["medication"],
        carryOn: "allowed",
        checked: "allowed",
        note: "✅ <strong>Allowed.</strong> ⚠️ <strong>Singapore Warning:</strong> Chewing gum (even nicotine) is strictly regulated. You must declare it and have a prescription, or risk a fine."
    },
    {
        id: 719,
        name: "Accutane (Isotretinoin)",
        keywords: ["acne", "skin", "pills", "dermatology"],
        category: ["medication"],
        carryOn: "allowed",
        checked: "allowed",
        note: "✅ <strong>Allowed.</strong> No travel restrictions. Keep in original packaging."
    },

    // --- FASHION & LUXURY ---
    {
        id: 670,
        name: "Wedding Dress",
        keywords: ["bridal gown", "ceremonial", "white dress"],
        category: ["fashion"],
        carryOn: "allowed",
        checked: "restricted",
        note: "✅ <strong>Carry-On Recommended.</strong> Ask flight attendants if there is closet space in First Class. Do not check it (loss risk)."
    },
    /* --- UPDATE THESE SPECIFIC ITEMS BASED ON YOUR GSC DATA --- */

{
    id: 'yogurt_fix',
    name: "Yogurt / Pudding",
    carryOn: "restricted",
    checked: "allowed",
    category: ["food", "liquids"],
    keywords: ["yogurt", "yoghurt", "pudding", "jello", "gelatin"],
    note: "⚠️ LIQUID RULE APPLIES. If container is >3.4oz (100ml), it is BANNED in carry-on, even if sealed. Freeze it solid to bypass this rule."
},
{
    id: 'rice_cooker',
    name: "Rice Cooker / Kitchen Appliances",
    carryOn: "allowed",
    checked: "allowed",
    category: ["electronics", "household"],
    keywords: ["rice cooker", "microwave", "blender", "kitchen", "appliance"],
    note: "✅ ALLOWED. Must fit in overhead bin. Remove cord for screening. Note: Blenders with blades are BANNED in carry-on."
},
{
    id: 'fishing_pole',
    name: "Fishing Pole / Rod",
    carryOn: "restricted",
    checked: "allowed",
    category: ["sports", "tools"],
    keywords: ["fishing", "rod", "pole", "hook", "tackle"],
    note: "⚠️ EXPENSIVE. Allowed in carry-on ONLY if it fits in overhead bin (hook/tackle must be sheathed). Hooks are dangerous items."
}
];

// Generate slugs for all items
ITEMS_DATA.forEach(item => {
    if (!item.slug) {
        item.slug = item.name
            .toLowerCase()
            .replace(/&/g, 'and')
            .replace(/\+/g, 'plus')
            .replace(/[()]/g, '')
            .replace(/\//g, '-')
            .replace(/[^\w\s-]/g, '')
            .replace(/\s+/g, '-')
            .replace(/-+/g, '-')
            .trim();
    }
});

console.log('📦 Data module loaded:', ITEMS_DATA.length, 'items');
