# Contributing to Smart Home Automation

Thank you for your interest in contributing to this project! 🎉

## How to Contribute

### Reporting Bugs

If you find a bug, please create an issue with:
- Clear description of the problem
- Steps to reproduce
- Expected vs actual behavior
- Screenshots if applicable
- Environment details (browser, ESP32 model, etc.)

### Suggesting Features

Feature suggestions are welcome! Please include:
- Clear description of the feature
- Use case and benefits
- Potential implementation approach

### Code Contributions

1. **Fork the repository**
2. **Create a feature branch**
   ```bash
   git checkout -b feature/your-feature-name
   ```

3. **Make your changes**
   - Follow existing code style
   - Add comments for complex logic
   - Update documentation as needed

4. **Test your changes**
   - Test dashboard functionality
   - Verify ESP32 compatibility
   - Check responsive design

5. **Commit with clear messages**
   ```bash
   git commit -m "Add: feature description"
   ```

6. **Push to your fork**
   ```bash
   git push origin feature/your-feature-name
   ```

7. **Create a Pull Request**

## Code Style Guidelines

### JavaScript/React
- Use functional components with hooks
- Follow ESLint configuration
- Use meaningful variable names
- Add PropTypes or TypeScript types
- Keep components small and focused

### Arduino/C++
- Follow Arduino style guide
- Use meaningful function names
- Add comments for hardware interactions
- Include pin definitions at top
- Test on actual hardware

### CSS/Styling
- Use TailwindCSS utility classes
- Follow mobile-first approach
- Ensure accessibility (WCAG 2.1)
- Test on multiple screen sizes

## Project Structure

```
smart-home-automation/
├── dashboard/              # React frontend
│   ├── src/
│   │   ├── components/    # React components
│   │   ├── config/        # Configuration files
│   │   ├── hooks/         # Custom hooks
│   │   └── styles/        # CSS/styling
├── esp32-firmware/        # ESP32 code
│   └── smart-home.ino
├── scripts/               # Setup scripts
└── docs/                  # Documentation
```

## Development Setup

1. **Install dependencies**
   ```bash
   cd dashboard
   npm install
   ```

2. **Configure Firebase**
   - Update `src/config/firebase.js`

3. **Run development server**
   ```bash
   npm run dev
   ```

4. **For ESP32 development**
   - Use Arduino IDE or PlatformIO
   - Install required libraries
   - Upload and test on hardware

## Testing

### Frontend Testing
- Manual testing in browser
- Check all device interactions
- Verify responsive design
- Test different browsers

### Hardware Testing
- Test on actual ESP32 board
- Verify all GPIO connections
- Check sensor readings
- Test relay switching

## Documentation

When adding features:
- Update README.md
- Update SETUP_GUIDE.md if setup changes
- Add inline code comments
- Update ARCHITECTURE.md for major changes

## Commit Message Convention

Use clear, descriptive commit messages:

- `Add: new feature description`
- `Fix: bug description`
- `Update: component/file description`
- `Refactor: code improvement description`
- `Docs: documentation update`

## Questions?

Feel free to open an issue for questions or discussions!

## License

By contributing, you agree that your contributions will be licensed under the MIT License.
