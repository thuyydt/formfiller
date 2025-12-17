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
  ['địa chỉ', 'address'],
  ['ghi chú', 'text'],
  ['tiêu đề', 'text'],
  ['nội dung', 'text'],
  ['tìm kiếm', 'search'],

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

  // Short terms
  ['họ tên', 'name'],
  ['địa chỉ', 'address'],
  ['email', 'email'],
  ['thư', 'email'],
  ['tên', 'firstname'],
  ['họ', 'lastname'],
  ['tuổi', 'age'],
  ['fax', 'phone']
];

/**
 * Translate Vietnamese keywords to English for better pattern matching
 * Uses ordered array to ensure longer keywords are matched first
 */
export const translateVietnameseKeywords = (text: string): string => {
  if (!text) return text;

  let translated = text;
  // Process in order (longest first) to avoid partial matches
  for (const [vietnamese, english] of vietnameseKeywordMap) {
    if (translated.includes(vietnamese)) {
      translated = translated.replace(new RegExp(vietnamese, 'g'), english);
    }
  }
  return translated;
};
