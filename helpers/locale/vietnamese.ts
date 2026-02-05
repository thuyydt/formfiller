/**
 * Vietnamese to English keyword mapping for better detection
 * Translates common Vietnamese field labels to English equivalents
 * IMPORTANT: Order matters! Longer keywords must come first to avoid partial matches
 */
export const vietnameseKeywordMap: [string, string][] = [
  // Longest compounds first
  ['nhập lại mật khẩu', 'password'],
  ['xác nhận mật khẩu', 'password'],
  ['họ và tên đệm', 'lastname'],
  ['số điện thoại', 'phone'],
  ['tên đăng nhập', 'username'],
  ['tỉnh thành phố', 'city'],
  ['quận huyện', 'city'],
  ['phường xã', 'ward'],
  ['ngày sinh', 'birthday'],
  ['thành phố', 'city'],
  ['mật khẩu', 'password'],
  ['địa chỉ email', 'email'],
  ['ghi chú', 'text'],
  ['tiêu đề', 'text'],
  ['nội dung', 'text'],
  ['tìm kiếm', 'search'],
  ['số thẻ', 'credit_card'],
  ['mã bảo mật', 'credit_card_cvv'],
  ['ngày hết hạn', 'credit_card_expiry'],
  ['số tài khoản', 'account_number'],
  ['chủ tài khoản', 'account_name'],
  ['trang web', 'url'],
  ['mã bưu điện', 'zipcode'],
  ['mã bưu chính', 'zipcode'],

  // Medium length
  ['họ và tên', 'name'],
  ['điện thoại', 'phone'],
  ['tài khoản', 'username'],
  ['giới tính', 'sex'],
  ['quốc gia', 'country'],
  ['bưu điện', 'zipcode'],
  ['công ty', 'company'],
  ['chức vụ', 'job_title'],
  ['website', 'url'],
  ['di động', 'phone'],
  ['cố định', 'phone'],
  ['liên hệ', 'phone'],
  ['địa chỉ', 'address'],
  ['mô tả', 'description'],
  ['giá', 'price'],
  ['số lượng', 'number'],

  // Short terms
  ['họ tên', 'name'],
  ['email', 'email'],
  ['thư', 'email'],
  ['tên', 'firstname'],
  ['họ', 'lastname'],
  ['tuổi', 'age'],
  ['fax', 'phone']
];

/**
 * Check if text contains Vietnamese-specific diacritics
 */
export const containsVietnamese = (text: string): boolean => {
  // Vietnamese uses Latin script with specific diacritics
  // Check for unique Vietnamese characters
  return /[àảãáạăằẳẵắặâầẩẫấậđèẻẽéẹêềểễếệìỉĩíịòỏõóọôồổỗốộơờởỡớợùủũúụưừửữứựỳỷỹýỵ]/i.test(text);
};

/**
 * Escape special regex characters in a string
 */
const escapeRegex = (str: string): string => {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
};

/**
 * Translate Vietnamese keywords to English for better pattern matching
 * Uses ordered array to ensure longer keywords are matched first
 */
export const translateVietnameseKeywords = (text: string): string => {
  if (!text || !containsVietnamese(text)) return text;

  let translated = text;
  // Process in order (longest first) to avoid partial matches
  for (const [vietnamese, english] of vietnameseKeywordMap) {
    if (translated.toLowerCase().includes(vietnamese)) {
      // Use case-insensitive replacement for Vietnamese
      const regex = new RegExp(escapeRegex(vietnamese), 'gi');
      translated = translated.replace(regex, english);
    }
  }
  return translated;
};
