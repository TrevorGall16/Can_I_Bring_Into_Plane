Dev Rules \& Best Practices (Rewritten)

This document defines the rules and workflow standards for all future app and website projects. These rules are based on issues observed in previous builds, with the goal of preventing wasted time, avoiding configuration traps, and ensuring clean, predictable development.



1\. The "Forever Name" Rule

Before starting any project, we decide together on one permanent project name (Bundle ID / Package Name). This name must:

Never include my real name.





Follow the format: com.studio.projectname (all lowercase, no underscores).





Be locked in before running Flutter create.





Command example:

flutter create --org com.studio project\_name



This prevents ID mismatches acDev Rules \& Best Practices (Rewritten)

This document defines the rules and workflow standards for all future app and website projects. These rules are based on issues observed in previous builds, with the goal of preventing wasted time, avoiding configuration traps, and ensuring clean, predictable development.



1\. The "Forever Name" Rule

Before starting any project, we decide together on one permanent project name (Bundle ID / Package Name). This name must:

Never include my real name.





Follow the format: com.studio.projectname (all lowercase, no underscores).





Be locked in before running Flutter create.





Command example:

flutter create --org com.studio project\_name



This prevents ID mismatches across Android, iOS, Google Play, and any external services.



2\. The Master Keystore Strategy

We no longer generate random keys for each app.

Rules:

Use one universal Keystore stored safely (ex: Documents/DevKeys/master\_key.jks).





The same password is reused for all apps.





New apps may use the same alias or a new alias.





This ensures zero risk of losing signing credentials.



3\. The iOS-on-Windows Protocol

Since iOS can't be tested directly without a Mac, changes must be minimal and controlled.

Only modify these two files:

ios/Runner/Info.plist → Add permissions early (Internet, Ads, Photos, etc.).





pubspec.yaml → Add remove\_alpha\_ios: true for icons.





Do not modify any other iOS configuration unless explicitly required.



4\. Visual Assets First

Common issue: ghost icons, cached assets, or mismatched resolutions.

Rules:

Create a 1024×1024 solid-background icon immediately.





No placeholder icons.





Run flutter\_launcher\_icons on day one.





Whenever images change: flutter clean.







5\. AdMob \& External IDs

We previously mixed up App IDs and Unit IDs, causing crashes.

Rules:

Create all entries before writing a single line of Ad code.





Android: Add the App ID to AndroidManifest.





iOS: Add the App ID to Info.plist.





Only then: write Dart code.







6\. GitHub Workflow (Mandatory)

To avoid lost files, unsynced changes, or overwritten configs:

Rules:

Every project must have a GitHub repo created at the start.





Push code at least once per work session.





Commits must be descriptive (e.g., feat: add home layout, fix: icon not loading).





Always push before asking the assistant to refactor or add files.





This ensures traceability and safe rollbacks.



7\. Module \& Package Discipline

Past issue: trying to fix broken packages instead of downgrading.

Rules:

Never update packages automatically.





If a module is outdated or incompatible → downgrade first.





Only update when explicitly necessary.







8\. Modification Rules for the Assistant

To avoid large, unnecessary rewrites:

Modify only what the user asks.





Do not rewrite entire files unless explicitly requested.





Do not introduce new architecture patterns.





Keep all code clean and simple.





Ask clarifying questions whenever unsure.





Follow all documents inside /docs.







9\. Performance \& UX Standards

Fast loading.





No heavy animations.





Minimal dependencies.





Small, modular code.







Summary Checklist

Permanent project name chosen upfront (no real names).





Master Keystore reused.





Minimal iOS edits.





Visual assets prepared first.





AdMob IDs configured before writing code.





GitHub repo created at the start.





Avoid unnecessary package updates.





Keep modifications simple and scoped.







End of document.



ross Android, iOS, Google Play, and any external services.



2\. The Master Keystore Strategy

We no longer generate random keys for each app.

Rules:

Use one universal Keystore stored safely (ex: Documents/DevKeys/master\_key.jks).





The same password is reused for all apps.





New apps may use the same alias or a new alias.





This ensures zero risk of losing signing credentials.



3\. The iOS-on-Windows Protocol

Since iOS can't be tested directly without a Mac, changes must be minimal and controlled.

Only modify these two files:

ios/Runner/Info.plist → Add permissions early (Internet, Ads, Photos, etc.).





pubspec.yaml → Add remove\_alpha\_ios: true for icons.





Do not modify any other iOS configuration unless explicitly required.



4\. Visual Assets First

Common issue: ghost icons, cached assets, or mismatched resolutions.

Rules:

Create a 1024×1024 solid-background icon immediately.





No placeholder icons.





Run flutter\_launcher\_icons on day one.





Whenever images change: flutter clean.







5\. AdMob \& External IDs

We previously mixed up App IDs and Unit IDs, causing crashes.

Rules:

Create all entries before writing a single line of Ad code.





Android: Add the App ID to AndroidManifest.





iOS: Add the App ID to Info.plist.





Only then: write Dart code.







6\. GitHub Workflow (Mandatory)

To avoid lost files, unsynced changes, or overwritten configs:

Rules:

Every project must have a GitHub repo created at the start.





Push code at least once per work session.





Commits must be descriptive (e.g., feat: add home layout, fix: icon not loading).





Always push before asking the assistant to refactor or add files.





This ensures traceability and safe rollbacks.



7\. Module \& Package Discipline

Past issue: trying to fix broken packages instead of downgrading.

Rules:

Never update packages automatically.





If a module is outdated or incompatible → downgrade first.





Only update when explicitly necessary.







8\. Modification Rules for the Assistant

To avoid large, unnecessary rewrites:

Modify only what the user asks.





Do not rewrite entire files unless explicitly requested.





Do not introduce new architecture patterns.





Keep all code clean and simple.





Ask clarifying questions whenever unsure.





Follow all documents inside /docs.







9\. Performance \& UX Standards

Fast loading.





No heavy animations.





Minimal dependencies.





Small, modular code.







Summary Checklist

Permanent project name chosen upfront (no real names).





Master Keystore reused.





Minimal iOS edits.





Visual assets prepared first.





AdMob IDs configured before writing code.





GitHub repo created at the start.





Avoid unnecessary package updates.





Keep modifications simple and scoped.







End of document.





