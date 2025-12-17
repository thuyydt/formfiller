# Changelog

## Version 2.4.1 (December 16, 2025)
- **NEW:** 📅 Date Range Support
  - Added support for birthdate fields with configurable min/max age
  - Improved date generation logic to respect age constraints
- **NEW:** 📂 File Input Support
  - Added support for filling file inputs with dummy files
  - Handles various file types and extensions
- **IMPROVED:** ⚙️ Options UI Updates
  - Updated options page for better usability
  - Added new configuration settings for date and file inputs
  - Fill data on iframe with option to enable/disable

## Version 2.4.0 (November 24, 2025)
- **NEW:** 🎯 Fill Individual Fields
  - Right-click on any input/textarea/select to fill just that field
  - New context menu item: "Fill This Field"
  - Works with all field types (text, email, phone, select, textarea, etc.)
  - Respects custom field patterns and settings
  - Smart field type detection for accurate data generation
  - Shows field name in success notification
  - Perfect for filling specific fields without filling entire form
- **NEW:** 🔑 Default Password
  - Set a default password to be used for all password fields
  - Overrides random password generation
  - Useful for development environments where a consistent password is needed
  - Can be configured in Extension Options -> General Settings
- **FIX:** 🔧 Vue Modal and Dynamic Content Support
  - Fixed issue where extension couldn't fill fields in Vue modals
  - Now searches for fields in shadow DOM and dynamically loaded content
  - Added 100ms delay to wait for modal rendering and animations
  - Support for Web Components with shadow roots
  - Better iframe field detection (when accessible)
  - Improved SPA (Single Page Application) compatibility
- **FIX:** Field detection for inputs without id or name attributes
  - Fixed "No fields found to fill" message appearing when filling valid fields
  - Visual feedback now correctly matches fields using DOM element references
  - Improved field matching logic to handle inputs with only class/placeholder attributes
  - Works reliably with modern frameworks that don't always use id/name attributes
- **FIX:** Button and reset input type handling
  - Moved button/reset type filtering to early stage before filling
  - Prevents these fields from being incorrectly counted as filled
  - Removed redundant hidden input type check
  - Cleaner skip logic for ignored input types
- **NEW:** Advanced DOM traversal helpers
  - `getAllInputs()` - Finds inputs in main document, shadow DOM, and iframes
  - `getAllTextareas()` - Finds textareas everywhere
  - `getAllSelects()` - Finds select elements everywhere
  - `getAllRadios()` - Finds radio buttons everywhere
  - `getAllCheckboxes()` - Finds checkboxes everywhere
  - `waitForElements()` - Wait for dynamic content to load
  - `isElementVisible()` - Check if modal/element is visible
- **IMPROVED:** Memory management and performance
  - Added automatic cleanup of cached element attributes after form filling
  - Clear DOM references from detection report after visual feedback completes
  - Implemented TTL (5 minutes) for undo state history to prevent memory leaks
  - Added `clearUndoMemory()` function for manual memory cleanup
  - Periodic cleanup of expired undo states
  - Prevents memory leaks from long-lived DOM element references
  - Better performance for single-page applications (SPAs)
- **IMPROVED:** Resource cleanup
  - Automatic cleanup runs 2 seconds after form fill completes
  - Cached attributes cleared from all input elements
  - Detection report DOM references released after use
  - Undo history expires automatically after 5 minutes
- **IMPROVED:** Context menu organization
  - Separate menu for individual field operations
  - Available on all editable fields
  - Better user control over form filling
- **IMPROVED:** Field tracking
  - Tracks last focused field for context menu operations
  - Validates field is still in document before filling
  - Prevents errors from stale element references
- **IMPROVED:** Framework compatibility
  - Better Vue.js modal support
  - Better React portal support
  - Better Angular dialog support
  - Works with any framework that uses dynamic rendering
- **REMOVED:** Field Detection Report (Debug Mode) feature
  - Removed the "Enable Field Detection Report" setting from General tab
  - Removed console logging of detection reports
  - Simplified visual feedback logic
  - Reduced memory usage and improved performance
  - Users who need debugging can use browser DevTools instead

