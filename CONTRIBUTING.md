# Contributing to nasdaq-strategy

Thank you for your interest in contributing! This document provides guidelines for contributing to the nasdaq-strategy project.

## Code of Conduct

Be respectful, inclusive, and professional. We do not tolerate harassment, discrimination, or hostile behavior.

## Ways to Contribute

- **Report bugs**: Open an issue describing the bug
- **Suggest features**: Discuss ideas in issues before implementing
- **Fix bugs**: Submit PRs for existing issues
- **Improve documentation**: Docs are always welcome
- **Test**: Help test on devnet/testnet
- **Security**: Report vulnerabilities responsibly

## Getting Started

1. Fork the repository
2. Clone your fork: `git clone https://github.com/YOUR-USERNAME/nasdaq-strategy.git`
3. Add upstream: `git remote add upstream https://github.com/rthefinder/nasdaq-strategy.git`
4. Create feature branch: `git checkout -b feature/your-feature`
5. Make changes following the guidelines below
6. Test thoroughly
7. Push to your fork
8. Open a Pull Request

## Development Guidelines

### Code Style

**Rust:**
- Follow Anchor conventions
- Use `cargo fmt` for formatting
- Run `cargo clippy` for linting
- Document public functions

**TypeScript:**
- Use ESLint and Prettier
- Run `pnpm lint` and `pnpm format`
- Write clear, self-documenting code
- Add JSDoc comments for complex functions

**General:**
- Write small, focused commits
- Use clear commit messages
- Link to related issues in PRs
- Update documentation when changing behavior

### Testing

- Write tests for new features
- Ensure all tests pass: `pnpm test`
- Test on devnet before deployment
- Document test scenarios

### Smart Contracts

- Changes to program logic must have comprehensive tests
- Include event logging for all state changes
- Document account requirements
- Consider gas/compute optimization
- Follow Anchor best practices

### Documentation

- Keep README.md updated
- Update docs/ when changing behavior
- Add JSDoc/rustdoc comments
- Include examples for new features
- Maintain changelog

## Pull Request Process

1. **Before submitting:**
   - Run `pnpm build`
   - Run `pnpm test`
   - Run `pnpm lint`
   - Run `pnpm format`
   - Rebase on latest main

2. **PR description should include:**
   - What problem does this solve?
   - How does it solve it?
   - Any breaking changes?
   - Testing performed
   - Related issues (e.g., "Closes #123")

3. **Expectations:**
   - CI checks must pass
   - At least one review before merge
   - Address feedback promptly
   - Keep commits organized

## Security

### Reporting Security Issues

**Do not open public issues for security vulnerabilities.**

Email security details to [security contact TBD] with:
- Description of the vulnerability
- Steps to reproduce
- Potential impact
- Suggested fix (if any)

We will:
- Acknowledge within 48 hours
- Investigate thoroughly
- Keep you updated
- Credit you if desired

### Security Considerations

When reviewing code, consider:
- Integer overflow/underflow
- Authorization checks
- Data validation
- Reentrancy (for contracts)
- Account ownership verification

## Smart Contract Changes

### High-Risk Changes

Changes to core logic, fee mechanisms, or treasury management require:

1. **Detailed specification** explaining the change
2. **Comprehensive tests** covering edge cases
3. **Security analysis** of potential exploits
4. **Formal audit** before mainnet deployment

### Safe Changes

Documentation, UI, or utility changes have lighter review.

## Testing Strategy

### Unit Tests

Test individual functions in isolation:

```rust
#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_fee_calculation() {
        let fee = calculate_fee(1_000_000, 400);
        assert_eq!(fee, 40_000);
    }
}
```

### Integration Tests

Test program interactions:

```bash
anchor test
```

### Devnet Testing

- Deploy to devnet
- Test end-to-end flows
- Monitor for errors
- Verify on-chain state

## Documentation Standards

### Code Comments

```rust
/// Calculate fee for transaction
/// # Arguments
/// * `amount` - Transaction amount in base units
/// * `fee_percentage` - Fee in basis points (400 = 4%)
/// # Returns
/// Fee amount in base units
pub fn calculate_fee(amount: u64, fee_percentage: u16) -> u64 {
    (amount as u128 * fee_percentage as u128 / 10000) as u64
}
```

### API Documentation

Use markdown in docs/:

```markdown
## calculate_fee

Calculate transaction fee.

**Parameters**:
- `amount: u64` - Transaction amount
- `fee_percentage: u16` - Fee in basis points

**Returns**: Fee amount

**Example**:
\`\`\`typescript
const fee = calculateFee(1_000_000, 400); // 40,000
\`\`\`
```

## Commit Messages

Use clear, descriptive messages:

```
feat: Add NAV update instruction
fix: Correct fee calculation overflow
docs: Update API reference
test: Add fee calculation tests
chore: Update dependencies
```

Format:
```
<type>: <subject>

<body>

<footer>
```

Types: `feat`, `fix`, `docs`, `test`, `chore`, `refactor`, `perf`

## Issue Guidelines

### Reporting Bugs

```markdown
## Description
[Clear description of the bug]

## Steps to Reproduce
1. [Step 1]
2. [Step 2]

## Expected Behavior
[What should happen]

## Actual Behavior
[What actually happens]

## Environment
- OS: [e.g., macOS, Linux]
- Solana CLI version: [e.g., 1.17]
- Anchor version: [e.g., 0.29]
```

### Feature Requests

```markdown
## Proposal
[Clear description of the feature]

## Motivation
[Why is this needed?]

## Implementation
[Suggested approach, if any]
```

## Review Guidelines

Reviewers should check:

- Code quality and style
- Test coverage
- Security considerations
- Documentation updates
- Breaking changes

## Release Process

1. Update version in package.json
2. Update CHANGELOG
3. Create release tag
4. Publish to npm (for packages)
5. Deploy to devnet (for contracts)

## Questions?

- Open a discussion on GitHub
- Join our Discord (coming soon)
- Review existing documentation

## License

By contributing, you agree that your contributions will be licensed under the MIT License.

## Recognition

Contributors will be recognized in:
- README.md acknowledgments
- Release notes
- Project team

Thank you for contributing!
