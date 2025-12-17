# Security Policy

## Supported Versions

We release security updates for the following versions of Form Filler Extension:

| Version | Supported          |
| ------- | ------------------ |
| 2.2.x   | ✅ Yes             |
| 2.1.x   | ✅ Yes             |
| 2.0.x   | ⚠️ Limited support |
| < 2.0   | ❌ No              |

**Note**: We recommend always using the latest version available on the Chrome Web Store or Firefox Add-ons.

## Security Measures

### Built-in Security Features

1. **No External Communication**
   - The extension does not make any network requests
   - All data processing happens locally in your browser
   - No telemetry or analytics

2. **Minimal Permissions**
   - Only requests necessary permissions (`activeTab`, `contextMenus`, `storage`)
   - No access to browsing history or cross-origin data
   - No persistent background scripts with broad access

3. **Content Security Policy**
   - Strict CSP implemented in manifest
   - No inline scripts or unsafe evaluations
   - No external script loading

4. **Local Storage Only**
   - All settings stored locally using Chrome Storage API
   - No cloud synchronization (unless user enables Chrome Sync)
   - Temporary data (undo history) cleared on page unload

5. **Open Source**
   - Full source code available for review
   - Community auditing encouraged
   - Transparent development process

### Security Best Practices

When using this extension:

- ✅ Review the permissions before installation
- ✅ Keep the extension updated to the latest version
- ✅ Use the "Ignored Domains" feature to prevent filling on sensitive sites
- ✅ Review custom field patterns to ensure they don't match sensitive fields
- ⚠️ Do not use on production systems with real user data
- ⚠️ This extension is intended for development and testing only

## Reporting a Vulnerability

We take security vulnerabilities seriously. If you discover a security issue, please follow these steps:

### How to Report

1. **DO NOT** open a public GitHub issue for security vulnerabilities
2. **Use GitHub Security Advisory** (preferred): Go to the repository's "Security" tab and click "Report a vulnerability"
3. **Alternative**: Contact the maintainer privately at https://github.com/thuyydt

### What to Include

Please include the following information in your report:

- **Description**: Clear description of the vulnerability
- **Impact**: Potential impact and severity
- **Steps to Reproduce**: Detailed steps to reproduce the issue
- **Proof of Concept**: If possible, provide a PoC or example
- **Affected Versions**: Which versions are affected
- **Suggested Fix**: If you have ideas for a fix (optional)
- **Your Contact**: How we can reach you for follow-up

### Example Report Template

```markdown
## Vulnerability Report

**Summary**: Brief description

**Severity**: Critical / High / Medium / Low

**Affected Versions**: 2.2.x, 2.1.x

**Description**:
Detailed explanation of the vulnerability

**Steps to Reproduce**:
1. Step one
2. Step two
3. Step three

**Impact**:
What an attacker could do with this vulnerability

**Suggested Fix**:
Your ideas for fixing (if any)

**Contact**: your-email@example.com
```

### Response Timeline

- **Initial Response**: Within 48 hours of receiving the report
- **Assessment**: Within 7 days we'll assess the severity and impact
- **Fix Development**: Timeline depends on severity
  - Critical: Within 1-3 days
  - High: Within 1-2 weeks
  - Medium: Within 2-4 weeks
  - Low: Next regular release cycle
- **Disclosure**: After fix is released and users have had time to update (typically 7-14 days)

### Recognition

We believe in recognizing security researchers who help make our extension safer:

- Your name (or pseudonym) will be added to our CONTRIBUTORS.md file (with your permission)
- Public acknowledgment in the release notes (if desired)
- Our sincere gratitude!

**Note**: This is an open-source project maintained by volunteers. We do not offer bug bounties, but we deeply appreciate your contributions to security.

## Known Security Considerations

### Intended Use

⚠️ **Important**: This extension is designed for **development and testing purposes only**.

- **DO NOT** use on forms containing real personal information
- **DO NOT** use on production environments
- **DO NOT** use on financial or healthcare websites
- **DO NOT** store sensitive data in custom field patterns

### Limitations

1. **No Data Validation**: The extension generates random fake data without validating it against backend systems
2. **Client-Side Only**: All security depends on browser security model
3. **Custom Patterns**: User-defined regex patterns could potentially match unintended fields
4. **No Encryption**: Settings are stored in plain text in local storage (no sensitive data should be stored)

### Recommended Security Settings

Configure the extension for maximum security:

```javascript
// In Options page, consider setting:
- Ignored Domains: Add production domains, banking sites, healthcare sites
- Ignore Filled Fields: Enable this to avoid overwriting existing data
- Custom Fields: Review patterns to ensure they're not too broad
```

## Secure Development Practices

Our development process includes:

- ✅ TypeScript with strict mode for type safety
- ✅ ESLint for code quality and security linting
- ✅ 70%+ test coverage with Jest
- ✅ Manual code review for all changes
- ✅ Dependency security scanning
- ✅ No `eval()` or unsafe code execution
- ✅ Content Security Policy enforcement
- ✅ Input sanitization for user settings

## Dependencies

We regularly monitor dependencies for security vulnerabilities:

```bash
# Check for vulnerabilities
npm audit

# Update dependencies
npm update

# Review dependency tree
npm ls
```

### Dependency Policy

- Regular updates to patch known vulnerabilities
- Minimal dependencies to reduce attack surface
- Only use well-maintained, reputable packages
- Review dependency changes before updating

## Security Checklist for Contributors

If you're contributing to the project, please ensure:

- [ ] No use of `eval()`, `new Function()`, or `innerHTML` with user input
- [ ] All user inputs are properly sanitized
- [ ] No storage of sensitive information
- [ ] No network requests (extension should work offline)
- [ ] Proper error handling to prevent information leakage
- [ ] TypeScript strict mode compliance
- [ ] Tests for security-critical code paths
- [ ] Documentation of security implications for new features

## Security Updates

Security updates will be:

1. Released as soon as possible after a fix is developed
2. Announced in the CHANGELOG.md
3. Published to Chrome Web Store and Firefox Add-ons immediately
4. Communicated via GitHub releases and security advisories

## External Security Audits

We welcome external security audits and penetration testing:

- If you plan to perform a security audit, please inform us first
- Share your findings privately before public disclosure
- We'll work with you on responsible disclosure timelines

## Contact

For security-related questions or concerns:

- **Security Issues**: Use GitHub Security Advisory (preferred)
- **General Questions**: Open a GitHub issue at https://github.com/thuyydt/formfiller/issues
- **Private Inquiries**: Contact maintainer at https://github.com/thuyydt

## Additional Resources

- [Chrome Extension Security Best Practices](https://developer.chrome.com/docs/extensions/mv3/security/)
- [OWASP Browser Extension Security](https://owasp.org/www-community/vulnerabilities/Browser_extension_security)
- [Mozilla Add-on Security Best Practices](https://extensionworkshop.com/documentation/develop/build-a-secure-extension/)

---

**Last Updated**: November 21, 2025  
**Version**: 2.2.1  

Thank you for helping keep Form Filler Extension and its users safe! 🔒
