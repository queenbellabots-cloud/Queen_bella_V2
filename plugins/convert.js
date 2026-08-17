/**
 * 👑 QUEEN BELLA MD - Unit Converter
 * Convert between different units
 */

const settings = require('../settings');

const REACTIONS = ['📊', '📐', '⚖️', '🌡️', '📏'];

module.exports = {
    name: 'convert',
    aliases: ['conv', 'unit'],
    category: 'tools',
    description: 'Convert between units',
    usage: '.convert <value> <from> <to>',
    react: '📊',
    async execute(conn, mek, args, chatId, isOwner) {
        try {
            const sender = mek.key.participant || mek.key.remoteJid;
            
            if (args.length < 3) {
                await conn.sendMessage(chatId, {
                    react: { text: '❌', key: mek.key }
                });
                await conn.sendMessage(chatId, { 
                    text: `┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
┃   📊 UNIT CONVERTER         ┃
┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛

❌ *Missing arguments!*

📝 *Usage:*
.convert <value> <from> <to>

📌 *Examples:*
.convert 100 km mi
.convert 32 f c
.convert 5 kg lb
.convert 10 m ft

🌡️ *Temperature:* c, f, k
📏 *Length:* m, cm, mm, km, mi, ft, in, yd
⚖️ *Weight:* kg, g, mg, lb, oz, ton
📊 *Volume:* l, ml, gal, cup
💾 *Data:* b, kb, mb, gb, tb

${settings.footer}`
                });
                return;
            }

            const value = parseFloat(args[0]);
            if (isNaN(value) || value < 0) {
                await conn.sendMessage(chatId, {
                    react: { text: '❌', key: mek.key }
                });
                await conn.sendMessage(chatId, { 
                    text: '❌ Invalid number!'
                });
                return;
            }

            const fromUnit = args[1].toLowerCase();
            const toUnit = args[2].toLowerCase();

            // Conversion factors (to base unit)
            const conversions = {
                // Length (base: meters)
                'm': 1,
                'meter': 1,
                'meters': 1,
                'cm': 0.01,
                'centimeter': 0.01,
                'centimeters': 0.01,
                'mm': 0.001,
                'millimeter': 0.001,
                'millimeters': 0.001,
                'km': 1000,
                'kilometer': 1000,
                'kilometers': 1000,
                'mi': 1609.344,
                'mile': 1609.344,
                'miles': 1609.344,
                'ft': 0.3048,
                'foot': 0.3048,
                'feet': 0.3048,
                'in': 0.0254,
                'inch': 0.0254,
                'inches': 0.0254,
                'yd': 0.9144,
                'yard': 0.9144,
                'yards': 0.9144,
                
                // Weight (base: kilograms)
                'kg': 1,
                'kilogram': 1,
                'kilograms': 1,
                'g': 0.001,
                'gram': 0.001,
                'grams': 0.001,
                'mg': 0.000001,
                'milligram': 0.000001,
                'milligrams': 0.000001,
                'lb': 0.453592,
                'pound': 0.453592,
                'pounds': 0.453592,
                'oz': 0.0283495,
                'ounce': 0.0283495,
                'ounces': 0.0283495,
                'ton': 1000,
                'tons': 1000,
                
                // Volume (base: liters)
                'l': 1,
                'liter': 1,
                'liters': 1,
                'ml': 0.001,
                'milliliter': 0.001,
                'milliliters': 0.001,
                'gal': 3.78541,
                'gallon': 3.78541,
                'gallons': 3.78541,
                'cup': 0.236588,
                'cups': 0.236588,
                
                // Data (base: bytes)
                'b': 1,
                'byte': 1,
                'bytes': 1,
                'kb': 1024,
                'kilobyte': 1024,
                'kilobytes': 1024,
                'mb': 1048576,
                'megabyte': 1048576,
                'megabytes': 1048576,
                'gb': 1073741824,
                'gigabyte': 1073741824,
                'gigabytes': 1073741824,
                'tb': 1099511627776,
                'terabyte': 1099511627776,
                'terabytes': 1099511627776
            };

            // Temperature conversion (special)
            const tempConversions = {
                'c': { toF: (v) => (v * 9/5) + 32, toK: (v) => v + 273.15 },
                'f': { toC: (v) => (v - 32) * 5/9, toK: (v) => (v - 32) * 5/9 + 273.15 },
                'k': { toC: (v) => v - 273.15, toF: (v) => (v - 273.15) * 9/5 + 32 }
            };

            // Check if temperature
            const tempUnits = ['c', 'f', 'k', 'celcius', 'fahrenheit', 'kelvin'];
            if (tempUnits.includes(fromUnit) && tempUnits.includes(toUnit)) {
                let celsius;
                let fromLabel = fromUnit;
                let toLabel = toUnit;

                // Convert from unit to celsius
                if (fromUnit === 'c' || fromUnit === 'celcius') {
                    celsius = value;
                    fromLabel = '°C';
                } else if (fromUnit === 'f' || fromUnit === 'fahrenheit') {
                    celsius = (value - 32) * 5/9;
                    fromLabel = '°F';
                } else if (fromUnit === 'k' || fromUnit === 'kelvin') {
                    celsius = value - 273.15;
                    fromLabel = 'K';
                }

                // Convert celsius to target unit
                let result;
                let resultLabel;
                if (toUnit === 'c' || toUnit === 'celcius') {
                    result = celsius;
                    resultLabel = '°C';
                } else if (toUnit === 'f' || toUnit === 'fahrenheit') {
                    result = (celsius * 9/5) + 32;
                    resultLabel = '°F';
                } else if (toUnit === 'k' || toUnit === 'kelvin') {
                    result = celsius + 273.15;
                    resultLabel = 'K';
                }

                const randomReact = REACTIONS[Math.floor(Math.random() * REACTIONS.length)];
                await conn.sendMessage(chatId, {
                    react: { text: randomReact, key: mek.key }
                });

                await conn.sendMessage(chatId, {
                    text: `┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
┃   🌡️ TEMPERATURE CONVERT   ┃
┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛

📝 *${value}${fromLabel}* = *${result.toFixed(2)}${resultLabel}*

${settings.footer}`
                });
                return;
            }

            // Regular conversion
            const fromFactor = conversions[fromUnit];
            const toFactor = conversions[toUnit];

            if (!fromFactor || !toFactor) {
                await conn.sendMessage(chatId, {
                    react: { text: '❌', key: mek.key }
                });
                await conn.sendMessage(chatId, { 
                    text: `❌ Unknown units!\n\nAvailable: m, cm, km, mi, ft, in, kg, g, lb, oz, l, ml, gal, b, kb, mb, gb`
                });
                return;
            }

            const result = (value * fromFactor) / toFactor;
            const randomReact = REACTIONS[Math.floor(Math.random() * REACTIONS.length)];
            
            await conn.sendMessage(chatId, {
                react: { text: randomReact, key: mek.key }
            });

            await conn.sendMessage(chatId, {
                text: `┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
┃   📊 UNIT CONVERT RESULT    ┃
┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛

📝 *${value} ${fromUnit}* = *${result.toFixed(4)} ${toUnit}*

${settings.footer}`
            });

        } catch (error) {
            console.error('Error in convert:', error);
            await conn.sendMessage(chatId, { 
                text: '❌ Error converting units.'
            });
        }
    }
};