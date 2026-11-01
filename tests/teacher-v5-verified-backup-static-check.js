const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..');
const scriptPath = path.join(root, 'scripts', 'teacher-v5-verified-backup.ps1');
const runbookPath = path.join(root, 'docs', 'runbooks', 'TEACHER_V5_FREE_PLAN_VERIFIED_BACKUP_WINDOWS.md');
const script = fs.readFileSync(scriptPath, 'utf8');
const runbook = fs.readFileSync(runbookPath, 'utf8');

function requireMatch(text, pattern, message) {
  if (!pattern.test(text)) throw new Error(message);
}

for (const required of [
  "'roles.sql'", "'schema.sql'", "'data.sql'", '--role-only', '--data-only', '--use-copy',
  'supabase/postgres:17.6.1.166', 'ON_ERROR_STOP=1', '--single-transaction',
  'source-verification.csv', 'restored-verification.csv', 'verified-backup-receipt.json',
  'offsite_copy_verified', 'verified_restorable_logical_backup', 'Assert-OutsideRepository',
  'Start-Sleep -Seconds 300', 'Assert-ZeroActivity', "'mkdir', '-p', '/work'", 'dockerPath rm --force',
  "'extension.' || extname"
]) {
  if (!script.includes(required)) throw new Error(`Backup workflow missing required invariant: ${required}`);
}

requireMatch(script, /Read-Host[^\n]+-AsSecureString/, 'Connection string must use a hidden local prompt.');
requireMatch(script, /production_mutation\s*=\s*\$false/, 'Receipt must explicitly record no production mutation.');
requireMatch(script, /if \(\$sourceNormalized -ne \$restoredNormalized\)/, 'Restore manifest must be compared exactly.');
requireMatch(script, /Get-FileHash[\s\S]+Algorithm SHA256/, 'SHA-256 receipts are mandatory.');
requireMatch(runbook, /do not send|不要发送/i, 'Runbook must prohibit secret transmission.');
requireMatch(runbook, /Storage/i, 'Runbook must identify Storage scope limits.');
requireMatch(runbook, /verified-backup-receipt\.json/, 'Runbook must identify the shareable receipt.');

for (const forbidden of ['apply_migration', 's10_reset_room_for_reuse', 'git push', 'settings/pages/save']) {
  if (script.toLowerCase().includes(forbidden)) throw new Error(`Backup script contains forbidden mutation path: ${forbidden}`);
}

console.log('Teacher V5 verified-backup static checks passed.');
