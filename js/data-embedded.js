// Embedded items data - Fully Updated & Verified
// Sources: TSA.gov, CATSA, EASA, USDA, Australian Border Force, China Customs
const ITEMS_DATA = [
    // --- LIQUIDS & DRINKS ---
    {
        "id": 1, 
        "name": "Water Bottle (Empty)", 
        "carryOn": "allowed", 
        "checked": "allowed", 
        "note": "✅ Must be COMPLETELY EMPTY through security. Can refill at fountains after checkpoint. (Source: TSA.gov)", 
        "category": ["liquids", "containers"], 
        "keywords": ["water", "bottle", "flask", "hydroflask", "yeti"]
    },
    {
        "id": 2, 
        "name": "Water Bottle (Full - under 100ml)", 
        "carryOn": "allowed", 
        "checked": "allowed", 
        "note": "✅ Allowed if container is 100ml (3.4oz) or less. Must fit in quart-sized bag. (Source: TSA 3-1-1 Rule)", 
        "category": ["liquids"], 
        "keywords": ["water", "drink", "juice", "small bottle"]
    },
    {
        "id": 121, 
        "name": "Water Bottle (Full - over 100ml)", 
        "carryOn": "prohibited", 
        "checked": "allowed", 
        "note": "❌ Security will confiscate liquids over 100ml. Empty it before screening! ✅ Allowed in checked bags. (Source: TSA)", 
        "category": ["liquids"], 
        "keywords": ["water", "drink", "soda", "coke", "large bottle"]
    },
    {
        "id": 97, 
        "name": "Alcohol (Liquor/Wine)", 
        "carryOn": "restricted", 
        "checked": "allowed", 
        "note": "⚠️ CARRY-ON: Mini bottles (under 100ml) only. ✅ CHECKED: Allowed (up to 5L per person if 24-70% ABV). ❌ Over 70% ABV (140 proof) PROHIBITED everywhere. (Source: FAA/TSA)", 
        "category": ["liquids", "alcohol"], 
        "keywords": ["alcohol", "wine", "beer", "vodka", "whiskey"]
    },

    // --- FRESH FOOD (FRUIT/VEG) ---
    {
        "id": 96, 
        "name": "Fresh Fruit (General)", 
        "carryOn": "allowed", 
        "checked": "allowed", 
        "note": "✅ SECURITY: Allowed through checkpoint. 🚨 CUSTOMS: BANNED entering many countries (China, Aus, NZ, US, Japan) due to pests. Eat it on the plane or discard before landing. (Source: USDA/Biosecurity)", 
        "category": ["food", "customs"], 
        "keywords": ["fruit", "snack", "produce"],
        "customs_restricted": ["China", "Australia", "New Zealand", "Japan", "USA", "EU", "Canada", "UK"]
    },
    {
        "id": 200, 
        "name": "Apple", 
        "carryOn": "allowed", 
        "checked": "allowed", 
        "note": "✅ SECURITY: Allowed. 🚨 CUSTOMS: BANNED entering China, USA, Australia, NZ. Fruit flies hide inside apples. Fines apply ($300+). Discard before customs. (Source: USDA/Customs)", 
        "category": ["food", "customs"], 
        "keywords": ["apple", "fruit", "granny smith", "red delicious"],
        "customs_restricted": ["China", "Australia", "New Zealand", "Japan", "USA", "EU", "Canada", "UK"]
    },
    {
        "id": 201, 
        "name": "Banana", 
        "carryOn": "allowed", 
        "checked": "allowed", 
        "note": "✅ SECURITY: Allowed. 🚨 CUSTOMS: BANNED entering most countries. High risk for Panama disease/pests. Discard before landing. (Source: Biosecurity)", 
        "category": ["food", "customs"], 
        "keywords": ["banana", "fruit", "plantain"],
        "customs_restricted": ["China", "Australia", "New Zealand", "Japan", "USA", "EU", "Canada", "UK"]
    },
    {
        "id": 202, 
        "name": "Orange / Citrus", 
        "carryOn": "allowed", 
        "checked": "allowed", 
        "note": "✅ SECURITY: Allowed. 🚨 CUSTOMS: STRICTLY BANNED. Citrus carries invasive pests. High fines in USA and Australia. (Source: USDA APHIS)", 
        "category": ["food", "customs"], 
        "keywords": ["orange", "lemon", "lime", "citrus", "fruit"],
        "customs_restricted": ["China", "Australia", "New Zealand", "Japan", "USA", "EU", "Canada", "UK"]
    },
    {
        "id": 174, 
        "name": "Fresh Vegetables", 
        "carryOn": "allowed", 
        "checked": "allowed", 
        "note": "✅ SECURITY: Allowed. 🚨 CUSTOMS: BANNED in most international travel. Soil on potatoes/carrots is a major biosecurity risk. (Source: Customs)", 
        "category": ["food", "customs"], 
        "keywords": ["vegetables", "carrot", "potato", "lettuce", "salad"],
        "customs_restricted": ["China", "Australia", "New Zealand", "Japan", "USA", "EU"]
    },

    // --- MEAT & DAIRY (HIGH BIOSECURITY RISK) ---
    {
        "id": 171, 
        "name": "Beef Jerky / Dried Meat", 
        "carryOn": "allowed", 
        "checked": "allowed", 
        "note": "✅ SECURITY: Allowed. 🚨 CUSTOMS: BANNED in China, Aus, NZ, EU. Pork products especially restricted (Swine Fever risk). Declare or discard. (Source: Customs)", 
        "category": ["food", "customs"], 
        "keywords": ["jerky", "meat", "beef", "pork", "snack"],
        "customs_restricted": ["China", "Australia", "New Zealand", "Japan", "EU"]
    },
    {
        "id": 172, 
        "name": "Fresh Meat / Seafood", 
        "carryOn": "allowed", 
        "checked": "allowed", 
        "note": "✅ SECURITY: Allowed with ice packs (frozen solid). 🚨 CUSTOMS: PROHIBITED internationally. Cannot bring fresh meat across borders. (Source: USDA/Customs)", 
        "category": ["food", "customs"], 
        "keywords": ["meat", "steak", "chicken", "fish", "pork", "raw"],
        "customs_restricted": ["China", "Australia", "New Zealand", "Japan", "USA", "EU", "Canada", "UK"]
    },
    {
        "id": 177, 
        "name": "Kinder Surprise Eggs", 
        "carryOn": "allowed", 
        "checked": "allowed", 
        "note": "✅ Allowed worldwide EXCEPT USA. 🚨 USA WARNING: Banned by FDA (choking hazard). Fines up to $2,500 per egg. 'Kinder Joy' (separate toy) is legal.", 
        "category": ["food", "customs"], 
        "keywords": ["kinder", "chocolate", "egg", "candy"],
        "customs_restricted": ["USA"] 
    },
    {
        "id": 190, 
        "name": "Chewing Gum", 
        "carryOn": "allowed", 
        "checked": "allowed", 
        "note": "✅ Allowed generally. 🚨 SINGAPORE WARNING: Import of gum is banned (unless for medical use). Large quantities may be confiscated.", 
        "category": ["food", "customs"], 
        "keywords": ["gum", "chewing gum", "bubble gum"],
        "customs_restricted": ["Singapore"] 
    },
    {
        "id": 128, 
        "name": "Cheese (Hard)", 
        "carryOn": "allowed", 
        "checked": "allowed", 
        "note": "✅ Cheddar, Parmesan, Swiss allowed. No restrictions. (Source: TSA)", 
        "category": ["food"], 
        "keywords": ["cheese", "cheddar", "block cheese"]
    },
    {
        "id": 129, 
        "name": "Cheese (Soft/Creamy)", 
        "carryOn": "restricted", 
        "checked": "allowed", 
        "note": "⚠️ Considered a LIQUID/PASTE. Max 100ml in carry-on. Includes Brie, Camembert, Cream Cheese. (Source: TSA)", 
        "category": ["food", "liquids"], 
        "keywords": ["cheese", "brie", "cream cheese", "spread"]
    },

    // --- ELECTRONICS & BATTERIES (FIRE SAFETY) ---
    {
        "id": 3, 
        "name": "Laptop", 
        "carryOn": "allowed", 
        "checked": "allowed", 
        "note": "✅ Carry-on recommended to prevent damage. Remove from bag at security screening. (Source: TSA)", 
        "category": ["electronics"], 
        "keywords": ["laptop", "computer", "macbook", "dell", "pc"]
    },
    {
        "id": 4, 
        "name": "Power Bank / Portable Charger", 
        "carryOn": "allowed", 
        "checked": "prohibited", 
        "note": "✅ CARRY-ON ONLY. ❌ NEVER CHECKED (Fire Risk). Must be under 100Wh (approx 27,000mAh). 🚨 CHINA WARNING: If capacity label is missing/rubbed off, security WILL confiscate it. (Source: FAA/IATA)", 
        "category": ["electronics", "batteries"], 
        "keywords": ["power bank", "charger", "battery pack", "portable charger"]
    },
    {
        "id": 39, 
        "name": "Spare Lithium Batteries", 
        "carryOn": "allowed", 
        "checked": "prohibited", 
        "note": "✅ CARRY-ON ONLY. ❌ NEVER CHECKED. Tape terminals to prevent short circuits. Max 100Wh per battery. (Source: FAA)", 
        "category": ["electronics", "batteries"], 
        "keywords": ["batteries", "lithium", "AA", "camera battery", "drone battery"]
    },
    {
        "id": 20, 
        "name": "E-Cigarette / Vape", 
        "carryOn": "allowed", 
        "checked": "prohibited", 
        "note": "✅ CARRY-ON ONLY. ❌ NEVER CHECKED. 🚨 BANNED in Singapore, Thailand, Taiwan, Mexico, India. Possession can lead to fines or ARREST. Do not bring. (Source: FAA/Gov)", 
        "category": ["electronics", "smoking", "customs"], 
        "keywords": ["vape", "juul", "e-cig", "puff bar", "smoking"],
        "customs_restricted": ["Thailand", "Singapore", "Mexico", "Taiwan", "India"]
    },

    // --- TOILETRIES ---
    {
        "id": 8, 
        "name": "Toothpaste", 
        "carryOn": "restricted", 
        "checked": "allowed", 
        "note": "⚠️ Liquid rule applies: Max 100ml (3.4oz). Large tubes prohibited in carry-on even if half empty. (Source: TSA)", 
        "category": ["toiletries", "liquids"], 
        "keywords": ["toothpaste", "colgate", "crest", "teeth"]
    },
    {
        "id": 10, 
        "name": "Deodorant (Solid Stick)", 
        "carryOn": "allowed", 
        "checked": "allowed", 
        "note": "✅ Solid sticks have NO size limit. Allowed in any quantity. (Source: TSA)", 
        "category": ["toiletries"], 
        "keywords": ["deodorant", "stick", "old spice", "dove"]
    },
    {
        "id": 11, 
        "name": "Deodorant (Spray/Gel)", 
        "carryOn": "restricted", 
        "checked": "allowed", 
        "note": "⚠️ Liquid rule applies: Max 100ml (3.4oz) in carry-on. (Source: TSA)", 
        "category": ["toiletries", "liquids"], 
        "keywords": ["deodorant", "spray", "axe", "gel"]
    },
    {
        "id": 5, 
        "name": "Scissors (Small)", 
        "carryOn": "allowed", 
        "checked": "allowed", 
        "note": "✅ Allowed if blades are less than 4 inches (10cm) from the pivot point. (Source: TSA)", 
        "category": ["tools", "toiletries"], 
        "keywords": ["scissors", "cutters", "nail scissors"]
    },
    {
        "id": 6, 
        "name": "Scissors (Large)", 
        "carryOn": "prohibited", 
        "checked": "allowed", 
        "note": "❌ Blades longer than 4 inches (10cm) must be checked. (Source: TSA)", 
        "category": ["tools"], 
        "keywords": ["scissors", "shears", "office scissors"]
    },
    {
        "id": 7, 
        "name": "Pocket Knife / Swiss Army", 
        "carryOn": "prohibited", 
        "checked": "allowed", 
        "note": "❌ PROHIBITED in carry-on, even small ones. Must be checked. (Source: TSA)", 
        "category": ["tools", "weapons"], 
        "keywords": ["knife", "blade", "swiss army", "leatherman"]
    },
    {
        "id": 12, 
        "name": "Razor (Disposable/Cartridge)", 
        "carryOn": "allowed", 
        "checked": "allowed", 
        "note": "✅ Allowed in carry-on. (Source: TSA)", 
        "category": ["toiletries"], 
        "keywords": ["razor", "gillette", "shaving", "bic"]
    },
    {
        "id": 13, 
        "name": "Razor (Safety/Straight)", 
        "carryOn": "prohibited", 
        "checked": "allowed", 
        "note": "❌ Safety razors with removable blades are BANNED in carry-on (unless blade is removed). Straight razors always banned. (Source: TSA)", 
        "category": ["toiletries", "weapons"], 
        "keywords": ["razor", "safety razor", "straight razor", "blade"]
    },

    // --- OTHER COMMON ITEMS ---
    {
        "id": 18, 
        "name": "Lighter (Disposable)", 
        "carryOn": "allowed", 
        "checked": "prohibited", 
        "note": "✅ One lighter allowed on your person. ❌ BANNED in checked bags. ❌ Torch/Blue flame lighters banned everywhere. (Source: FAA)", 
        "category": ["fire", "smoking"], 
        "keywords": ["lighter", "bic", "fire"]
    },
    {
        "id": 91, 
        "name": "Coffee (Ground or Beans)", 
        "carryOn": "allowed", 
        "checked": "allowed", 
        "note": "✅ Allowed. Powders over 350ml (12oz) may require extra screening. 🚨 CUSTOMS: Australia/NZ restrict unroasted beans. (Source: TSA)", 
        "category": ["food"], 
        "keywords": ["coffee", "beans", "ground", "espresso"],
        "customs_restricted": ["Australia", "New Zealand"]
    },
    {
        "id": 14, 
        "name": "Prescription Medication (General)", 
        "carryOn": "allowed", 
        "checked": "allowed", 
        "note": "✅ Allowed. Bring prescription. 🚨 JAPAN/UAE WARNING: Common meds like Adderall (stimulants) and Codeine (opiates) are ILLEGAL narcotics. You can be arrested. Check embassy lists.", 
        "category": ["medication", "customs"], 
        "keywords": ["medicine", "pills", "drugs", "adderall", "ritalin", "codeine"],
        "customs_restricted": ["Japan", "UAE"] 
    },
    {
        "id": 26, 
        "name": "Breast Milk / Formula", 
        "carryOn": "allowed", 
        "checked": "allowed", 
        "note": "✅ EXEMPT from 100ml rule. Allowed in reasonable quantities. Inform officer at start of screening. (Source: TSA)", 
        "category": ["baby", "liquids"], 
        "keywords": ["milk", "formula", "baby", "nursing"]
    },
    {
        "id": 150, 
        "name": "Nail Clippers", 
        "carryOn": "allowed", 
        "checked": "allowed", 
        "note": "✅ Allowed. (Source: TSA)", 
        "category": ["toiletries"], 
        "keywords": ["clippers", "nails", "grooming"]
    },
    {
        "id": 82, 
        "name": "Baby Wipes / Wet Wipes", 
        "carryOn": "allowed", 
        "checked": "allowed", 
        "note": "✅ Allowed. Not considered a liquid. (Source: TSA)", 
        "category": ["toiletries", "baby"], 
        "keywords": ["wipes", "wet wipes", "baby"]
    }
];