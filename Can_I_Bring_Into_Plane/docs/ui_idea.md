Airport Delay Advisor — UI Layout Specification

This document describes the full visual structure of the Airport Delay Advisor website. It explains EXACTLY what appears on screen, how elements are positioned, spacing, hierarchy, and the relationship between components. Another AI should be able to draft wireframes or code the layout purely from this page.



1\. General Layout Principles

Single-screen experience (desktop \& mobile-first).





Scrolling is minimal — ideally everything fits on one page.





Vertical stacking layout: Clean, modular blocks.





Simple color palette: Neutral background (white or light grey), one primary accent color.

Airport Delay Advisor — UI Layout Specification

This document describes the full visual structure of the Airport Delay Advisor website. It explains EXACTLY what appears on screen, how elements are positioned, spacing, hierarchy, and the relationship between components. Another AI should be able to draft wireframes or code the layout purely from this page.



1\. General Layout Principles

Single-screen experience (desktop \& mobile-first).





Scrolling is minimal — ideally everything fits on one page.





Vertical stacking layout: Clean, modular blocks.





Simple color palette: Neutral background (white or light grey), one primary accent color.





No animations except micro-fades.





Immediate clarity: User instantly sees the search input and latest airport delay alerts.







2\. Page Structure Overview

The page contains five stacked sections:

Header (compact)





Airport Search Bar





Selected Airport Summary Box





Live Delay Indicators Grid





Recent Updates Log





Footer (very small)





Everything is vertically centered with consistent horizontal padding (24 px mobile, 64 px desktop).



3\. Section-by-Section Layout Details

3.1 HEADER (TOP BAR)

Height: ~60 px





Content:





Left: Small airplane icon + text "Airport Delay Advisor"





Right: Nothing (keep minimal)





Style:





Light background, no shadow





Minimalist, unobtrusive







3.2 AIRPORT SEARCH BAR (PRIMARY INPUT)

Position: Directly under header, centered.

Components:

A single large input field labeled: "Search airport (LAX, CDG, HND...)"





Autocomplete dropdown for top ~20 airports.





Dimensions:

Mobile width: 90% of screen





Desktop width: 50% of screen





Height: 52 px





Behavior:

After user types an airport code, the remaining page sections instantly update.







3.3 SELECTED AIRPORT SUMMARY BOX

Appears immediately after selecting an airport.

Structure:

&nbsp;A rounded card containing:

Airport full name (large bold text)





Airport code (secondary small text)





Country flag (small icon)





Short subtitle: "Live delay indicators above their 24h average" OR "Normal operations"





Layout:

Card width: 100% mobile, 60% desktop





Padding: 20–32 px





Background: Slightly tinted







3.4 LIVE DELAY INDICATORS GRID (MAIN CONTENT)

This is the core of the page.

The grid contains 3–5 rectangular data tiles, each representing a delay indicator:

Security queue time





Check-in congestion





Takeoff/landing delays





Weather disruption level





Baggage claim delays (optional)





Each tile:

Shape: Rounded rectangle





Size: ~160–180 px tall





Background: white





Border: subtle grey line





Vertical content layout:





Top-left: Icon (clock, cloud, runway etc.)





Center: Big numeric/stat text (e.g., "+34% today")





Bottom: Small text: "Compared to 24h average"





Grid rules:

Mobile: Single column, tiles stacked





Tablet: Two-column grid





Desktop: Three-column grid





Spacing:

16 px vertical





16 px horizontal gap







3.5 RECENT UPDATES LOG

Appears below indicators.

Purpose: Shows when airport data was last refreshed.

Design:

One thin horizontal list





Items like:





"Security updated 3 min ago"





"Weather updated 17 min ago"





"Runway activity updated 2 min ago"





Style: Small, muted text.



3.6 FOOTER

Very minimal.

Content:

Tiny text: "Data refreshed every 10 minutes. Experimental tool."





Links: Privacy Policy, About





Style:

40 px height





Grey, subtle







4\. Visual Hierarchy Summary

Search Bar = Most important





Selected Airport Card = Context





Indicator Tiles = Core data delivery