## Version 2.3.1 (November 22, 2025)
- **FIX:** Firefox compatibility issues
  - Fixed manifest v2 compatibility (changed `action` to `browser_action`)
  - Removed `importScripts` usage (not supported in Firefox MV2)
  - Integrated context menu code directly into background script
  - Added browser API detection for cross-browser compatibility
  - Fixed context menu contexts to use correct type for each browser
- **IMPROVED:** Keyboard shortcuts for Firefox
  - Changed default shortcuts to avoid conflicts with Firefox defaults
  - New shortcuts: `Alt+Shift+F` (Fill), `Alt+Shift+U` (Undo), `Alt+Shift+C` (Clear)
  - Chrome shortcuts remain unchanged: `Ctrl/Cmd+Shift+F/Z/X`
- **IMPROVED:** Cross-browser support
  - Automatic detection of `browser` API (Firefox) vs `chrome` API
  - Dynamic context menu type selection based on browser
  - Better compatibility across Chrome, Firefox, and other browsers
- **TESTED:** Extension verified working on both Chrome and Firefox

## Version 2.3.0 (November 21, 2025)
- **NEW:** 🤖 AI-Powered Field Detection
  - Machine learning-inspired scoring algorithm for intelligent field type detection
  - Trained on thousands of real-world form patterns from popular websites
  - Works as intelligent fallback when rule-based detection returns generic "text"
  - Confidence scoring system with adjustable threshold (30-95%, default 60%)
  - Enable/disable AI detection in settings
  - Analyzes field names, IDs, classes, labels, placeholders, and context
  - Supports 25+ field types with multi-language patterns (11+ languages)
  - Ensemble method combines multiple signals for better accuracy
  - Context-aware detection (analyzes parent elements, field relationships)
  - Performance: <10ms per field, handles 100+ fields in <1 second
  - Comprehensive test coverage (36 test cases)
  - Detailed documentation in AI_DETECTION.md
- **NEW:** Settings UI for AI detection
  - Toggle AI detection on/off
  - Confidence threshold slider with real-time preview
  - Visual indicators and helpful tooltips
  - Default enabled with 60% threshold
- **FIX:** Field count accuracy with "Ignore filled fields" option
  - Previously counted all fields with values, including pre-existing data
  - Now correctly counts only fields that were actually filled by the extension
  - Visual feedback and toast notifications now show accurate filled count
  - Uses detection report data for precise tracking
- **IMPROVED:** Field detection accuracy
  - Better handling of ambiguous field names
  - Improved multi-language support
  - Context-aware analysis for better predictions
- **IMPROVED:** Documentation
  - Added comprehensive AI detection guide
  - Updated README with AI features
  - Usage examples and best practices
  - Created CONTRIBUTING.md for contributors
- **ADDED:** New helper functions
  - `predictFieldType()` - Basic AI prediction
  - `predictFieldTypeEnhanced()` - Enhanced with ensemble methods
  - `analyzeField()` - Detailed field analysis for debugging
  - `getElmTypeWithAI()` - Integrated detection with AI fallback

## Version 2.2.0 (Upcoming)
- **NEW:** Advanced Custom Fields with Faker.js Integration
  - Added new "Faker" type for custom field rules
  - 25+ Faker.js data types available (person, location, internet, company, finance, etc.)
  - Dynamic dropdown to select Faker data types directly in UI
  - Smart cell visibility toggle based on selected type (List/Regex/Faker)
  - Improved custom fields table with better UX
  - Support for nested Faker paths (e.g., `person.firstName`, `internet.email`)
  - Automatic fallback to default detection if Faker path fails
  - Enhanced data generation flexibility and control
  - Complete documentation in ADVANCED_CUSTOM_FIELDS.md
- **IMPROVED:** Custom Fields UI
  - Added "Faker Data Type" column with intelligent visibility
  - Better placeholder text and field labels
  - Cleaner table layout and styling
  - Improved user guidance and tooltips
  - Quick Guide with show/hide functionality and localStorage persistence
- **IMPROVED:** Documentation
  - New comprehensive guide for advanced custom fields
  - Updated README with Faker type examples
  - Detailed usage examples for all custom field types
  - Interactive Quick Guide with examples for List, Regex, and Faker types
  - Enhanced Pro Tips section with 8 actionable items
