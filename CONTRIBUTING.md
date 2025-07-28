# 🤝 Contributing to Cyberguard

Thank you for your interest in contributing to Cyberguard! This document provides guidelines and information for contributors.

## 🎯 How to Contribute

### 🐛 Reporting Bugs

1. **Check existing issues** first to avoid duplicates
2. **Use the bug report template** when creating new issues
3. **Provide detailed information**:
   - Steps to reproduce
   - Expected vs actual behavior
   - Screenshots if applicable
   - Browser/OS information

### 💡 Suggesting Features

1. **Check existing feature requests** first
2. **Use the feature request template**
3. **Explain the use case** and benefits
4. **Consider implementation complexity**

### 🔧 Code Contributions

#### Getting Started

1. **Fork the repository**
2. **Clone your fork**:
   ```bash
   git clone https://github.com/yourusername/cyberguard.git
   cd cyberguard
   ```
3. **Install dependencies**:
   ```bash
   npm run install-deps
   ```
4. **Set up environment variables** (see README.md)

#### Development Workflow

1. **Create a feature branch**:
   ```bash
   git checkout -b feature/your-feature-name
   ```
2. **Make your changes**
3. **Test your changes**:
   ```bash
   npm run dev  # Test both frontend and backend
   ```
4. **Commit your changes**:
   ```bash
   git commit -m "feat: add your feature description"
   ```
5. **Push to your fork**:
   ```bash
   git push origin feature/your-feature-name
   ```
6. **Create a Pull Request**

## 📝 Code Style Guidelines

### JavaScript/React
- Use **ES6+ features**
- Follow **React Hooks** patterns
- Use **functional components** over class components
- **Destructure props** when possible
- Add **PropTypes** for type checking

### CSS
- Use **CSS custom properties** for theming
- Follow **BEM methodology** for class naming
- Keep styles **modular and reusable**
- Use **responsive design** principles

### Backend
- Use **async/await** over promises
- Implement proper **error handling**
- Add **input validation**
- Follow **RESTful API** conventions

## 🧪 Testing

### Frontend Testing
```bash
cd frontend
npm test
```

### Backend Testing
```bash
cd backend
npm test
```

### Manual Testing Checklist
- [ ] Authentication works correctly
- [ ] Questions load and display properly
- [ ] Sound effects play correctly
- [ ] Leaderboard updates in real-time
- [ ] Game mechanics work as expected
- [ ] Responsive design on mobile devices

## 📋 Pull Request Guidelines

### Before Submitting
- [ ] Code follows style guidelines
- [ ] All tests pass
- [ ] No console errors or warnings
- [ ] Documentation is updated if needed
- [ ] Commit messages follow convention

### PR Description Template
```markdown
## Description
Brief description of changes

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation update

## Testing
- [ ] Tested locally
- [ ] Added/updated tests
- [ ] Manual testing completed

## Screenshots (if applicable)
Add screenshots here

## Checklist
- [ ] Code follows style guidelines
- [ ] Self-review completed
- [ ] Documentation updated
```

## 🏷️ Commit Message Convention

Use conventional commits format:

```
type(scope): description

[optional body]

[optional footer]
```

### Types
- **feat**: New feature
- **fix**: Bug fix
- **docs**: Documentation changes
- **style**: Code style changes (formatting, etc.)
- **refactor**: Code refactoring
- **test**: Adding or updating tests
- **chore**: Maintenance tasks

### Examples
```
feat(auth): add Google authentication
fix(sound): resolve audio playback issues
docs(readme): update installation instructions
style(css): improve responsive design
```

## 🎨 Design Guidelines

### UI/UX Principles
- **Cyberpunk aesthetic** with modern touches
- **Accessibility first** - ensure good contrast and keyboard navigation
- **Mobile-responsive** design
- **Intuitive user flow**
- **Consistent visual hierarchy**

### Color Palette
- Primary: `#3b82f6` (Blue)
- Secondary: `#8b5cf6` (Purple)
- Success: `#22c55e` (Green)
- Error: `#ef4444` (Red)
- Background: Dark gradients

## 🔒 Security Guidelines

### Frontend Security
- Never expose API keys in client code
- Validate all user inputs
- Use HTTPS in production
- Implement proper authentication checks

### Backend Security
- Validate and sanitize all inputs
- Use environment variables for secrets
- Implement rate limiting
- Follow OWASP security guidelines

## 📚 Resources

### Learning Resources
- [React Documentation](https://reactjs.org/docs)
- [Firebase Documentation](https://firebase.google.com/docs)
- [Node.js Best Practices](https://github.com/goldbergyoni/nodebestpractices)
- [Cybersecurity Fundamentals](https://www.nist.gov/cyberframework)

### Development Tools
- [React Developer Tools](https://chrome.google.com/webstore/detail/react-developer-tools)
- [Firebase Emulator Suite](https://firebase.google.com/docs/emulator-suite)
- [Postman](https://www.postman.com/) for API testing

## 🏆 Recognition

Contributors will be recognized in:
- README.md contributors section
- Release notes for significant contributions
- Special mentions in project updates

## ❓ Questions?

- **General questions**: Open a discussion
- **Bug reports**: Create an issue
- **Feature requests**: Create an issue with feature template
- **Security concerns**: Email maintainers directly

## 📞 Contact

- **Project Maintainer**: [Your Name]
- **Email**: [your.email@example.com]
- **Discord**: [Your Discord Server]

---

**Thank you for contributing to Cyberguard! Together, we're making the internet safer for everyone.** 🛡️