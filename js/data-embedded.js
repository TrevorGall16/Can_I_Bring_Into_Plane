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
        "note": "❌ Liquids that exceed the 100ml (3.4 oz) limit are the most common item confiscated at security. The volume is based on the container size, not the liquid level inside. You MUST empty this before entering the checkpoint, or it will be seized. Refill fountains are usually available after security. (Source: TSA 3-1-1 Rule)", 
        "category": ["liquids"], 
        "keywords": ["water", "drink", "soda", "coke", "large bottle"]
    },
    {
"id": 97, 
        "name": "Alcohol (Liquor/Wine)", 
        "carryOn": "restricted", 
        "checked": "allowed", 
        "note": "⚠️ CARRY-ON: Liquids (including alcohol) must be in containers of 100ml (3.4oz) or less and fit in your quart-sized bag. ✅ CHECKED: Allowed (up to 5 liters per person if between 24–70% alcohol by volume). ❌ Alcohol over 70% ABV (140 proof) is strictly PROHIBITED in both carry-on and checked luggage due to fire risk. (Source: FAA/TSA)", 
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
        "note": "✅ CARRY-ON IS HIGHLY RECOMMENDED for expensive electronics to prevent damage and theft. Most passengers must remove their laptop from their bag at the security checkpoint for separate X-ray screening. Failure to remove it will result in your bag being pulled for inspection, slowing down the whole process. Always be prepared to power it on. (Source: TSA)", 
        "category": ["electronics"], 
        "keywords": ["laptop", "computer", "macbook", "dell", "pc"]
    },
    {
"id": 4, 
        "name": "Power Bank / Portable Charger", 
        "carryOn": "allowed", 
        "checked": "prohibited", 
        "note": "✅ CARRY-ON ONLY. This is a non-negotiable FAA safety rule because lithium batteries pose a significant fire risk (thermal runaway) in the cargo hold, where fires are difficult to extinguish. Power banks must be under 100 watt-hours (Wh). 🚨 CHINA WARNING: Security often confiscates chargers if the capacity label is missing or rubbed off. (Source: FAA/IATA)", 
        "category": ["electronics", "batteries"], 
        "keywords": ["power bank", "charger", "battery pack", "portable charger"]
    },
    {
"id": 39, 
        "name": "Spare Lithium Batteries", 
        "carryOn": "allowed", 
        "checked": "prohibited", 
        "note": "✅ CARRY-ON ONLY. Loose batteries are forbidden in checked baggage due to the extreme fire risk they pose in the cargo hold. You must protect the terminals from short circuits—use electrical tape or place each battery in its own protective case or plastic bag. Maximum individual capacity is 100Wh. (Source: FAA)", 
        "category": ["electronics", "batteries"], 
        "keywords": ["batteries", "lithium", "AA", "camera battery", "drone battery"]
    },
    {
"id": 20, 
        "name": "E-Cigarette / Vape", 
        "carryOn": "allowed", 
        "checked": "prohibited", 
        "note": "✅ CARRY-ON ONLY. This device contains a lithium battery and must be carried in the cabin, not checked. ❌ DO NOT USE ON PLANE. 🚨 CUSTOMS WARNING: Vaping is strictly ILLEGAL in many destinations (e.g., Thailand, Singapore, Mexico). Possession alone can lead to severe fines or ARREST. Always check local laws before traveling. (Source: FAA/Gov)", 
        "category": ["electronics", "smoking", "customs"], 
        "keywords": ["vape", "juul", "e-cig", "puff bar", "smoking"],
        "customs_restricted": ["Thailand", "Singapore", "Mexico", "Taiwan",]
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
        "note": "❌ PROHIBITED. Security has a zero-tolerance policy for all knives, regardless of blade length or size. Do not attempt to bring small or novelty knives in your carry-on; they will be confiscated. This item MUST be packed securely in your checked luggage. (Source: TSA)", 
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
        "note": "✅ USA/EU: One allowed on person. ❌ CHINA/JAPAN: All lighters/matches are STRICTLY BANNED in both carry-on and checked. (Source: CAAC)", 
        "category": ["fire", "smoking"], 
        "keywords": ["lighter", "bic", "fire"],
        "customs_restricted": ["China", "Thailand"]
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
        "note": "✅ Allowed. It is highly recommended to keep all medication in its original packaging and bring a copy of the prescription or a doctor's note, especially when traveling internationally. Liquids (e.g., insulin) that are medically necessary are EXEMPT from the 100ml rule. 🚨 JAPAN/UAE WARNING: Certain common narcotics and stimulants (like Adderall or codeine) are ILLEGAL narcotics without special permits. Check embassy lists BEFORE travel. (Source: TSA/Gov)", 
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
    },
    // --- RESTORED COMMON ITEMS (You were missing these!) ---
    {
        "id": 9, "name": "Shampoo / Conditioner", "carryOn": "restricted", "checked": "allowed", 
        "note": "⚠️ Liquid rule applies: Max 100ml (3.4oz) per bottle. Unlimited in checked bags. (Source: TSA)", 
        "category": ["toiletries", "liquids"], "keywords": ["shampoo", "soap", "hair", "conditioner"]
    },
    {
        "id": 41, "name": "Sunscreen (Lotion/Spray)", "carryOn": "restricted", "checked": "allowed", 
        "note": "⚠️ Liquid rule applies: Max 100ml (3.4oz). Full-size bottles must be checked. (Source: TSA)", 
        "category": ["toiletries", "liquids"], "keywords": ["sunscreen", "sunblock", "spf"]
    },
    {
        "id": 43, "name": "Makeup (Liquid/Cream)", "carryOn": "restricted", "checked": "allowed", 
        "note": "⚠️ Mascara, liquid foundation, and creams must be under 100ml. Powder makeup is unrestricted. (Source: TSA)", 
        "category": ["toiletries", "liquids"], "keywords": ["makeup", "mascara", "foundation", "lipstick"]
    },
    {
        "id": 35, "name": "Headphones / Earbuds", "carryOn": "allowed", "checked": "allowed", 
        "note": "✅ Allowed. (Source: TSA)", 
        "category": ["electronics"], "keywords": ["headphones", "earbuds", "airpods", "beats"]
    },
    {
        "id": 36, "name": "Tablet / iPad", "carryOn": "allowed", "checked": "allowed", 
        "note": "✅ Allowed. Must be removed from bag at security in most airports. (Source: TSA)", 
        "category": ["electronics"], "keywords": ["tablet", "ipad", "kindle"]
    },
    {
        "id": 32, "name": "Camera (DSLR/Mirrorless)", "carryOn": "allowed", "checked": "allowed", 
        "note": "✅ Allowed. Recommended in carry-on to prevent theft/damage. (Source: TSA)", 
        "category": ["electronics"], "keywords": ["camera", "dslr", "lens", "photography"]
    },
    {
        "id": 25, "name": "Baby Formula (Powder/Liquid)", "carryOn": "allowed", "checked": "allowed", 
        "note": "✅ EXEMPT from liquid rule. You can bring more than 100ml. Tell the TSA officer. (Source: TSA)", 
        "category": ["baby", "liquids", "food"], "keywords": ["formula", "baby", "milk", "similac"]
    },
    {
        "id": 21, "name": "Snacks (Chips/Cookies)", "carryOn": "allowed", "checked": "allowed", 
        "note": "✅ Solid foods are allowed. (Source: TSA)", 
        "category": ["food"], "keywords": ["chips", "cookies", "snacks", "food"]
    },
    {
        "id": 22, "name": "Sandwich / Burger", "carryOn": "allowed", "checked": "allowed", 
        "note": "✅ Allowed. If it has a lot of sauce/mayo, it might get flagged. (Source: TSA)", 
        "category": ["food"], "keywords": ["sandwich", "burger", "lunch", "meal"]
    },
    {
        "id": 75, "name": "Electric Toothbrush", "carryOn": "allowed", "checked": "allowed", 
        "note": "✅ Allowed. (Source: TSA)", 
        "category": ["toiletries", "electronics"], "keywords": ["toothbrush", "electric"]
    },
    // --- SPORTS EQUIPMENT ---
    {
"id": 300, 
        "name": "Baseball / Cricket Bat", 
        "carryOn": "prohibited", 
        "checked": "allowed", 
        "note": "❌ BANNED in the cabin. The security rule views this as a potential blunt force weapon. It MUST be placed in checked luggage. Note that most airlines charge an oversize fee for specialized sports equipment. Always declare it during check-in. (Source: TSA)", 
        "category": ["sports", "weapons"], 
        "keywords": ["bat", "baseball", "cricket", "softball", "club"]
    },
    {
        "id": 301, 
        "name": "Golf Clubs", 
        "carryOn": "prohibited", 
        "checked": "allowed", 
        "note": "❌ BANNED in cabin. Must be checked. Clean clubs to avoid soil/customs issues internationally. (Source: TSA)", 
        "category": ["sports"], 
        "keywords": ["golf", "clubs", "driver", "putter"]
    },
    {
        "id": 302, 
        "name": "Tennis / Badminton Racket", 
        "carryOn": "allowed", 
        "checked": "allowed", 
        "note": "✅ Allowed, but check airline size limits for overhead bins. If it doesn't fit, it must be checked. (Source: TSA)", 
        "category": ["sports"], 
        "keywords": ["tennis", "racket", "racquet", "badminton", "squash"]
    },
    {
        "id": 303, 
        "name": "Ice Skates", 
        "carryOn": "allowed", 
        "checked": "allowed", 
        "note": "✅ Allowed by TSA in carry-on. ⚠️ Warning: Some international airlines (and UK/EU airports) may reject them as 'blades'. Check local rules. (Source: TSA)", 
        "category": ["sports", "sharp objects"], 
        "keywords": ["skates", "ice skates", "hockey", "blades"]
    },
    {
        "id": 304, 
        "name": "Roller Skates / Blades", 
        "carryOn": "allowed", 
        "checked": "allowed", 
        "note": "✅ Allowed in carry-on and checked bags. (Source: TSA)", 
        "category": ["sports"], 
        "keywords": ["skates", "rollerblades", "roller"]
    },
    {
        "id": 305, 
        "name": "Skateboard", 
        "carryOn": "allowed", 
        "checked": "allowed", 
        "note": "✅ Allowed if it fits under the seat or in overhead bin. Some budget airlines forced check-in. (Source: TSA)", 
        "category": ["sports"], 
        "keywords": ["skateboard", "skating", "penny board", "longboard"]
    },
    {
        "id": 306, 
        "name": "Fishing Rod / Pole", 
        "carryOn": "allowed", 
        "checked": "allowed", 
        "note": "✅ Allowed if it fits airline size limits. ⚠️ Hooks must be securely sheathed/covered. Large tackle must be checked. (Source: TSA)", 
        "category": ["sports", "sharp objects"], 
        "keywords": ["fishing", "rod", "pole", "fish"]
    },
    {
        "id": 307, 
        "name": "Bowling Ball", 
        "carryOn": "allowed", 
        "checked": "allowed", 
        "note": "✅ Allowed in carry-on. Be careful taking it out of overhead bins! (Source: TSA)", 
        "category": ["sports"], 
        "keywords": ["bowling", "ball"]
    },
    {
        "id": 308, 
        "name": "Yoga Mat", 
        "carryOn": "allowed", 
        "checked": "allowed", 
        "note": "✅ Allowed. Counts as your carry-on or personal item depending on airline. (Source: TSA)", 
        "category": ["sports"], 
        "keywords": ["yoga", "mat", "pilates", "exercise"]
    },
    {
        "id": 309, 
        "name": "Ski / Hiking Poles", 
        "carryOn": "prohibited", 
        "checked": "allowed", 
        "note": "❌ BANNED in cabin (sharp points). Must be checked. (Source: TSA)", 
        "category": ["sports", "sharp objects"], 
        "keywords": ["ski", "poles", "hiking", "trekking", "walking stick"]
    },
    {
        "id": 310, 
        "name": "Boxing Gloves", 
        "carryOn": "allowed", 
        "checked": "allowed", 
        "note": "✅ Allowed. (Source: TSA)", 
        "category": ["sports"], 
        "keywords": ["boxing", "gloves", "fighting", "mma"]
    },
    {
        "id": 311, 
        "name": "Helmet (Bike/Sports)", 
        "carryOn": "allowed", 
        "checked": "allowed", 
        "note": "✅ Allowed. Often clipped to outside of backpack. (Source: TSA)", 
        "category": ["sports"], 
        "keywords": ["helmet", "bike", "motorcycle", "protection"]
    },
    {
        "id": 312, 
        "name": "Inflatable Balls (Soccer/Basketball)", 
        "carryOn": "allowed", 
        "checked": "allowed", 
        "note": "✅ Allowed. ⚠️ TIP: Deflate partially (to 50%) to prevent bursting/warping due to cabin pressure changes. (Source: TSA)", 
        "category": ["sports"], 
        "keywords": ["ball", "soccer", "basketball", "football", "volleyball"]
    },
    {
        "id": 314, 
        "name": "Parachute", 
        "carryOn": "allowed", 
        "checked": "allowed", 
        "note": "✅ Allowed. Must be packed separately from other luggage. Security may open to inspect. (Source: TSA)", 
        "category": ["sports"], 
        "keywords": ["parachute", "skydive", "rig"]
    },
    {
        "id": 315, 
        "name": "Dumbbells / Weights", 
        "carryOn": "restricted", 
        "checked": "allowed", 
        "note": "⚠️ Generally allowed, but security may reject heavy weights as 'blunt force weapons'. Best to check them. (Source: TSA)", 
        "category": ["sports"], 
        "keywords": ["weights", "dumbbells", "gym", "workout"]
    },
    {
        "id": 316, 
        "name": "Billiards / Pool Cue", 
        "carryOn": "prohibited", 
        "checked": "allowed", 
        "note": "❌ BANNED in cabin. Must be checked. (Source: TSA)", 
        "category": ["sports"], 
        "keywords": ["pool", "cue", "billiards", "snooker"]
    },
    {
        "id": 317, 
        "name": "Surfboard", 
        "carryOn": "prohibited", 
        "checked": "allowed", 
        "note": "❌ Too large for cabin. Must be checked (Oversize fees usually apply). Remove fins/wax. (Source: Airline Policies)", 
        "category": ["sports"], 
        "keywords": ["surf", "surfboard", "board"]
    },
    // --- TOOLS & HOME IMPROVEMENT ---
    {
        "id": 400, 
        "name": "Power Drill", 
        "carryOn": "prohibited", 
        "checked": "allowed", 
        "note": "❌ Power tools are BANNED in the cabin. Must be checked. Spare lithium batteries for the drill must go in CARRY-ON. (Source: TSA)", 
        "category": ["tools", "electronics"], 
        "keywords": ["drill", "power tool", "driver"]
    },
    {
        "id": 401, 
        "name": "Drill Bits", 
        "carryOn": "allowed", 
        "checked": "allowed", 
        "note": "✅ Allowed in carry-on (surprisingly!). But keeping them with the drill in checked bags is safer to avoid delays. (Source: TSA)", 
        "category": ["tools"], 
        "keywords": ["drill bits", "bit", "tool"]
    },
    {
        "id": 402, 
        "name": "Hammer", 
        "carryOn": "prohibited", 
        "checked": "allowed", 
        "note": "❌ Bludgeoning tools are BANNED in cabin. Must be checked. (Source: TSA)", 
        "category": ["tools"], 
        "keywords": ["hammer", "mallet", "tool"]
    },
    {
        "id": 403, 
        "name": "Screwdriver (Under 7 inches)", 
        "carryOn": "allowed", 
        "checked": "allowed", 
        "note": "✅ Allowed if overall length is UNDER 7 inches (18cm). (Source: TSA)", 
        "category": ["tools"], 
        "keywords": ["screwdriver", "tool", "flathead", "phillips"]
    },
    {
        "id": 404, 
        "name": "Screwdriver (Over 7 inches)", 
        "carryOn": "prohibited", 
        "checked": "allowed", 
        "note": "❌ Tools longer than 7 inches (18cm) must be checked. (Source: TSA)", 
        "category": ["tools"], 
        "keywords": ["screwdriver", "tool", "large tool"]
    },
    {
        "id": 405, 
        "name": "Wrenches / Pliers", 
        "carryOn": "allowed", 
        "checked": "allowed", 
        "note": "✅ Allowed if UNDER 7 inches (18cm). Larger ones must be checked. (Source: TSA)", 
        "category": ["tools"], 
        "keywords": ["wrench", "pliers", "tool", "spanner"]
    },
    {
        "id": 406, 
        "name": "Saw / Saw Blades", 
        "carryOn": "prohibited", 
        "checked": "allowed", 
        "note": "❌ All saws and blades are BANNED in cabin. Must be checked. (Source: TSA)", 
        "category": ["tools", "sharp objects"], 
        "keywords": ["saw", "blade", "hacksaw", "chain saw"]
    },
    {
        "id": 407, 
        "name": "Tape Measure", 
        "carryOn": "allowed", 
        "checked": "allowed", 
        "note": "✅ Allowed. (Source: TSA)", 
        "category": ["tools"], 
        "keywords": ["tape measure", "measuring tape"]
    },
    {
        "id": 408, 
        "name": "Multitool (Leatherman)", 
        "carryOn": "prohibited", 
        "checked": "allowed", 
        "note": "❌ If it has a blade (almost all do), it must be checked. TSA will confiscate these! (Source: TSA)", 
        "category": ["tools", "sharp objects"], 
        "keywords": ["multitool", "leatherman", "swiss army", "utility"]
    },
    {
        "id": 409, 
        "name": "Crowbar", 
        "carryOn": "prohibited", 
        "checked": "allowed", 
        "note": "❌ BANNED in cabin. Must be checked. (Source: TSA)", 
        "category": ["tools"], 
        "keywords": ["crowbar", "pry bar"]
    },

    // --- CAMPING & OUTDOOR ---
    {
        "id": 420, 
        "name": "Camping Stove (Used)", 
        "carryOn": "allowed", 
        "checked": "allowed", 
        "note": "✅ Allowed ONLY if completely empty and cleaned of all fuel vapors. If it smells like gas, TSA will seize it. (Source: TSA)", 
        "category": ["camping", "fire"], 
        "keywords": ["stove", "camping", "burner", "jetboil"]
    },
    {
        "id": 421, 
        "name": "Fuel Canister (Gas)", 
        "carryOn": "prohibited", 
        "checked": "prohibited", 
        "note": "❌ FLAMMABLE GAS BANNED everywhere. Do not bring. Buy fuel at destination. (Source: FAA/TSA)", 
        "category": ["camping", "fire", "hazardous"], 
        "keywords": ["fuel", "gas", "propane", "butane", "isopro"]
    },
    {
        "id": 422, 
        "name": "Tent Spikes / Poles", 
        "carryOn": "prohibited", 
        "checked": "allowed", 
        "note": "❌ Metal spikes are considered potential weapons. Tent fabric can be carry-on, but poles/stakes must be checked. (Source: TSA)", 
        "category": ["camping"], 
        "keywords": ["tent", "spikes", "stakes", "poles"]
    },
    {
        "id": 423, 
        "name": "Bear Spray", 
        "carryOn": "prohibited", 
        "checked": "prohibited", 
        "note": "❌ BANNED. It exceeds the 4oz limit for self-defense sprays and is considered a hazardous material. (Source: TSA/FAA)", 
        "category": ["camping", "weapons", "hazardous"], 
        "keywords": ["bear spray", "pepper spray", "mace"]
    },
    {
        "id": 424, 
        "name": "Cast Iron Skillet", 
        "carryOn": "allowed", 
        "checked": "allowed", 
        "note": "✅ Allowed. It's just heavy! (Source: TSA)", 
        "category": ["camping", "cooking"], 
        "keywords": ["skillet", "pan", "cast iron", "cookware"]
    },
    {
        "id": 425, 
        "name": "Cooler (Empty)", 
        "carryOn": "allowed", 
        "checked": "allowed", 
        "note": "✅ Allowed. If bringing ice packs, they must be FROZEN SOLID at security. Slushy ice packs will be confiscated. (Source: TSA)", 
        "category": ["camping", "food"], 
        "keywords": ["cooler", "ice chest", "yeti"]
    },

    // --- FLAMMABLES & DANGEROUS GOODS ---
    {
        "id": 440, 
        "name": "Matches (Safety)", 
        "carryOn": "allowed", 
        "checked": "prohibited", 
        "note": "✅ ONE book of safety matches allowed on your person. ❌ Banned in checked bags. (Source: FAA)", 
        "category": ["fire"], 
        "keywords": ["matches", "safety matches"]
    },
    {
        "id": 441, 
        "name": "Matches (Strike-Anywhere)", 
        "carryOn": "prohibited", 
        "checked": "prohibited", 
        "note": "❌ BANNED completely. They can ignite by friction. (Source: FAA)", 
        "category": ["fire", "hazardous"], 
        "keywords": ["matches", "strike anywhere"]
    },
    {
        "id": 442, 
        "name": "Fireworks / Sparklers", 
        "carryOn": "prohibited", 
        "checked": "prohibited", 
        "note": "❌ EXPLOSIVES BANNED everywhere. Don't even try. (Source: TSA/FAA)", 
        "category": ["hazardous", "fire"], 
        "keywords": ["fireworks", "sparklers", "crackers", "explosive"]
    },
    {
        "id": 443, 
        "name": "Spray Paint", 
        "carryOn": "prohibited", 
        "checked": "prohibited", 
        "note": "❌ BANNED. Aerosol paint is flammable and explosive. (Source: TSA)", 
        "category": ["art", "hazardous"], 
        "keywords": ["paint", "spray paint", "aerosol", "graffiti"]
    },
    {
        "id": 444, 
        "name": "Bleach / Chlorine", 
        "carryOn": "prohibited", 
        "checked": "prohibited", 
        "note": "❌ BANNED. Hazardous chemical. (Source: TSA)", 
        "category": ["cleaning", "hazardous"], 
        "keywords": ["bleach", "chlorine", "pool chemicals"]
    },

    // --- SELF DEFENSE (TRICKY!) ---
    {
"id": 460, 
        "name": "Pepper Spray / Mace", 
        "carryOn": "prohibited", 
        "checked": "restricted", 
        "note": "⚠️ CHECKED ONLY (USA). One 4oz container allowed. 🚨 ILLEGAL in UK, China, Singapore, and many EU countries. (Source: TSA)", 
        "category": ["weapons", "self-defense"], 
        "keywords": ["pepper spray", "mace", "spray"],
        "customs_restricted": ["UK", "China", "Singapore", "Japan", "Thailand", "EU"]
    },
    {
        "id": 461, 
        "name": "Brass Knuckles", 
        "carryOn": "prohibited", 
        "checked": "allowed", 
        "note": "❌ BANNED in cabin. Allowed in checked bags, but verify local laws at destination (illegal in many states/countries). (Source: TSA)", 
        "category": ["weapons"], 
        "keywords": ["brass knuckles", "knuckles", "weapon"]
    },
    {
        "id": 462, 
        "name": "Taser / Stun Gun", 
        "carryOn": "prohibited", 
        "checked": "allowed", 
        "note": "⚠️ CHECKED ONLY. Battery must be removed or rendered inoperable. 🚨 Illegal in many countries. (Source: TSA)", 
        "category": ["weapons", "electronics"], 
        "keywords": ["taser", "stun gun", "shock"]
    },
    {
        "id": 463, 
        "name": "Pocket Knife", 
        "carryOn": "prohibited", 
        "checked": "allowed", 
        "note": "❌ All knives are BANNED in cabin. Must be checked. (Source: TSA)", 
        "category": ["weapons", "tools"], 
        "keywords": ["knife", "blade", "pen knife"]
    },

    // --- MISCELLANEOUS / HOUSEHOLD ---
    {
        "id": 480, 
        "name": "Cremated Remains (Ashes)", 
        "carryOn": "allowed", 
        "checked": "allowed", 
        "note": "✅ Allowed. Must pass through X-ray. Container must be wood/plastic (not metal/lead) so X-ray can see inside. TSA will NOT open the container. (Source: TSA)", 
        "category": ["other"], 
        "keywords": ["ashes", "cremation", "remains", "urn"]
    },
    {
        "id": 481, 
        "name": "Snow Globe", 
        "carryOn": "restricted", 
        "checked": "allowed", 
        "note": "⚠️ Liquid rule applies! Only allowed in carry-on if smaller than a tennis ball. Larger ones must be checked. (Source: TSA)", 
        "category": ["liquids", "other"], 
        "keywords": ["snow globe", "souvenir", "gift"]
    },
    {
        "id": 482, 
        "name": "Dry Ice", 
        "carryOn": "allowed", 
        "checked": "allowed", 
        "note": "✅ Allowed. Max 5.5 lbs (2.5 kg). Package must be vented (not airtight) to let gas escape. Airline approval usually required. (Source: FAA)", 
        "category": ["other", "hazardous"], 
        "keywords": ["dry ice", "ice", "frozen"]
    },
    {
        "id": 483, 
        "name": "Christmas Crackers", 
        "carryOn": "prohibited", 
        "checked": "prohibited", 
        "note": "❌ BANNED by most airlines (Delta, American, United, etc.) because they contain tiny explosives. (Source: Airline Policies)", 
        "category": ["other", "holiday"], 
        "keywords": ["crackers", "christmas", "party poppers"]
    },
    {
        "id": 484, 
        "name": "Knitting Needles", 
        "carryOn": "allowed", 
        "checked": "allowed", 
        "note": "✅ Allowed. Circular needles recommended. Thread cutter blades must be covered. (Source: TSA)", 
        "category": ["hobbies", "tools"], 
        "keywords": ["knitting", "needles", "yarn", "crochet"]
    },
    {
        "id": 485, 
        "name": "Paint (Artist - Acrylic/Water)", 
        "carryOn": "allowed", 
        "checked": "allowed", 
        "note": "✅ Non-flammable paints allowed. Liquid rule (100ml) applies for carry-on. (Source: TSA)", 
        "category": ["art", "liquids"], 
        "keywords": ["paint", "acrylic", "watercolor", "art"]
    },
    {
        "id": 486, 
        "name": "Paint (Oil Based)", 
        "carryOn": "prohibited", 
        "checked": "prohibited", 
        "note": "❌ Often BANNED if flammable (check label for 'Flammable' symbol). Solvents like Turpentine are 100% prohibited. (Source: TSA)", 
        "category": ["art", "hazardous"], 
        "keywords": ["oil paint", "solvent", "turpentine"]
    },
    // --- HOUSEHOLD & KITCHEN ---
    {
        "id": 500, 
        "name": "Blender", 
        "carryOn": "restricted", 
        "checked": "allowed", 
        "note": "⚠️ CARRY-ON: Allowed ONLY if the blade is removed. ❌ If the blade is attached, it must be checked. (Source: TSA)", 
        "category": ["household", "electronics", "sharp objects"], 
        "keywords": ["blender", "vitamix", "nutribullet", "smoothie"]
    },
    {
        "id": 501, 
        "name": "Coffee Maker / Espresso Machine", 
        "carryOn": "allowed", 
        "checked": "allowed", 
        "note": "✅ Allowed. Please wrap the glass pot carefully if checking it! (Source: TSA)", 
        "category": ["household", "electronics"], 
        "keywords": ["coffee maker", "espresso", "keurig", "nespresso"]
    },
    {
        "id": 502, 
        "name": "Pots and Pans", 
        "carryOn": "allowed", 
        "checked": "allowed", 
        "note": "✅ Allowed in both. Cast iron skillets are also allowed but may require additional screening due to density. (Source: TSA)", 
        "category": ["household", "cooking"], 
        "keywords": ["pot", "pan", "skillet", "wok", "cooking"]
    },
    {
 "id": 503, 
        "name": "Kitchen Knives", 
        "carryOn": "prohibited", 
        "checked": "allowed", 
        "note": "❌ All knives, whether a small paring knife or a large chef's knife, are BANNED in the cabin. This rule is non-negotiable. They MUST be packed securely in checked baggage. Wrap the sharp edges safely (e.g., in cardboard or a sheath) to prevent injury to baggage handlers and TSA screeners. (Source: TSA)", 
        "category": ["household", "sharp objects", "weapons"], 
        "keywords": ["knife", "chef knife", "steak knife", "cutlery"]
    },
    {
        "id": 504, 
        "name": "Forks and Spoons", 
        "carryOn": "allowed", 
        "checked": "allowed", 
        "note": "✅ Metal and plastic forks/spoons are allowed. (Source: TSA)", 
        "category": ["household", "cooking"], 
        "keywords": ["fork", "spoon", "silverware", "cutlery"]
    },
    {
        "id": 505, 
        "name": "Corkscrew (No Blade)", 
        "carryOn": "allowed", 
        "checked": "allowed", 
        "note": "✅ Allowed if it does NOT have a small foil-cutting blade attached. (Source: TSA)", 
        "category": ["household", "tools"], 
        "keywords": ["corkscrew", "wine opener"]
    },
    {
        "id": 506, 
        "name": "Corkscrew (With Blade)", 
        "carryOn": "prohibited", 
        "checked": "allowed", 
        "note": "❌ If it has a small knife/blade for foil, it must be checked. (Source: TSA)", 
        "category": ["household", "sharp objects"], 
        "keywords": ["corkscrew", "wine opener", "waiter's friend"]
    },
    {
        "id": 507, 
        "name": "Clothes Iron / Steamer", 
        "carryOn": "allowed", 
        "checked": "allowed", 
        "note": "✅ Allowed. Empty all water before packing to avoid leaks and liquid rule issues. (Source: TSA)", 
        "category": ["household", "electronics"], 
        "keywords": ["iron", "steamer", "clothes"]
    },
    {
        "id": 508, 
        "name": "Microwave / Small Appliances", 
        "carryOn": "allowed", 
        "checked": "allowed", 
        "note": "✅ Allowed if it fits in the overhead bin (good luck!). Checked is recommended. (Source: TSA)", 
        "category": ["household", "electronics"], 
        "keywords": ["microwave", "toaster", "appliance"]
    },
    {
        "id": 509, 
        "name": "Light Bulbs", 
        "carryOn": "allowed", 
        "checked": "allowed", 
        "note": "✅ Allowed (LED, CFL, Incandescent). Pack carefully! (Source: TSA)", 
        "category": ["household"], 
        "keywords": ["light bulb", "lamp", "lights"]
    },
    {
        "id": 510, 
        "name": "Extension Cord / Power Strip", 
        "carryOn": "allowed", 
        "checked": "allowed", 
        "note": "✅ Allowed. (Source: TSA)", 
        "category": ["household", "electronics"], 
        "keywords": ["extension cord", "power strip", "surge protector"]
    },
    {
        "id": 511, 
        "name": "Flashlight", 
        "carryOn": "allowed", 
        "checked": "allowed", 
        "note": "✅ Allowed. If it's a large 'tactical' flashlight (over 7 inches), it might be considered a bludgeon (weapon) and require checking. (Source: TSA)", 
        "category": ["household", "tools", "camping"], 
        "keywords": ["flashlight", "torch", "light"]
    },
    {
        "id": 512, 
        "name": "Sewing Kit", 
        "carryOn": "allowed", 
        "checked": "allowed", 
        "note": "✅ Allowed if scissors are smaller than 4 inches. Needles are allowed. (Source: TSA)", 
        "category": ["household", "tools"], 
        "keywords": ["sewing", "needle", "thread"]
    },
    {
        "id": 513, 
        "name": "Glass Vase / Ceramics", 
        "carryOn": "allowed", 
        "checked": "allowed", 
        "note": "✅ Allowed. Carry-on is safer to prevent breakage. (Source: TSA)", 
        "category": ["household"], 
        "keywords": ["vase", "glass", "ceramic", "pottery"]
    },
    {
        "id": 514, 
        "name": "Christmas Lights", 
        "carryOn": "allowed", 
        "checked": "allowed", 
        "note": "✅ Allowed. (Source: TSA)", 
        "category": ["household", "holiday"], 
        "keywords": ["lights", "christmas", "holiday", "decorations"]
    },
    {
        "id": 515, 
        "name": "Vacuum Robot (Roomba)", 
        "carryOn": "allowed", 
        "checked": "allowed", 
        "note": "✅ Allowed. ⚠️ Lithium battery rules apply! If checking the robot, you usually must REMOVE the battery and take it in the cabin. (Source: FAA)", 
        "category": ["household", "electronics", "batteries"], 
        "keywords": ["vacuum", "roomba", "cleaning"]
    },
    {
        "id": 516, 
        "name": "Detergent (Liquid)", 
        "carryOn": "restricted", 
        "checked": "allowed", 
        "note": "⚠️ Liquid rule applies: Max 3.4oz (100ml) in carry-on. Unlimited in checked bags. (Source: TSA)", 
        "category": ["household", "liquids", "cleaning"], 
        "keywords": ["detergent", "soap", "washing liquid"]
    },
    {
        "id": 517, 
        "name": "Detergent (Pods/Powder)", 
        "carryOn": "allowed", 
        "checked": "allowed", 
        "note": "✅ Pods and Powder are allowed. Powders over 12oz (350ml) may require extra screening. (Source: TSA)", 
        "category": ["household", "cleaning"], 
        "keywords": ["detergent", "pods", "powder", "tide pods"]
} // This is the end of your last item
]; // <--- This bracket closes the ITEMS_DATA array

// NOW you run the logic outside the array
ITEMS_DATA.forEach(item => {
    if (!item.slug) {
        item.slug = item.name
            .toLowerCase()
            .replace(/[()]/g, '') // Remove parentheses
            .replace(/\//g, '-')  // Replace slashes with hyphens
            .replace(/[^\w\s-]/g, '') // Remove special characters
            .replace(/\s+/g, '-') // Replace spaces with hyphens
            .replace(/-+/g, '-')  // Remove duplicate hyphens
            .trim();
    }
});