# Bullfrog Security Demo Repository

This repository demonstrates the security capabilities of **Bullfrog** - a comprehensive GitHub Actions security solution that combines:

1. **Bullfrog GitHub Action** - Network egress filtering for GitHub Actions workflows
2. **Bullfrog GitHub App** - Monitoring and alerting for CI/CD security events

## What is Bullfrog?

Bullfrog increases the security of your GitHub Actions workflows by controlling outbound network connections. You can:

- **Audit Mode**: Monitor all network connections without blocking (perfect for discovery)
- **Block Mode**: Enforce strict allow-lists for domains and IPs
- **Hybrid Approach**: Mix protected and unprotected jobs based on your needs

## Repository Contents

This demo repository contains:

- **Demo Node.js Application** (`src/`) - A simple Express app for testing
- **Multiple Workflow Examples** (`.github/workflows/`) - Showcasing different Bullfrog configurations
- **Network Test Scripts** - Tools to demonstrate blocking and auditing

## Demo Workflows

### 1. Protected Build (Block Mode)

**File**: `.github/workflows/protected-build.yml`

Demonstrates fully protected builds with:

- Block mode enabled
- Actions pinned to commit hashes for security
- Minimal allow-list for GitHub and NPM
- Docker Hub access example
- `sudo` disabled for maximum security

**Use Case**: Production builds requiring strict security controls

### 2. Audit Mode Monitoring

**File**: `.github/workflows/audit-mode.yml`

Shows audit-only monitoring:

- No blocking - only observing
- Discovers all network connections
- Tests various external APIs
- Helps build allow-lists for block mode

**Use Case**: Discovery phase to understand what your workflows access

### 3. Mixed Protection Levels

**File**: `.github/workflows/mixed-protection.yml`

Demonstrates different security levels in one workflow:

- Unprotected job (no Bullfrog)
- Audit-only job
- Fully protected job (block mode)
- Partially protected job (some domains allowed)

**Use Case**: Organizations with varying security requirements across jobs

### 4. Connection Blocking Demo

**File**: `.github/workflows/blocking-demo.yml`

Shows various blocking scenarios:

- Strict blocking with minimal allow-list
- IP-based allow-lists
- Zero-trust mode (block everything except essentials)
- Testing blocked vs allowed connections

**Use Case**: Understanding how blocking works and testing your allow-lists

### 5. Wildcard Domain Patterns

**File**: `.github/workflows/wildcard-domains.yml`

Examples of wildcard domain configurations:

- Docker Hub access (`*.docker.io`, `*.docker.com`)
- GitHub ecosystem (`*.github.com`, `*.githubusercontent.com`)
- NPM and CDN access (`*.npmjs.org`, `*.unpkg.com`)
- Cloud providers (`*.amazonaws.com`)
- Selective wildcards for specific services

**Use Case**: Allowing entire ecosystems while maintaining security

## Quick Start

### Running the Workflows

All workflows are scheduled to run automatically, but you can also trigger them manually:

1. Go to the **Actions** tab in GitHub
2. Select a workflow from the left sidebar
3. Click **Run workflow** button
4. Click the green **Run workflow** button

### Viewing Results

After a workflow runs:

1. Click on the workflow run
2. Click on individual jobs to see details
3. **Check the workflow summary** for:
   - Blocked connection attempts
   - Allowed connections
   - Security violations detected by Bullfrog

### Understanding the Output

#### Audit Mode

- Shows all network connections attempted
- No connections are blocked
- Helps you build allow-lists

#### Block Mode

- Connections not in the allow-list are blocked
- Blocked attempts appear in the workflow summary
- Failed connection attempts show in logs

## Key Configuration Options

### Egress Policy

```yaml
- uses: bullfrogsec/bullfrog@ebd3ce460ed3371d6fd751649fc1637ef0c21a18 # v0.11.0
  with:
    egress-policy: block # or 'audit'
```

- `audit` - Monitor but don't block (default)
- `block` - Enforce allow-lists

### Allowed Domains

```yaml
allowed-domains: |
  github.com
  *.github.com
  *.docker.io
  registry.npmjs.org
```

- Supports wildcards (`*.example.com`)
- One domain per line

### Allowed IPs

```yaml
allowed-ips: |
  1.2.3.4
  10.0.0.0/24
```

- Individual IPs or CIDR ranges

### DNS Policy

```yaml
dns-policy: allowed-domains-only # or 'any'
```

- `allowed-domains-only` - Only DNS for allowed domains
- `any` - Allow all DNS queries

### Enable Sudo

```yaml
enable-sudo: false # or 'true'
```