- **OPTIMIZED:** Performance improvements
  - Removed duplicate field type checks in detection algorithm
  - Reduced type detection code from 283 to 256 lines (9.5% reduction)
  - Eliminated redundant checks for emoji, user_agent, currency, currency_code, currency_name, and price types
  - Faster field detection with cleaner code structure

## Version 2.1.0
- **NEW:** Field Detection Report (Debug Tool)
  - Comprehensive field detection logging system
  - Console report showing all detected fields, filled fields, and skipped fields
  - Visual report panel with interactive UI
  - Export report as JSON or copy to clipboard
  - Detailed skip reasons (hidden, readonly, matched ignore patterns, etc.)
  - Custom pattern matching visibility
  - Label detection results shown in report
  - Performance impact minimal when disabled
  - Helps developers debug and improve detection logic
  - Assists users in writing better custom field patterns
- **FIX:** Sound setting bug - now correctly respects the "Play sound when form is filled" option
  - Previously would play sound even when unchecked
  - Now only plays sound when explicitly enabled
- Enhanced debugging capabilities for better extension development
- Improved field detection transparency for users

## Version 2.0.10
- **NEW:** Redesigned Options UI with Tabs
  - Organized settings into 4 logical tabs: General, Behavior, Custom Fields, Advanced
  - Modern, clean interface with smooth animations
  - Tab state is remembered across sessions
  - Improved visual hierarchy and spacing
  - Collapsible documentation sections for cleaner look
  - Better mobile responsiveness
- Enhanced CSS with modern styling and transitions
- Improved button designs and hover effects
- Better visual feedback throughout the UI
- More intuitive navigation and organization

## Version 2.0.9
- **NEW:** Customizable keyboard shortcuts
  - Easy access to Chrome's shortcuts page from settings
  - One-click button to customize all shortcuts
  - Support for custom key combinations for Fill, Undo, and Clear
- Improved settings UI with keyboard shortcuts section
- Added helpful guide for customizing shortcuts

## Version 2.0.8
- **NEW:** Clear/Undo functionality for better UX
  - Undo last fill operation (restores original values)
  - Clear all form fields at once
  - Available via keyboard shortcuts and context menu
  - Keyboard shortcuts:
    - `Cmd+Shift+Z` (Mac) / `Ctrl+Shift+Z` (Windows) - Undo
    - `Cmd+Shift+X` (Mac) / `Ctrl+Shift+X` (Windows) - Clear
  - Right-click extension icon for quick access
- Form state is automatically saved before filling for undo
- Visual feedback for undo/clear operations

## Version 2.0.7
- **NEW:** Enhanced Visual Feedback when form is filled
  - Toast notification showing number of fields filled
  - Smooth highlight animation on filled fields
  - Optional success sound (can be enabled in settings)
- Improved user experience with clear visual confirmation
- Removed console.log output for cleaner browser console

## Version 2.0.6
- Fixed issue with Custom Fields not saving correctly in some cases
- Supported Javascript-based forms that dynamically generate fields

## Version 2.0.5
- **NEW:** Enhanced Custom Fields with label-based matching
- Added intelligent label detection that finds the closest label element to input fields
- Improved custom field matching to include associated labels, aria-labels, placeholders, and closest labels
- Added new "Label-Based Matching" setting in options to control this feature
- Enhanced field detection for forms without clear id, name, class, or attribute patterns
- Better support for forms with label elements positioned near input fields
- Enhanced Custom Fields with wildcard pattern matching
- Added support for `*address` (ends with), `address*` (starts with), and `*address*` (contains) patterns
- Custom field matching now works with type, name, id, class, and any attribute values
- Improved field matching logic for better accuracy

## Version 2.0.4
- Fixed filling for dynamic selects
- Added settings page for user preferences
- Added Ignore Fields setting
- Added Ignore Domains setting
- Added Custom Fields with list or regex
- Added Export/Import Settings to json
- Improved error handling for unsupported fields
- Support new languages: Arabic, Korean, Russian, French, Spanish, Polish, German

## Version 1.0.3
- Initial release on Google Extension Store
- Support languages: English, Chinese, Japanese, Vietnamese