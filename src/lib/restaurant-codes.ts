//src/lib/restaurant-codes.ts

export function generateRestaurantCode(country: string): string {
  // Get country prefix (first 2 letters uppercase)
  const countryPrefix = country.substring(0, 2).toUpperCase();
  
  // Generate random 6-digit number
  const randomNum = Math.floor(100000 + Math.random() * 900000);
  
  return `${countryPrefix}${randomNum}`;
}

// Example: generateRestaurantCode('Greece') → 'GR123456'