Update Log = Transparency + trust





Footer = Legal + support







5\. Interaction Notes

No scrolling except on mobile when tiles exceed screen height.





Autocomplete should show airport code + name.





Indicators update instantly on search.





Tiles should use consistent iconography style.







6\. Technical Constraints

Page must load in < 1 second.





No external heavy scripts.





All assets local.





Grid must auto-adapt on all screen sizes.





Font: One single font family.







This single page fully describes the UI layout for the Airport Delay Advisor project. Another AI can use this to produce wireframes, HTML/CSS, or Flutter Web code without additional context.







No animations except micro-fades.





Immediate clarity: User instantly sees the search input and latest airport delay alerts.







2\. Page Structure Overview

The page contains five stacked sections:

Header (compact)





Airport Search Bar





Selected Airport Summary Box





Live Delay Indicators Grid





Recent Updates Log





Footer (very small)





Everything is vertically centered with consistent horizontal padding (24 px mobile, 64 px desktop).



3\. Section-by-Section Layout Details

3.1 HEADER (TOP BAR)

Height: ~60 px





Content:





Left: Small airplane icon + text "Airport Delay Advisor"





Right: Nothing (keep minimal)





Style:





Light background, no shadow





Minimalist, unobtrusive







3.2 AIRPORT SEARCH BAR (PRIMARY INPUT)

Position: Directly under header, centered.

Components:

A single large input field labeled: "Search airport (LAX, CDG, HND...)"





Autocomplete dropdown for top ~20 airports.





Dimensions:

Mobile width: 90% of screen





Desktop width: 50% of screen





Height: 52 px





Behavior:

After user types an airport code, the remaining page sections instantly update.







3.3 SELECTED AIRPORT SUMMARY BOX

Appears immediately after selecting an airport.

Structure:

&nbsp;A rounded card containing:

Airport full name (large bold text)





Airport code (secondary small text)





Country flag (small icon)





Short subtitle: "Live delay indicators above their 24h average" OR "Normal operations"





Layout:

Card width: 100% mobile, 60% desktop





Padding: 20–32 px





Background: Slightly tinted







3.4 LIVE DELAY INDICATORS GRID (MAIN CONTENT)

This is the core of the page.

The grid contains 3–5 rectangular data tiles, each representing a delay indicator:

Security queue time





Check-in congestion





Takeoff/landing delays





Weather disruption level





Baggage claim delays (optional)





Each tile:

Shape: Rounded rectangle





Size: ~160–180 px tall





Background: white





Border: subtle grey line





Vertical content layout:





Top-left: Icon (clock, cloud, runway etc.)





Center: Big numeric/stat text (e.g., "+34% today")





Bottom: Small text: "Compared to 24h average"





Grid rules:

Mobile: Single column, tiles stacked





Tablet: Two-column grid





Desktop: Three-column grid





Spacing:

16 px vertical





16 px horizontal gap







3.5 RECENT UPDATES LOG

Appears below indicators.

Purpose: Shows when airport data was last refreshed.

Design:

One thin horizontal list





Items like:





"Security updated 3 min ago"





"Weather updated 17 min ago"





"Runway activity updated 2 min ago"





Style: Small, muted text.



3.6 FOOTER

Very minimal.

Content:

Tiny text: "Data refreshed every 10 minutes. Experimental tool."





Links: Privacy Policy, About





Style:

40 px height





Grey, subtle







4\. Visual Hierarchy Summary

Search Bar = Most important





Selected Airport Card = Context





Indicator Tiles = Core data delivery





Update Log = Transparency + trust





Footer = Legal + support







5\. Interaction Notes

No scrolling except on mobile when tiles exceed screen height.





Autocomplete should show airport code + name.





Indicators update instantly on search.





Tiles should use consistent iconography style.







6\. Technical Constraints

Page must load in < 1 second.





No external heavy scripts.





All assets local.





Grid must auto-adapt on all screen sizes.





Font: One single font family.







This single page fully describes the UI layout for the Airport Delay Advisor project. Another AI can use this to produce wireframes, HTML/CSS, or Flutter Web code without additional context.





