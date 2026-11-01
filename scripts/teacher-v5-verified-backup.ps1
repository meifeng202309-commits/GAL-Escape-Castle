[CmdletBinding()]
param(
  [Parameter(Mandatory = $true)]
  [string]$OffsiteRoot,

  [string]$LocalBackupRoot = (Join-Path ([Environment]::GetFolderPath('MyDocuments')) 'GAL-Escape-Castle-Private-Backups'),
  [string]$ProjectRef = 'qdcbdcjobzytzhnhfwyn',
  [string]$RestoreImage = 'supabase/postgres:17.6.1.166',
  [switch]$PlanOnly,
  [switch]$KeepRestoreContainer
)

Set-StrictMode -Version Latest
$ErrorActionPreference = 'Stop'

function Get-FullPath([string]$PathValue) {
  if ([System.IO.Path]::IsPathRooted($PathValue)) {
    return [System.IO.Path]::GetFullPath($PathValue)
  }
  return [System.IO.Path]::GetFullPath((Join-Path (Get-Location).Path $PathValue))
}

function Assert-OutsideRepository([string]$Candidate, [string]$RepositoryRoot, [string]$Label) {
  $candidateFull = Get-FullPath $Candidate
  $repositoryFull = (Get-FullPath $RepositoryRoot).TrimEnd('\') + '\'
  if (($candidateFull.TrimEnd('\') + '\').StartsWith($repositoryFull, [System.StringComparison]::OrdinalIgnoreCase)) {
    throw "$Label must be outside the repository. Refusing path: $candidateFull"
  }
  return $candidateFull
}

function Invoke-Native([string]$FilePath, [string[]]$Arguments, [switch]$Capture) {
  if ($Capture) {
    $output = & $FilePath @Arguments 2>&1
    $exitCode = $LASTEXITCODE
    if ($exitCode -ne 0) {
      throw "$FilePath failed with exit code $exitCode. Review the local terminal output; do not share credentials or connection strings."
    }
    return ($output -join [Environment]::NewLine)
  }

  & $FilePath @Arguments
  $exitCode = $LASTEXITCODE
  if ($exitCode -ne 0) {
    throw "$FilePath failed with exit code $exitCode. Review the local terminal output; do not share credentials or connection strings."
  }
}

function Convert-SecureStringToPlain([Security.SecureString]$SecureValue) {
  $pointer = [Runtime.InteropServices.Marshal]::SecureStringToBSTR($SecureValue)
  try {
    return [Runtime.InteropServices.Marshal]::PtrToStringBSTR($pointer)
  }
  finally {
    [Runtime.InteropServices.Marshal]::ZeroFreeBSTR($pointer)
  }
}

function Invoke-SourceSql(
  [string]$DockerPath,
  [string]$Image,
  [string]$WorkingDirectory,
  [string]$ConnectionString,
  [string]$SqlFile
) {
  $mount = "${WorkingDirectory}:/work:ro"
  return Invoke-Native $DockerPath @(
    'run', '--rm', '--volume', $mount, '--entrypoint', 'psql', $Image,
    $ConnectionString, '-X', '--set', 'ON_ERROR_STOP=1', '--csv', "--file=/work/$SqlFile"
  ) -Capture
}

function Assert-ZeroActivity([string]$CsvText, [string]$GateName) {
  $rows = @($CsvText | ConvertFrom-Csv)
  if ($rows.Count -ne 5) {
    throw "$GateName returned an unexpected activity receipt. Expected five metrics."
  }
  $nonZero = @($rows | Where-Object { [int64]$_.value -ne 0 })
  if ($nonZero.Count -gt 0) {
    $summary = ($nonZero | ForEach-Object { "$($_.metric)=$($_.value)" }) -join ', '
    throw "$GateName failed: $summary. Stop; do not continue during possible live activity."
  }
}

$repositoryRoot = Get-FullPath (Join-Path $PSScriptRoot '..')
$localRootFull = Assert-OutsideRepository $LocalBackupRoot $repositoryRoot 'LocalBackupRoot'
$offsiteRootFull = Assert-OutsideRepository $OffsiteRoot $repositoryRoot 'OffsiteRoot'
if ($localRootFull.TrimEnd('\').Equals($offsiteRootFull.TrimEnd('\'), [System.StringComparison]::OrdinalIgnoreCase)) {
  throw 'LocalBackupRoot and OffsiteRoot must be different locations.'
}

Write-Host 'GAL Escape Castle - Free-plan verified logical backup'
Write-Host 'This workflow is read-only against production. It never applies migrations or resets rooms.'
Write-Host "Local staging: $localRootFull"
Write-Host "Off-site destination: $offsiteRootFull"
Write-Host "Disposable restore image: $RestoreImage"

if ($PlanOnly) {
  Write-Host 'PLAN ONLY: no directory, network, Docker, Supabase or database operation was performed.'
  Write-Host 'Live run requires Supabase CLI, Docker Desktop, a local Session-pooler URL, and an encrypted/trusted off-site destination.'
  return
}

$supabaseCommand = Get-Command 'supabase' -ErrorAction SilentlyContinue
$dockerCommand = Get-Command 'docker' -ErrorAction SilentlyContinue
if (-not $supabaseCommand) { throw 'Supabase CLI is missing. Use a trusted already-equipped computer or install the official CLI first.' }
if (-not $dockerCommand) { throw 'Docker is missing. Start Docker Desktop on a trusted computer before retrying.' }

$supabasePath = $supabaseCommand.Source
$dockerPath = $dockerCommand.Source
$supabaseVersion = Invoke-Native $supabasePath @('--version') -Capture
$dumpHelp = Invoke-Native $supabasePath @('db', 'dump', '--help') -Capture
foreach ($requiredFlag in @('--db-url', '--role-only', '--data-only', '--use-copy')) {
  if ($dumpHelp -notmatch [regex]::Escape($requiredFlag)) {
    throw "Installed Supabase CLI does not advertise required flag $requiredFlag. Stop and review the current official CLI documentation."
  }
}
$dockerVersion = Invoke-Native $dockerPath @('version', '--format', '{{.Server.Version}}') -Capture
Invoke-Native $dockerPath @('info', '--format', '{{.ServerVersion}}') | Out-Null

Write-Host ''
Write-Host 'In Supabase Dashboard, open Connect and copy the SESSION POOLER connection string.'
Write-Host 'Paste it only into the hidden local prompt below. Never send it through chat, GitHub or email.'
$secureConnection = Read-Host 'Local Session-pooler connection string' -AsSecureString
$dbUrl = Convert-SecureStringToPlain $secureConnection
$secureConnection.Dispose()
if ($dbUrl -notmatch '^postgres(ql)?://') { throw 'The local value is not a PostgreSQL connection URL.' }
if ($dbUrl -notmatch [regex]::Escape($ProjectRef)) { throw 'The connection URL does not contain the expected project reference.' }
if ($dbUrl -match '\[YOUR-PASSWORD\]' -or $dbUrl -match '<password>') { throw 'Replace the password placeholder locally before running the workflow.' }

$timestamp = (Get-Date).ToUniversalTime().ToString('yyyyMMddTHHmmssZ')
$backupName = "GAL-Escape-Castle-$timestamp"
$backupDirectory = Join-Path $localRootFull $backupName
$offsiteDirectory = Join-Path $offsiteRootFull $backupName
$containerName = "gal-v5-restore-$($timestamp.ToLowerInvariant())"
$restorePassword = [Guid]::NewGuid().ToString('N')
$restoreStarted = $false
$verified = $false

New-Item -ItemType Directory -Path $backupDirectory -Force | Out-Null

$activitySql = @'
select 'player_seen_30m' as metric, count(*)::bigint as value from public.s1_room_players where last_seen_at > now()-interval '30 minutes'
union all select 'player_join_30m', count(*)::bigint from public.s1_room_players where joined_at > now()-interval '30 minutes'
union all select 'run_started_30m', count(*)::bigint from public.game_runs where run_started_at > now()-interval '30 minutes'
union all select 'runtime_event_30m', count(*)::bigint from public.runtime_events where created_at > now()-interval '30 minutes'
union all select 'discussion_started_30m', count(*)::bigint from public.discussion_sessions where started_at > now()-interval '30 minutes'
order by metric;
'@

$verificationSql = @'
select metric, value from (
  select 'objects.public_base_tables'::text as metric, count(*)::text as value from information_schema.tables where table_schema='public' and table_type='BASE TABLE'
  union all select 'objects.public_functions', count(*)::text from pg_proc p join pg_namespace n on n.oid=p.pronamespace where n.nspname='public'
  union all select 'objects.public_policies', count(*)::text from pg_policies where schemaname='public'
  union all select 'objects.public_triggers', count(*)::text from information_schema.triggers where trigger_schema='public'
  union all select 'extension.' || extname, extversion from pg_extension where extname in ('pg_stat_statements','pgcrypto','plpgsql','supabase_vault','uuid-ossp')
  union all select 'rows.dialogue_messages', count(*)::text from public.dialogue_messages
  union all select 'rows.discussion_sessions', count(*)::text from public.discussion_sessions
  union all select 'rows.game_runs', count(*)::text from public.game_runs
  union all select 'rows.runtime_events', count(*)::text from public.runtime_events
  union all select 'rows.s1_room_players', count(*)::text from public.s1_room_players
  union all select 'rows.s1_rooms', count(*)::text from public.s1_rooms
  union all select 'rows.s6_choices', count(*)::text from public.s6_choices
  union all select 'rows.s8_finalizations', count(*)::text from public.s8_finalizations
) evidence order by metric;
'@

Set-Content -LiteralPath (Join-Path $backupDirectory 'activity-gate.sql') -Value $activitySql -Encoding UTF8
Set-Content -LiteralPath (Join-Path $backupDirectory 'verification.sql') -Value $verificationSql -Encoding UTF8

try {
  Write-Host "Pulling pinned disposable restore image $RestoreImage ..."
  Invoke-Native $dockerPath @('pull', $RestoreImage)
  $imageDigest = Invoke-Native $dockerPath @('image', 'inspect', '--format', '{{index .RepoDigests 0}}', $RestoreImage) -Capture

  Write-Host 'Running maintenance gate T0 (read-only)...'
  $gateT0 = Invoke-SourceSql $dockerPath $RestoreImage $backupDirectory $dbUrl 'activity-gate.sql'
  Assert-ZeroActivity $gateT0 'T0'
  Set-Content -LiteralPath (Join-Path $backupDirectory 'activity-gate-t0.csv') -Value $gateT0 -Encoding UTF8

  Write-Host 'Waiting five minutes for the required second read. Keep the no-entry/no-class window active...'
  Start-Sleep -Seconds 300
  Write-Host 'Running maintenance gate T+5 (read-only)...'
  $gateT5 = Invoke-SourceSql $dockerPath $RestoreImage $backupDirectory $dbUrl 'activity-gate.sql'
  Assert-ZeroActivity $gateT5 'T+5'
  Set-Content -LiteralPath (Join-Path $backupDirectory 'activity-gate-t5.csv') -Value $gateT5 -Encoding UTF8

  Write-Host 'Creating official roles/schema/data logical dumps...'
  Invoke-Native $supabasePath @('db', 'dump', '--db-url', $dbUrl, '-f', (Join-Path $backupDirectory 'roles.sql'), '--role-only')
  Invoke-Native $supabasePath @('db', 'dump', '--db-url', $dbUrl, '-f', (Join-Path $backupDirectory 'schema.sql'))
  Invoke-Native $supabasePath @('db', 'dump', '--db-url', $dbUrl, '-f', (Join-Path $backupDirectory 'data.sql'), '--use-copy', '--data-only', '-x', 'storage.buckets_vectors', '-x', 'storage.vector_indexes')

  foreach ($dumpFile in @('roles.sql', 'schema.sql', 'data.sql')) {
    $dumpPath = Join-Path $backupDirectory $dumpFile
    if (-not (Test-Path -LiteralPath $dumpPath) -or (Get-Item -LiteralPath $dumpPath).Length -eq 0) {
      throw "$dumpFile is missing or empty. The backup is not verified."
    }
  }

  Write-Host 'Capturing source verification manifest (read-only)...'
  $sourceVerification = Invoke-SourceSql $dockerPath $RestoreImage $backupDirectory $dbUrl 'verification.sql'
  Set-Content -LiteralPath (Join-Path $backupDirectory 'source-verification.csv') -Value $sourceVerification -Encoding UTF8

  Write-Host 'Running final no-activity check after dump creation...'
  $gateFinal = Invoke-SourceSql $dockerPath $RestoreImage $backupDirectory $dbUrl 'activity-gate.sql'
  Assert-ZeroActivity $gateFinal 'Post-dump gate'
  Set-Content -LiteralPath (Join-Path $backupDirectory 'activity-gate-final.csv') -Value $gateFinal -Encoding UTF8

  Write-Host 'Starting unmistakably disposable local restore container...'
  Invoke-Native $dockerPath @(
    'run', '--detach', '--name', $containerName,
    '--label', 'gal.purpose=disposable-backup-restore-verification',
    '--env', "POSTGRES_PASSWORD=$restorePassword",
    '--env', 'POSTGRES_DB=restore_verification',
    $RestoreImage
  ) | Out-Null
  $restoreStarted = $true

  $ready = $false
  for ($attempt = 1; $attempt -le 90; $attempt++) {
    & $dockerPath exec $containerName pg_isready -U postgres -d restore_verification *> $null
    if ($LASTEXITCODE -eq 0) { $ready = $true; break }
    Start-Sleep -Seconds 2
  }
  if (-not $ready) { throw 'Disposable restore database did not become ready within 180 seconds.' }

  Invoke-Native $dockerPath @('exec', $containerName, 'mkdir', '-p', '/work')
  foreach ($copyFile in @('roles.sql', 'schema.sql', 'data.sql', 'verification.sql')) {
    Invoke-Native $dockerPath @('cp', (Join-Path $backupDirectory $copyFile), "${containerName}:/work/$copyFile")
  }

  Write-Host 'Restoring roles, schema and data in one stop-on-error transaction...'
  Invoke-Native $dockerPath @(
    'exec', $containerName, 'psql', '--single-transaction', '--variable', 'ON_ERROR_STOP=1',
    '--file', '/work/roles.sql', '--file', '/work/schema.sql',
    '--command', 'SET session_replication_role = replica', '--file', '/work/data.sql',
    '--dbname', 'restore_verification', '--username', 'postgres'
  )

  $restoredVerification = Invoke-Native $dockerPath @(
    'exec', $containerName, 'psql', '--dbname', 'restore_verification', '--username', 'postgres',
    '-X', '--set', 'ON_ERROR_STOP=1', '--csv', '--file', '/work/verification.sql'
  ) -Capture
  Set-Content -LiteralPath (Join-Path $backupDirectory 'restored-verification.csv') -Value $restoredVerification -Encoding UTF8

  $sourceNormalized = ($sourceVerification -replace "`r`n", "`n").Trim()
  $restoredNormalized = ($restoredVerification -replace "`r`n", "`n").Trim()
  if ($sourceNormalized -ne $restoredNormalized) {
    throw 'Source and disposable-restore schema/row-count manifests differ. The backup is not verified.'
  }

  $dumpReceipts = @()
  foreach ($dumpFile in @('roles.sql', 'schema.sql', 'data.sql')) {
    $item = Get-Item -LiteralPath (Join-Path $backupDirectory $dumpFile)
    $hash = Get-FileHash -LiteralPath $item.FullName -Algorithm SHA256
    $dumpReceipts += [ordered]@{ file = $dumpFile; bytes = $item.Length; sha256 = $hash.Hash.ToLowerInvariant() }
  }

  $receipt = [ordered]@{
    receipt_version = 1
    project_ref = $ProjectRef
    created_utc = $timestamp
    production_mutation = $false
    verified_restorable_logical_backup = $false
    offsite_copy_verified = $false
    local_backup_directory = $backupDirectory
    offsite_backup_directory = $offsiteDirectory
    supabase_cli_version = $supabaseVersion.Trim()
    docker_server_version = $dockerVersion.Trim()
    restore_image = $RestoreImage
    restore_image_digest = $imageDigest.Trim()
    maintenance_gate = 'T0 zero + T+5 zero + post-dump zero for five trailing-30-minute activity metrics'
    restore_target = "disposable Docker container $containerName / database restore_verification"
    verification = 'source and restored public object/key-table row-count manifests exact match'
    scope_limits = @('logical database dump only', 'Storage object bytes excluded', 'platform secrets and hosted configuration excluded')
    files = $dumpReceipts
  }
  $receiptPath = Join-Path $backupDirectory 'verified-backup-receipt.json'
  Set-Content -LiteralPath $receiptPath -Value ($receipt | ConvertTo-Json -Depth 6) -Encoding UTF8

  Write-Host 'Copying sensitive backup files to the operator-selected off-site destination...'
  New-Item -ItemType Directory -Path $offsiteRootFull -Force | Out-Null
  if (Test-Path -LiteralPath $offsiteDirectory) { throw "Off-site destination already exists: $offsiteDirectory" }
  Copy-Item -LiteralPath $backupDirectory -Destination $offsiteDirectory -Recurse

  foreach ($dump in $dumpReceipts) {
    $offsiteHash = (Get-FileHash -LiteralPath (Join-Path $offsiteDirectory $dump.file) -Algorithm SHA256).Hash.ToLowerInvariant()
    if ($offsiteHash -ne $dump.sha256) { throw "Off-site hash mismatch for $($dump.file)." }
  }

  $receipt.verified_restorable_logical_backup = $true
  $receipt.offsite_copy_verified = $true
  $receipt.completed_utc = (Get-Date).ToUniversalTime().ToString('yyyyMMddTHHmmssZ')
  $finalReceipt = $receipt | ConvertTo-Json -Depth 6
  Set-Content -LiteralPath $receiptPath -Value $finalReceipt -Encoding UTF8
  Set-Content -LiteralPath (Join-Path $offsiteDirectory 'verified-backup-receipt.json') -Value $finalReceipt -Encoding UTF8
  $verified = $true

  Write-Host ''
  Write-Host 'VERIFIED: disposable restore and exact verification manifest passed.' -ForegroundColor Green
  Write-Host "Off-site copy hash verification passed: $offsiteDirectory" -ForegroundColor Green
  Write-Host "Share only the non-secret receipt: $receiptPath"
  Write-Host 'Never upload roles.sql, schema.sql, data.sql or the connection string to chat, GitHub or email.'
}
finally {
  $dbUrl = $null
  $restorePassword = $null
  if ($restoreStarted -and -not $KeepRestoreContainer) {
    & $dockerPath rm --force $containerName *> $null
  }
  if (-not $verified) {
    Write-Warning 'Backup verification did not complete. Do not call the dump a verified backup and do not authorize migration074 from this run.'
  }
}
