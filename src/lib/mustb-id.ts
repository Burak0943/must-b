// Eşsiz ve doğrulanabilir must-b ID'si üretir (Ortağının vizyonu)
export function generateMustbId() {
  let idBase = "";
  let sum = 0;
  
  // 9 haneli rastgele bir sayı dizisi oluşturuyoruz
  for (let i = 0; i < 9; i++) {
    const digit = Math.floor(Math.random() * 10);
    idBase += digit;
    // Çift/Tek hanelere göre ağırlık verip topluyoruz (Luhn mantığı)
    sum += digit * (i % 2 === 0 ? 1 : 2);
  }
  
  // Kontrol hanesini (10. hane) matematiksel olarak hesaplıyoruz
  const checkDigit = (10 - (sum % 10)) % 10;
  
  // Örnek Çıktı: MB-482910384-7
  return `MB-${idBase}-${checkDigit}`;
}

// Buluta (Cloud) bağlanan bir ID'nin sahte olup olmadığını DB'ye gitmeden anlar
export function verifyMustbId(mustbId: string) {
  if (!mustbId.startsWith('MB-')) return false;
  
  const parts = mustbId.replace('MB-', '').split('-');
  if (parts.length !== 2) return false;
  
  const idBase = parts[0];
  const checkDigit = parseInt(parts[1], 10);
  let sum = 0;
  
  for (let i = 0; i < idBase.length; i++) {
    sum += parseInt(idBase[i], 10) * (i % 2 === 0 ? 1 : 2);
  }
  
  const expectedCheckDigit = (10 - (sum % 10)) % 10;
  return checkDigit === expectedCheckDigit;
}