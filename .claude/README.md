# Claude Code Configuration

This directory contains Claude Code configuration for the Jokers Hockey project.

## Structure

```
.claude/
├── README.md              # This file
├── settings.json          # Project hooks configuration
└── skills/               # Project-specific skills
    ├── deploy-jokers/    # Deployment automation
    ├── database-migration/ # Database schema management
    ├── pm2-management/   # Production process management
    └── build-check/      # Pre-deployment verification
```

## Skills

Skills are automatically invoked by Claude based on your requests. You don't need to explicitly call them.

### 1. deploy-jokers

**When it activates**: When you ask to deploy, push to production, or update the live site.

**What it does**:
- Connects to production server (srv759970.hstgr.cloud)
- Pulls latest code or uploads changes
- Installs dependencies
- Runs database migrations
- Builds the project
- Restarts PM2 process
- Verifies deployment

**Example triggers**:
- "Deploy to production"
- "Push the changes to the server"
- "Update the live site"

### 2. database-migration

**When it activates**: When you ask to modify the database schema or add tables.

**What it does**:
- Guides schema changes in `shared/schema.ts`
- Uses Drizzle ORM for migrations
- Validates schema changes
- Pushes to database
- Provides rollback instructions

**Example triggers**:
- "Add a news table"
- "Modify the database schema"
- "Create a migration"

### 3. pm2-management

**When it activates**: When you ask about logs, restart the app, or check production status.

**What it does**:
- Checks PM2 process status
- Views application logs
- Monitors CPU/memory usage
- Restarts application
- Troubleshoots production issues

**Example triggers**:
- "Check the logs"
- "Restart the application"
- "Is the site running?"

### 4. build-check

**When it activates**: When you want to verify the build or prepare for deployment.

**What it does**:
- Runs TypeScript compilation check
- Builds the project
- Verifies build output
- Checks bundle sizes
- Runs security audit
- Provides deployment readiness checklist

**Example triggers**:
- "Check if the build works"
- "Verify before deploying"
- "Run quality checks"

## Hooks

Hooks automatically execute at specific points in Claude's workflow.

### Configured Hooks

#### PostToolUse - Write/Edit Files
**Trigger**: After Write or Edit tool completes
**Action**: Logs the file that was modified
**Purpose**: Track file changes during sessions

#### PreToolUse - Bash Commands
**Trigger**: Before executing Bash commands
**Action**: Logs command to audit.log
**Purpose**: Audit trail of all shell commands

#### UserPromptSubmit
**Trigger**: When you submit a prompt
**Action**: Logs timestamp to session.log
**Purpose**: Session activity tracking

### Log Files

Hooks create these log files:
- `.claude/audit.log` - Bash command audit trail
- `.claude/session.log` - Session activity log

Add these to `.gitignore`:
```gitignore
.claude/audit.log
.claude/session.log
```

## Customizing Configuration

### Modify Hooks

Edit `.claude/settings.json` to add/remove hooks:

```json
{
  "hooks": {
    "PostToolUse": [
      {
        "matcher": "ToolName",
        "hooks": [...]
      }
    ]
  }
}
```

### Add Skills

Create a new skill:

1. Create directory: `.claude/skills/skill-name/`
2. Create `SKILL.md` with frontmatter:
   ```yaml
   ---
   name: skill-name
   description: What it does and when to use it
   ---
   ```
3. Add instructions and examples

## Recommended Additional Skills

Consider adding these skills for enhanced workflow:

### Component Generator
Auto-generate React components with proper structure:
```yaml
---
name: create-component
description: Generate new React components with TypeScript and shadcn/ui patterns. Use when creating new UI components.
---
```

### API Route Builder
Scaffold new Express API routes:
```yaml
---
name: add-api-route
description: Create new Express API endpoints with proper typing. Use when adding backend routes.
---
```

### Image Optimizer
Optimize images before commit:
```yaml
---
name: optimize-images
description: Compress and optimize images in attached_assets/. Use before adding new images.
---
```

## Recommended Additional Hooks

### Pre-Commit Formatting (PostToolUse on Write/Edit)
```json
{
  "matcher": "Write",
  "hooks": [{
    "type": "command",
    "command": "prettier --write $TOOL_INPUT | jq -r '.file_path'"
  }]
}
```

### Prevent Production File Edits (PreToolUse)
```json
{
  "matcher": "Edit",
  "hooks": [{
    "type": "command",
    "command": "if echo $TOOL_INPUT | jq -r '.file_path' | grep -q '/var/www/'; then exit 2; fi"
  }]
}
```

### Auto-Build Check Before Deploy (PreToolUse)
```json
{
  "matcher": "Bash",
  "hooks": [{
    "type": "command",
    "command": "if echo $TOOL_INPUT | grep -q 'deploy'; then npm run check || exit 2; fi"
  }]
}
```

## Best Practices

1. **Keep skills focused** - One skill per specific task
2. **Test skills** - Verify they activate with natural language
3. **Update descriptions** - Include trigger words users would use
4. **Document hooks** - Comment complex hook logic
5. **Review audit logs** - Check `.claude/audit.log` periodically
6. **Share with team** - Commit `.claude/` to Git for team benefits

## Security Considerations

1. **Sensitive data**: Never include credentials in skills or hooks
2. **Hook review**: Always review hooks before enabling
3. **Bash commands**: Hooks run with your credentials - be cautious
4. **Audit trail**: Keep audit.log for security review

## Resources

- [Claude Code Skills Docs](https://code.claude.com/docs/en/skills.md)
- [Claude Code Hooks Guide](https://code.claude.com/docs/en/hooks-guide.md)
- [Project Documentation](../claude.md)

## Quick Reference

### Test a Skill
Just ask Claude naturally:
- "Deploy this to production" → activates `deploy-jokers`
- "Add a table for products" → activates `database-migration`
- "Show me the logs" → activates `pm2-management`

### Disable a Skill Temporarily
Rename the skill directory:
```bash
mv .claude/skills/skill-name .claude/skills/_skill-name
```

### View Hook Logs
```bash
# Audit trail
tail -f .claude/audit.log

# Session activity
tail -f .claude/session.log
```
