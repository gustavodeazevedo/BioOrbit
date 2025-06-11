/**
 * Utility functions for handling number formatting in forms
 */

/**
 * Converts input values to use only decimal points (not commas)
 * @param {string} value - The input value to format
 * @returns {string} Value with commas replaced by periods and only one decimal point
 */
export const formatNumberInput = (value) => {
    if (value === null || value === undefined) return '';

    // Convert to string and replace commas with dots
    const stringValue = String(value).replace(/,/g, '.');

    // Ensure there's only one decimal point
    const parts = stringValue.split('.');
    let formattedValue = parts[0];
    if (parts.length > 1) {
        formattedValue += '.' + parts.slice(1).join('');
    }

    return formattedValue;
};

/**
 * Format a numeric value specifically for temperature inputs
 * @param {string} value - The temperature value
 * @returns {string} Formatted temperature value
 */
export const formatTemperature = (value) => {
    const formattedValue = formatNumberInput(value);
    const temp = parseFloat(formattedValue);

    if (isNaN(temp)) return "20.0";

    // Round to nearest 0.5
    const roundedTemp = Math.round(temp * 2) / 2;

    // Limit between 15.0 and 30.0
    const limitedTemp = Math.max(15.0, Math.min(30.0, roundedTemp));

    return limitedTemp.toFixed(1);
};