- `false` - Prevent elevated privileges (recommended)
- `true` - Allow sudo commands

## Common Use Cases

### Discovery Phase

Start with audit mode to understand your workflows:

```yaml
- uses: bullfrogsec/bullfrog@ebd3ce460ed3371d6fd751649fc1637ef0c21a18 # v0.11.0
  with:
    egress-policy: audit
```

Run your workflows normally and check the summaries to see what's accessed.

### Production Security

Once you know what domains are needed, switch to block mode:

```yaml
- uses: bullfrogsec/bullfrog@ebd3ce460ed3371d6fd751649fc1637ef0c21a18 # v0.11.0
  with:
    egress-policy: block
    allowed-domains: |
      github.com
      *.github.com
      registry.npmjs.org
    enable-sudo: false
```

### Docker Workflows

For workflows that pull Docker images:

```yaml
allowed-domains: |
  github.com
  *.github.com
  *.docker.com
  docker.io
  *.docker.io
  registry-1.docker.io
```

### NPM Package Publishing

For workflows that publish to NPM:

```yaml
allowed-domains: |
  github.com
  *.github.com
  registry.npmjs.org
  *.npmjs.org
```

## Security Best Practices

### 1. Pin Actions to Commit Hashes

```yaml
# ✓ Good - pinned to commit hash
- uses: actions/checkout@b4ffde65f46336ab88eb53be808477a3936bae11

# ✗ Bad - uses floating tag
- uses: actions/checkout@v4
```

### 2. Use Bullfrog as the First Step

```yaml
steps:
  - name: Setup Bullfrog Security
    uses: bullfrogsec/bullfrog@ebd3ce460ed3371d6fd751649fc1637ef0c21a18 # v0.11.0

  - name: Checkout code
    uses: actions/checkout@v4
```

If Bullfrog isn't first, it can't monitor earlier steps.

### 3. Disable Sudo When Possible

```yaml
enable-sudo: false
```

Prevents workflows from bypassing network restrictions.

### 4. Use Minimal Allow-Lists

Only allow domains you actually need:

```yaml
# Start minimal
allowed-domains: |
  github.com
  *.github.com
  registry.npmjs.org

# Add more only as needed
```

### 5. Use allowed-domains-only DNS Policy

```yaml
dns-policy: allowed-domains-only
```

Prevents DNS exfiltration and unwanted domain lookups.

## Integrating with Bullfrog GitHub App

The **Bullfrog GitHub App** complements the GitHub Action by:

- Providing a web dashboard for all organizations
- Sending email alerts for security events
- Analyzing workflow definitions for risks
- Tracking network connections across all workflows
- Managing alert configurations

### Setup

1. Install the Bullfrog GitHub App on your organization
2. Configure alert rules in the dashboard
3. Set up email notifications via MailerSend
4. Monitor security events in real-time

### Viewing Results

After workflows run with Bullfrog:

1. Visit the Bullfrog App dashboard
2. View your organization's security posture
3. See all network connections detected
4. Review security alerts and recommendations

## Troubleshooting

### Workflow Fails with Network Errors

If your workflow fails with connection errors in block mode:

1. Check the workflow summary for blocked connections
2. Add necessary domains to your `allowed-domains` list
3. Consider using `dns-policy: any` if DNS is the issue
4. Re-run the workflow

### NPM Install Fails

Make sure you allow NPM registry:

```yaml
allowed-domains: |
  registry.npmjs.org
  *.npmjs.org
```

### Docker Pull Fails

Allow Docker Hub domains:

```yaml
allowed-domains: |
  *.docker.com
  docker.io
  *.docker.io
```

### Actions Fail to Download

Ensure GitHub domains are allowed:

```yaml
allowed-domains: |
  github.com
  *.github.com
  *.githubusercontent.com
```

## Learn More

- **Bullfrog GitHub Action**: [bullfrog/README.md](https://github.com/bullfrogsec/bullfrog)
- **Documentation**: Visit [bullfrogsec.com](https://bullfrogsec.com)
- **Support**: Join us on [Slack](https://join.slack.com/t/bullfogsec/shared_invite/zt-2mbf603gn-TRfhXvf_x8J7yB9fJ3Os7Q)

## Contributing

Found an issue or have a suggestion? Please open an issue or submit a pull request!

## License

MIT License - see LICENSE file for details

---

**Security Note**: This is a demo repository. In production, always use the latest stable version of Bullfrog and keep your dependencies updated.

If you find Bullfrog useful, please leave a star ⭐️ on the [main repository](https://github.com/bullfrogsec/bullfrog)!
